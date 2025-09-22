"use client";

import { motion } from "framer-motion";
import type React from "react";
import { FuturisticHeader } from "@/components/futuristic-header";
import { FuturisticSidebar } from "@/components/futuristic-sidebar";
import { cn } from "@/lib/utils";

interface FuturisticDashboardLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export function FuturisticDashboardLayout({
  children,
  className,
}: FuturisticDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <FuturisticSidebar />

      <div className="ml-64 transition-all duration-300">
        <FuturisticHeader />

        <main className={cn("p-6", className)}>
          <motion.div
            animate={{ opacity: 1, y: 0 }}
            initial={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5 }}
          >
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  );
}
