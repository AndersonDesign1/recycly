import { PrismaClient } from "@prisma/client";
import { connectToPrismaPostgres } from "@/lib/prisma";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding Prisma Postgres database...");

  // Connect to Prisma Postgres
  await connectToPrismaPostgres();

  // Create superadmin user with Better Auth compatible structure
  const superadmin = await prisma.user.upsert({
    where: { email: "superadmin@recycly.com" },
    update: {},
    create: {
      email: "superadmin@recycly.com",
      name: "Super Admin",
      emailVerified: new Date(),
      role: "SUPERADMIN",
      points: 1000,
      level: 10,
      accounts: {
        create: {
          accountId: "superadmin-account",
          providerId: "credential",
          password:
            "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq/3Haa", // superadmin123
        },
      },
    },
  });

  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: "admin@recycly.com" },
    update: {},
    create: {
      email: "admin@recycly.com",
      name: "Admin User",
      emailVerified: new Date(),
      role: "ADMIN",
      points: 500,
      level: 5,
      accounts: {
        create: {
          accountId: "admin-account",
          providerId: "credential",
          password:
            "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq/3Haa", // admin123
        },
      },
    },
  });

  // Create waste manager user
  const wasteManager = await prisma.user.upsert({
    where: { email: "wastemanager@recycly.com" },
    update: {},
    create: {
      email: "wastemanager@recycly.com",
      name: "Waste Manager",
      emailVerified: new Date(),
      role: "WASTE_MANAGER",
      points: 200,
      level: 2,
      accounts: {
        create: {
          accountId: "wastemanager-account",
          providerId: "credential",
          password:
            "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq/3Haa", // wastemanager123
        },
      },
    },
  });

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: "user@recycly.com" },
    update: {},
    create: {
      email: "user@recycly.com",
      name: "Regular User",
      emailVerified: new Date(),
      role: "USER",
      points: 50,
      level: 1,
      accounts: {
        create: {
          accountId: "user-account",
          providerId: "credential",
          password:
            "$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj6hsxq/3Haa", // user123
        },
      },
    },
  });

  // Create sample waste bins with optimized coordinates for Prisma Postgres
  const wasteBins = await Promise.all([
    prisma.wasteBin.create({
      data: {
        name: "Central Park Recycling",
        type: "RECYCLING",
        latitude: 40.7829,
        longitude: -73.9654,
        qrCode: "QR_CENTRAL_PARK_001",
        address: "Central Park, New York, NY",
        description: "Recycling bin located near the main entrance",
      },
    }),
    prisma.wasteBin.create({
      data: {
        name: "Downtown Compost",
        type: "COMPOST",
        latitude: 40.7589,
        longitude: -73.9851,
        qrCode: "QR_DOWNTOWN_002",
        address: "Downtown Manhattan, NY",
        description: "Compost bin for organic waste",
      },
    }),
    prisma.wasteBin.create({
      data: {
        name: "Electronics Disposal Center",
        type: "ELECTRONIC",
        latitude: 40.7505,
        longitude: -73.9934,
        qrCode: "QR_ELECTRONICS_003",
        address: "Tech District, NY",
        description: "Specialized bin for electronic waste",
      },
    }),
  ]);

  // Create sample rewards
  const rewards = await Promise.all([
    prisma.reward.create({
      data: {
        name: "$5 Coffee Voucher",
        description: "Enjoy a free coffee at participating cafes",
        pointsRequired: 100,
        category: "VOUCHER",
        stock: 50,
        partnerName: "Green Coffee Co.",
      },
    }),
    prisma.reward.create({
      data: {
        name: "10% Discount on Eco Products",
        description: "Get 10% off on all eco-friendly products",
        pointsRequired: 200,
        category: "DISCOUNT",
        partnerName: "EcoStore",
      },
    }),
    prisma.reward.create({
      data: {
        name: "Tree Planting Donation",
        description: "Plant a tree in your name",
        pointsRequired: 500,
        category: "DONATION",
        partnerName: "Green Earth Foundation",
      },
    }),
  ]);

  // Create sample achievements
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        name: "First Disposal",
        description: "Complete your first waste disposal",
        condition: { type: "disposal_count", value: 1 },
        points: 10,
        rarity: "COMMON",
      },
    }),
    prisma.achievement.create({
      data: {
        name: "Recycling Champion",
        description: "Dispose 50 recycling items",
        condition: { type: "recycling_count", value: 50 },
        points: 100,
        rarity: "RARE",
      },
    }),
    prisma.achievement.create({
      data: {
        name: "Eco Warrior",
        description: "Reach 1000 points",
        condition: { type: "points_total", value: 1000 },
        points: 200,
        rarity: "EPIC",
      },
    }),
  ]);

  console.log("✅ Prisma Postgres database seeded successfully!");
  console.log("👤 Users created:");
  console.log(`   - Superadmin: ${superadmin.email} (password: superadmin123)`);
  console.log(`   - Admin: ${admin.email} (password: admin123)`);
  console.log(
    `   - Waste Manager: ${wasteManager.email} (password: wastemanager123)`
  );
  console.log(`   - User: ${user.email} (password: user123)`);
  console.log(`🗑️  Created ${wasteBins.length} waste bins`);
  console.log(`🎁 Created ${rewards.length} rewards`);
  console.log(`🏆 Created ${achievements.length} achievements`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error("❌ Error seeding Prisma Postgres:", e);
    await prisma.$disconnect();
    process.exit(1);
  });
