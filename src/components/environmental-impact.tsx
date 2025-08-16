"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Leaf, Droplets, Zap, TreePine } from "lucide-react";
import { motion } from "framer-motion";

interface EnvironmentalImpactProps {
  stats: {
    co2Saved: number; // kg
    waterSaved: number; // liters
    energySaved: number; // kWh
    treesEquivalent: number;
  };
}

export function EnvironmentalImpact({ stats }: EnvironmentalImpactProps) {
  const impacts = [
    {
      title: "CO₂ Reduced",
      value: `${stats.co2Saved.toFixed(1)} kg`,
      description: "Carbon footprint reduced",
      icon: <Leaf className="h-5 w-5 text-fresh-mint-600" />,
      color: "fresh-mint",
    },
    {
      title: "Water Saved",
      value: `${stats.waterSaved.toLocaleString()} L`,
      description: "Water conservation",
      icon: <Droplets className="h-5 w-5 text-ocean-blue-600" />,
      color: "ocean-blue",
    },
    {
      title: "Energy Saved",
      value: `${stats.energySaved.toFixed(1)} kWh`,
      description: "Energy conservation",
      icon: <Zap className="h-5 w-5 text-reward-gold-600" />,
      color: "reward-gold",
    },
    {
      title: "Trees Equivalent",
      value: `${stats.treesEquivalent}`,
      description: "Trees worth of impact",
      icon: <TreePine className="h-5 w-5 text-forest-green-600" />,
      color: "forest-green",
    },
  ];

  return (
    <Card className="card-shadow border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Leaf className="h-5 w-5 text-fresh-mint-600" />
          Environmental Impact
        </CardTitle>
        <CardDescription>
          Your positive contribution to the planet
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          {impacts.map((impact, index) => (
            <motion.div
              key={impact.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: index * 0.1 }}
              className={`p-4 rounded-lg bg-${impact.color}-50/50 hover:bg-${impact.color}-50 transition-colors`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className={`p-2 bg-${impact.color}-100 rounded-full`}>
                  {impact.icon}
                </div>
                <div className="text-sm font-medium text-muted-foreground">
                  {impact.title}
                </div>
              </div>
              <div className="text-xl font-bold text-foreground mb-1">
                {impact.value}
              </div>
              <div className="text-xs text-muted-foreground">
                {impact.description}
              </div>
            </motion.div>
          ))}
        </div>

        <div className="mt-6 p-4 bg-gradient-to-r from-sage-green-50 to-fresh-mint-50 rounded-lg border border-sage-green-100">
          <div className="text-center">
            <div className="text-sm font-medium text-forest-green-800 mb-1">
              🌍 Your Eco Score
            </div>
            <div className="text-2xl font-bold text-forest-green-700">
              {Math.floor(
                (stats.co2Saved + stats.energySaved + stats.treesEquivalent) *
                  10
              )}
            </div>
            <div className="text-xs text-forest-green-600">
              Keep up the great work for our planet!
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
