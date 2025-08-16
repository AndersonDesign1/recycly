"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { QrCode, MapPin, Gift, BarChart3 } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";

export function QuickActions() {
  const actions = [
    {
      title: "Scan QR Code",
      description: "Dispose waste and earn points",
      icon: <QrCode className="h-5 w-5" />,
      href: "/scan",
      variant: "primary" as const,
      color: "forest-green",
    },
    {
      title: "Find Bins",
      description: "Locate nearby waste bins",
      icon: <MapPin className="h-5 w-5" />,
      href: "/bins",
      variant: "secondary" as const,
      color: "ocean-blue",
    },
    {
      title: "View Rewards",
      description: "Redeem your points",
      icon: <Gift className="h-5 w-5" />,
      href: "/rewards",
      variant: "gold" as const,
      color: "reward-gold",
    },
    {
      title: "Analytics",
      description: "Track your impact",
      icon: <BarChart3 className="h-5 w-5" />,
      href: "/analytics",
      variant: "mint" as const,
      color: "fresh-mint",
    },
  ];

  return (
    <Card className="card-shadow border-0 bg-white/80 backdrop-blur-sm">
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
        <CardDescription>
          Common tasks to help you earn more points
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {actions.map((action, index) => (
            <motion.div
              key={action.title}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                asChild
                variant={action.variant}
                className="w-full h-auto p-4 flex-col items-start space-y-2 hover:scale-105 transition-transform"
              >
                <Link href={action.href}>
                  <div className="flex items-center gap-2 w-full">
                    {action.icon}
                    <span className="font-semibold">{action.title}</span>
                  </div>
                  <span className="text-xs opacity-90 text-left w-full">
                    {action.description}
                  </span>
                </Link>
              </Button>
            </motion.div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
