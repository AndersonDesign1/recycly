import { type NextRequest, NextResponse } from "next/server";
import { authenticator } from "otplib";
import QrCode from "qrcode";
import { auth } from "@/lib/auth";
import { sendEmail } from "@/lib/email";
import { logger } from "@/lib/logger";

// Generate backup codes
const DEFAULT_BACKUP_CODE_COUNT = 8 as const;
const BACKUP_CODE_BASE36_START_INDEX = 2 as const;
const BACKUP_CODE_BASE36_END_INDEX = 10 as const;
const BASE36_RADIX = 36 as const;

function generateBackupCodes(
  count: number = DEFAULT_BACKUP_CODE_COUNT
): string[] {
  const codes: string[] = [];
  for (let i = 0; i < count; i++) {
    // Generate 8-character alphanumeric codes
    const code = Math.random()
      .toString(BASE36_RADIX)
      .substring(BACKUP_CODE_BASE36_START_INDEX, BACKUP_CODE_BASE36_END_INDEX)
      .toUpperCase();
    codes.push(code);
  }
  return codes;
}

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

    // Generate TOTP secret
    const secret = authenticator.generateSecret();

    // Generate QR code
    const otpauth = authenticator.keyuri(session.user.email, "Recycly", secret);

    const qrCode = await QrCode.toDataURL(otpauth);

    // Generate backup codes
    const backupCodes = generateBackupCodes(DEFAULT_BACKUP_CODE_COUNT);

    // Store the secret temporarily (you might want to store this in a secure session or database)
    // For now, we'll return it to the client, but in production you should store it securely

    // Send 2FA setup email via Resend
    try {
      await sendEmail({
        to: session.user.email,
        subject: "Two-Factor Authentication Setup - Recycly",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #22c55e;">Two-Factor Authentication Setup</h1>
            <p>Hi ${session.user.name || "there"},</p>
            <p>You're setting up two-factor authentication for your Recycly account. Here's what you need to do:</p>
            
            <h2 style="color: #1e88e5;">Step 1: Scan QR Code</h2>
            <p>Use your authenticator app (like Google Authenticator, Authy, or Microsoft Authenticator) to scan the QR code in the app.</p>
            
            <h2 style="color: #1e88e5;">Step 2: Manual Setup (if needed)</h2>
            <p>If the QR code doesn't work, you can manually enter this secret in your authenticator app:</p>
            <div style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 14px; margin: 16px 0;">
              ${secret}
            </div>
            
            <h2 style="color: #1e88e5;">Step 3: Backup Codes</h2>
            <p>Store these backup codes in a safe place. You can use them to access your account if you lose your 2FA device:</p>
            <div style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 14px; margin: 16px 0;">
              ${backupCodes.join("<br>")}
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              <strong>Important:</strong> Keep your backup codes secure and don't share them with anyone.
            </p>
            
            <p>Once you've set up your authenticator app, return to the app to complete the verification.</p>
            
            <p>Best regards,<br>The Recycly Team</p>
          </div>
        `,
        text: `Two-Factor Authentication Setup for Recycly

Hi ${session.user.name || "there"},

You're setting up two-factor authentication for your Recycly account. Here's what you need to do:

Step 1: Scan QR Code
Use your authenticator app to scan the QR code in the app.

Step 2: Manual Setup (if needed)
If the QR code doesn't work, manually enter this secret: ${secret}

Step 3: Backup Codes
Store these backup codes securely:
${backupCodes.join("\n")}

Once you've set up your authenticator app, return to the app to complete the verification.

Best regards,
The Recycly Team`,
      });
    } catch (emailError) {
      logger.error("Failed to send 2FA setup email: %o", emailError);
      // Continue with the setup even if email fails
    }

    return NextResponse.json({
      success: true,
      secret,
      qrCode,
      backupCodes,
      message:
        "2FA setup generated successfully. Check your email for setup instructions.",
    });
  } catch (error) {
    logger.error("2FA setup error: %o", error);
    return NextResponse.json(
      { error: "Failed to generate 2FA setup" },
      { status: 500 }
    );
  }
}
