import { PrismaClient } from "@prisma/client";
import { withAccelerate } from "@prisma/extension-accelerate";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
  basePrisma: PrismaClient | undefined;
};

// Base Prisma client without extensions (for operations that have type conflicts)
export const basePrisma =
  globalForPrisma.basePrisma ??
  new PrismaClient({
    log: ["query"],
  });

// Extended Prisma client with Accelerate
export const db = basePrisma.$extends(withAccelerate());

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = basePrisma;
  globalForPrisma.basePrisma = basePrisma;
}
