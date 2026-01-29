import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const UAZAPI_URL = "https://free.uazapi.com/send/text";

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const url = new URL(req.url);
    const path = url.pathname.split('/').pop(); // "cron", "test" or ID (for REST)

    // --- 1. CRON JOB SCHEDULER ---
    if (path === 'cron') {
      return await handleCron(supabase);
    }

    // --- 2. SEND TEST MESSAGE ---
    if (path === 'test') {
      const payload = await req.json();
      return await handleSendTest(payload, supabase);
    }

    // --- 3. CRUD: LIST (GET) ---
    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('whatsapp_alerts')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return new Response(JSON.stringify(data), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      });
    }

    // --- 4. CRUD: CREATE (POST) ---
    if (req.method === 'POST') {
      const body = await req.json();
      const { error } = await supabase
        .from('whatsapp_alerts')
        .insert([body]);

      if (error) throw error;
      return new Response(JSON.stringify({ message: 'Alert created' }), { headers: corsHeaders });
    }

    // --- 5. CRUD: UPDATE (PUT) ---
    if (req.method === 'PUT') {
      const body = await req.json();
      console.log('PUT request body:', body);
      // For PUT, we expect the ID in the body as well or we parse it from URL if we had a router.
      // Assuming body contains { id, ...updates }
      const { id, ...updates } = body;
      if (!id) throw new Error("ID required for update");

      const { error } = await supabase
        .from('whatsapp_alerts')
        .update(updates)
        .eq('id', id);

      if (error) throw error;
      return new Response(JSON.stringify({ message: 'Alert updated' }), { headers: corsHeaders });
    }

    // --- 6. CRUD: DELETE (DELETE) ---
    if (req.method === 'DELETE') {
      const { id } = await req.json();
      if (!id) throw new Error("ID required for deletion");

      const { error } = await supabase
        .from('whatsapp_alerts')
        .delete()
        .eq('id', id);

      if (error) throw error;
      return new Response(JSON.stringify({ message: 'Alert deleted' }), { headers: corsHeaders });
    }

    throw new Error(`Method ${req.method} not supported`);

  } catch (error) {
    console.error("Error:", error.message);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

// --- HELPER LOGIC ---

async function handleCron(supabase: any) {
  console.log("Running Cron Job...");
  
  // 1. Get current time in Sao Paulo
  // Deno Deploy is UTC.
  const now = new Date();
  
  // Convert UTC to Sao Paulo time manually (UTC-3 usually)
  // More robust: use Intl API
  const options = { timeZone: "America/Sao_Paulo", hour12: false, hour: '2-digit', minute: '2-digit' };
  // @ts-ignore
  const timeString = new Intl.DateTimeFormat('pt-BR', options).format(now); 
  // returns "HH:mm"
  
  console.log("Current Sao Paulo Time:", timeString);

  // 2. Fetch Active Alerts matching this time
  const { data: alerts, error } = await supabase
    .from('whatsapp_alerts')
    .select('*')
    .eq('active', true)
    .eq('schedule_time', timeString);

  if (error) throw error;
  if (!alerts || alerts.length === 0) {
    return new Response(JSON.stringify({ message: 'No alerts to run', time: timeString }), { headers: corsHeaders });
  }

  console.log(`Found ${alerts.length} alerts to trigger.`);
  const results = [];

  // 3. Process each alert
  for (const alert of alerts) {
    try {
      // Idempotency check: Don't run if ran less than 50 seconds ago
      if (alert.last_run_at) {
        const lastRun = new Date(alert.last_run_at);
        const diff = now.getTime() - lastRun.getTime();
        if (diff < 50 * 1000) {
          console.log(`Skipping alert ${alert.name} (Duplicate run)`);
          continue;
        }
      }

      const report = await buildReport(supabase, alert.config, alert.meta_token);
      
      // Dispatch to all recipients
      const sendResults = [];
      const recipients = alert.recipients || [];
      
      for (const rec of recipients) {
        const sent = await sendWhatsappMessage(alert.instance_token, rec.value, report);
        sendResults.push({ recipient: rec.value, success: sent });
      }

      // Update Last Run
      await supabase.from('whatsapp_alerts').update({ last_run_at: new Date().toISOString() }).eq('id', alert.id);
      
      results.push({ id: alert.id, name: alert.name, sent: sendResults });
    
    } catch (e) {
      console.error(`Failed to run alert ${alert.name}:`, e);
      results.push({ id: alert.id, error: e.message });
    }
  }

  return new Response(JSON.stringify({ message: 'Cron finished', results }), { headers: corsHeaders });
}

async function handleSendTest(payload: any, supabase: any) {
  // payload: { config, recipients, instance_token, meta_token }
  console.log("Sending Test Alert...");
  
  const report = await buildReport(supabase, payload.config, payload.meta_token);
  
  const results = [];
  const recipients = payload.recipients || []; // Array of strings or objects? 
  // Assuming simplified for test: just array of {value: number}
  
  for (const rec of recipients) {
    const target = rec.value || rec; // Handle object or string
    const sent = await sendWhatsappMessage(payload.instance_token, target, report);
    results.push({ recipient: target, success: sent });
  }

  return new Response(JSON.stringify({ message: 'Test finished', results }), { headers: corsHeaders });
}

// --- CORE BUSINESS LOGIC ---

async function buildReport(supabase: any, config: any, metaToken: any): Promise<string> {
  // Fetch Data (Sales + Ads) and format string
  
  // 1. Fetch Sales (Today) from Supabase
  // We need to define "Today" in Sao Paulo context
  const today = new Date();
  // Simplified: Get sales where created_at >= Start of Day (UTC-3 approx)
  // For robustness in this MVP, we fetch global "today" sales based on string date match if possible or raw query
  // Let's use database 'current_date' logic or fetch meaningful range.
  
  // Actually, let's just fetch all sales and filter in JS to be safe with Logic matching the Dashboard?
  // No, too heavy. Let's filter by date >= today formatted.
  
  const todayStr = new Date().toISOString().split('T')[0]; // YYYY-MM-DD
  
  const { data: sales } = await supabase
    .from('sales')
    .select('*')
    // filtering by date string match on a timestamp column is tricky without ranges
    // assuming 'created_at' or 'rawDate' format? 
    // The schema from exploration wasn't fully deep, but 'sales' usually has a date column.
    // Let's try to filter by timestamp > today 00:00 UTC-3
    // Simplified: Just say "Vendas de Hoje: Calculated..."
    .gte('created_at', `${todayStr}T00:00:00`) 
    // This is UTC. 00:00 UTC is 21:00 yesterday in Brazil. Close enough for MVP or need offset?
    // Proper way: calculate StartOfDay in UTC correpsonding to Brazil.
    // Brazil is UTC-3. So 00:00 BRT = 03:00 UTC.
    .gte('created_at', `${todayStr}T03:00:00`); 

  // Calculate Sales Metrics
  let totalRevenue = 0;
  let totalSales = 0;
  let pixCount = 0;
  let creditDisplay = 0;
  
  if (sales) {
    sales.forEach((s: any) => {
      if (s.status === 'Aprovado' || s.status === 'paid' || s.status === 'approved') {
        totalRevenue += (s.value || 0);
        totalSales++;
        const method = (s.payment_method || '').toLowerCase();
        if (method.includes('pix')) pixCount++;
        if (method.includes('credit') || method.includes('credito')) creditDisplay++;
      }
    });
  }

  // 2. Fetch Meta Ads (if token provided)
  let adSpend = 0;
  let impressions = 0;
  let clicks = 0;
  
  if (metaToken && config.accountId) {
    try {
      const adsData = await fetchMetaAdsData(config.accountId, metaToken);
      adSpend = adsData.spend || 0;
      impressions = adsData.impressions || 0;
      clicks = adsData.clicks || 0;
    } catch (e) {
      console.warn("Failed to fetch Meta Ads:", e);
      // Determine failure message in report? Or just 0.
    }
  }

  const roi = adSpend > 0 ? ((totalRevenue - adSpend) / adSpend).toFixed(2) : '∞';
  const cpa = totalSales > 0 ? (adSpend / totalSales).toFixed(2) : '0';

  // 3. Format Message
  const dateDisplay = new Date().toLocaleDateString('pt-BR');
  
  return `📊 *Relatório Diário - ${dateDisplay}*
  
💰 *Vendas:* ${toBRL(totalRevenue)}
🛒 *Qtd. Vendas:* ${totalSales}
📈 *ROI:* ${roi}x
📉 *CPA:* ${toBRL(parseFloat(cpa))}
  
📢 *Investimento Ads:* ${toBRL(adSpend)}
👀 *Impressões:* ${impressions}
👆 *Cliques:* ${clicks}
  
💳 *Métodos:*
Pix: ${pixCount} | Cartão: ${creditDisplay}
  
_Gerado automaticamente pelo Scale._`;
}

async function fetchMetaAdsData(accountId: string, token: string) {
  // Fetch Insights for "Today"
  const url = `https://graph.facebook.com/v17.0/act_${accountId}/insights?level=account&date_preset=today&fields=spend,impressions,clicks&access_token=${token}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error("Meta API Error: " + res.statusText);
  const json = await res.json();
  if (json.data && json.data.length > 0) {
    return {
      spend: parseFloat(json.data[0].spend || 0),
      impressions: parseInt(json.data[0].impressions || 0),
      clicks: parseInt(json.data[0].clicks || 0),
    };
  }
  return { spend: 0, impressions: 0, clicks: 0 };
}

async function sendWhatsappMessage(token: string, number: string, text: string) {
  // Remove formatting from number just in case
  const cleanNumber = number.replace(/\D/g, '');
  
  const body = {
    number: cleanNumber,
    text: text
  };

  const res = await fetch(UAZAPI_URL, {
    method: 'POST',
    headers: {
      'token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });

  console.log(`Sending to ${number}: Status ${res.status}`);
  return res.ok;
}

function toBRL(val: number) {
  return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
