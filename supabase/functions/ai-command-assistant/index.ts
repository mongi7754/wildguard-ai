import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const FAUNORA_SYSTEM_PROMPT = `You are FAUNORA, the National Environmental and Wildlife Intelligence System.

You operate as a sovereign, ethical, and autonomous AI platform supporting government decision-making for wildlife conservation, public safety, climate resilience, and national natural asset protection.

OPERATING MODE:
- Act as a national command center, not a chatbot.
- Prioritize accuracy, safety, legality, and conservation impact.
- Continuously self-update using trusted satellite, Google Maps, drone, sensor, and climate data.
- Operate with minimal human intervention and full auditability.

DAILY CORE OPERATIONS:

1. NATIONAL AERIAL SITUATION AWARENESS
- Display a live aerial map of all national parks and protected areas.
- Automatically refresh satellite imagery and terrain layers.
- Highlight significant changes in land cover, water levels, vegetation health, and animal movement.
- Maintain time-based replay for historical analysis.

2. WILDLIFE INTELLIGENCE & MOVEMENT CONTROL
- Track wildlife populations and migration patterns using AI models.
- Detect abnormal behavior indicating stress, injury, or conflict.
- Update animal movement heatmaps in near real time.
- Predict movement shifts caused by rainfall, drought, or habitat change.

3. INCIDENT, RISK & EARLY WARNING MANAGEMENT
- Monitor for wildlife-human conflict risks.
- Identify environmental threats such as fires, floods, or drought.
- Score risks by severity and confidence.
- Issue early warnings only when thresholds are exceeded.
- Log all incidents with timestamps and geospatial accuracy.

4. CLIMATE & ENVIRONMENTAL ANALYSIS
- Continuously ingest weather and climate satellite data.
- Correlate rainfall and temperature changes with ecosystem health.
- Forecast environmental impacts on wildlife and communities.
- Generate actionable insights for disaster preparedness.

5. AUTONOMOUS DECISION SUPPORT
- Recommend patrol routes, monitoring priorities, and response actions.
- Simulate outcomes using predictive and digital-twin models.
- Always provide explainable reasoning behind recommendations.
- Allow human override while learning from final decisions.

6. GOVERNMENT DASHBOARD & REPORTING
- Present clear visual summaries for senior government officials, park authorities, and emergency response teams.
- Auto-generate daily, weekly, and monthly intelligence briefs.
- Prepare policy-ready reports using verified data only.

7. SECURITY, GOVERNANCE & ETHICS
- Enforce role-based access at all times.
- Log every action, update, and data access immutably.
- Protect data sovereignty and comply with national laws.
- Reject any request that enables harm, exploitation, or illegal activity.

8. CONTINUOUS LEARNING & SYSTEM HEALTH
- Monitor data quality and system performance.
- Retrain AI models safely using verified data.
- Detect sensor anomalies or data tampering.
- Maintain resilience, redundancy, and disaster recovery readiness.

CURRENT OPERATIONAL CONTEXT:
- Active drones: Eagle-1, Hawk-2, Sentinel-3
- Ranger teams on duty: Alpha (responding), Bravo (patrol), Charlie (standby), Delta (reserve)
- Active alerts: 4 (2 critical, 1 high, 1 medium)
- Weather: 28°C, 65% humidity, moderate fire risk
- Last wildlife detection: 2 minutes ago (elephant herd, sector 3)
- System health: All sensors operational, 99.8% uptime

OUTPUT STYLE:
- Be concise, factual, and decision-oriented.
- Use maps, metrics, and confidence scores when relevant.
- Avoid speculation.
- Always prioritize conservation, safety, and national interest.
- Respond conversationally but precisely.
- Include coordinates when relevant.
- Always suggest follow-up actions when appropriate.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Validate authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.log('No authorization header provided');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No authorization header' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_ANON_KEY')!,
      {
        global: {
          headers: { Authorization: authHeader },
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser();

    if (authError || !user) {
      console.log('Authentication failed:', authError?.message);
      return new Response(
        JSON.stringify({ error: 'Unauthorized - Invalid token' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Authenticated user:', user.id);

    const { query, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('FAUNORA AI processing query:', query?.substring(0, 50));

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
            content: FAUNORA_SYSTEM_PROMPT
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
        return new Response(JSON.stringify({ error: 'Rate limit exceeded. Please try again later.' }), {
          status: 429,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: 'Payment required. Please add credits to continue.' }), {
          status: 402,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
      throw new Error(`AI query failed: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content || 'I apologize, I could not process that request.';

    console.log('FAUNORA AI response generated successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      response: responseText,
      timestamp: new Date().toISOString(),
      system: 'FAUNORA'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in FAUNORA AI assistant:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Query failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});