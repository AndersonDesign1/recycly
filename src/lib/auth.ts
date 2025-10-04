import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { db } from "./db";

export const auth = betterAuth({
  database: prismaAdapter(db, {
    provider: "postgresql",
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: true,
  },
  socialProviders: {
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        defaultValue: "USER",
        required: false,
      },
      phone: {
        type: "string",
        required: false,
      },
      latitude: {
        type: "number",
        required: false,
      },
      longitude: {
        type: "number",
        required: false,
      },
      address: {
        type: "string",
        required: false,
      },
      governmentId: {
        type: "string",
        required: false,
      },
      certificateUrl: {
        type: "string",
        required: false,
      },
      isVerified: {
        type: "boolean",
        defaultValue: false,
        required: false,
      },
      isAvailable: {
        type: "boolean",
        defaultValue: true,
        required: false,
      },
    },
  },
  plugins: [
    // Role-based access control plugin
    {
      id: "role-based-access",
      onRequest: async (request) => {
        // Add role-based middleware here
        return { request };
      },
    },
  ],
});

export type Session = typeof auth.$Infer.Session;
export type User = typeof auth.$Infer.Session.user;
