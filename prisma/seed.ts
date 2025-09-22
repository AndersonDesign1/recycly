import { PrismaClient } from "@prisma/client";
import dotenv from "dotenv";
import { logger } from "@/lib/logger";

// Load environment variables
dotenv.config({ path: ".env.local" });

const prisma = new PrismaClient();

async function main() {
  logger.info("🌱 Starting database seed...");

  // Create waste categories
  const wasteCategories = await Promise.all([
    prisma.wasteCategory.create({
      data: {
        name: "Plastic",
        description: "Plastic bottles, containers, and packaging",
        pointsPerUnit: 10,
        color: "#3B82F6",
      },
    }),
    prisma.wasteCategory.create({
      data: {
        name: "Paper",
        description: "Cardboard, newspapers, magazines",
        pointsPerUnit: 8,
        color: "#10B981",
      },
    }),
    prisma.wasteCategory.create({
      data: {
        name: "Glass",
        description: "Glass bottles and containers",
        pointsPerUnit: 15,
        color: "#8B5CF6",
      },
    }),
    prisma.wasteCategory.create({
      data: {
        name: "Metal",
        description: "Aluminum cans, steel containers",
        pointsPerUnit: 20,
        color: "#F59E0B",
      },
    }),
    prisma.wasteCategory.create({
      data: {
        name: "Electronics",
        description: "Old phones, computers, batteries",
        pointsPerUnit: 50,
        color: "#EF4444",
      },
    }),
  ]);

  logger.info("✅ Created waste categories: %d", wasteCategories.length);

  // Create reward categories
  const rewardCategories = await Promise.all([
    prisma.rewardCategory.create({
      data: {
        name: "Discounts",
        description: "Store discounts and coupons",
        color: "#3B82F6",
      },
    }),
    prisma.rewardCategory.create({
      data: {
        name: "Products",
        description: "Physical products and merchandise",
        color: "#10B981",
      },
    }),
    prisma.rewardCategory.create({
      data: {
        name: "Experiences",
        description: "Event tickets and activities",
        color: "#8B5CF6",
      },
    }),
    prisma.rewardCategory.create({
      data: {
        name: "Donations",
        description: "Charitable donations in your name",
        color: "#F59E0B",
      },
    }),
  ]);

  logger.info("✅ Created reward categories: %d", rewardCategories.length);

  // Create some sample rewards
  const rewards = await Promise.all([
    prisma.reward.create({
      data: {
        name: "10% Off at EcoStore",
        description: "Get 10% off your next purchase at EcoStore",
        pointsRequired: 100,
        categoryId: rewardCategories[0].id, // Discounts
        stock: 100,
      },
    }),
    prisma.reward.create({
      data: {
        name: "Reusable Water Bottle",
        description: "Eco-friendly stainless steel water bottle",
        pointsRequired: 200,
        categoryId: rewardCategories[1].id, // Products
        stock: 50,
      },
    }),
    prisma.reward.create({
      data: {
        name: "Tree Planting",
        description: "Plant a tree in your name",
        pointsRequired: 150,
        categoryId: rewardCategories[3].id, // Donations
        stock: 1000,
      },
    }),
  ]);

  logger.info("✅ Created rewards: %d", rewards.length);

  // Create some achievements
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        name: "First Steps",
        description: "Complete your first waste disposal",
        type: "WASTE_COUNT",
        requirement: 1,
        bonusPoints: 50,
      },
    }),
    prisma.achievement.create({
      data: {
        name: "Waste Warrior",
        description: "Complete 10 waste disposals",
        type: "WASTE_COUNT",
        requirement: 10,
        bonusPoints: 200,
      },
    }),
    prisma.achievement.create({
      data: {
        name: "Point Collector",
        description: "Earn 500 points",
        type: "POINTS_THRESHOLD",
        requirement: 500,
        bonusPoints: 100,
      },
    }),
    prisma.achievement.create({
      data: {
        name: "Level Up",
        description: "Reach level 5",
        type: "LEVEL_THRESHOLD",
        requirement: 5,
        bonusPoints: 300,
      },
    }),
  ]);

  logger.info("✅ Created achievements: %d", achievements.length);

  logger.info("🎉 Database seeding completed successfully!");
}

main()
  .catch((e) => {
    logger.error("❌ Error seeding database: %o", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
