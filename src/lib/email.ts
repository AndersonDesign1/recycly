import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface EmailOptions {
  to: string | string[];
  subject: string;
  html?: string;
  text?: string;
  from?: string;
}

export async function sendEmail({
  to,
  subject,
  html,
  text,
  from,
  react,
}: EmailOptions & { react?: React.ReactElement }) {
  try {
    const result = await resend.emails.send({
      from: from || process.env.FROM_EMAIL || "Recycly <noreply@recycly.com>",
      react: react,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
      text,
    });

    console.log("✅ Email sent successfully:", result.data?.id);
    return { success: true, id: result.data?.id };
  } catch (error) {
    console.error("❌ Failed to send email:", error);
    return { success: false, error };
  }
}

// Email templates
export const emailTemplates = {
  welcome: (name: string) => ({
    subject: "Welcome to Recycly! 🌱",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #22c55e;">Welcome to Recycly, ${name}! 🌱</h1>
        <p>Thank you for joining our mission to make waste disposal rewarding and sustainable.</p>
        <p>Get started by:</p>
        <ul>
          <li>Finding nearby waste bins using our app</li>
          <li>Disposing waste responsibly to earn points</li>
          <li>Redeeming rewards from our partners</li>
        </ul>
        <p>Happy recycling!</p>
        <p>The Recycly Team</p>
      </div>
    `,
    text: `Welcome to Recycly, ${name}! Thank you for joining our mission to make waste disposal rewarding and sustainable.`,
  }),

  emailVerification: (name: string, verificationUrl: string) => ({
    subject: "Verify your Recycly account",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #22c55e;">Verify Your Email</h1>
        <p>Hi ${name},</p>
        <p>Please verify your email address by clicking the button below:</p>
        <a href="${verificationUrl}" style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">
          Verify Email
        </a>
        <p>If you didn't create an account with Recycly, you can safely ignore this email.</p>
        <p>The Recycly Team</p>
      </div>
    `,
    text: `Hi ${name}, please verify your email address by visiting: ${verificationUrl}`,
  }),

  passwordReset: (name: string, resetUrl: string) => ({
    subject: "Reset your Recycly password",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #22c55e;">Reset Your Password</h1>
        <p>Hi ${name},</p>
        <p>You requested to reset your password. Click the button below to set a new password:</p>
        <a href="${resetUrl}" style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; margin: 16px 0;">
          Reset Password
        </a>
        <p>This link will expire in 1 hour for security reasons.</p>
        <p>If you didn't request this, you can safely ignore this email.</p>
        <p>The Recycly Team</p>
      </div>
    `,
    text: `Hi ${name}, reset your password by visiting: ${resetUrl}`,
  }),

  pointsEarned: (name: string, points: number, wasteType: string) => ({
    subject: `You earned ${points} points! 🎉`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #22c55e;">Points Earned! 🎉</h1>
        <p>Hi ${name},</p>
        <p>Great job! You just earned <strong>${points} points</strong> for disposing ${wasteType.toLowerCase()} waste responsibly.</p>
        <p>Keep up the great work and help make our planet cleaner! 🌍</p>
        <p>The Recycly Team</p>
      </div>
    `,
    text: `Hi ${name}, you earned ${points} points for disposing ${wasteType.toLowerCase()} waste!`,
  }),

  levelUp: (name: string, newLevel: number) => ({
    subject: `Level Up! You're now level ${newLevel} 🚀`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h1 style="color: #22c55e;">Level Up! 🚀</h1>
        <p>Hi ${name},</p>
        <p>Congratulations! You've reached <strong>Level ${newLevel}</strong>!</p>
        <p>Your dedication to sustainable waste disposal is making a real difference. Keep it up!</p>
        <p>The Recycly Team</p>
      </div>
    `,
    text: `Hi ${name}, congratulations! You've reached Level ${newLevel}!`,
  }),
};
