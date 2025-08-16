import { prisma } from "./prisma";

export async function testDatabaseConnection() {
  try {
    // Test the connection by running a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`;
    console.log("✅ Database connection successful:", result);
    return true;
  } catch (error) {
    console.error("❌ Database connection failed:", error);
    return false;
  }
}

export async function testPrismaAccelerate() {
  try {
    // Test if we can access the database through Prisma Accelerate
    const userCount = await prisma.user.count();
    console.log("✅ Prisma Accelerate working, user count:", userCount);
    return true;
  } catch (error) {
    console.error("❌ Prisma Accelerate test failed:", error);
    return false;
  }
}
