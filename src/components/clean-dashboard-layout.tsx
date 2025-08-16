"use client"

import type React from "react"
import { CleanSidebar } from "@/components/clean-sidebar"

interface CleanDashboardLayoutProps {
  children: React.ReactNode
}

export function CleanDashboardLayout({ children }: CleanDashboardLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-50">
      <CleanSidebar />
      <div className="ml-20 min-h-screen">{children}</div>
    </div>
  )
}
