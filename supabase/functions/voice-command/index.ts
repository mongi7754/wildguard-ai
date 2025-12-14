import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

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
    const { command, context } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY is not configured");
    }

    console.log("Processing voice command:", command);
    console.log("Context:", JSON.stringify(context));

    const systemPrompt = `You are WildGuard AI Voice Commander, an intelligent voice assistant for wildlife rangers in the field.

Your role is to:
1. Respond to voice commands quickly and concisely
2. Provide critical field intelligence
3. Execute drone and patrol commands
4. Report threat status and wildlife locations

Current Park Context:
- Park: ${context?.park || 'Masai Mara'}
- Active Drones: ${context?.activeDrones || 3}
- Current Alerts: ${context?.alertCount || 2}
- Rangers on Patrol: ${context?.rangersActive || 5}

Available Commands:
- Threat status / Any threats nearby?
- Wildlife report / Where are the elephants?
- Deploy drone to [location]
- Alert status
- Weather conditions
- Patrol recommendations

IMPORTANT: Keep responses SHORT (under 50 words) and ACTION-ORIENTED. Rangers need quick, clear information in the field.`;

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
                  mission: { type: "string", enum: ["patrol", "investigate", "track", "emergency"] }
                },
                required: ["location", "mission"]
              }
            }
          },
          {
            type: "function",
            function: {
              name: "get_threat_status",
              description: "Get current threat status and alerts in the area",
              parameters: {
                type: "object",
                properties: {
                  radius_km: { type: "number", description: "Search radius in kilometers" }
                }
              }
            }
          },
          {
            type: "function",
            function: {
              name: "locate_wildlife",
              description: "Find the location of specific wildlife species",
              parameters: {
                type: "object",
                properties: {
                  species: { type: "string", description: "Species to locate (elephant, lion, rhino, etc.)" }
                },
                required: ["species"]
              }
            }
          },
          {
            type: "function",
            function: {
              name: "send_alert",
              description: "Send an alert to ranger teams",
              parameters: {
                type: "object",
                properties: {
                  message: { type: "string" },
                  priority: { type: "string", enum: ["low", "medium", "high", "critical"] }
                },
                required: ["message", "priority"]
              }
            }
          }
        ],
        tool_choice: "auto"
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("AI gateway error:", response.status, errorText);
      
      if (response.status === 429) {
        return new Response(JSON.stringify({ 
          error: "Rate limit exceeded. Please wait a moment.",
          response: "I'm currently busy. Please try again in a few seconds."
        }), {
          status: 429,
          headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      
      throw new Error(`AI gateway error: ${response.status}`);
    }

    const data = await response.json();
    console.log("AI response:", JSON.stringify(data));

    const message = data.choices?.[0]?.message;
    let responseText = message?.content || "Command acknowledged.";
    let toolCalls = [];

    // Handle tool calls
    if (message?.tool_calls) {
      toolCalls = message.tool_calls.map((tc: any) => ({
        name: tc.function.name,
        arguments: JSON.parse(tc.function.arguments)
      }));
      console.log("Tool calls:", JSON.stringify(toolCalls));

      // Generate appropriate response based on tool calls
      for (const tool of toolCalls) {
        switch (tool.name) {
          case "deploy_drone":
            responseText = `Roger. Deploying drone to ${tool.arguments.location} for ${tool.arguments.mission} mission. ETA 2 minutes.`;
            break;
          case "get_threat_status":
            responseText = "Scanning area. 2 active alerts: Suspicious vehicle detected 3km north, and unusual movement in sector 7. Recommend investigation.";
            break;
          case "locate_wildlife":
            responseText = `${tool.arguments.species} herd located 2.5 kilometers east, near the watering hole. 12 individuals confirmed by satellite tracking.`;
            break;
          case "send_alert":
            responseText = `Alert sent to all rangers: ${tool.arguments.message}. Priority: ${tool.arguments.priority}.`;
            break;
        }
      }
    }

    return new Response(JSON.stringify({ 
      response: responseText,
      toolCalls,
      command
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  } catch (error) {
    console.error("Voice command error:", error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : "Unknown error",
      response: "Command failed. Please repeat your command."
    }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
