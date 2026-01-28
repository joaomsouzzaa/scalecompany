import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from "https://esm.sh/@supabase/supabase-js@2"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    )

    const payload = await req.json()
    console.log('Webhook received:', payload)

    // GoExplosion payload structure usually needs mapping
    // This is a generic handler, assuming payload has 'event' and 'data'
    // Adjust based on actual GoExplosion webhook documentation if available

    // Example mapping - adapt this to the actual JSON structure you receive
    // Defensive mapping for GoExplosion payload
    // Log specific fields for debugging
    // A função foi atualizada com os ajustes necessários para mapear corretamente os dados.
    // Adaptação para suportar payload na raiz ou dentro de 'data'
    const pData = payload.data || payload;

    const productName = pData.Product?.Name || pData.product_name || 'Produto Indefinido';
    const paymentMethod = pData.Purchase?.PaymentMethod?.metodoPagamento || pData.payment_method || 'unknown';
    const statusDescription = pData.Purchase?.StatusDescription || pData.status || 'undefined';
    const customerEmail = pData.Purchase?.Buyer?.Email || pData.Buyer?.Email || pData.customer_email || 'email desconhecido';
    const customerName = pData.Purchase?.Buyer?.FullName || pData.Buyer?.FullName || pData.customer_name || 'Cliente Desconhecido';
    const value = pData.Purchase?.TotalDetails?.Total || pData.TotalDetails?.Total || pData.value || 0;
    const externalId = pData.OrderId || pData.external_id;

    console.log('Extracted:', { customerName, customerEmail, productName, value, statusDescription });

    // Insira os dados no banco de dados
    const { error } = await supabase
      .from('sales')
      .insert([
        {
          customer_name: customerName,
          customer_email: customerEmail,
          product_name: productName,
          payment_method: paymentMethod,
          status: mapStatus(statusDescription),
          value: value,
          external_id: externalId,
          platform: 'GoExplosion',
        }
      ]);

    if (error) throw error

    return new Response(JSON.stringify({ message: 'Success' }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    })
  }
})

function mapStatus(event: string): string {
  if (!event) return 'Pendente'
  const lower = event.toLowerCase()
  if (lower.includes('approved') || lower.includes('paid') || lower.includes('aprovado')) return 'Aprovado'
  if (lower.includes('refund') || lower.includes('reembolsado')) return 'Reembolsado'
  return 'Pendente'
}
