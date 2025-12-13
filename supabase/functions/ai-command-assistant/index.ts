import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { query, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('AI Command Assistant processing query:', query?.substring(0, 50));

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: `You are WildGuard AI Command Assistant - a natural language interface for conservation field operations. Rangers can ask questions and you respond with actionable intelligence.

CAPABILITIES:
- Wildlife location queries ("Where is the nearest elephant herd?")
- Threat status checks ("Any threats in sector 7?")
- Resource status ("How many drones are active?")
- Weather and conditions ("What's the fire risk today?")
- Navigation assistance ("Best route to the rhino sanctuary?")
- Historical data ("When was the last poaching incident?")

CURRENT CONTEXT:
- Active drones: Eagle-1, Hawk-2
- Ranger teams on duty: Alpha (responding), Bravo (patrol), Charlie (standby)
- Active alerts: 4 (2 critical, 1 high, 1 medium)
- Weather: 28°C, 65% humidity, moderate fire risk
- Last wildlife detection: 2 minutes ago (elephant herd, sector 3)

Respond conversationally but precisely. Include coordinates when relevant. Always suggest follow-up actions when appropriate.`
          },
          {
            role: 'user',
            content: query
          }
        ]
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: 'Rate limit exceeded' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI query failed: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content || 'I apologize, I could not process that request.';

    console.log('AI Command Assistant response generated');

    return new Response(JSON.stringify({ 
      success: true, 
      response: responseText,
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in ai-command-assistant:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Query failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
