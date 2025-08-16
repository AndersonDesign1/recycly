import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { sendEmail, emailTemplates } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Generate a new verification email using Better Auth
    const result = await auth.api.resendVerificationEmail({
      headers: request.headers,
      body: { email },
    });

    if (result.error) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      );
    }

    // Send the verification email using Resend
    try {
      await sendEmail({
        to: email,
        ...emailTemplates.emailVerification(
          "User", // You might want to get the actual name from the user
          result.verificationUrl || `${process.env.NEXT_PUBLIC_APP_URL}/auth/verify-email?token=${result.token}`
        ),
      });

      return NextResponse.json({
        success: true,
        message: "Verification email sent successfully",
      });

    } catch (emailError) {
      console.error("Failed to send verification email:", emailError);
      return NextResponse.json(
        { error: "Failed to send verification email" },
        { status: 500 }
      );
    }

  } catch (error) {
    console.error("Resend verification error:", error);
    return NextResponse.json(
      { error: "Failed to resend verification email" },
      { status: 500 }
    );
  }
}
