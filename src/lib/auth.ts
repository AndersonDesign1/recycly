import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { prisma } from "./prisma";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url, token }, request) => {
      await sendEmail({
        to: user.email,
        subject: "Verify your email address - Recycly",
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #22c55e;">Welcome to Recycly!</h1>
            <p>Hi ${user.name || "there"},</p>
            <p>Please verify your email address by clicking the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${url}" style="background-color: #22c55e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; font-weight: bold;">
                Verify Email Address
              </a>
            </div>
            
            <p style="color: #6b7280; font-size: 14px;">
              If the button doesn't work, you can copy and paste this link into your browser: ${url}
            </p>
            
            <p>Best regards,<br>The Recycly Team</p>
          </div>
        `,
        text: `Welcome to Recycly! Please verify your email address by clicking this link: ${url}`,
      });
    },
    autoSignInAfterVerification: true,
    afterEmailVerification: async (user, request) => {
      console.log(`${user.email} has been successfully verified!`);
      // You can add custom logic here like granting access to features
    },
  },
  twoFactor: {
    enabled: true,
    methods: ["totp", "email"],
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 24 hours
    strategy: "database",
  },
});

// Type definitions for better-auth
export interface User {
  id: string;
  email: string;
  name: string;
  image?: string | null;
  role: string;
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
  SUPERADMIN: 4,
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
