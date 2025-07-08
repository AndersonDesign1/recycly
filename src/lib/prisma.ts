import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["query", "error", "warn"]
        : ["error"],
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Prisma Postgres specific optimizations
export async function connectToPrismaPostgres() {
  try {
    await prisma.$connect();
    console.log("✅ Connected to Prisma Postgres successfully");
  } catch (error) {
    console.error("❌ Failed to connect to Prisma Postgres:", error);
    throw error;
  }
}

// Graceful shutdown
export async function disconnectFromPrismaPostgres() {
  try {
    await prisma.$disconnect();
    console.log("✅ Disconnected from Prisma Postgres");
  } catch (error) {
    console.error("❌ Error disconnecting from Prisma Postgres:", error);
  }
}

// Health check for Prisma Postgres
export async function checkPrismaPostgresHealth() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return { status: "healthy", timestamp: new Date().toISOString() };
  } catch (error) {
    return {
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    };
  }
}
