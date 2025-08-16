"use client";

import { useState } from "react";
import {
  BarChart3,
  FileText,
  Wallet,
  Award,
  Recycle,
  Users,
  MapPin,
  HelpCircle,
  TrendingUp,
  Target,
  Star,
  Trophy,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

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
      maxPoints: 19999,
      benefits: [
        "Premium rewards",
        "VIP support",
        "Double points",
        "Exclusive offers",
      ],
    },
    {
      name: "Platinum",
      minPoints: 20000,
      maxPoints: 999999,
      benefits: [
        "Luxury rewards",
        "24/7 support",
        "Triple points",
        "Exclusive events",
        "Personal manager",
      ],
    },
  ];

  const getCurrentTier = () => {
    return (
      loyaltyTiers.find(
        (tier) =>
          stats.totalPoints >= tier.minPoints &&
          stats.totalPoints <= tier.maxPoints
      ) || loyaltyTiers[0]
    );
  };

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
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, {user.name}! 🌱
          </h1>
          <p className="text-gray-600 mt-2">
            Track your recycling progress and earn rewards
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            View History
          </Button>
          <Button variant="outline" size="sm">
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
            key={range}
            variant={timeRange === range ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(range)}
            className={
              timeRange === range
                ? "bg-forest-green-600 hover:bg-forest-green-700"
                : ""
            }
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Points</CardTitle>
            <Award className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalPoints.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <span className="text-green-600">+{stats.monthlyPoints}</span>{" "}
              this month
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Current Balance
            </CardTitle>
            <Wallet className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ${stats.currentBalance}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <span className="text-green-600">Available</span> for withdrawal
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Deposits
            </CardTitle>
            <Recycle className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalDeposits}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <span className="text-green-600">+{stats.monthlyDeposits}</span>{" "}
              this month
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Level Progress
            </CardTitle>
            <Target className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              Level {user.level}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <span className="text-green-600">{stats.levelProgress}%</span> to
              next level
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Level Progress & Environmental Impact */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-forest-green-600" />
              <span>Level Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-forest-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Current Level
              </span>
              <span className="text-lg font-bold text-forest-green-600">
                Level {user.level}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 bg-forest-green-600 rounded-full transition-all duration-300"
                style={{ width: `${stats.levelProgress}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-sage-green-50 rounded-lg">
                <div className="text-2xl font-bold text-sage-green-600">
                  {stats.totalPoints}
                </div>
                <div className="text-xs text-gray-600">Current Points</div>
              </div>
              <div className="p-3 bg-ocean-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-ocean-blue-600">
                  {stats.nextLevelPoints}
                </div>
                <div className="text-xs text-gray-600">Next Level</div>
              </div>
            </div>
            {getNextTier() && (
              <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Star className="h-4 w-4 text-yellow-600" />
                  <span className="text-sm font-medium text-yellow-800">
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
            <div className="flex items-center justify-between p-3 bg-forest-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                CO2 Saved
              </span>
              <span className="text-lg font-bold text-forest-green-600">
                {stats.environmentalImpact} kg
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-sage-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Trees Saved
              </span>
              <span className="text-lg font-bold text-sage-green-600">
                {stats.treesSaved}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-ocean-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Energy Saved
              </span>
              <span className="text-lg font-bold text-ocean-blue-600">
                {stats.energySaved} kWh
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-reward-gold-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Referral Bonus
              </span>
              <span className="text-lg font-bold text-reward-gold-600">
                +{stats.referralBonus} points
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Achievements & Recent Deposits */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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
                key={achievement.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`p-2 rounded-full ${getAchievementRarityColor(
                    achievement.rarity
                  )}`}
                >
                  <span className="text-lg">{achievement.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {achievement.name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {achievement.description}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={
                    achievement.unlocked
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }
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
                key={deposit.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`p-2 rounded-full ${getDepositStatusColor(
                    deposit.status
                  )}`}
                >
                  <Recycle className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {deposit.type}
                  </p>
                  <p className="text-xs text-gray-500">
                    {deposit.weight}kg • {deposit.timestamp}
                  </p>
                </div>
                <div className="text-right">
                  <div className="text-sm font-bold text-forest-green-600">
                    +{deposit.points} pts
                  </div>
                  <Badge
                    variant="outline"
                    className={getDepositStatusColor(deposit.status)}
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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {loyaltyTiers.map((tier, index) => {
              const isCurrentTier = tier.name === getCurrentTier().name;
              const isUnlocked = stats.totalPoints >= tier.minPoints;

              return (
                <div
                  key={tier.name}
                  className={`p-4 rounded-lg border-2 transition-all ${
                    isCurrentTier
                      ? "border-forest-green-500 bg-forest-green-50"
                      : isUnlocked
                      ? "border-gray-300 bg-gray-50"
                      : "border-gray-200 bg-gray-100 opacity-60"
                  }`}
                >
                  <div className="text-center space-y-3">
                    <div
                      className={`text-2xl font-bold ${
                        isCurrentTier
                          ? "text-forest-green-600"
                          : isUnlocked
                          ? "text-gray-700"
                          : "text-gray-500"
                      }`}
                    >
                      {tier.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      {tier.minPoints.toLocaleString()} -{" "}
                      {tier.maxPoints === 999999
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
                          key={benefitIndex}
                          className="text-xs text-gray-600"
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Recycle className="h-6 w-6" />
              <span className="text-sm">Make Deposit</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <MapPin className="h-6 w-6" />
              <span className="text-sm">Find Bins</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Refer Friends</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <HelpCircle className="h-6 w-6" />
              <span className="text-sm">Get Help</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
