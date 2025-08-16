"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Recycle, Award, TrendingUp, Target } from "lucide-react";
import { motion } from "framer-motion";

interface StatsOverviewProps {
  stats: {
    totalDisposals: number;
    totalPoints: number;
    currentLevel: number;
    totalRewards: number;
  };
}

export function StatsOverview({ stats }: StatsOverviewProps) {
  const statCards = [
    {
      title: "Total Disposals",
      value: stats.totalDisposals,
      description: "Waste items disposed",
      icon: <Recycle className="h-5 w-5 text-forest-green-600" />,
      color: "forest-green",
    },
    {
      title: "Points Earned",
      value: stats.totalPoints.toLocaleString(),
      description: "Total points collected",
      icon: <Award className="h-5 w-5 text-reward-gold-600" />,
      color: "reward-gold",
    },
    {
      title: "Current Level",
      value: stats.currentLevel,
      description: "Your eco level",
      icon: <TrendingUp className="h-5 w-5 text-ocean-blue-600" />,
      color: "ocean-blue",
    },
    {
      title: "Rewards Claimed",
      value: stats.totalRewards,
      description: "Benefits received",
      icon: <Target className="h-5 w-5 text-fresh-mint-600" />,
      color: "fresh-mint",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {statCards.map((stat, index) => (
        <motion.div
          key={stat.title}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
        >
          <Card className="card-shadow border-0 bg-white/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <div className={`p-2 bg-${stat.color}-50 rounded-full`}>
                {stat.icon}
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">
                {stat.value}
              </div>
              <CardDescription className="text-xs text-muted-foreground mt-1">
                {stat.description}
              </CardDescription>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  );
}
