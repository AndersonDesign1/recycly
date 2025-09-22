"use client";

import { motion } from "framer-motion";
import { Star, TrendingUp } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
            <div className="rounded-full bg-gradient-to-r from-reward-gold-500 to-reward-gold-600 p-3">
              <Star className="h-6 w-6 text-white" />
            </div>
            <div>
              <div className="font-bold text-2xl text-foreground">
                Level {currentLevel}
              </div>
              <div className="text-muted-foreground text-sm">Eco Warrior</div>
            </div>
          </div>
          <div className="text-right">
            <div className="font-semibold text-foreground text-lg">
              {currentPoints.toLocaleString()}
            </div>
            <div className="text-muted-foreground text-xs">Total Points</div>
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
            animate={{ width: "100%" }}
            initial={{ width: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <Progress
              className="h-3 bg-sage-green-100"
              value={progressPercentage}
            />
          </motion.div>
          <div className="text-center text-muted-foreground text-xs">
            {nextLevelPoints - currentPoints} points until next level
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4 border-sage-green-100 border-t pt-4">
          <div className="text-center">
            <div className="font-bold text-forest-green-600 text-lg">
              {Math.floor(currentPoints / 10)}
            </div>
            <div className="text-muted-foreground text-xs">Items Recycled</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-lg text-ocean-blue-600">
              {currentLevel * 2}
            </div>
            <div className="text-muted-foreground text-xs">Achievements</div>
          </div>
          <div className="text-center">
            <div className="font-bold text-fresh-mint-600 text-lg">
              {Math.floor(currentPoints / 50)}
            </div>
            <div className="text-muted-foreground text-xs">Rewards Earned</div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
