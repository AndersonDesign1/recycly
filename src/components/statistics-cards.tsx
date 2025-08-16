"use client"

import { motion } from "framer-motion"
import { MoreHorizontal } from "lucide-react"

interface StatisticsCardsProps {
  stats: any
}

export function StatisticsCards({ stats }: StatisticsCardsProps) {
  const statisticsData = [
    {
      title: "Paper",
      value: 34,
      unit: "kg",
      percentage: 83,
      color: "reward-gold",
    },
    {
      title: "Glass",
      value: 29,
      unit: "kg",
      percentage: 62,
      color: "reward-gold",
    },
    {
      title: "Organic",
      value: 15,
      unit: "kg",
      percentage: 61,
      color: "reward-gold",
    },
    {
      title: "Plastic",
      value: 13,
      unit: "kg",
      percentage: 23,
      color: "reward-gold",
    },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="dashboard-card"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-medium-gray uppercase tracking-wide">STATISTICS</h3>
      </div>

      <div className="space-y-6">
        {statisticsData.map((item, index) => (
          <motion.div
            key={item.title}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 + index * 0.1 }}
            className="flex items-center justify-between"
          >
            <div className="flex items-center space-x-4">
              <div>
                <h4 className="text-sm font-medium text-dark-charcoal">{item.title}</h4>
                <div className="flex items-baseline space-x-1">
                  <span className="text-2xl font-bold text-dark-charcoal">{item.value}</span>
                  <span className="text-sm text-medium-gray">{item.unit}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Circular Progress */}
              <div className="relative w-12 h-12">
                <svg className="w-12 h-12 progress-ring" viewBox="0 0 48 48">
                  <circle cx="24" cy="24" r="20" className="progress-ring-background" />
                  <motion.circle
                    cx="24"
                    cy="24"
                    r="20"
                    className="progress-ring-circle"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: item.percentage / 100 }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                    style={{
                      strokeDasharray: "125.6",
                      strokeDashoffset: 125.6 * (1 - item.percentage / 100),
                    }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-xs font-semibold text-dark-charcoal">{item.percentage}%</span>
                </div>
              </div>

              <button className="p-1 hover:bg-light-gray rounded">
                <MoreHorizontal className="w-4 h-4 text-medium-gray" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
