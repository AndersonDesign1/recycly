import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

// Extended user type that includes role and other fields
export interface ExtendedUser {
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

export interface ExtendedSession {
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
  user: ExtendedUser;
}

export interface Context {
  db: typeof prisma;
  session: ExtendedSession | null;
}

export async function createContext(): Promise<Context> {
  // For now, return null session - we'll handle auth in the procedures
  // This is a temporary fix until we implement proper session handling
  return {
    db: prisma,
    session: null,
  };
}
