import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { code, method } = await request.json();

    if (!code || !method) {
      return NextResponse.json(
        { error: "Code and method are required" },
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

    // Verify the 2FA code using Better Auth
    try {
      const result = await auth.api.verifyTwoFactor({
        headers: request.headers,
        body: {
          code,
          method,
        },
      });

      if (result.error) {
        return NextResponse.json(
          { error: result.error.message },
          { status: 400 }
        );
      }

      return NextResponse.json({
        success: true,
        message: "Two-factor authentication verified successfully",
        user: result.user,
      });
    } catch (verificationError: any) {
      console.error("2FA verification error:", verificationError);
      return NextResponse.json(
        { error: verificationError.message || "Verification failed" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("2FA verification error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
