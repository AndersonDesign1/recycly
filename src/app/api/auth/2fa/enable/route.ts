import { type NextRequest, NextResponse } from "next/server";
import { authenticator } from "otplib";
import { auth } from "@/lib/auth";
import { logger } from "@/lib/logger";

export async function POST(request: NextRequest) {
  try {
    const { secret, code } = await request.json();

    if (!(secret && code)) {
      return NextResponse.json(
        { error: "Secret and verification code are required" },
        { status: 400 }
      );
    }

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

    // Verify the TOTP code
    const isValid = authenticator.verify({
      token: code,
      secret,
    });

    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid verification code" },
        { status: 400 }
      );
    }

    // Here you would typically:
    // 1. Store the 2FA secret in your user's record
    // 2. Mark the user as having 2FA enabled
    // 3. Store backup codes securely

    // For now, we'll just return success
    // In production, you'd want to update the user's record in the database

    return NextResponse.json({
      success: true,
      message: "Two-factor authentication enabled successfully",
    });
  } catch (error) {
    logger.error("2FA enable error: %o", error);
    return NextResponse.json(
      { error: "Failed to enable 2FA" },
      { status: 500 }
    );
  }
}
