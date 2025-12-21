import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.49.1";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// In-memory OTP storage (in production, use database)
const otpStore = new Map<string, { otp: string; expiresAt: number }>();

interface SendOtpRequest {
  email: string;
  action: "send" | "verify";
  otp?: string;
}

const generateOtp = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { email, action, otp }: SendOtpRequest = await req.json();

    console.log(`OTP ${action} request for email: ${email}`);

    if (!email) {
      return new Response(
        JSON.stringify({ error: "Email is required" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    // Create Supabase admin client
    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    if (action === "send") {
      const newOtp = generateOtp();
      const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes expiry
      
      // Store OTP
      otpStore.set(email, { otp: newOtp, expiresAt });
      
      console.log(`Generated OTP for ${email}`);

      // Send email via Resend API
      const emailResponse = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RESEND_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: "FAUNORA Security <onboarding@resend.dev>",
          to: [email],
          subject: "Your FAUNORA Security Code",
          html: `
            <!DOCTYPE html>
            <html>
            <head>
              <meta charset="utf-8">
              <meta name="viewport" content="width=device-width, initial-scale=1.0">
            </head>
            <body style="margin: 0; padding: 0; background-color: #0a0f0a; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;">
              <div style="max-width: 600px; margin: 0 auto; padding: 40px 20px;">
                <div style="background: linear-gradient(145deg, #0d1f0d 0%, #0a1510 100%); border: 1px solid #1a3d1a; border-radius: 16px; padding: 40px; text-align: center;">
                  <div style="margin-bottom: 30px;">
                    <span style="font-size: 48px;">🛡️</span>
                  </div>
                  <h1 style="color: #4ade80; font-size: 28px; margin: 0 0 10px 0; font-weight: 700; letter-spacing: 2px;">
                    FAUNORA
                  </h1>
                  <p style="color: #6b7280; font-size: 12px; letter-spacing: 3px; margin: 0 0 30px 0;">
                    AERIAL INTELLIGENCE ENGINE
                  </p>
                  <p style="color: #d1d5db; font-size: 16px; margin: 0 0 30px 0;">
                    Your security verification code is:
                  </p>
                  <div style="background: #0f1f14; border: 2px solid #22c55e; border-radius: 12px; padding: 20px 40px; display: inline-block; margin-bottom: 30px;">
                    <span style="font-size: 36px; font-weight: 700; letter-spacing: 8px; color: #4ade80; font-family: 'Courier New', monospace;">
                      ${newOtp}
                    </span>
                  </div>
                  <p style="color: #6b7280; font-size: 14px; margin: 0 0 10px 0;">
                    This code expires in <strong style="color: #f59e0b;">5 minutes</strong>
                  </p>
                  <p style="color: #4b5563; font-size: 12px; margin: 0;">
                    If you didn't request this code, please ignore this email.
                  </p>
                </div>
                <div style="text-align: center; margin-top: 30px;">
                  <p style="color: #374151; font-size: 11px; margin: 0;">
                    Government Authorized System • Wildlife Conservation Division
                  </p>
                </div>
              </div>
            </body>
            </html>
          `,
        }),
      });

      if (!emailResponse.ok) {
        const errorData = await emailResponse.text();
        console.error("Resend API error:", errorData);
        throw new Error(`Failed to send email: ${errorData}`);
      }

      const emailResult = await emailResponse.json();
      console.log("Email sent successfully:", emailResult);

      return new Response(
        JSON.stringify({ success: true, message: "OTP sent successfully" }),
        { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
      );
    }

    if (action === "verify") {
      if (!otp) {
        return new Response(
          JSON.stringify({ error: "OTP is required for verification" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      // Validate OTP format
      if (!/^\d{6}$/.test(otp)) {
        return new Response(
          JSON.stringify({ success: false, error: "Invalid OTP format" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      const storedData = otpStore.get(email);
      
      if (!storedData) {
        console.log(`No OTP found for email: ${email}`);
        return new Response(
          JSON.stringify({ success: false, error: "No OTP found. Please request a new code." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (Date.now() > storedData.expiresAt) {
        otpStore.delete(email);
        console.log(`OTP expired for email: ${email}`);
        return new Response(
          JSON.stringify({ success: false, error: "OTP has expired. Please request a new code." }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }

      if (storedData.otp === otp) {
        otpStore.delete(email);
        console.log(`OTP verified successfully for email: ${email}`);

        try {
          // Check if user exists
          const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
          const existingUser = existingUsers?.users?.find(u => u.email === email);

          let userId: string;

          if (existingUser) {
            userId = existingUser.id;
            console.log(`Existing user found: ${userId}`);
          } else {
            // Create new user with email confirmed
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
              email,
              email_confirm: true,
              user_metadata: { verified_via: 'otp' }
            });

            if (createError) {
              console.error("Error creating user:", createError);
              throw createError;
            }

            userId = newUser.user.id;
            console.log(`New user created: ${userId}`);
          }

          // Generate magic link for session
          const { data: linkData, error: linkError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email,
            options: {
              redirectTo: `${req.headers.get('origin') || 'https://app.lovable.dev'}/`
            }
          });

          if (linkError) {
            console.error("Error generating link:", linkError);
            throw linkError;
          }

          // Extract token from the link
          const tokenHash = linkData.properties?.hashed_token;
          
          // Use the verification token to sign in the user
          const { data: sessionData, error: sessionError } = await supabaseAdmin.auth.admin.generateLink({
            type: 'magiclink',
            email
          });

          if (sessionError) {
            console.error("Error creating session:", sessionError);
          }

          // Return the magic link token for client to use
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: "OTP verified successfully",
              // Return the token parts for client-side verification
              token: linkData.properties?.hashed_token,
              type: 'magiclink',
              email
            }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        } catch (authError: any) {
          console.error("Auth error:", authError);
          // Still return success for OTP verification but without session
          return new Response(
            JSON.stringify({ 
              success: true, 
              message: "OTP verified successfully",
              email,
              requiresManualAuth: true
            }),
            { status: 200, headers: { "Content-Type": "application/json", ...corsHeaders } }
          );
        }
      } else {
        console.log(`Invalid OTP for email: ${email}`);
        return new Response(
          JSON.stringify({ success: false, error: "Invalid OTP" }),
          { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
        );
      }
    }

    return new Response(
      JSON.stringify({ error: "Invalid action" }),
      { status: 400, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );

  } catch (error: any) {
    console.error("Error in send-otp function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json", ...corsHeaders } }
    );
  }
};

serve(handler);