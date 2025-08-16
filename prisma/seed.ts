import { PrismaClient, UserRole, AchievementRarity } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Starting database seed...");

  // Create achievements
  const achievements = [
    {
      id: "first_disposal",
      name: "First Step",
      description: "Complete your first waste disposal",
      icon: "🌱",
      condition: { type: "first_disposal" },
      points: 50,
      badge: "🥇",
      rarity: AchievementRarity.COMMON,
    },
    {
      id: "level_5",
      name: "Rising Star",
      description: "Reach level 5",
      icon: "⭐",
      condition: { type: "level", value: 5 },
      points: 100,
      badge: "🌟",
      rarity: AchievementRarity.RARE,
    },
    {
      id: "level_10",
      name: "Waste Warrior",
      description: "Reach level 10",
      icon: "🏆",
      condition: { type: "level", value: 10 },
      points: 200,
      badge: "👑",
      rarity: AchievementRarity.EPIC,
    },
    {
      id: "recycling_master",
      name: "Recycling Master",
      description: "Dispose of 50 recycling items",
      icon: "♻️",
      condition: { type: "waste_count", wasteType: "RECYCLING", count: 50 },
      points: 150,
      badge: "♻️",
      rarity: AchievementRarity.RARE,
    },
    {
      id: "hazardous_hero",
      name: "Hazardous Hero",
      description: "Dispose of 10 hazardous waste items",
      icon: "⚠️",
      condition: { type: "waste_count", wasteType: "HAZARDOUS", count: 10 },
      points: 300,
      badge: "🛡️",
      rarity: AchievementRarity.EPIC,
    },
  ];

  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: { id: achievement.id },
      update: {},
      create: achievement,
    });
  }

  // Create sample rewards
  const rewards = [
    {
      name: "Eco-Friendly Water Bottle",
      description: "Reusable water bottle made from recycled materials",
      pointsRequired: 500,
      category: "PRODUCT",
      stock: 100,
      partnerName: "EcoStore",
      partnerLogo: "🌍",
    },
    {
      name: "Local Coffee Shop Voucher",
      description: "Get 20% off at participating eco-friendly coffee shops",
      pointsRequired: 200,
      category: "VOUCHER",
      stock: 50,
      partnerName: "Green Coffee Co.",
      partnerLogo: "☕",
    },
    {
      name: "Tree Planting Certificate",
      description:
        "We'll plant a tree in your name for environmental conservation",
      pointsRequired: 1000,
      category: "DONATION",
      stock: null,
      partnerName: "Tree Foundation",
      partnerLogo: "🌳",
    },
  ];

  for (const reward of rewards) {
    await prisma.reward.create({
      data: reward,
    });
  }

  // Create superadmin user
  const hashedPassword = await bcrypt.hash("superadmin123", 12);

  const superadmin = await prisma.user.upsert({
    where: { email: "superadmin@recycly.com" },
    update: {},
    create: {
      email: "superadmin@recycly.com",
      name: "Super Admin",
      role: UserRole.SUPERADMIN,
      points: 0,
      level: 1,
      isActive: true,
      accounts: {
        create: {
          providerId: "credentials",
          accountId: "superadmin@recycly.com",
          password: hashedPassword,
        },
      },
    },
  });

  // Create sample admin user
  const adminPassword = await bcrypt.hash("admin123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@recycly.com" },
    update: {},
    create: {
      email: "admin@recycly.com",
      name: "Admin User",
      role: UserRole.ADMIN,
      points: 0,
      level: 1,
      isActive: true,
      accounts: {
        create: {
          providerId: "credentials",
          accountId: "admin@recycly.com",
          password: adminPassword,
        },
      },
    },
  });

  // Create sample waste manager
  const managerPassword = await bcrypt.hash("manager123", 12);

  const manager = await prisma.user.upsert({
    where: { email: "manager@recycly.com" },
    update: {},
    create: {
      email: "manager@recycly.com",
      name: "Waste Manager",
      role: UserRole.WASTE_MANAGER,
      points: 0,
      level: 1,
      isActive: true,
      accounts: {
        create: {
          providerId: "credentials",
          accountId: "manager@recycly.com",
          password: managerPassword,
        },
      },
    },
  });

  // Create sample regular user
  const userPassword = await bcrypt.hash("user123", 12);

  const user = await prisma.user.upsert({
    where: { email: "user@recycly.com" },
    update: {},
    create: {
      email: "user@recycly.com",
      name: "Regular User",
      role: UserRole.USER,
      points: 0,
      level: 1,
      isActive: true,
      accounts: {
        create: {
          providerId: "credentials",
          accountId: "user@recycly.com",
          password: userPassword,
        },
      },
    },
  });

  console.log("✅ Database seeded successfully!");
  console.log("👑 Superadmin: superadmin@recycly.com / superadmin123");
  console.log("👨‍💼 Admin: admin@recycly.com / admin123");
  console.log("👷 Waste Manager: manager@recycly.com / manager123");
  console.log("👤 User: user@recycly.com / user123");
}

main()
  .catch((e) => {
    console.error("❌ Seeding failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
