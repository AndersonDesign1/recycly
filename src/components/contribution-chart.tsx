"use client"

import { motion } from "framer-motion"
import { useState } from "react"

interface ContributionChartProps {
  data: any
}

export function ContributionChart({ data }: ContributionChartProps) {
  const [activeTab, setActiveTab] = useState<"delivered" | "thrown">("delivered")
  const [timeframe, setTimeframe] = useState<"week" | "month">("week")

  // Mock data for the chart - matching the reference design
  const chartData = [
    { day: "Mon", value: 1.5 },
    { day: "Tue", value: 1.3 },
    { day: "Wed", value: 2.1 },
    { day: "Thu", value: 1.9 },
    { day: "Fri", value: 2.8 },
    { day: "Sat", value: 2.4 },
    { day: "Sun", value: 1.2 },
  ]

  const maxValue = Math.max(...chartData.map((d) => d.value))
  const currentValue = 2.2

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="dashboard-card h-full">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-medium text-medium-gray uppercase tracking-wide mb-2">CONTRIBUTION</h3>
          <div className="text-2xl font-bold text-dark-charcoal">
            {currentValue}
            <span className="text-sm font-normal">kg</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Status Tabs */}
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setActiveTab("delivered")}
              className={`flex items-center space-x-2 text-sm ${
                activeTab === "delivered" ? "text-fresh-mint-500" : "text-medium-gray"
              }`}
            >
              <div className="w-2 h-2 bg-fresh-mint-500 rounded-full" />
              <span>Delivered</span>
            </button>
            <button
              onClick={() => setActiveTab("thrown")}
              className={`flex items-center space-x-2 text-sm ${
                activeTab === "thrown" ? "text-medium-gray" : "text-medium-gray"
              }`}
            >
              <div className="w-2 h-2 bg-medium-gray rounded-full" />
              <span>Thrown</span>
            </button>
          </div>

          {/* Date Selector */}
          <div className="flex items-center space-x-4">
            <span className="text-sm font-medium text-medium-gray uppercase tracking-wide">DATE</span>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => setTimeframe("week")}
                className={`flex items-center space-x-1 text-sm ${
                  timeframe === "week" ? "text-dark-charcoal" : "text-medium-gray"
                }`}
              >
                <div className="w-2 h-2 bg-fresh-mint-500 rounded-full" />
                <span>Week</span>
              </button>
              <button
                onClick={() => setTimeframe("month")}
                className={`text-sm ${timeframe === "month" ? "text-dark-charcoal" : "text-medium-gray"}`}
              >
                Month
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative h-64">
        {/* Y-axis labels */}
        <div className="absolute left-0 top-0 h-full flex flex-col justify-between text-xs text-medium-gray">
          <span>3.5kg</span>
          <span>3.0kg</span>
          <span>2.5kg</span>
          <span>2.0kg</span>
          <span>1.5kg</span>
          <span>1.0kg</span>
        </div>

        {/* Chart area */}
        <div className="ml-12 h-full relative">
          <svg className="w-full h-full" viewBox="0 0 400 200">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line key={i} x1="0" y1={i * 40} x2="400" y2={i * 40} stroke="#f3f4f6" strokeWidth="1" />
            ))}

            {/* Chart line - using warm yellow from design brief */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d={`M ${chartData
                .map(
                  (point, index) => `${(index * 400) / (chartData.length - 1)},${200 - (point.value / maxValue) * 160}`,
                )
                .join(" L ")}`}
              className="chart-line"
              stroke="#FFD54F"
            />

            {/* Fill area */}
            <motion.path
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 2, ease: "easeInOut" }}
              d={`M ${chartData
                .map(
                  (point, index) => `${(index * 400) / (chartData.length - 1)},${200 - (point.value / maxValue) * 160}`,
                )
                .join(" L ")} L 400,200 L 0,200 Z`}
              fill="url(#gradient)"
              opacity="0.3"
            />

            {/* Data points */}
            {chartData.map((point, index) => (
              <motion.circle
                key={index}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 + 1, duration: 0.3 }}
                cx={(index * 400) / (chartData.length - 1)}
                cy={200 - (point.value / maxValue) * 160}
                r="4"
                className="chart-point"
                fill="#FFD54F"
              />
            ))}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="#FFD54F" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FFD54F" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* X-axis labels */}
          <div className="flex justify-between mt-4 text-xs text-medium-gray">
            {chartData.map((point) => (
              <span key={point.day}>{point.day}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}
