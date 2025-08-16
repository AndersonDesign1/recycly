import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    // Get the authenticated user
    const session = await auth.api.getSession({
      headers: request.headers,
    });

    if (!session?.user) {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const { method } = await request.json();

    if (!method || method !== "email") {
      return NextResponse.json(
        { error: "Invalid method. Only 'email' is supported" },
        { status: 400 }
      );
    }

    // Generate a new 6-digit verification code
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    if (method === "email") {
      // Send verification code via email using Better Auth
      try {
        await sendEmail({
          to: session.user.email,
          subject: "Two-Factor Authentication Code - Recycly",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #22c55e;">Two-Factor Authentication</h1>
              <p>Hi ${session.user.name || "there"},</p>
              <p>Here's your new verification code for Recycly:</p>
              
              <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; text-align: center; margin: 20px 0;">
                <h2 style="color: #1e88e5; font-size: 32px; margin: 0; letter-spacing: 4px;">${verificationCode}</h2>
              </div>
              
              <p style="color: #6b7280; font-size: 14px;">
                <strong>Important:</strong> This code will expire in 10 minutes. Do not share this code with anyone.
              </p>
              
              <p>If you didn't request this code, please ignore this email and contact support immediately.</p>
              
              <p>Best regards,<br>The Recycly Team</p>
            </div>
          `,
          text: `Two-Factor Authentication Code for Recycly

Hi ${session.user.name || "there"},

Here's your new verification code: ${verificationCode}

This code will expire in 10 minutes. Do not share this code with anyone.

If you didn't request this code, please ignore this email and contact support immediately.

Best regards,
The Recycly Team`,
        });

        // Store the verification code securely in the database
        // This should be integrated with Better Auth's 2FA system
        // For now, we'll return success

        return NextResponse.json({
          success: true,
          message: "Verification code sent successfully",
        });
      } catch (emailError) {
        console.error("Email sending error:", emailError);
        return NextResponse.json(
          { error: "Failed to send verification code via email" },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ error: "Invalid method" }, { status: 400 });
  } catch (error) {
    console.error("2FA resend error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
