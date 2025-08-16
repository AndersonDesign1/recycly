"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDate } from "@/lib/utils";
import { Recycle, MapPin, Clock } from "lucide-react";
import { motion } from "framer-motion";

interface RecentActivityProps {
  activities: Array<{
    id: string;
    wasteType: string;
    pointsEarned: number;
    wasteBin: {
      name: string;
      type: string;
    };
    createdAt: Date;
  }>;
}

const wasteTypeColors = {
  RECYCLING: "ocean-blue",
  COMPOST: "earth-brown",
  GENERAL: "muted",
  ELECTRONIC: "innovation-purple",
  HAZARDOUS: "red",
  TEXTILE: "sage-green",
  GLASS: "ocean-blue",
  METAL: "muted",
  PAPER: "sage-green",
  PLASTIC: "ocean-blue",
} as const;

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <Card className="card-shadow border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Recycle className="h-5 w-5 text-forest-green-600" />
          Recent Activity
        </CardTitle>
        <CardDescription>Your latest waste disposal activities</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {activities.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Recycle className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
            <p>No recent activity</p>
            <p className="text-sm">
              Start disposing waste to see your activity here!
            </p>
          </div>
        ) : (
          activities.map((activity, index) => (
            <motion.div
              key={activity.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="flex items-center justify-between p-4 rounded-lg bg-sage-green-50/50 hover:bg-sage-green-50 transition-colors"
            >
              <div className="flex items-center space-x-4">
                <div className="p-2 bg-white rounded-full shadow-sm">
                  <Recycle className="h-4 w-4 text-forest-green-600" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Badge
                      variant="secondary"
                      className={`bg-${
                        wasteTypeColors[
                          activity.wasteType as keyof typeof wasteTypeColors
                        ]
                      }-100 text-${
                        wasteTypeColors[
                          activity.wasteType as keyof typeof wasteTypeColors
                        ]
                      }-700 hover:bg-${
                        wasteTypeColors[
                          activity.wasteType as keyof typeof wasteTypeColors
                        ]
                      }-200`}
                    >
                      {activity.wasteType.toLowerCase()}
                    </Badge>
                    <span className="text-sm font-medium text-foreground">
                      +{activity.pointsEarned} points
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {activity.wasteBin.name}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatDate(activity.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </CardContent>
    </Card>
  );
}
