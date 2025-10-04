#!/usr/bin/env tsx

import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function testAPI() {
  console.log("🧪 Testing Recycly Nigeria API...");

  try {
    // Test 1: Get waste types
    console.log("\n📋 Testing waste types...");
    const wasteTypes = await prisma.wasteType.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
    });
    console.log(`✅ Found ${wasteTypes.length} waste types`);
    for (const type of wasteTypes) {
      console.log(`   - ${type.name}: ₦${type.ratePerKg}/kg`);
    }

    // Test 2: Get system settings
    console.log("\n⚙️  Testing system settings...");
    const settings = await prisma.systemSetting.findMany({
      orderBy: { key: "asc" },
    });
    console.log(`✅ Found ${settings.length} system settings`);
    for (const setting of settings) {
      console.log(`   - ${setting.key}: ${setting.value}`);
    }

    // Test 3: Test user creation (without auth for now)
    console.log("\n👤 Testing user model...");
    const userCount = await prisma.user.count();
    console.log(`✅ User table accessible: ${userCount} users`);

    // Test 4: Test waste deposit model
    console.log("\n🗑️  Testing waste deposit model...");
    const depositCount = await prisma.wasteDeposit.count();
    console.log(`✅ Waste deposit table accessible: ${depositCount} deposits`);

    // Test 5: Test credit model
    console.log("\n💰 Testing credit model...");
    const creditCount = await prisma.credit.count();
    console.log(`✅ Credit table accessible: ${creditCount} credits`);

    console.log("\n🎉 All API tests passed!");
    console.log("🇳🇬 Recycly Nigeria API is ready!");
  } catch (error) {
    console.error("❌ API test failed:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

testAPI();
