"use client"

import { motion } from "framer-motion"

interface EarningsChartProps {
  data: any
}

export function EarningsChart({ data }: EarningsChartProps) {
  const earningsData = [
    { category: "Paper", value: 47, color: "#FFD54F" },
    { category: "Glass", value: 58, color: "#FFD54F" },
    { category: "Organic", value: 18, color: "#FFD54F" },
    { category: "Plastic", value: 49, color: "#FFD54F" },
  ]

  const maxValue = Math.max(...earningsData.map((d) => d.value))

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6 }}
      className="dashboard-card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-medium-gray uppercase tracking-wide">EARNINGS</h3>
      </div>

      <div className="mb-6">
        <h4 className="text-lg font-semibold text-dark-charcoal mb-2">Total Amount</h4>
        <div className="flex items-center space-x-4 text-sm text-medium-gray">
          <span>Paper</span>
          <span>Glass</span>
          <span>Organic</span>
          <span>Plastic</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end justify-between h-32 space-x-2">
        {earningsData.map((item, index) => (
          <div key={item.category} className="flex flex-col items-center flex-1">
            <motion.div
              initial={{ height: 0 }}
              animate={{ height: `${(item.value / maxValue) * 100}%` }}
              transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
              className="w-full bg-reward-gold-500 rounded-t-lg min-h-[20px] relative"
              style={{ backgroundColor: "#FFD54F" }}
            />
            <span className="text-xs text-medium-gray mt-2">{item.value}$</span>
          </div>
        ))}
      </div>
    </motion.div>
  )
}
