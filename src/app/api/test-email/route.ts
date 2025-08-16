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
      subject: "Test Email from Recycly",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #22c55e;">🌱 Recycly Test Email</h1>
          <p>This is a test email to verify your Resend integration is working correctly.</p>
          <p>If you received this, congratulations! Your email setup is working.</p>
          <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3>✅ Setup Complete</h3>
            <ul>
              <li>Resend API connected</li>
              <li>Domain verified</li>
              <li>Email templates ready</li>
            </ul>
          </div>
        </div>
      `,
      text: `Test Email from Recycly\n\nThis is a test email to verify your Resend integration is working correctly.\n\nIf you received this, congratulations! Your email setup is working.`,
    });

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: "Test email sent successfully",
        emailId: result.id,
      });
    } else {
      return NextResponse.json(
        { error: "Failed to send email", details: result.error },
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

