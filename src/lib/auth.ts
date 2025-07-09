import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const resend = new Resend(process.env.RESEND_API_KEY!);

export const auth = betterAuth({
  database: prismaAdapter(prisma, { provider: "postgresql" }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
    sendResetPassword: async ({ user, url }: { user: { email: string; name?: string }; url: string }) => {
      await resend.emails.send({
        from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
        to: user.email,
        subject: "Reset your password",
        html: `<p>Hello ${user.name || user.email},</p>
               <p>Click <a href="${url}">here</a> to reset your password.</p>`,
        text: `Hello ${user.name || user.email},\nReset your password: ${url}`,
      });
    },
    sendVerificationEmail: async ({ user, url }: { user: { email: string; name?: string }; url: string }) => {
      await resend.emails.send({
        from: `${process.env.EMAIL_SENDER_NAME} <${process.env.EMAIL_SENDER_ADDRESS}>`,
        to: user.email,
        subject: "Verify your email",
        html: `<p>Hello ${user.name || user.email},</p>
               <p>Click <a href="${url}">here</a> to verify your email address.</p>`,
        text: `Hello ${user.name || user.email},\nVerify your email: ${url}`,
      });
    },
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    },
  },
  user: {
    additionalFields: {
      role: { type: "string", defaultValue: "USER", required: false },
      points: { type: "number", defaultValue: 0, required: false },
      level: { type: "number", defaultValue: 1, required: false },
      isActive: { type: "boolean", defaultValue: true, required: false },
    },
  },
});

// --- Role hierarchy and permission helper ---
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

// --- Helper to get authenticated user ---
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
