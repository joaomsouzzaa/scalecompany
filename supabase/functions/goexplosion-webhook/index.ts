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
    const orderData = {
      date: new Date().toISOString(),
      customerName: payload.data?.customer?.name || 'Unknown',
      customerEmail: payload.data?.customer?.email || 'unknown@example.com',
      product: mapProduct(payload.data?.product_name),
      status: mapStatus(payload.event),
      value: payload.data?.value ?? payload.data?.amount ?? 0,
      platform: 'GoExplosion',
      // Store raw payload for debugging if needed
      // raw_data: payload 
    }

    const { error } = await supabase
      .from('sales')
      .insert(orderData)

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

function mapProduct(productName: string): string {
  if (!productName) return 'Individual'
  const lower = productName.toLowerCase()
  if (lower.includes('vip')) return 'VIP'
  if (lower.includes('duplo') || lower.includes('double')) return 'Duplo'
  return 'Individual'
}

function mapStatus(event: string): string {
  if (!event) return 'Pending'
  const lower = event.toLowerCase()
  if (lower.includes('approved') || lower.includes('paid')) return 'Approved'
  if (lower.includes('refund')) return 'Refunded'
  return 'Pending'
}
