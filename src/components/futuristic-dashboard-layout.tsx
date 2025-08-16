"use client"

import type React from "react"

import { motion } from "framer-motion"
import { FuturisticSidebar } from "@/components/futuristic-sidebar"
import { FuturisticHeader } from "@/components/futuristic-header"
import { cn } from "@/lib/utils"

interface FuturisticDashboardLayoutProps {
  children: React.ReactNode
  className?: string
}

export function FuturisticDashboardLayout({ children, className }: FuturisticDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      <FuturisticSidebar />

      <div className="ml-64 transition-all duration-300">
        <FuturisticHeader />

        <main className={cn("p-6", className)}>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            {children}
          </motion.div>
        </main>
      </div>
    </div>
  )
}
