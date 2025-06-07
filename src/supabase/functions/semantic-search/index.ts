
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
    const { query, filters, limit = 20 } = await req.json();
    
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    );

    // Get user from auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Invalid user token');
    }

    // For now, return a simple text-based search
    // In production, this would use vector embeddings
    const { data: messages, error: searchError } = await supabaseClient
      .from('messages')
      .select('id, content, sender, created_at, session_id')
      .eq('user_id', user.id)
      .ilike('content', `%${query}%`)
      .order('created_at', { ascending: false })
      .limit(limit);

    if (searchError) {
      throw searchError;
    }

    // Add relevance scores (mock implementation)
    const resultsWithScores = messages?.map(msg => ({
      ...msg,
      relevanceScore: Math.random() * 0.5 + 0.5, // Mock score between 0.5-1.0
      sessionTitle: `Session ${msg.session_id.slice(0, 8)}`,
      context: `Message from ${msg.sender}`
    })) || [];

    return new Response(
      JSON.stringify({ results: resultsWithScores }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Semantic search error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
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
