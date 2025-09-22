import { prisma } from "@/lib/prisma";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface RewardCalculation {
  basePoints: number;
  bonusPoints: number;
  totalPoints: number;
  levelUp: boolean;
  newLevel: number;
}

export class RewardService {
  /**
   * Calculate rewards for waste disposal completion
   */
  static async calculateWasteDisposalRewards(
    wasteDisposalId: string,
    userId: string,
    managerId: string
  ): Promise<{
    userReward: RewardCalculation;
    managerReward: RewardCalculation;
  }> {
    const wasteDisposal = await prisma.wasteDisposal.findUnique({
      where: { id: wasteDisposalId },
      include: {
        wasteCategory: true,
        user: true,
        assignedManager: true,
      },
    });

    if (!wasteDisposal) {
      throw new Error("Waste disposal not found");
    }

    if (wasteDisposal.status !== "COMPLETED") {
      throw new Error("Waste disposal must be completed to calculate rewards");
    }

    // Calculate user rewards
    const userReward = await this.calculateUserRewards(
      userId,
      wasteDisposal.wasteCategory.pointsPerUnit,
      Number(wasteDisposal.quantity)
    );

    // Calculate manager rewards (smaller amount for processing)
    const managerReward = await this.calculateManagerRewards(
      managerId,
      wasteDisposal.wasteCategory.pointsPerUnit,
      Number(wasteDisposal.quantity)
    );

    return { userReward, managerReward };
  }

  /**
   * Calculate rewards for a user based on waste type and quantity
   */
  static async calculateUserRewards(
    userId: string,
    pointsPerUnit: number,
    quantity: number
  ): Promise<RewardCalculation> {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { points: true, level: true },
    });

    if (!user) {
      throw new Error("User not found");
    }

    // Base points calculation
    const basePoints = Math.floor(pointsPerUnit * quantity);

    // Bonus points based on user level (higher level = more bonus)
    const bonusMultiplier = Math.min(user.level * 0.1, 0.5); // Max 50% bonus
    const bonusPoints = Math.floor(basePoints * bonusMultiplier);

    const totalPoints = basePoints + bonusPoints;

    // Check for level up
    const newLevel = this.calculateNewLevel(user.points + totalPoints);
    const levelUp = newLevel > user.level;

    return {
      basePoints,
      bonusPoints,
      totalPoints,
      levelUp,
      newLevel,
    };
  }

  /**
   * Calculate rewards for a waste manager
   */
  static async calculateManagerRewards(
    managerId: string,
    pointsPerUnit: number,
    quantity: number
  ): Promise<RewardCalculation> {
    const manager = await prisma.user.findUnique({
      where: { id: managerId },
      select: { points: true, level: true },
    });

    if (!manager) {
      throw new Error("Manager not found");
    }

    // Managers get a smaller reward for processing (10% of user reward)
    const basePoints = Math.floor(pointsPerUnit * quantity * 0.1);

    // Bonus based on manager level
    const bonusMultiplier = Math.min(manager.level * 0.05, 0.25); // Max 25% bonus
    const bonusPoints = Math.floor(basePoints * bonusMultiplier);

    const totalPoints = basePoints + bonusPoints;

    // Check for level up
    const newLevel = this.calculateNewLevel(manager.points + totalPoints);
    const levelUp = newLevel > manager.level;

    return {
      basePoints,
      bonusPoints,
      totalPoints,
      levelUp,
      newLevel,
    };
  }

  /**
   * Distribute rewards to users after waste disposal completion
   */
  static async distributeWasteDisposalRewards(
    wasteDisposalId: string
  ): Promise<void> {
    const wasteDisposal = await prisma.wasteDisposal.findUnique({
      where: { id: wasteDisposalId },
      include: {
        wasteCategory: true,
        user: true,
        assignedManager: true,
      },
    });

    if (!wasteDisposal || !wasteDisposal.assignedManagerId) {
      throw new Error("Waste disposal or manager not found");
    }

    const { userReward, managerReward } =
      await this.calculateWasteDisposalRewards(
        wasteDisposalId,
        wasteDisposal.userId,
        wasteDisposal.assignedManagerId
      );

    // Use transaction to ensure data consistency
    await prisma.$transaction(async (tx) => {
      // Update user points and level
      await tx.user.update({
        where: { id: wasteDisposal.userId },
        data: {
          points: { increment: userReward.totalPoints },
          level: userReward.newLevel,
        },
      });

      // Update manager points and level
      await tx.user.update({
        where: { id: wasteDisposal.assignedManagerId },
        data: {
          points: { increment: managerReward.totalPoints },
          level: managerReward.newLevel,
        },
      });

      // Create point transaction records
      await tx.pointTransaction.create({
        data: {
          userId: wasteDisposal.userId,
          type: "EARNED",
          amount: userReward.totalPoints,
          description: `Waste disposal reward: ${wasteDisposal.wasteCategory.name}`,
          referenceId: wasteDisposal.id,
          referenceType: "WASTE_DISPOSAL",
        },
      });

      await tx.pointTransaction.create({
        data: {
          userId: wasteDisposal.assignedManagerId,
          type: "EARNED",
          amount: managerReward.totalPoints,
          description: `Waste processing reward: ${wasteDisposal.wasteCategory.name}`,
          referenceId: wasteDisposal.id,
          referenceType: "WASTE_DISPOSAL",
        },
      });

      // Check for achievements
      await this.checkAndAwardAchievements(wasteDisposal.userId, tx);
      await this.checkAndAwardAchievements(wasteDisposal.assignedManagerId, tx);
    });

    // Send notifications (async)
    this.sendRewardNotifications(
      wasteDisposal,
      userReward,
      managerReward
    ).catch(console.error);
  }

  /**
   * Check and award achievements based on user actions
   */
  static async checkAndAwardAchievements(
    userId: string,
    tx: any = prisma
  ): Promise<void> {
    const user = await tx.user.findUnique({
      where: { id: userId },
      include: {
        wasteDisposals: {
          where: { status: "COMPLETED" },
        },
        userRewards: {
          where: { status: "COMPLETED" },
        },
        achievements: {
          include: { achievement: true },
        },
      },
    });

    if (!user) return;

    // Check for various achievement types
    const achievements = await tx.achievement.findMany({
      where: { isActive: true },
    });

    for (const achievement of achievements) {
      const hasAchievement = user.achievements.some(
        (ua) => ua.achievementId === achievement.id
      );

      if (hasAchievement) continue;

      let shouldAward = false;

      switch (achievement.type) {
        case "WASTE_COUNT":
          shouldAward = user.wasteDisposals.length >= achievement.requirement;
          break;
        case "POINTS_THRESHOLD":
          shouldAward = user.points >= achievement.requirement;
          break;
        case "LEVEL_THRESHOLD":
          shouldAward = user.level >= achievement.requirement;
          break;
        case "REWARDS_REDEEMED":
          shouldAward = user.userRewards.length >= achievement.requirement;
          break;
        case "CONSECUTIVE_DAYS":
          // TODO: Implement consecutive days logic
          break;
      }

      if (shouldAward) {
        await tx.userAchievement.create({
          data: {
            userId,
            achievementId: achievement.id,
            awardedAt: new Date(),
          },
        });

        // Award bonus points for achievement
        await tx.user.update({
          where: { id: userId },
          data: {
            points: { increment: achievement.bonusPoints || 0 },
          },
        });

        // Create transaction record for bonus
        if (achievement.bonusPoints && achievement.bonusPoints > 0) {
          await tx.pointTransaction.create({
            data: {
              userId,
              type: "BONUS",
              amount: achievement.bonusPoints,
              description: `Achievement bonus: ${achievement.name}`,
              referenceId: achievement.id,
              referenceType: "ACHIEVEMENT",
            },
          });
        }
      }
    }
  }

  /**
   * Calculate new level based on total points
   */
  private static calculateNewLevel(totalPoints: number): number {
    // Simple level calculation: every 100 points = 1 level
    return Math.floor(totalPoints / 100) + 1;
  }

  /**
   * Send reward notifications via email
   */
  private static async sendRewardNotifications(
    wasteDisposal: any,
    userReward: RewardCalculation,
    managerReward: RewardCalculation
  ): Promise<void> {
    try {
      // Send notification to user
      if (wasteDisposal.user.email) {
        await resend.emails.send({
          from: process.env.FROM_EMAIL || "noreply@recycly.onresend.com",
          to: [wasteDisposal.user.email],
          subject: "🎉 Waste Disposal Rewards Earned!",
          html: `
            <h2>Congratulations! You've earned rewards!</h2>
            <p>Your waste disposal has been completed and you've earned:</p>
            <ul>
              <li>Base Points: ${userReward.basePoints}</li>
              <li>Bonus Points: ${userReward.bonusPoints}</li>
              <li><strong>Total Points: ${userReward.totalPoints}</strong></li>
            </ul>
            ${
              userReward.levelUp
                ? `<p>🎊 <strong>Level Up!</strong> You're now level ${userReward.newLevel}!</p>`
                : ""
            }
            <p>Keep up the great work for a cleaner environment!</p>
          `,
        });
      }

      // Send notification to manager
      if (wasteDisposal.assignedManager.email) {
        await resend.emails.send({
          from: process.env.FROM_EMAIL || "noreply@recycly.onresend.com",
          to: [wasteDisposal.assignedManager.email],
          subject: "🔄 Waste Processing Rewards Earned!",
          html: `
            <h2>Waste Processing Complete!</h2>
            <p>You've successfully processed waste and earned:</p>
            <ul>
              <li>Base Points: ${managerReward.basePoints}</li>
              <li>Bonus Points: ${managerReward.bonusPoints}</li>
              <li><strong>Total Points: ${
                managerReward.totalPoints
              }</strong></li>
            </ul>
            ${
              managerReward.levelUp
                ? `<p>🎊 <strong>Level Up!</strong> You're now level ${managerReward.newLevel}!</p>`
                : ""
            }
            <p>Thank you for your contribution to waste management!</p>
          `,
        });
      }
    } catch (error) {
      console.error("Failed to send reward notifications:", error);
    }
  }
}
