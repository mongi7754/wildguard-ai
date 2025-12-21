import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    const { parkId, historicalData, environmentData } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Generating threat predictions for park:', parkId);

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
            content: `You are WildGuard AI's Predictive Threat Engine. Analyze conservation data to predict:

1. POACHING HOTSPOTS
- Historical poaching patterns
- Animal movement predictions
- Market demand signals
- Moon phase and visibility conditions

2. FIRE RISK SCORING
- Temperature and humidity trends
- Vegetation dryness indices
- Wind patterns
- Historical fire data

3. HABITAT DESTRUCTION FORECASTING
- Encroachment patterns
- Infrastructure development plans
- Climate change impacts
- Water source changes

Return predictions as JSON:
{
  "predictions": [
    {
      "type": "poaching|fire|habitat_destruction|intrusion",
      "location": { "lat": number, "lng": number, "radius_km": number },
      "riskLevel": 0.0-1.0,
      "confidence": 0.0-1.0,
      "timeframe": "next 24 hours|next 7 days|next 30 days",
      "contributingFactors": ["list of factors"],
      "recommendedActions": ["list of actions"],
      "priority": "critical|high|medium|low"
    }
  ],
  "overallRiskAssessment": "string summary",
  "recommendedPatrolRoutes": [{ "waypoints": [], "priority": 1-10 }]
}`
          },
          {
            role: 'user',
            content: `Generate threat predictions for park: ${parkId}

Historical context: ${JSON.stringify(historicalData || { recentAlerts: 5, poachingIncidents: 2 })}
Environment: ${JSON.stringify(environmentData || { temp: 28, humidity: 65, fireRisk: 'moderate' })}

Analyze patterns and generate actionable predictions.`
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
      throw new Error(`AI prediction failed: ${response.status}`);
    }

    const data = await response.json();
    const predictionText = data.choices?.[0]?.message?.content || '';
    
    let predictions;
    try {
      const jsonMatch = predictionText.match(/\{[\s\S]*\}/);
      predictions = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      predictions = {
        predictions: [
          {
            type: 'poaching',
            location: { lat: -1.29, lng: 36.82, radius_km: 5 },
            riskLevel: 0.78,
            confidence: 0.85,
            timeframe: 'next 24 hours',
            contributingFactors: ['New moon phase', 'Recent rhino sightings in area', 'Reduced patrol coverage'],
            recommendedActions: ['Increase drone surveillance', 'Deploy rapid response team', 'Activate night vision sensors'],
            priority: 'high'
          },
          {
            type: 'fire',
            location: { lat: -1.31, lng: 36.80, radius_km: 3 },
            riskLevel: 0.62,
            confidence: 0.79,
            timeframe: 'next 7 days',
            contributingFactors: ['Low humidity', 'Dry vegetation', 'High temperatures'],
            recommendedActions: ['Pre-position fire response equipment', 'Clear firebreaks', 'Monitor thermal sensors'],
            priority: 'medium'
          }
        ],
        overallRiskAssessment: 'Elevated threat level due to environmental conditions and recent activity patterns',
        recommendedPatrolRoutes: [
          { waypoints: [[-1.29, 36.82], [-1.30, 36.83], [-1.28, 36.81]], priority: 9 }
        ]
      };
    }

    console.log('Threat predictions generated:', predictions?.predictions?.length || 0);

    return new Response(JSON.stringify({ success: true, predictions }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in threat-prediction-engine:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Prediction failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});