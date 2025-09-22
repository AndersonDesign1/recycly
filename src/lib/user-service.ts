import { UserRole, WasteType } from "@prisma/client";
import bcrypt from "bcryptjs";
import { prisma } from "./prisma";

export class UserService {
  // Create a new user with proper role assignment
  static async createUser(data: {
    email: string;
    name: string;
    password: string;
    role?: UserRole;
  }) {
    const hashedPassword = await bcrypt.hash(data.password, 12);

    const user = await prisma.user.create({
      data: {
        email: data.email,
        name: data.name,
        role: data.role || UserRole.USER,
        points: 0,
        level: 1,
        isActive: true,
        accounts: {
          create: {
            providerId: "credentials",
            accountId: data.email,
            password: hashedPassword,
          },
        },
      },
    });

    return user;
  }

  // Get user by ID with role-based access control
  static async getUserById(userId: string, requestingUserRole: UserRole) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wasteDisposals: true,
        userRewards: true,
        achievements: true,
        notifications: true,
      },
    });

    if (!user) return null;

    // Role-based access control
    if (!UserService.canAccessUser(requestingUserRole, user.role)) {
      throw new Error("Insufficient permissions to access this user");
    }

    return user;
  }

  // Get all users with role-based filtering
  static async getUsers(
    requestingUserRole: UserRole,
    filters?: {
      role?: UserRole;
      isActive?: boolean;
    }
  ) {
    if (!UserService.canListUsers(requestingUserRole)) {
      throw new Error("Insufficient permissions to list users");
    }

    const where: any = {};
    if (filters?.role) where.role = filters.role;
    if (filters?.isActive !== undefined) where.isActive = filters.isActive;

    return await prisma.user.findMany({
      where,
      include: {
        wasteDisposals: {
          take: 5,
          orderBy: { createdAt: "desc" },
        },
        _count: {
          select: {
            wasteDisposals: true,
            userRewards: true,
            achievements: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  // Update user role (only superadmin can do this)
  static async updateUserRole(
    userId: string,
    newRole: UserRole,
    requestingUserRole: UserRole
  ) {
    if (requestingUserRole !== UserRole.SUPERADMIN) {
      throw new Error("Only superadmins can change user roles");
    }

    if (newRole === UserRole.SUPERADMIN) {
      throw new Error("Cannot assign superadmin role");
    }

    return await prisma.user.update({
      where: { id: userId },
      data: { role: newRole },
    });
  }

  // Process waste disposal and award points
  static async processWasteDisposal(data: {
    userId: string;
    wasteBinId: string;
    wasteType: WasteType;
    weightKg?: number;
    imageUrl?: string;
    location?: any;
  }) {
    // Calculate points based on waste type and weight
    const pointsEarned = UserService.calculatePoints(
      data.wasteType,
      data.weightKg
    );

    // Create waste disposal record
    const wasteDisposal = await prisma.wasteDisposal.create({
      data: {
        userId: data.userId,
        wasteBinId: data.wasteBinId,
        wasteType: data.wasteType,
        weightKg: data.weightKg,
        imageUrl: data.imageUrl,
        location: data.location,
        pointsEarned,
        verified: false, // Requires verification for higher point values
      },
    });

    // Update user points and check for level up
    const updatedUser = await UserService.updateUserPoints(
      data.userId,
      pointsEarned
    );

    // Check for achievements
    await UserService.checkAchievements(data.userId);

    return { wasteDisposal, updatedUser, pointsEarned };
  }

  // Calculate points based on waste type and weight
  private static calculatePoints(
    wasteType: WasteType,
    weightKg?: number
  ): number {
    const basePoints = {
      [WasteType.RECYCLING]: 10,
      [WasteType.COMPOST]: 8,
      [WasteType.GENERAL]: 5,
      [WasteType.ELECTRONIC]: 25,
      [WasteType.HAZARDOUS]: 30,
      [WasteType.TEXTILE]: 6,
      [WasteType.GLASS]: 12,
      [WasteType.METAL]: 15,
      [WasteType.PAPER]: 8,
      [WasteType.PLASTIC]: 10,
    };

    let points = basePoints[wasteType] || 5;

    // Bonus points for weight (if provided)
    if (weightKg && weightKg > 0) {
      points += Math.floor(weightKg * 2); // 2 points per kg
    }

    return points;
  }

  // Update user points and check for level up
  private static async updateUserPoints(userId: string, pointsToAdd: number) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) throw new Error("User not found");

    const newPoints = user.points + pointsToAdd;
    const newLevel = Math.floor(newPoints / 100) + 1; // Level up every 100 points

    return await prisma.user.update({
      where: { id: userId },
      data: {
        points: newPoints,
        level: newLevel,
      },
    });
  }

  // Check for achievements based on user actions
  private static async checkAchievements(userId: string) {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        wasteDisposals: true,
        userAchievements: true,
      },
    });

    if (!user) return;

    // Check for first disposal achievement
    if (user.wasteDisposals.length === 1) {
      await UserService.grantAchievement(userId, "first_disposal");
    }

    // Check for level achievements
    if (
      user.level >= 5 &&
      !user.userAchievements.some((ua) => ua.achievementId === "level_5")
    ) {
      await UserService.grantAchievement(userId, "level_5");
    }

    if (
      user.level >= 10 &&
      !user.userAchievements.some((ua) => ua.achievementId === "level_10")
    ) {
      await UserService.grantAchievement(userId, "level_10");
    }
  }

  // Grant achievement to user
  private static async grantAchievement(userId: string, achievementId: string) {
    const achievement = await prisma.achievement.findUnique({
      where: { id: achievementId },
    });

    if (!achievement) return;

    await prisma.userAchievement.create({
      data: {
        userId,
        achievementId,
      },
    });

    // Add achievement points to user
    await UserService.updateUserPoints(userId, achievement.points);
  }

  // Role-based access control methods
  private static canAccessUser(
    requestingRole: UserRole,
    targetRole: UserRole
  ): boolean {
    const roleHierarchy = {
      [UserRole.SUPERADMIN]: 4,
      [UserRole.ADMIN]: 3,
      [UserRole.WASTE_MANAGER]: 2,
      [UserRole.USER]: 1,
    };

    return roleHierarchy[requestingRole] >= roleHierarchy[targetRole];
  }

  private static canListUsers(requestingRole: UserRole): boolean {
    return (
      requestingRole === UserRole.SUPERADMIN ||
      requestingRole === UserRole.ADMIN
    );
  }

  // Get user statistics for dashboard
  static async getUserStats(userId: string, requestingUserRole: UserRole) {
    const user = await UserService.getUserById(userId, requestingUserRole);
    if (!user) return null;

    const stats = await prisma.$transaction([
      prisma.wasteDisposal.count({ where: { userId } }),
      prisma.userReward.count({ where: { userId } }),
      prisma.userAchievement.count({ where: { userId } }),
      prisma.wasteDisposal.aggregate({
        where: { userId },
        _sum: { pointsEarned: true },
      }),
    ]);

    return {
      totalDisposals: stats[0],
      totalRewards: stats[1],
      totalAchievements: stats[2],
      totalPointsEarned: stats[3]._sum.pointsEarned || 0,
      currentPoints: user.points,
      currentLevel: user.level,
    };
  }
}
