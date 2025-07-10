import {
  PrismaClient,
  WasteType,
  WasteBinStatus,
  RewardCategory,
  AchievementRarity,
  ReportType,
  ReportPriority,
  UserRole,
  Prisma,
} from "@prisma/client"
import QRCode from "qrcode"

const prisma = new PrismaClient()

async function generateQRCode(binId: string): Promise<string> {
  try {
    return await QRCode.toDataURL(`waste-bin:${binId}`)
  } catch (error) {
    console.error("Error generating QR code:", error)
    return `qr-${binId}`
  }
}

async function main() {
  console.log("🌱 Seeding database...")

  // Create demo users for each role
  const demoUsers = await Promise.all([
    // Super Admin
    prisma.user.create({
      data: {
        email: "superadmin@wasteapp.com",
        name: "Super Administrator",
        role: UserRole.SUPER_ADMIN,
        points: 5000,
        level: 10,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=superadmin",
      },
    }),
    // Admin
    prisma.user.create({
      data: {
        email: "admin@wasteapp.com",
        name: "System Administrator",
        role: UserRole.ADMIN,
        points: 2500,
        level: 7,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=admin",
      },
    }),
    // Waste Manager
    prisma.user.create({
      data: {
        email: "manager@wasteapp.com",
        name: "Waste Operations Manager",
        role: UserRole.WASTE_MANAGER,
        points: 1500,
        level: 5,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=manager",
      },
    }),
    // Regular User
    prisma.user.create({
      data: {
        email: "user@wasteapp.com",
        name: "Regular User",
        role: UserRole.USER,
        points: 150,
        level: 2,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
      },
    }),
    // Additional regular users
    prisma.user.create({
      data: {
        email: "alice@example.com",
        name: "Alice Johnson",
        role: UserRole.USER,
        points: 300,
        level: 3,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=alice",
      },
    }),
    prisma.user.create({
      data: {
        email: "bob@example.com",
        name: "Bob Smith",
        role: UserRole.USER,
        points: 75,
        level: 1,
        avatarUrl: "https://api.dicebear.com/7.x/avataaars/svg?seed=bob",
      },
    }),
  ])

  console.log("✅ Created demo users with roles")

  // Get users by role for proper type safety
  const superAdmin = demoUsers.find((user) => user.role === UserRole.SUPER_ADMIN)!
  const admin = demoUsers.find((user) => user.role === UserRole.ADMIN)!
  const wasteManager = demoUsers.find((user) => user.role === UserRole.WASTE_MANAGER)!
  const regularUsers = demoUsers.filter((user) => user.role === UserRole.USER)

  // Create waste bins with proper Decimal handling
  const wasteBins = await Promise.all([
    prisma.wasteBin.create({
      data: {
        name: "Central Park Recycling",
        type: WasteType.RECYCLING,
        latitude: new Prisma.Decimal("40.7829"),
        longitude: new Prisma.Decimal("-73.9654"),
        qrCode: await generateQRCode("bin-1"),
        status: WasteBinStatus.ACTIVE,
        capacity: 80,
        address: "123 Central Park West, New York, NY",
        description: "Recycling bin located near the main entrance",
        managedBy: wasteManager.id,
      },
    }),
    prisma.wasteBin.create({
      data: {
        name: "Downtown Compost",
        type: WasteType.COMPOST,
        latitude: new Prisma.Decimal("40.7589"),
        longitude: new Prisma.Decimal("-73.9851"),
        qrCode: await generateQRCode("bin-2"),
        status: WasteBinStatus.ACTIVE,
        capacity: 60,
        address: "456 Broadway, New York, NY",
        description: "Compost bin for organic waste",
        managedBy: wasteManager.id,
      },
    }),
    prisma.wasteBin.create({
      data: {
        name: "Electronics Drop-off",
        type: WasteType.ELECTRONIC,
        latitude: new Prisma.Decimal("40.7505"),
        longitude: new Prisma.Decimal("-73.9934"),
        qrCode: await generateQRCode("bin-3"),
        status: WasteBinStatus.ACTIVE,
        capacity: 90,
        address: "789 Tech Street, New York, NY",
        description: "Safe disposal for electronic waste",
        managedBy: wasteManager.id,
      },
    }),
    prisma.wasteBin.create({
      data: {
        name: "Glass Collection Point",
        type: WasteType.GLASS,
        latitude: new Prisma.Decimal("40.7614"),
        longitude: new Prisma.Decimal("-73.9776"),
        qrCode: await generateQRCode("bin-4"),
        status: WasteBinStatus.FULL,
        capacity: 100,
        address: "321 Glass Avenue, New York, NY",
        description: "Specialized glass recycling facility",
        managedBy: wasteManager.id,
      },
    }),
  ])

  console.log("✅ Created waste bins with manager assignments")

  // Create rewards
  const rewards = await Promise.all([
    prisma.reward.create({
      data: {
        name: "Coffee Shop Discount",
        description: "20% off your next coffee purchase",
        pointsRequired: 50,
        category: RewardCategory.DISCOUNT,
        stock: 100,
        partnerName: "Green Bean Coffee",
        terms: "Valid for 30 days from redemption",
        createdBy: admin.id,
      },
    }),
    prisma.reward.create({
      data: {
        name: "Eco-Friendly Water Bottle",
        description: "Reusable stainless steel water bottle",
        pointsRequired: 200,
        category: RewardCategory.PRODUCT,
        stock: 50,
        partnerName: "EcoGoods",
        terms: "Free shipping included",
        createdBy: admin.id,
      },
    }),
    prisma.reward.create({
      data: {
        name: "Tree Planting Donation",
        description: "Plant a tree in your name",
        pointsRequired: 100,
        category: RewardCategory.DONATION,
        partnerName: "Green Earth Foundation",
        terms: "Certificate of planting will be emailed",
        createdBy: admin.id,
      },
    }),
  ])

  console.log("✅ Created rewards")

  // Create achievements
  const achievements = await Promise.all([
    prisma.achievement.create({
      data: {
        name: "First Steps",
        description: "Complete your first waste disposal",
        condition: { type: "disposal_count", value: 1 },
        points: 10,
        rarity: AchievementRarity.COMMON,
      },
    }),
    prisma.achievement.create({
      data: {
        name: "Recycling Champion",
        description: "Dispose of 50 recycling items",
        condition: { type: "recycling_count", value: 50 },
        points: 100,
        rarity: AchievementRarity.RARE,
      },
    }),
    prisma.achievement.create({
      data: {
        name: "Eco Warrior",
        description: "Reach 1000 points",
        condition: { type: "points_total", value: 1000 },
        points: 200,
        rarity: AchievementRarity.EPIC,
      },
    }),
    prisma.achievement.create({
      data: {
        name: "Waste Management Expert",
        description: "Complete 100 waste disposals",
        condition: { type: "disposal_count", value: 100 },
        points: 500,
        rarity: AchievementRarity.LEGENDARY,
      },
    }),
  ])

  console.log("✅ Created achievements")

  // Create sample waste disposals with proper Decimal handling
  await Promise.all([
    prisma.wasteDisposal.create({
      data: {
        userId: regularUsers[0].id,
        wasteBinId: wasteBins[0].id,
        wasteType: WasteType.RECYCLING,
        weightKg: new Prisma.Decimal("2.5"),
        pointsEarned: 25,
        verified: true,
        verifiedBy: wasteManager.id,
        verifiedAt: new Date(),
        location: { lat: 40.7829, lng: -73.9654 },
      },
    }),
    prisma.wasteDisposal.create({
      data: {
        userId: regularUsers[1].id,
        wasteBinId: wasteBins[1].id,
        wasteType: WasteType.COMPOST,
        weightKg: new Prisma.Decimal("1.8"),
        pointsEarned: 18,
        verified: true,
        verifiedBy: wasteManager.id,
        verifiedAt: new Date(),
        location: { lat: 40.7589, lng: -73.9851 },
      },
    }),
    prisma.wasteDisposal.create({
      data: {
        userId: regularUsers[0].id,
        wasteBinId: wasteBins[2].id,
        wasteType: WasteType.ELECTRONIC,
        weightKg: new Prisma.Decimal("5.2"),
        pointsEarned: 52,
        verified: false, // Pending verification
        location: { lat: 40.7505, lng: -73.9934 },
      },
    }),
  ])

  console.log("✅ Created waste disposals")

  // Create sample reports
  await Promise.all([
    prisma.report.create({
      data: {
        userId: regularUsers[0].id,
        wasteBinId: wasteBins[3].id, // The full glass bin
        type: ReportType.BIN_FULL,
        description: "This glass recycling bin is completely full and needs to be emptied urgently",
        priority: ReportPriority.HIGH,
        assignedTo: wasteManager.id,
      },
    }),
    prisma.report.create({
      data: {
        userId: regularUsers[1].id,
        wasteBinId: wasteBins[0].id,
        type: ReportType.BIN_DAMAGED,
        description: "The lid of this recycling bin is broken and won't close properly",
        priority: ReportPriority.MEDIUM,
        assignedTo: wasteManager.id,
      },
    }),
  ])

  console.log("✅ Created reports")

  // Create a campaign with proper Decimal handling
  await prisma.campaign.create({
    data: {
      name: "Earth Day Challenge",
      description: "Double points for all recycling during Earth Week!",
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      multiplier: new Prisma.Decimal("2.0"),
      targetType: WasteType.RECYCLING,
      active: true,
      createdBy: admin.id,
    },
  })

  console.log("✅ Created campaign")

  console.log("\n🎉 Database seeded successfully!")
  console.log("\n📋 Demo Login Credentials:")
  console.log("┌─────────────────┬─────────────────────────┬──────────────────┐")
  console.log("│ Role            │ Email                   │ Password         │")
  console.log("├─────────────────┼─────────────────────────┼──────────────────┤")
  console.log("│ Super Admin     │ superadmin@wasteapp.com │ SuperAdmin123!   │")
  console.log("│ Admin           │ admin@wasteapp.com      │ Admin123!        │")
  console.log("│ Waste Manager   │ manager@wasteapp.com    │ Manager123!      │")
  console.log("│ User            │ user@wasteapp.com       │ User123!         │")
  console.log("└─────────────────┴─────────────────────────┴──────────────────┘")
  console.log("\nNote: These are demo accounts for development/testing purposes.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
