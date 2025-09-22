import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";

export async function GET(request: NextRequest) {
  try {
    const envVars = {
      RESEND_API_KEY: process.env.RESEND_API_KEY ? "✅ Set" : "❌ Missing",
      FROM_EMAIL: process.env.FROM_EMAIL || "❌ Not set",
      SENDER_NAME: process.env.SENDER_NAME || "❌ Not set",
      NODE_ENV: process.env.NODE_ENV || "❌ Not set",
    };

    // Test Resend connection
    let resendTest = "❌ Failed";
    try {
      const resend = new Resend(process.env.RESEND_API_KEY);
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
