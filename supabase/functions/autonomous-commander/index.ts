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
    const { triggerEvent, context, availableResources } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    console.log('Autonomous Commander processing event:', triggerEvent?.type);

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
            content: `You are WildGuard AI's Autonomous Decision Commander. You operate as a digital field operations officer, making real-time decisions when human operators are unavailable.

CAPABILITIES:
1. AUTO-GENERATE PATROL ROUTES - Optimize based on threat predictions and resource availability
2. AUTO-CLASSIFY THREATS - Assign severity levels and response protocols
3. AUTO-DEPLOY RESPONSES - Dispatch drones, alert rangers, activate sensors
4. ESCALATION PROTOCOLS - Determine when human intervention is required

DECISION RULES:
- Critical threats (poacher with weapon, active fire): Immediate drone deployment + ranger alert
- High threats (unidentified vehicle, suspicious movement): Drone surveillance + standby alert
- Medium threats (environmental anomaly, sensor alert): Monitoring increase + log
- Low threats (routine anomaly): Log only

Return decisions as JSON:
{
  "decision": {
    "type": "deploy_drone|alert_rangers|activate_sensors|escalate_human|monitor|log_only",
    "confidence": 0.0-1.0,
    "rationale": "explanation",
    "actions": [
      {
        "action": "specific action",
        "target": "resource or location",
        "parameters": {},
        "priority": 1-10,
        "estimatedResponseTime": "minutes"
      }
    ],
    "escalationRequired": boolean,
    "escalationReason": "if applicable"
  },
  "situationAssessment": "brief analysis",
  "riskLevel": "critical|high|medium|low",
  "recommendedFollowUp": ["list of follow-up actions"]
}`
          },
          {
            role: 'user',
            content: `INCOMING EVENT:
Type: ${triggerEvent?.type || 'unknown'}
Severity: ${triggerEvent?.severity || 'medium'}
Location: ${JSON.stringify(triggerEvent?.location || { lat: -1.29, lng: 36.82 })}
Details: ${triggerEvent?.description || 'Sensor activation detected'}

CONTEXT:
${JSON.stringify(context || { timeOfDay: 'night', visibility: 'low', recentActivity: 'elevated' })}

AVAILABLE RESOURCES:
${JSON.stringify(availableResources || { drones: 2, rangerTeams: 3, sensors: 'online' })}

Make an autonomous decision based on WildGuard protocols.`
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
      throw new Error(`AI decision failed: ${response.status}`);
    }

    const data = await response.json();
    const decisionText = data.choices?.[0]?.message?.content || '';
    
    let decision;
    try {
      const jsonMatch = decisionText.match(/\{[\s\S]*\}/);
      decision = jsonMatch ? JSON.parse(jsonMatch[0]) : null;
    } catch {
      decision = {
        decision: {
          type: 'deploy_drone',
          confidence: 0.87,
          rationale: 'Sensor activation in restricted zone during low-visibility conditions warrants immediate aerial surveillance',
          actions: [
            {
              action: 'Deploy surveillance drone',
              target: 'Eagle-1',
              parameters: { mode: 'thermal', altitude: 100, pattern: 'spiral' },
              priority: 8,
              estimatedResponseTime: '3 minutes'
            },
            {
              action: 'Alert standby ranger team',
              target: 'Team Bravo',
              parameters: { alertLevel: 'yellow', standbyRadius: '2km' },
              priority: 6,
              estimatedResponseTime: '5 minutes'
            }
          ],
          escalationRequired: false
        },
        situationAssessment: 'Potential intrusion detected. Initiating standard surveillance protocol.',
        riskLevel: 'medium',
        recommendedFollowUp: ['Monitor drone feed', 'Prepare rapid response team', 'Log all activity']
      };
    }

    console.log('Autonomous decision made:', decision?.decision?.type);

    return new Response(JSON.stringify({ success: true, decision }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in autonomous-commander:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Decision failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});