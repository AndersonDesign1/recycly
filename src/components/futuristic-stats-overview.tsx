"use client";

import { motion } from "framer-motion";
import { Award, Recycle, Target, TrendingUp, Users, Zap } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatsOverviewProps {
  stats: {
    totalDisposals: number;
    totalPoints: number;
    currentLevel: number;
    totalRewards: number;
  };
  userRole?: string;
}

export function FuturisticStatsOverview({
  stats,
  userRole = "USER",
}: StatsOverviewProps) {
  const getStatsForRole = () => {
    const baseStats = [
      {
        title: "Total Disposals",
        value: stats.totalDisposals.toLocaleString(),
        subtitle: "Items recycled",
        icon: <Recycle className="h-6 w-6" />,
        gradient: "gradient-primary",
        glow: "glow-primary",
      },
      {
        title: "Points Earned",
        value: stats.totalPoints.toLocaleString(),
        subtitle: "Eco points collected",
        icon: <Award className="h-6 w-6" />,
        gradient: "gradient-orange",
        glow: "glow-green",
      },
      {
        title: "Current Level",
        value: stats.currentLevel.toString(),
        subtitle: "Eco warrior level",
        icon: <TrendingUp className="h-6 w-6" />,
        gradient: "gradient-secondary",
        glow: "glow-secondary",
      },
      {
        title: "Rewards Claimed",
        value: stats.totalRewards.toString(),
        subtitle: "Benefits received",
        icon: <Target className="h-6 w-6" />,
        gradient: "gradient-green",
        glow: "glow-green",
      },
    ];

    if (userRole === "ADMIN" || userRole === "SUPERADMIN") {
      return [
        ...baseStats,
        {
          title: "Active Users",
          value: "2,847",
          subtitle: "Platform members",
          icon: <Users className="h-6 w-6" />,
          gradient: "gradient-primary",
          glow: "glow-primary",
        },
        {
          title: "System Health",
          value: "99.9%",
          subtitle: "Uptime status",
          icon: <Zap className="h-6 w-6" />,
          gradient: "gradient-green",
          glow: "glow-green",
        },
      ];
    }

    return baseStats;
  };

  const statCards = getStatsForRole();

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
      {statCards.map((stat, index) => (
        <motion.div
          animate={{ opacity: 1, y: 0 }}
          className="group"
          initial={{ opacity: 0, y: 20 }}
          key={stat.title}
          transition={{ duration: 0.5, delay: index * 0.1 }}
        >
          <div
            className={cn(
              "metric-card relative overflow-hidden",
              "transition-all duration-300 hover:scale-105"
            )}
          >
            {/* Background Gradient */}
            <div
              className={cn(
                "absolute inset-0 opacity-10 transition-opacity group-hover:opacity-20",
                stat.gradient
              )}
            />

            {/* Content */}
            <div className="relative z-10">
              <div className="mb-4 flex items-center justify-between">
                <div className={cn("rounded-xl p-3", stat.gradient, stat.glow)}>
                  {stat.icon}
                </div>
                <div className="text-right">
                  <div className="metric-value">{stat.value}</div>
                </div>
              </div>

              <div>
                <h3 className="mb-1 font-semibold text-foreground text-lg">
                  {stat.title}
                </h3>
                <p className="metric-label">{stat.subtitle}</p>
              </div>
            </div>

            {/* Animated Border */}
            <div className="absolute inset-0 rounded-lg opacity-0 transition-opacity group-hover:opacity-100">
              <div
                className={cn(
                  "absolute inset-0 rounded-lg",
                  "bg-gradient-to-r from-transparent via-white/20 to-transparent",
                  "animate-pulse"
                )}
              />
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
