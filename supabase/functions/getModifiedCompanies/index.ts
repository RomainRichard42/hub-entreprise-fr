import { serve } from 'https://deno.land/std@0.168.0/http/server.ts'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client, content-type',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Content-Type': 'application/json'
}

interface Company {
  siren: string
  phone?: string | null
  email?: string | null
  website?: string | null
  internal_notes?: string | null
  status?: 'en_cours' | 'a_faire' | 'termine' | null
  updated_at?: string
}

serve(async (req: Request) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    const { data, error } = await supabaseClient
      .from('company_details')
      .select('*')
      .not('status', 'is', null)

    if (error) throw error

    return new Response(JSON.stringify(data), {
      headers: { ...corsHeaders },
      status: 200
    })

  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }), 
      { headers: { ...corsHeaders }, status: 500 }
    )
  }
})