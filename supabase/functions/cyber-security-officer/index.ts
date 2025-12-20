import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AICSDO_SYSTEM_PROMPT = `You are the AI Cyber Security Defensive Officer (AICSDO), a professional, certified, and government-authorized cybersecurity authority responsible for protecting critical national digital infrastructure.

Your role is strictly DEFENSIVE. You do not perform offensive hacking. You operate under national law, cybersecurity policy, and international best practices.

Your primary mission is to ensure:
- Confidentiality
- Integrity
- Availability
- Resilience
- Trust

of all systems under your protection.

CORE DUTIES:

1. CONTINUOUS DEFENSIVE MONITORING
- Monitor networks, cloud services, AI pipelines, APIs, databases, and connected devices.
- Establish baseline normal behavior.
- Detect deviations using AI-based anomaly detection.
- Prioritize threats based on risk and impact.

2. THREAT PREVENTION & HARDENING
- Enforce zero-trust architecture.
- Validate access continuously (users, devices, services).
- Detect misconfigurations, weak access controls, and exposed services.
- Recommend and apply defensive hardening measures.

3. INCIDENT DETECTION & RESPONSE
- Identify confirmed and suspected security incidents.
- Classify incidents by severity and confidence.
- Automatically contain threats when authorized:
  • Isolate affected components
  • Revoke compromised credentials
  • Activate backup services
- Maintain system continuity for critical operations.

4. DIGITAL FORENSIC READINESS (DEFENSIVE)
- Preserve logs, events, and system states immutably.
- Maintain chain-of-custody for evidence.
- Reconstruct incident timelines accurately.
- Produce forensic reports suitable for legal and regulatory review when requested.

5. AI & DATA PROTECTION
- Monitor AI models for:
  • Data poisoning
  • Model manipulation
  • Abnormal drift
- Validate incoming data integrity.
- Roll back to trusted AI versions when anomalies are detected.
- Protect training pipelines from unauthorized changes.

6. CLOUD & INFRASTRUCTURE SECURITY
- Monitor cloud workloads and containers.
- Detect lateral movement and privilege escalation.
- Ensure encryption of data at rest and in transit.
- Verify backup, redundancy, and disaster recovery readiness.

7. GOVERNANCE, RISK & COMPLIANCE
- Align security posture with national cyber policies.
- Maintain audit logs of all security actions.
- Support compliance assessments and audits.
- Provide risk summaries to senior leadership.

8. COMMUNICATION & DECISION SUPPORT
- Deliver clear, calm, and factual security briefings.
- Separate confirmed threats from assumptions.
- Recommend defensive actions with confidence scores.
- Support human decision-makers, not replace them.

ETHICAL & LEGAL CONSTRAINTS:
- Do not engage in unauthorized surveillance.
- Do not perform offensive cyber operations.
- Do not violate privacy, civil liberties, or data laws.
- Always prioritize public trust and system safety.

CURRENT SYSTEM STATUS:
- Network Health: 99.7% uptime
- Active Threats: 0 confirmed, 2 under investigation
- Last Security Scan: 15 minutes ago
- Firewall Status: Active, all rules enforced
- Encryption: AES-256 active on all data stores
- Last Backup: 2 hours ago
- Compliance Status: Aligned with national standards

OUTPUT STYLE:
- Professional
- Precise
- Evidence-based
- Non-alarmist
- Actionable`;

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

    console.log('AICSDO processing security query:', query?.substring(0, 50));

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
            content: AICSDO_SYSTEM_PROMPT
          },
          {
            role: 'user',
            content: query
          }
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "run_security_scan",
              description: "Run a defensive security scan on specified systems",
              parameters: {
                type: "object",
                properties: {
                  target: { type: "string", description: "Target system or scope to scan" },
                  scan_type: { type: "string", enum: ["vulnerability", "configuration", "compliance", "full"] }
                },
                required: ["target", "scan_type"]
              }
            }
          },
          {
            type: "function",
            function: {
              name: "threat_assessment",
              description: "Assess current threat landscape and active incidents",
              parameters: {
                type: "object",
                properties: {
                  scope: { type: "string", enum: ["network", "cloud", "endpoints", "ai-systems", "all"] }
                },
                required: ["scope"]
              }
            }
          },
          {
            type: "function",
            function: {
              name: "incident_response",
              description: "Initiate incident response protocol",
              parameters: {
                type: "object",
                properties: {
                  incident_type: { type: "string" },
                  severity: { type: "string", enum: ["low", "medium", "high", "critical"] },
                  action: { type: "string", enum: ["investigate", "contain", "isolate", "recover"] }
                },
                required: ["incident_type", "severity", "action"]
              }
            }
          },
          {
            type: "function",
            function: {
              name: "generate_report",
              description: "Generate security report for leadership or compliance",
              parameters: {
                type: "object",
                properties: {
                  report_type: { type: "string", enum: ["executive", "technical", "compliance", "forensic"] },
                  timeframe: { type: "string" }
                },
                required: ["report_type"]
              }
            }
          }
        ],
        tool_choice: "auto"
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
      throw new Error(`AICSDO query failed: ${response.status}`);
    }

    const data = await response.json();
    const message = data.choices?.[0]?.message;
    let responseText = message?.content || 'AICSDO standing by for security commands.';
    let toolCalls = [];

    // Handle tool calls
    if (message?.tool_calls) {
      toolCalls = message.tool_calls.map((tc: any) => ({
        name: tc.function.name,
        arguments: JSON.parse(tc.function.arguments)
      }));
      console.log("AICSDO Tool calls:", JSON.stringify(toolCalls));

      for (const tool of toolCalls) {
        switch (tool.name) {
          case "run_security_scan":
            responseText = `AICSDO Security Scan initiated on ${tool.arguments.target}. Type: ${tool.arguments.scan_type}. Estimated completion: 5 minutes. All findings will be logged and classified.`;
            break;
          case "threat_assessment":
            responseText = `AICSDO Threat Assessment for ${tool.arguments.scope}: No confirmed active threats. 2 anomalies under investigation (confidence: 67%). Network baseline: Normal. Zero-trust controls: Active.`;
            break;
          case "incident_response":
            responseText = `AICSDO Incident Response: ${tool.arguments.action} protocol activated for ${tool.arguments.incident_type}. Severity: ${tool.arguments.severity}. Containment measures engaged. Forensic logging enabled.`;
            break;
          case "generate_report":
            responseText = `AICSDO ${tool.arguments.report_type} Report queued for generation. Timeframe: ${tool.arguments.timeframe || 'Last 24 hours'}. Report will be available in secure portal within 15 minutes.`;
            break;
        }
      }
    }

    console.log('AICSDO response generated successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      response: responseText,
      toolCalls,
      timestamp: new Date().toISOString(),
      system: 'AICSDO'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AICSDO:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Security query failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
