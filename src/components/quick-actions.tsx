"use client";

import { motion } from "framer-motion";
import { BarChart3, Gift, MapPin, QrCode } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

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
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {actions.map((action, index) => (
            <motion.div
              animate={{ opacity: 1, scale: 1 }}
              initial={{ opacity: 0, scale: 0.95 }}
              key={action.title}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              <Button
                asChild
                className="h-auto w-full flex-col items-start space-y-2 p-4 transition-transform hover:scale-105"
                variant={action.variant}
              >
                <Link href={action.href}>
                  <div className="flex w-full items-center gap-2">
                    {action.icon}
                    <span className="font-semibold">{action.title}</span>
                  </div>
                  <span className="w-full text-left text-xs opacity-90">
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
