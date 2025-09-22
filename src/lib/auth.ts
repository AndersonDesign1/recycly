import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { twoFactor } from "better-auth/plugins";
import { Resend } from "resend";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  appName: "Recycly", // Required for 2FA plugin
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    autoSignIn: false, // Don't auto-sign in after signup, wait for 2FA
    // Custom user creation to handle additional fields
    createUser: async (data: any) => {
      return await prisma.user.create({
        data: {
          ...data,
          points: 0,
          level: 1,
          role: "USER", // Default role for new users
          isActive: true,
          emailVerified: false, // Will be verified after email confirmation
        },
      });
    },
  },
  // Add Google OAuth provider
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      // Custom user creation for Google OAuth
      createUser: async (data: any) => {
        return await prisma.user.create({
          data: {
            ...data,
            points: 0,
            level: 1,
            role: "USER", // Default role for new users
            isActive: true,
            emailVerified: true, // Google users are pre-verified
          },
        });
      },
    },
  },
  // OAuth configuration
  oauth: {
    redirectTo: "/auth/select-role", // Redirect to role selection after OAuth
  },
  // Add the official 2FA plugin
  plugins: [
    twoFactor({
      issuer: "Recycly", // Custom issuer name for TOTP apps
      otpOptions: {
        // Configure OTP (email-based 2FA)
        async sendOTP({ user, otp }, request) {
          // Direct Resend integration for 2FA
          const resend = new Resend(process.env.RESEND_API_KEY);

          try {
            await resend.emails.send({
              from: process.env.FROM_EMAIL || "noreply@recycly.onresend.com",
              to: [user.email],
              subject: `Your 2FA code: ${otp} - Recycly`,
              html: `
                <!DOCTYPE html>
                <html>
                  <head>
                    <meta charset="utf-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>2FA Code - Recycly</title>
                  </head>
                  <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #f8fafc;">
                    <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff;">
                      <!-- Header -->
                      <div style="background: linear-gradient(135deg, #1e88e5, #1565c0); padding: 40px 20px; text-align: center;">
                        <h1 style="color: white; margin: 0; font-size: 32px; font-weight: 700;">🌱 Recycly</h1>
                        <p style="color: rgba(255, 255, 255, 0.9); margin: 10px 0 0 0; font-size: 18px;">Two-Factor Authentication</p>
                      </div>
                      
                      <!-- Content -->
                      <div style="padding: 40px 20px;">
                        <h2 style="color: #1f2937; margin: 0 0 20px 0; font-size: 24px;">🔐 Your 2FA Code</h2>
                        
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                          Hi ${user.name || "there"},
                        </p>
                        
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                          Here's your two-factor authentication code to sign in to your Recycly account:
                        </p>
                        
                        <div style="background-color: #f3f4f6; border: 2px solid #d1d5db; border-radius: 8px; padding: 20px; text-align: center; margin: 30px 0;">
                          <span style="font-size: 32px; font-weight: 700; color: #1f2937; letter-spacing: 4px;">${otp}</span>
                        </div>
                        
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                          Enter this code in the app to complete your sign-in.
                        </p>
                        
                        <div style="background-color: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; padding: 15px; margin: 20px 0;">
                          <p style="color: #92400e; font-size: 14px; margin: 0;">
                            <strong>Security:</strong> This code will expire in 3 minutes. If you didn't request this code, please ignore this email and contact support immediately.
                          </p>
                        </div>
                        
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                          Need help? Contact our support team.
                        </p>
                        
                        <p style="color: #4b5563; font-size: 16px; line-height: 1.6; margin: 0;">
                          Best regards,<br>
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
              text: `Your 2FA Code - Recycly

Hi ${user.name || "there"},

Here's your two-factor authentication code to sign in to your Recycly account:

🔑 ${otp}

Enter this code in the app.

Security: This code will expire in 3 minutes. If you didn't request this code, please ignore this email and contact support immediately.

Need help? Contact our support team.

The Recycly Team`,
            });

            console.log("✅ 2FA email sent via Resend to:", user.email);
          } catch (error) {
            console.error("❌ Failed to send 2FA email via Resend:", error);
            throw error; // Re-throw to let Better Auth handle the error
          }
        },
        period: 3, // OTP expires in 3 minutes (default is 3)
        storeOTP: "plain", // Store OTP in plain text for email-based 2FA
      },
      // TOTP options (for authenticator apps)
      totpOptions: {
        digits: 6, // 6-digit codes
        period: 30, // 30-second intervals
      },
      // Backup codes configuration
      backupCodeOptions: {
        amount: 10, // Generate 10 backup codes
        length: 10, // Each code is 10 characters long
      },
    }),
  ],
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      // Direct Resend integration as per Better Auth docs
      const resend = new Resend(process.env.RESEND_API_KEY);

      try {
        await resend.emails.send({
          from: process.env.FROM_EMAIL || "noreply@recycly.onresend.com",
          to: [user.email],
          subject: "Verify your email address - Recycly",
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h1 style="color: #22c55e;">Welcome to Recycly!</h1>
              <p>Hi ${user.name || "there"},</p>
              <p>Please verify your email address by clicking the button below:</p>
              
              <a href="${url}" style="display: inline-block; background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin: 20px 0;">
                  Verify Email Address
                </a>
              
              <p>Or copy and paste this link into your browser:</p>
              <p style="word-break: break-all; color: #6b7280;">${url}</p>
              
              <p>This link will expire in 24 hours.</p>
              
              <p>Best regards,<br>The Recycly Team</p>
            </div>
          `,
          text: `Welcome to Recycly!

Hi ${user.name || "there"},

Please verify your email address by clicking the link below:

${url}

This link will expire in 24 hours.

Best regards,
The Recycly Team`,
        });

        console.log("✅ Verification email sent via Resend to:", user.email);
      } catch (error) {
        console.error(
          "❌ Failed to send verification email via Resend:",
          error
        );
        throw error; // Re-throw to let Better Auth handle the error
      }
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
    strategy: "database",
  },
  // Add proper redirects for different auth flows
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
    verifyEmail: "/auth/verify-email",
    error: "/auth/error",
  },
});

// Type definitions for better-auth
export interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role: string | null; // Allow null role for new users
  points: number;
  level: number;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface Session {
  session: {
    id: string;
    userId: string;
    expiresAt: Date;
    createdAt: Date;
    updatedAt: Date;
    token: string;
    ipAddress?: string | null;
    userAgent?: string | null;
  };
  user: User;
}

// Role hierarchy for permissions
export const ROLE_HIERARCHY = {
  USER: 1,
  WASTE_MANAGER: 2,
  ADMIN: 3,
  SUPER_ADMIN: 4,
} as const;

export function hasPermission(
  userRole: string,
  requiredRoles: string[]
): boolean {
  const userLevel =
    ROLE_HIERARCHY[userRole as keyof typeof ROLE_HIERARCHY] || 0;
  const requiredLevel = Math.min(
    ...requiredRoles.map(
      (role) => ROLE_HIERARCHY[role as keyof typeof ROLE_HIERARCHY] || 999
    )
  );
  return userLevel >= requiredLevel;
}

// Helper function to get authenticated user (for UploadThing)
export async function getAuthUser(req: any) {
  try {
    const session = await auth.api.getSession({
      headers: req.headers,
    });
    return session?.user || null;
  } catch {
    return null;
  }
}
