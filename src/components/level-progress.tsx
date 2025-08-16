"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { TrendingUp, Star } from "lucide-react";
import { motion } from "framer-motion";

interface LevelProgressProps {
  currentLevel: number;
  currentPoints: number;
  nextLevelPoints: number;
}

export function LevelProgress({
  currentLevel,
  currentPoints,
  nextLevelPoints,
}: LevelProgressProps) {
  const pointsForCurrentLevel = (currentLevel - 1) * 100; // Simple calculation
  const pointsNeededForNext = nextLevelPoints - pointsForCurrentLevel;
  const currentLevelProgress = currentPoints - pointsForCurrentLevel;
  const progressPercentage = Math.min(
    (currentLevelProgress / pointsNeededForNext) * 100,
    100
  );

  return (
    <Card className="card-shadow border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-ocean-blue-600" />
          Level Progress
        </CardTitle>
        <CardDescription>Your journey to the next eco level</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-to-r from-reward-gold-500 to-reward-gold-600 rounded-full">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="text-2xl font-bold text-foreground">
                Level {currentLevel}
              </div>
              <div className="text-sm text-muted-foreground">Eco Warrior</div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-lg font-semibold text-foreground">
              {currentPoints.toLocaleString()}
            </div>
            <div className="text-xs text-muted-foreground">Total Points</div>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">
              Progress to Level {currentLevel + 1}
            </span>
            <span className="font-medium text-foreground">
              {currentLevelProgress}/{pointsNeededForNext} points
            </span>
          </div>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: "100%" }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Progress
              value={progressPercentage}
              className="h-3 bg-sage-green-100"
            />
          </motion.div>
          <div className="text-xs text-muted-foreground text-center">
            {nextLevelPoints - currentPoints} points until next level
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-sage-green-100">
          <div className="text-center">
            <div className="text-lg font-bold text-forest-green-600">
              {Math.floor(currentPoints / 10)}
            </div>
            <div className="text-xs text-muted-foreground">Items Recycled</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-ocean-blue-600">
              {currentLevel * 2}
            </div>
            <div className="text-xs text-muted-foreground">Achievements</div>
          </div>
          <div className="text-center">
            <div className="text-lg font-bold text-fresh-mint-600">
              {Math.floor(currentPoints / 50)}
            </div>
            <div className="text-xs text-muted-foreground">Rewards Earned</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
