"use client";

import {
  Award,
  BarChart3,
  FileText,
  HelpCircle,
  MapPin,
  Recycle,
  Star,
  Target,
  TrendingUp,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  points: number;
  level: number;
}

interface UserDashboardProps {
  user: User;
}

export function UserDashboard({ user }: UserDashboardProps) {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">(
    "7d"
  );

  // Mock data for User dashboard
  const stats = {
    totalPoints: user.points,
    monthlyPoints: 1250,
    totalDeposits: 45,
    monthlyDeposits: 8,
    totalWaste: 125, // kg
    monthlyWaste: 28, // kg
    environmentalImpact: 250, // CO2 saved in kg
    treesSaved: 5,
    energySaved: 125, // kWh
    referralBonus: 150,
    currentBalance: 75.5,
    levelProgress: 75, // percentage to next level
    nextLevelPoints: 500,
  };

  const achievements = [
    {
      id: "1",
      name: "Eco Warrior",
      description: "Recycled 100kg of waste",
      icon: "🌱",
      unlocked: true,
      rarity: "common",
    },
    {
      id: "2",
      name: "Level Up!",
      description: "Reached Level 3",
      icon: "⭐",
      unlocked: true,
      rarity: "common",
    },
    {
      id: "3",
      name: "Referral Master",
      description: "Referred 5 friends",
      icon: "👥",
      unlocked: false,
      rarity: "rare",
    },
    {
      id: "4",
      name: "Consistency King",
      description: "Recycled for 30 days straight",
      icon: "🔥",
      unlocked: false,
      rarity: "epic",
    },
  ];

  const recentDeposits = [
    {
      id: "1",
      type: "Plastic",
      weight: 2.5,
      points: 50,
      status: "verified",
      timestamp: "2 hours ago",
    },
    {
      id: "2",
      type: "Paper",
      weight: 1.8,
      points: 36,
      status: "verified",
      timestamp: "1 day ago",
    },
    {
      id: "3",
      type: "Glass",
      weight: 3.2,
      points: 64,
      status: "pending",
      timestamp: "2 days ago",
    },
    {
      id: "4",
      type: "Metal",
      weight: 1.5,
      points: 30,
      status: "verified",
      timestamp: "3 days ago",
    },
  ];

  const loyaltyTiers = [
    {
      name: "Bronze",
      minPoints: 0,
      maxPoints: 999,
      benefits: ["Basic rewards", "Standard support"],
    },
    {
      name: "Silver",
      minPoints: 1000,
      maxPoints: 4999,
      benefits: ["Enhanced rewards", "Priority support", "Bonus points"],
    },
    {
      name: "Gold",
      minPoints: 5000,
      maxPoints: 19_999,
      benefits: [
        "Premium rewards",
        "VIP support",
        "Double points",
        "Exclusive offers",
      ],
    },
    {
      name: "Platinum",
      minPoints: 20_000,
      maxPoints: 999_999,
      benefits: [
        "Luxury rewards",
        "24/7 support",
        "Triple points",
        "Exclusive events",
        "Personal manager",
      ],
    },
  ];

  const getCurrentTier = () =>
    loyaltyTiers.find(
      (tier) =>
        stats.totalPoints >= tier.minPoints &&
        stats.totalPoints <= tier.maxPoints
    ) || loyaltyTiers[0];

  const getNextTier = () => {
    const currentTierIndex = loyaltyTiers.findIndex(
      (tier) => tier.name === getCurrentTier().name
    );
    return loyaltyTiers[currentTierIndex + 1] || null;
  };

  const getAchievementRarityColor = (rarity: string) => {
    switch (rarity) {
      case "common":
        return "bg-gray-100 text-gray-700";
      case "rare":
        return "bg-blue-100 text-blue-700";
      case "epic":
        return "bg-purple-100 text-purple-700";
      case "legendary":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const getDepositStatusColor = (status: string) => {
    switch (status) {
      case "verified":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-gray-900">
            Welcome back, {user.name}! 🌱
          </h1>
          <p className="mt-2 text-gray-600">
            Track your recycling progress and earn rewards
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            View History
          </Button>
          <Button size="sm" variant="outline">
            Find Bins
          </Button>
          <Button className="bg-forest-green-600 hover:bg-forest-green-700">
            Make Deposit
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center space-x-2">
        {(["24h", "7d", "30d", "90d"] as const).map((range) => (
          <Button
            className={
              timeRange === range
                ? "bg-forest-green-600 hover:bg-forest-green-700"
                : ""
            }
            key={range}
            onClick={() => setTimeRange(range)}
            size="sm"
            variant={timeRange === range ? "default" : "outline"}
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Points</CardTitle>
            <Award className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-gray-900">
              {stats.totalPoints.toLocaleString()}
            </div>
            <p className="mt-1 text-gray-600 text-xs">
              <span className="text-green-600">+{stats.monthlyPoints}</span>{" "}
              this month
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Current Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-gray-900">
              ${stats.currentBalance}
            </div>
            <p className="mt-1 text-gray-600 text-xs">
              <span className="text-green-600">Available</span> for withdrawal
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Total Deposits
            </CardTitle>
            <Recycle className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-gray-900">
              {stats.totalDeposits}
            </div>
            <p className="mt-1 text-gray-600 text-xs">
              <span className="text-green-600">+{stats.monthlyDeposits}</span>{" "}
              this month
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Level Progress
            </CardTitle>
            <Target className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-gray-900">
              Level {user.level}
            </div>
            <p className="mt-1 text-gray-600 text-xs">
              <span className="text-green-600">{stats.levelProgress}%</span> to
              next level
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress & Environmental Impact */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-forest-green-600" />
              <span>Level Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-forest-green-50 p-3">
              <span className="font-medium text-gray-700 text-sm">
                Current Level
              </span>
              <span className="font-bold text-forest-green-600 text-lg">
                Level {user.level}
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-200">
              <div
                className="h-3 rounded-full bg-forest-green-600 transition-all duration-300"
                style={{ width: `${stats.levelProgress}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-lg bg-sage-green-50 p-3">
                <div className="font-bold text-2xl text-sage-green-600">
                  {stats.totalPoints}
                </div>
                <div className="text-gray-600 text-xs">Current Points</div>
              </div>
              <div className="rounded-lg bg-ocean-blue-50 p-3">
                <div className="font-bold text-2xl text-ocean-blue-600">
                  {stats.nextLevelPoints}
                </div>
                <div className="text-gray-600 text-xs">Next Level</div>
              </div>
            </div>
            {getNextTier() && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-sm text-yellow-800">
                    {getNextTier().minPoints - stats.totalPoints} points to{" "}
                    {getNextTier().name}
                  </span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Recycle className="h-5 w-5 text-forest-green-600" />
              <span>Environmental Impact</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-forest-green-50 p-3">
              <span className="font-medium text-gray-700 text-sm">
                CO2 Saved
              </span>
              <span className="font-bold text-forest-green-600 text-lg">
                {stats.environmentalImpact} kg
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-sage-green-50 p-3">
              <span className="font-medium text-gray-700 text-sm">
                Trees Saved
              </span>
              <span className="font-bold text-lg text-sage-green-600">
                {stats.treesSaved}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-ocean-blue-50 p-3">
              <span className="font-medium text-gray-700 text-sm">
                Energy Saved
              </span>
              <span className="font-bold text-lg text-ocean-blue-600">
                {stats.energySaved} kWh
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-reward-gold-50 p-3">
              <span className="font-medium text-gray-700 text-sm">
                Referral Bonus
              </span>
              <span className="font-bold text-lg text-reward-gold-600">
                +{stats.referralBonus} points
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements & Recent Deposits */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Trophy className="h-5 w-5 text-forest-green-600" />
              <span>Achievements</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {achievements.map((achievement) => (
              <div
                className="flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                key={achievement.id}
              >
                <div
                  className={`rounded-full p-2 ${getAchievementRarityColor(
                    achievement.rarity
                  )}`}
                >
                  <span className="text-lg">{achievement.icon}</span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {achievement.name}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {achievement.description}
                  </p>
                </div>
                <Badge
                  className={
                    achievement.unlocked
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }
                  variant="outline"
                >
                  {achievement.unlocked ? "Unlocked" : "Locked"}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <FileText className="h-5 w-5 text-forest-green-600" />
              <span>Recent Deposits</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentDeposits.map((deposit) => (
              <div
                className="flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                key={deposit.id}
              >
                <div
                  className={`rounded-full p-2 ${getDepositStatusColor(
                    deposit.status
                  )}`}
                >
                  <Recycle className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {deposit.type}
                  </p>
                  <p className="text-gray-500 text-xs">
                    {deposit.weight}kg • {deposit.timestamp}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-bold text-forest-green-600 text-sm">
                    +{deposit.points} pts
                  </div>
                  <Badge
                    className={getDepositStatusColor(deposit.status)}
                    variant="outline"
                  >
                    {deposit.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Loyalty Tiers */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Star className="h-5 w-5 text-forest-green-600" />
            <span>Loyalty Program</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4">
            {loyaltyTiers.map((tier, index) => {
              const isCurrentTier = tier.name === getCurrentTier().name;
              const isUnlocked = stats.totalPoints >= tier.minPoints;

              return (
                <div
                  className={`rounded-lg border-2 p-4 transition-all ${
                    isCurrentTier
                      ? "border-forest-green-500 bg-forest-green-50"
                      : isUnlocked
                        ? "border-gray-300 bg-gray-50"
                        : "border-gray-200 bg-gray-100 opacity-60"
                  }`}
                  key={tier.name}
                >
                  <div className="space-y-3 text-center">
                    <div
                      className={`font-bold text-2xl ${
                        isCurrentTier
                          ? "text-forest-green-600"
                          : isUnlocked
                            ? "text-gray-700"
                            : "text-gray-500"
                      }`}
                    >
                      {tier.name}
                    </div>
                    <div className="text-gray-600 text-xs">
                      {tier.minPoints.toLocaleString()} -{" "}
                      {tier.maxPoints === 999_999
                        ? "∞"
                        : tier.maxPoints.toLocaleString()}{" "}
                      points
                    </div>
                    {isCurrentTier && (
                      <Badge className="bg-forest-green-600 text-white">
                        Current Tier
                      </Badge>
                    )}
                    <div className="space-y-1">
                      {tier.benefits.map((benefit, benefitIndex) => (
                        <div
                          className="text-gray-600 text-xs"
                          key={benefitIndex}
                        >
                          • {benefit}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <Recycle className="h-6 w-6" />
              <span className="text-sm">Make Deposit</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <MapPin className="h-6 w-6" />
              <span className="text-sm">Find Bins</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <Users className="h-6 w-6" />
              <span className="text-sm">Refer Friends</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <HelpCircle className="h-6 w-6" />
              <span className="text-sm">Get Help</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
