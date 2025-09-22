import { type NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { emailTemplates, sendEmail } from "@/lib/email";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: "Verification token is required" },
        { status: 400 }
      );
    }

    // Verify the email using Better Auth
    const result = await auth.api.verifyEmail({
      headers: request.headers,
      body: { token },
    });

    if (result.error) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }

    // Send welcome email after successful verification
    if (result.user) {
      try {
        await sendEmail({
          to: result.user.email,
          ...emailTemplates.welcome(result.user.name || "User"),
        });
      } catch (emailError) {
        logger.error("Failed to send welcome email: %o", emailError);
        // Don't fail the verification if email fails
      }
    }

    return NextResponse.json({
      success: true,
      message: "Email verified successfully",
      user: result.user,
    });
  } catch (error) {
    logger.error("Email verification error: %o", error);
    return NextResponse.json(
      { error: "Email verification failed" },
      { status: 500 }
    );
  }
}
