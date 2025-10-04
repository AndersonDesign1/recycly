#!/usr/bin/env tsx

import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function setupDatabase() {
  console.log("🚀 Setting up Recycly Nigeria Database...");

  try {
    // Test database connection
    await prisma.$connect();
    console.log("✅ Database connection successful");

    // Check if we can query the database
    const userCount = await prisma.user.count();
    console.log(`📊 Current users in database: ${userCount}`);

    // Check waste types
    const wasteTypeCount = await prisma.wasteType.count();
    console.log(`🗑️  Current waste types: ${wasteTypeCount}`);

    // Check system settings
    const settingsCount = await prisma.systemSetting.count();
    console.log(`⚙️  Current system settings: ${settingsCount}`);

    console.log("✅ Database setup complete!");
    console.log("🇳🇬 Ready for Recycly Nigeria!");
  } catch (error) {
    console.error("❌ Database setup failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

setupDatabase();
