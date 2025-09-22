"use client";

import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";

export function ActiveAudienceCard() {
  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-2xl bg-forest-green-500 p-6 text-white shadow-sm"
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.8 }}
    >
      <div className="mb-4 flex items-center justify-between">
        <h3 className="font-medium text-sm uppercase tracking-wide opacity-90">
          GENERAL
        </h3>
        <button className="rounded p-1 hover:bg-white/10">
          <MoreHorizontal className="h-4 w-4" />
        </button>
      </div>

      <h4 className="mb-6 font-semibold text-lg">Active Audience</h4>

      {/* Illustration Area */}
      <div className="relative mb-4 h-24">
        {/* Simple illustration with colored shapes representing people */}
        <div className="flex h-full items-end justify-center space-x-2">
          <div className="h-12 w-8 rounded-full bg-reward-gold-500 opacity-80" />
          <div className="h-16 w-8 rounded-full bg-clean-white opacity-90" />
          <div className="h-14 w-8 rounded-full bg-reward-gold-400 opacity-85" />
          <div className="h-18 w-8 rounded-full bg-sage-green-400 opacity-80" />
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-sm opacity-90">World Widely</span>
        <span className="font-bold text-2xl">
          730<span className="font-normal text-sm">x</span>
        </span>
      </div>

      {/* Background decoration */}
      <div className="-translate-y-8 absolute top-0 right-0 h-32 w-32 translate-x-8 rounded-full bg-white/5" />
    </motion.div>
  );
}
