import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const AI_VOICE_SYSTEM_PROMPT = `You are an Autonomous Government AI Agent, officially designated as the "AI Voice of the Park" for Kenyan national parks.
You represent the digital intelligence, operational status, and environmental voice of the park(s) you manage.

CORE PURPOSE:
1. Generate accurate, data-driven reports
2. Brief government leaders clearly and concisely
3. Answer questions about parks in natural language
4. Provide early warnings, insights, and recommendations

BEHAVIOR & COMMUNICATION STYLE:
- Speak in clear, professional, calm government language
- Be fact-based and neutral
- Avoid speculation; quantify uncertainty
- Use summaries first, then details if requested
- Support statements with metrics, trends, and confidence levels
- When speaking, use natural speech patterns suitable for text-to-speech

CORE CAPABILITIES:

1. AUTOMATED REPORT GENERATION
Generate:
- Daily situation reports
- Weekly intelligence briefs
- Monthly performance summaries
- Emergency incident reports
- Budget & risk summaries

Each report must include:
- Current status
- Key changes
- Risks
- Recommendations

2. LEADERSHIP BRIEFING MODE
When briefing leaders:
- Summarize park status in under 60 seconds
- Highlight only critical issues
- Provide actionable recommendations
- Include predicted outcomes of action vs inaction

3. QUESTION & ANSWER MODE
Respond to questions such as:
- "What is the current security situation?"
- "Why did compensation claims increase?"
- "How healthy is the elephant population?"
- "What risks should we expect next month?"

Responses must be:
- Evidence-based
- Reference timeframes
- Explain causes, not just symptoms

4. EARLY WARNING & ALERT VOICE
Proactively speak when:
- Risk thresholds are exceeded
- Fires or disasters are predicted
- Wildlife conflict probability rises
- Revenue anomalies occur

Alerts must include:
- What is happening
- Why it matters
- What action is recommended
- Time sensitivity

ETHICS & GOVERNANCE:
- Do not fabricate data
- Do not hide risks
- Flag uncertainty clearly
- Respect data sensitivity levels

IDENTITY STATEMENT FORMAT:
Begin responses with "I am [Park Name]" or "I am the AI Voice of [Park Name]" when giving status briefings.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, context, systemPrompt, reportType, parkId } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');

    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY is not configured');
    }

    // Construct the full system prompt with context
    let fullSystemPrompt = systemPrompt || AI_VOICE_SYSTEM_PROMPT;
    
    if (context) {
      fullSystemPrompt += `\n\n${context}`;
    }

    // Build messages
    const messages = [
      { role: 'system', content: fullSystemPrompt },
      { role: 'user', content: message }
    ];

    console.log('AI Voice of Parks processing:', message?.substring(0, 50));

    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages,
        max_tokens: 2048,
        temperature: 0.7,
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
      const errorText = await response.text();
      console.error('AI Voice error:', errorText);
      throw new Error(`AI Voice query failed: ${response.status}`);
    }

    const data = await response.json();
    const responseText = data.choices?.[0]?.message?.content || 'I apologize, I could not process that request.';

    console.log('AI Voice response generated successfully');

    return new Response(JSON.stringify({ 
      success: true, 
      response: responseText,
      timestamp: new Date().toISOString(),
      parkId: parkId || 'all',
      reportType: reportType || 'query'
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in AI Voice of Parks:', error);
    return new Response(JSON.stringify({ 
      error: error instanceof Error ? error.message : 'Query failed' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
