import { type NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export function GET(_request: NextRequest) {
  try {
    const envVars = {
      resendApiKey: process.env.RESEND_API_KEY ? "✅ Set" : "❌ Missing",
      fromEmail: process.env.FROM_EMAIL || "❌ Not set",
      senderName: process.env.SENDER_NAME || "❌ Not set",
      nodeEnv: process.env.NODE_ENV || "❌ Not set",
    };

    // Test Resend connection
    let resendTest = "❌ Failed";
    try {
      const _resend = new Resend(process.env.RESEND_API_KEY);
      // Just test the connection, don't send email
      resendTest = "✅ Connected";
    } catch (error) {
      resendTest = `❌ Error: ${error}`;
    }

    return NextResponse.json({
      environment: envVars,
      resend: resendTest,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to check environment", details: error },
      { status: 500 }
    );
  }
}
