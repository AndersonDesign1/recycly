import { PrismaClient } from "../src/generated/prisma";

const prisma = new PrismaClient();

async function main() {
  // Create Nigerian-based waste types with realistic rates (in Naira per kg)
  const wasteTypes = await Promise.all([
    prisma.wasteType.upsert({
      where: { name: "Plastic Bottles" },
      update: {},
      create: {
        name: "Plastic Bottles",
        description: "PET bottles, water bottles, soft drink bottles",
        ratePerKg: 25.0, // ₦25 per kg
      },
    }),
    prisma.wasteType.upsert({
      where: { name: "Cardboard" },
      update: {},
      create: {
        name: "Cardboard",
        description: "Cardboard boxes, packaging materials",
        ratePerKg: 15.0, // ₦15 per kg
      },
    }),
    prisma.wasteType.upsert({
      where: { name: "Aluminum Cans" },
      update: {},
      create: {
        name: "Aluminum Cans",
        description: "Beer cans, soft drink cans, aluminum containers",
        ratePerKg: 40.0, // ₦40 per kg
      },
    }),
    prisma.wasteType.upsert({
      where: { name: "Glass Bottles" },
      update: {},
      create: {
        name: "Glass Bottles",
        description: "Beer bottles, wine bottles, glass containers",
        ratePerKg: 10.0, // ₦10 per kg
      },
    }),
    prisma.wasteType.upsert({
      where: { name: "Organic Waste" },
      update: {},
      create: {
        name: "Organic Waste",
        description: "Food scraps, vegetable peels, garden waste",
        ratePerKg: 5.0, // ₦5 per kg
      },
    }),
    prisma.wasteType.upsert({
      where: { name: "Electronic Waste" },
      update: {},
      create: {
        name: "Electronic Waste",
        description: "Old phones, computers, electronic devices",
        ratePerKg: 100.0, // ₦100 per kg
      },
    }),
    prisma.wasteType.upsert({
      where: { name: "Textiles" },
      update: {},
      create: {
        name: "Textiles",
        description: "Old clothes, fabric scraps, textile waste",
        ratePerKg: 8.0, // ₦8 per kg
      },
    }),
    prisma.wasteType.upsert({
      where: { name: "Paper" },
      update: {},
      create: {
        name: "Paper",
        description: "Newspapers, magazines, office paper",
        ratePerKg: 12.0, // ₦12 per kg
      },
    }),
  ]);

  // Create Nigerian-based system settings
  const systemSettings = await Promise.all([
    prisma.systemSetting.upsert({
      where: { key: "min_deposit_kg" },
      update: {},
      create: {
        key: "min_deposit_kg",
        value: "1",
        description: "Minimum weight in kg for waste deposits",
      },
    }),
    prisma.systemSetting.upsert({
      where: { key: "min_payout_amount" },
      update: {},
      create: {
        key: "min_payout_amount",
        value: "500", // ₦500 minimum payout
        description: "Minimum credit amount for payout requests (in Naira)",
      },
    }),
    prisma.systemSetting.upsert({
      where: { key: "currency" },
      update: {},
      create: {
        key: "currency",
        value: "NGN",
        description: "Default currency for the system",
      },
    }),
    prisma.systemSetting.upsert({
      where: { key: "max_daily_deposits" },
      update: {},
      create: {
        key: "max_daily_deposits",
        value: "10",
        description: "Maximum number of deposits per user per day",
      },
    }),
    prisma.systemSetting.upsert({
      where: { key: "waste_manager_radius_km" },
      update: {},
      create: {
        key: "waste_manager_radius_km",
        value: "5",
        description: "Radius in kilometers for waste manager assignment",
      },
    }),
    prisma.systemSetting.upsert({
      where: { key: "app_name" },
      update: {},
      create: {
        key: "app_name",
        value: "Recycly Nigeria",
        description: "Application name",
      },
    }),
  ]);

  console.log("✅ Database seeded successfully with Nigerian data!");
  console.log(`Created ${wasteTypes.length} waste types`);
  console.log(`Created ${systemSettings.length} system settings`);
  console.log("🇳🇬 Nigerian waste types and settings configured");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
