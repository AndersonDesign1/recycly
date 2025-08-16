import { Resend } from "resend";
import type { ReactElement } from "react";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  react?: React.ReactElement;
  from?: string;
  replyTo?: string;
  cc?: string[];
  bcc?: string[];
  attachments?: Array<{
    filename: string;
    content: Buffer | string;
    contentType?: string;
  }>;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  react,
  from,
  replyTo,
  cc,
  bcc,
  attachments,
}: EmailOptions) {
  try {
    const emailData: any = {
      from:
        from ||
        `${process.env.SENDER_NAME || "Recycly"} <${
          process.env.FROM_EMAIL || "noreply@onresend.com"
        }>`,
      to: Array.isArray(to) ? to : [to],
      subject,
      replyTo,
      cc,
      bcc,
      attachments,
    };

    if (react) {
      emailData.react = react;
    } else {
      if (html) emailData.html = html;
      if (text) emailData.text = text;
    }

    const result = await resend.emails.send(emailData);

    console.log("✅ Email sent successfully:", result.data?.id);
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return { success: false, error };
  }
}

// Enhanced email templates with better styling and Resend features
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: `Welcome to ${process.env.APP_NAME || "Recycly"}! 🌱`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to Recycly</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #22c55e, #1e88e5); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">🌱 ${
                process.env.APP_NAME || "Recycly"
              }</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 18px;">Turn Waste Into Rewards</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 20px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Welcome, ${name}! 🎉</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Thank you for joining our mission to make waste disposal rewarding and sustainable. 
                You're now part of a community that's making a real difference for our planet.
              </p>
              
              <div style="background-color: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 18px;">🚀 Get Started</h3>
                <ul style="color: #166534; margin: 0; padding-left: 20px;">
                  <li style="margin-bottom: 8px;">Find nearby waste bins using our app</li>
                  <li style="margin-bottom: 8px;">Dispose waste responsibly to earn points</li>
                  <li style="margin-bottom: 8px;">Redeem rewards from our partners</li>
                  <li style="margin-bottom: 0;">Track your environmental impact</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                }/dashboard" 
                   style="background-color: #22c55e; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                  Start Earning Rewards
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 30px 0 0 0;">
                Happy recycling! 🌍<br>
                <strong>The Recycly Team</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © 2024 Recycly. All rights reserved.<br>
                Making waste disposal rewarding and sustainable.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Welcome to Recycly, ${name}! 

Thank you for joining our mission to make waste disposal rewarding and sustainable. You're now part of a community that's making a real difference for our planet.

Get Started:
• Find nearby waste bins using our app
• Dispose waste responsibly to earn points  
• Redeem rewards from our partners
• Track your environmental impact

Start earning rewards: ${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/dashboard

Happy recycling! 🌍
The Recycly Team`,
  }),

  emailVerification: (name: string, verificationUrl: string) => ({
    subject: "Verify your Recycly account",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Verify Your Email - Recycly</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #22c55e, #1e88e5); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">🌱 Recycly</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 18px;">Email Verification</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 20px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Verify Your Email</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hi ${name},<br><br>
                Please verify your email address to complete your Recycly account setup. 
                This helps us ensure the security of your account.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${verificationUrl}" 
                   style="background-color: #22c55e; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
                  ✅ Verify Email Address
                </a>
              </div>
              
              <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="color: #92400e; margin: 0; font-size: 14px;">
                  <strong>🔒 Security Note:</strong> If you didn't create an account with Recycly, 
                  you can safely ignore this email. Your email address will not be added to any mailing lists.
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 30px 0 0 0;">
                Need help? Contact our support team.<br>
                <strong>The Recycly Team</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © 2024 Recycly. All rights reserved.<br>
                Making waste disposal rewarding and sustainable.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Verify Your Email - Recycly

Hi ${name},

Please verify your email address to complete your Recycly account setup. This helps us ensure the security of your account.

Verify your email: ${verificationUrl}

Security Note: If you didn't create an account with Recycly, you can safely ignore this email.

Need help? Contact our support team.

The Recycly Team`,
  }),

  passwordReset: (name: string, resetUrl: string) => ({
    subject: "Reset your Recycly password",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Reset Password - Recycly</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">🌱 Recycly</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 18px;">Password Reset</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 20px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">Reset Your Password</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hi ${name},<br><br>
                You requested to reset your password. Click the button below to set a new password for your Recycly account.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${resetUrl}" 
                   style="background-color: #ef4444; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; font-size: 16px;">
                  🔑 Reset Password
                </a>
              </div>
              
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="color: #991b1b; margin: 0; font-size: 14px;">
                  <strong>⏰ Important:</strong> This link will expire in 1 hour for security reasons. 
                  If you didn't request this password reset, you can safely ignore this email.
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 30px 0 0 0;">
                Need help? Contact our support team.<br>
                <strong>The Recycly Team</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © 2024 Recycly. All rights reserved.<br>
                Making waste disposal rewarding and sustainable.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Reset Your Password - Recycly

Hi ${name},

You requested to reset your password. Click the link below to set a new password for your Recycly account.

Reset your password: ${resetUrl}

Important: This link will expire in 1 hour for security reasons.

If you didn't request this password reset, you can safely ignore this email.

Need help? Contact our support team.

The Recycly Team`,
  }),

  pointsEarned: (name: string, points: number, wasteType: string) => ({
    subject: `You earned ${points} points! 🎉`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Points Earned - Recycly</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #fbbf24, #f59e0b); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">🌱 Recycly</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 18px;">Points Earned!</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 20px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">🎉 Points Earned!</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hi ${name},<br><br>
                Great job! You just earned <strong>${points} points</strong> for disposing ${wasteType.toLowerCase()} waste responsibly.
              </p>
              
              <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 10px;">🏆</div>
                <div style="font-size: 32px; font-weight: 700; color: #92400e; margin-bottom: 5px;">+${points} Points</div>
                <div style="color: #92400e; font-size: 16px;">Keep up the great work!</div>
              </div>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                Your dedication to sustainable waste disposal is making a real difference for our planet. 
                Every point you earn represents a step toward a cleaner, greener future.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                }/dashboard" 
                   style="background-color: #fbbf24; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                  View Your Progress
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 30px 0 0 0;">
                Keep up the great work and help make our planet cleaner! 🌍<br>
                <strong>The Recycly Team</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © 2024 Recycly. All rights reserved.<br>
                Making waste disposal rewarding and sustainable.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Points Earned! 🎉 - Recycly

Hi ${name},

Great job! You just earned ${points} points for disposing ${wasteType.toLowerCase()} waste responsibly.

🏆 +${points} Points
Keep up the great work!

Your dedication to sustainable waste disposal is making a real difference for our planet. Every point you earn represents a step toward a cleaner, greener future.

View your progress: ${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/dashboard

Keep up the great work and help make our planet cleaner! 🌍

The Recycly Team`,
  }),

  levelUp: (name: string, newLevel: number) => ({
    subject: `Level Up! You're now level ${newLevel} 🚀`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Level Up - Recycly</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #8b5cf6, #7c3aed); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">🌱 Recycly</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 18px;">Level Up!</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 20px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">🚀 Level Up!</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hi ${name},<br><br>
                Congratulations! You've reached <strong>Level ${newLevel}</strong> in your recycling journey!
              </p>
              
              <div style="background-color: #f3e8ff; border: 1px solid #c084fc; border-radius: 8px; padding: 20px; margin: 20px 0; text-align: center;">
                <div style="font-size: 48px; margin-bottom: 10px;">🎯</div>
                <div style="font-size: 32px; font-weight: 700; color: #7c3aed; margin-bottom: 5px;">Level ${newLevel}</div>
                <div style="color: #7c3aed; font-size: 16px;">New milestone achieved!</div>
              </div>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 20px 0;">
                Your dedication to sustainable waste disposal is making a real difference. 
                Each level represents your commitment to creating a cleaner environment and inspiring others to do the same.
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${
                  process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
                }/dashboard" 
                   style="background-color: #8b5cf6; color: white; padding: 14px 28px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block;">
                  View Your Achievements
                </a>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 30px 0 0 0;">
                Keep up the amazing work! 🌟<br>
                <strong>The Recycly Team</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © 2024 Recycly. All rights reserved.<br>
                Making waste disposal rewarding and sustainable.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Level Up! 🚀 - Recycly

Hi ${name},

Congratulations! You've reached Level ${newLevel} in your recycling journey!

🎯 Level ${newLevel}
New milestone achieved!

Your dedication to sustainable waste disposal is making a real difference. Each level represents your commitment to creating a cleaner environment and inspiring others to do the same.

View your achievements: ${
      process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
    }/dashboard

Keep up the amazing work! 🌟

The Recycly Team`,
  }),

  twoFactorSetup: (name: string, secret: string, backupCodes: string[]) => ({
    subject: "Two-Factor Authentication Setup - Recycly",
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>2FA Setup - Recycly</title>
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
            <!-- Header -->
            <div style="background: linear-gradient(135deg, #1e88e5, #1565c0); padding: 40px 20px; text-align: center;">
              <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">🌱 Recycly</h1>
              <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 18px;">2FA Setup</p>
            </div>
            
            <!-- Content -->
            <div style="padding: 40px 20px;">
              <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">🔐 Two-Factor Authentication Setup</h2>
              
              <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                Hi ${name},<br><br>
                You're setting up two-factor authentication for your Recycly account. 
                This adds an extra layer of security to protect your account and rewards.
              </p>
              
              <div style="background-color: #eff6ff; border: 1px solid #93c5fd; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #1e40af; margin: 0 0 15px 0; font-size: 18px;">📱 Step 1: Scan QR Code</h3>
                <p style="color: #1e40af; margin: 0; font-size: 14px;">
                  Use your authenticator app (Google Authenticator, Authy, Microsoft Authenticator) to scan the QR code in the app.
                </p>
              </div>
              
              <div style="background-color: #f0fdf4; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #166534; margin: 0 0 15px 0; font-size: 18px;">🔑 Step 2: Manual Setup (if needed)</h3>
                <p style="color: #166534; margin: 0 0 10px 0; font-size: 14px;">
                  If the QR code doesn't work, manually enter this secret in your authenticator app:
                </p>
                <div style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 14px; color: #374151; text-align: center;">
                  ${secret}
                </div>
              </div>
              
              <div style="background-color: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <h3 style="color: #92400e; margin: 0 0 15px 0; font-size: 18px;">💾 Step 3: Backup Codes</h3>
                <p style="color: #92400e; margin: 0 0 10px 0; font-size: 14px;">
                  Store these backup codes securely. Use them if you lose your 2FA device:
                </p>
                <div style="background-color: #f3f4f6; padding: 12px; border-radius: 6px; font-family: monospace; font-size: 14px; color: #374151; text-align: center;">
                  ${backupCodes.join("<br>")}
                </div>
              </div>
              
              <div style="background-color: #fef2f2; border: 1px solid #fecaca; border-radius: 8px; padding: 20px; margin: 20px 0;">
                <p style="color: #991b1b; margin: 0; font-size: 14px;">
                  <strong>⚠️ Important:</strong> Keep your backup codes secure and don't share them with anyone. 
                  Once you've set up your authenticator app, return to the app to complete the verification.
                </p>
              </div>
              
              <p style="color: #6b7280; font-size: 14px; text-align: center; margin: 30px 0 0 0;">
                Need help? Contact our support team.<br>
                <strong>The Recycly Team</strong>
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background-color: #f8fafc; padding: 20px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                © 2024 Recycly. All rights reserved.<br>
                Making waste disposal rewarding and sustainable.
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
    text: `Two-Factor Authentication Setup - Recycly

Hi ${name},

You're setting up two-factor authentication for your Recycly account. This adds an extra layer of security to protect your account and rewards.

📱 Step 1: Scan QR Code
Use your authenticator app to scan the QR code in the app.

🔑 Step 2: Manual Setup (if needed)
If the QR code doesn't work, manually enter this secret: ${secret}

💾 Step 3: Backup Codes
Store these backup codes securely:
${backupCodes.join("\n")}

Important: Keep your backup codes secure and don't share them with anyone.

Once you've set up your authenticator app, return to the app to complete the verification.

Need help? Contact our support team.

The Recycly Team`,
  }),
};
