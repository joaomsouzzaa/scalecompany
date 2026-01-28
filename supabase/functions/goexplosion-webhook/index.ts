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
    const orderData = {
      customer_name: payload.data?.customer_name ?? payload.data?.customerName ?? payload.data?.buyer?.name ?? payload.data?.customer?.name ?? 'Cliente Desconhecido',
      customer_email: payload.data?.customer_email ?? payload.data?.customerEmail ?? payload.data?.buyer?.email ?? payload.data?.customer?.email ?? 'email@desconhecido.com',
      product_name: payload.data?.product_name ?? payload.data?.product?.name ?? 'Produto Indefinido',
      value: payload.data?.value ?? payload.data?.amount ?? payload.data?.total ?? 0,
      status: mapStatus(payload.event ?? payload.data?.status),
      payment_method: payload.data?.payment_method ?? payload.data?.payment?.method ?? payload.data?.payment_type ?? 'unknown',
      external_id: payload.data?.external_id ?? payload.data?.id ?? payload.data?.order_id ?? payload.id,
      platform: 'GoExplosion',
      // created_at is handled by default database value
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

function mapStatus(event: string): string {
  if (!event) return 'Pendente'
  const lower = event.toLowerCase()
  if (lower.includes('approved') || lower.includes('paid') || lower.includes('aprovado')) return 'Aprovado'
  if (lower.includes('refund') || lower.includes('reembolsado')) return 'Reembolsado'
  return 'Pendente'
}
