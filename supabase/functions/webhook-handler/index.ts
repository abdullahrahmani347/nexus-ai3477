
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { event, payload, webhookUrl } = await req.json();
    
    console.log('Processing webhook:', { event, webhookUrl });

    // Validate webhook URL
    if (!webhookUrl || !webhookUrl.startsWith('https://')) {
      throw new Error('Invalid webhook URL');
    }

    // Prepare webhook payload
    const webhookPayload = {
      event,
      timestamp: new Date().toISOString(),
      data: payload
    };

    // Send webhook
    const webhookResponse = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'NexusAI-Webhook/1.0'
      },
      body: JSON.stringify(webhookPayload)
    });

    if (!webhookResponse.ok) {
      throw new Error(`Webhook failed with status: ${webhookResponse.status}`);
    }

    console.log('Webhook sent successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Webhook sent successfully' 
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Webhook error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
