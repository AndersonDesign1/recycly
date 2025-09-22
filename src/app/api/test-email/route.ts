import { NextRequest, NextResponse } from "next/server";
import { sendEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const result = await sendEmail({
      to: email,
      subject: "🧪 Test Email from Recycly",
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px;">
          <h2>🧪 Test Email</h2>
          <p>This is a test email to verify your email configuration is working.</p>
          <p>If you received this, your email setup is working correctly!</p>
          <p>Time: ${new Date().toLocaleString()}</p>
        </div>
      `,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully",
        id: result.id,
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send test email", details: result.error },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Test email error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
