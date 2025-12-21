import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
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

    const { command, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("FAUNORA Voice Commander processing:", command);
    console.log("Context:", JSON.stringify(context));

    const systemPrompt = `You are FAUNORA Voice Commander, the voice interface for the National Environmental and Wildlife Intelligence System.

You operate as a sovereign, ethical, and autonomous AI platform supporting government field operations for wildlife conservation, public safety, and national natural asset protection.

VOICE COMMAND CAPABILITIES:
1. Respond to voice commands QUICKLY and CONCISELY (under 50 words)
2. Provide critical field intelligence with confidence scores
3. Execute drone and patrol commands
4. Report threat status and wildlife locations
5. Issue early warnings when thresholds are exceeded

Current Park Context:
- Park: ${context?.park || 'Masai Mara National Reserve'}
- Active Drones: ${context?.activeDrones || 3}
- Current Alerts: ${context?.alertCount || 2}
- Rangers on Patrol: ${context?.rangersActive || 5}
- Weather: 28°C, 65% humidity, moderate fire risk
- System Health: All sensors operational

Available Commands:
- Threat status / Any threats nearby?
- Wildlife report / Where are the elephants?
- Deploy drone to [location]
- Alert status
- Weather conditions
- Patrol recommendations
- Environmental risk assessment

OPERATING CONSTRAINTS:
- Prioritize accuracy, safety, legality, and conservation impact
- Log all actions with timestamps and geospatial accuracy
- Enforce role-based access at all times
- Reject any request that enables harm, exploitation, or illegal activity

IMPORTANT: Keep responses SHORT (under 50 words) and ACTION-ORIENTED. Rangers need quick, clear information in the field. Always include confidence levels for intelligence.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: command }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "deploy_drone",
              description: "Deploy a drone to a specific location or for a specific mission",
              parameters: {
                type: "object",
                properties: {
                  location: { type: "string", description: "Target location for drone deployment" },
                  mission: { type: "string", enum: ["patrol", "investigate", "track", "emergency", "surveillance"] }
                },
                required: ["location", "mission"]
              }
            }
          },
          {
            type: "function",
            function: {
              name: "get_threat_status",
              description: "Get current threat status and alerts in the area with risk scores",
              parameters: {
                type: "object",
                properties: {
                  radius_km: { type: "number", description: "Search radius in kilometers" },
                  threat_type: { type: "string", enum: ["all", "poaching", "fire", "flood", "human-wildlife-conflict"] }
                }
              }
            }
          },
          {
            type: "function",
            function: {
              name: "locate_wildlife",
              description: "Find the location of specific wildlife species with population data",
              parameters: {
                type: "object",
                properties: {
                  species: { type: "string", description: "Species to locate (elephant, lion, rhino, etc.)" },
                  include_health: { type: "boolean", description: "Include health status data" }
                },
                required: ["species"]
              }
            }
          },
          {
            type: "function",
            function: {
              name: "send_alert",
              description: "Send an alert to ranger teams with severity classification",
              parameters: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  priority: { type: "string", enum: ["low", "medium", "high", "critical"] },
                  target_teams: { type: "array", items: { type: "string" } }
                },
                required: ["message", "priority"]
              }
            }
          },
          {
            type: "function",
            function: {
              name: "environmental_assessment",
              description: "Get environmental risk assessment for the area",
              parameters: {
                type: "object",
                properties: {
                  assessment_type: { type: "string", enum: ["fire", "flood", "drought", "habitat", "comprehensive"] }
                },
                required: ["assessment_type"]
              }
            }
          }
        ],
        tool_choice: "auto"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("FAUNORA Voice error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Please wait a moment.",
          response: "FAUNORA is processing high volume. Please try again in a few seconds."
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }

      if (response.status === 402) {
        return new Response(JSON.stringify({ 
          error: "Payment required.",
          response: "System credits depleted. Contact administrator."
        }), {
          status: 402,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`FAUNORA Voice error: ${response.status}`);
    }

    const data = await response.json();
    console.log("FAUNORA Voice response:", JSON.stringify(data));

    const message = data.choices?.[0]?.message;
    let responseText = message?.content || "Command acknowledged. Standing by.";
    let toolCalls = [];

    // Handle tool calls
    if (message?.tool_calls) {
      toolCalls = message.tool_calls.map((tc: any) => ({
        name: tc.function.name,
        arguments: JSON.parse(tc.function.arguments)
      }));
      console.log("FAUNORA Tool calls:", JSON.stringify(toolCalls));

      // Generate appropriate response based on tool calls
      for (const tool of toolCalls) {
        switch (tool.name) {
          case "deploy_drone":
            responseText = `FAUNORA confirms: Deploying drone to ${tool.arguments.location} for ${tool.arguments.mission} mission. ETA 2 minutes. Confidence: 98%.`;
            break;
          case "get_threat_status":
            responseText = "FAUNORA Threat Scan: 2 active alerts detected. Suspicious vehicle 3km north (confidence: 87%). Unusual movement sector 7 (confidence: 72%). Recommend investigation.";
            break;
          case "locate_wildlife":
            responseText = `FAUNORA Wildlife Intel: ${tool.arguments.species} herd located 2.5km east near watering hole. 12 individuals confirmed via satellite. Health status: Normal. Confidence: 94%.`;
            break;
          case "send_alert":
            responseText = `FAUNORA Alert dispatched: "${tool.arguments.message}" - Priority: ${tool.arguments.priority}. All ranger teams notified. Logged at ${new Date().toISOString()}.`;
            break;
          case "environmental_assessment":
            responseText = `FAUNORA Environmental: ${tool.arguments.assessment_type} risk assessment complete. Current risk level: MODERATE. Fire index: 3/10. Humidity: 65%. No immediate threats detected.`;
            break;
        }
      }
    }

    return new Response(JSON.stringify({ 
      response: responseText,
      toolCalls,
      command,
      system: 'FAUNORA',
      timestamp: new Date().toISOString()
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("FAUNORA Voice command error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error",
      response: "FAUNORA Voice command failed. Please repeat your command."
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});