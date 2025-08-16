"use client"

import { motion } from "framer-motion"
import { MoreHorizontal } from "lucide-react"

export function ActiveAudienceCard() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.8 }}
      className="bg-forest-green-500 rounded-2xl p-6 text-white relative overflow-hidden shadow-sm"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium uppercase tracking-wide opacity-90">GENERAL</h3>
        <button className="p-1 hover:bg-white/10 rounded">
          <MoreHorizontal className="w-4 h-4" />
        </button>
      </div>

      <h4 className="text-lg font-semibold mb-6">Active Audience</h4>

      {/* Illustration Area */}
      <div className="relative h-24 mb-4">
        {/* Simple illustration with colored shapes representing people */}
        <div className="flex items-end justify-center space-x-2 h-full">
          <div className="w-8 h-12 bg-reward-gold-500 rounded-full opacity-80" />
          <div className="w-8 h-16 bg-clean-white rounded-full opacity-90" />
          <div className="w-8 h-14 bg-reward-gold-400 rounded-full opacity-85" />
          <div className="w-8 h-18 bg-sage-green-400 rounded-full opacity-80" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm opacity-90">World Widely</span>
        <span className="text-2xl font-bold">
          730<span className="text-sm font-normal">x</span>
        </span>
      </div>

      {/* Background decoration */}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full -translate-y-8 translate-x-8" />
    </motion.div>
  )
}
