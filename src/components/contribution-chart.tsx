"use client";

import { motion } from "framer-motion";
import { useState } from "react";

interface ContributionChartProps {
  data: any;
}

export function ContributionChart({ data }: ContributionChartProps) {
  const [activeTab, setActiveTab] = useState<"delivered" | "thrown">(
    "delivered"
  );
  const [timeframe, setTimeframe] = useState<"week" | "month">("week");

  // Mock data for the chart - matching the reference design
  const chartData = [
    { day: "Mon", value: 1.5 },
    { day: "Tue", value: 1.3 },
    { day: "Wed", value: 2.1 },
    { day: "Thu", value: 1.9 },
    { day: "Fri", value: 2.8 },
    { day: "Sat", value: 2.4 },
    { day: "Sun", value: 1.2 },
  ];

  const maxValue = Math.max(...chartData.map((d) => d.value));
  const currentValue = 2.2;

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card h-full"
      initial={{ opacity: 0, y: 20 }}
    >
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h3 className="mb-2 font-medium text-medium-gray text-sm uppercase tracking-wide">
            CONTRIBUTION
          </h3>
          <div className="font-bold text-2xl text-dark-charcoal">
            {currentValue}
            <span className="font-normal text-sm">kg</span>
          </div>
        </div>

        <div className="flex items-center space-x-6">
          {/* Status Tabs */}
          <div className="flex items-center space-x-4">
            <button
              className={`flex items-center space-x-2 text-sm ${
                activeTab === "delivered"
                  ? "text-fresh-mint-500"
                  : "text-medium-gray"
              }`}
              onClick={() => setActiveTab("delivered")}
            >
              <div className="h-2 w-2 rounded-full bg-fresh-mint-500" />
              <span>Delivered</span>
            </button>
            <button
              className={`flex items-center space-x-2 text-sm ${
                activeTab === "thrown" ? "text-medium-gray" : "text-medium-gray"
              }`}
              onClick={() => setActiveTab("thrown")}
            >
              <div className="h-2 w-2 rounded-full bg-medium-gray" />
              <span>Thrown</span>
            </button>
          </div>

          {/* Date Selector */}
          <div className="flex items-center space-x-4">
            <span className="font-medium text-medium-gray text-sm uppercase tracking-wide">
              DATE
            </span>
            <div className="flex items-center space-x-2">
              <button
                className={`flex items-center space-x-1 text-sm ${
                  timeframe === "week"
                    ? "text-dark-charcoal"
                    : "text-medium-gray"
                }`}
                onClick={() => setTimeframe("week")}
              >
                <div className="h-2 w-2 rounded-full bg-fresh-mint-500" />
                <span>Week</span>
              </button>
              <button
                className={`text-sm ${timeframe === "month" ? "text-dark-charcoal" : "text-medium-gray"}`}
                onClick={() => setTimeframe("month")}
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
        <div className="absolute top-0 left-0 flex h-full flex-col justify-between text-medium-gray text-xs">
          <span>3.5kg</span>
          <span>3.0kg</span>
          <span>2.5kg</span>
          <span>2.0kg</span>
          <span>1.5kg</span>
          <span>1.0kg</span>
        </div>

        {/* Chart area */}
        <div className="relative ml-12 h-full">
          <svg className="h-full w-full" viewBox="0 0 400 200">
            {/* Grid lines */}
            {[0, 1, 2, 3, 4, 5].map((i) => (
              <line
                key={i}
                stroke="#f3f4f6"
                strokeWidth="1"
                x1="0"
                x2="400"
                y1={i * 40}
                y2={i * 40}
              />
            ))}

            {/* Chart line - using warm yellow from design brief */}
            <motion.path
              animate={{ pathLength: 1 }}
              className="chart-line"
              d={`M ${chartData
                .map(
                  (point, index) =>
                    `${(index * 400) / (chartData.length - 1)},${200 - (point.value / maxValue) * 160}`
                )
                .join(" L ")}`}
              initial={{ pathLength: 0 }}
              stroke="#FFD54F"
              transition={{ duration: 2, ease: "easeInOut" }}
            />

            {/* Fill area */}
            <motion.path
              animate={{ pathLength: 1 }}
              d={`M ${chartData
                .map(
                  (point, index) =>
                    `${(index * 400) / (chartData.length - 1)},${200 - (point.value / maxValue) * 160}`
                )
                .join(" L ")} L 400,200 L 0,200 Z`}
              fill="url(#gradient)"
              initial={{ pathLength: 0 }}
              opacity="0.3"
              transition={{ duration: 2, ease: "easeInOut" }}
            />

            {/* Data points */}
            {chartData.map((point, index) => (
              <motion.circle
                animate={{ scale: 1 }}
                className="chart-point"
                cx={(index * 400) / (chartData.length - 1)}
                cy={200 - (point.value / maxValue) * 160}
                fill="#FFD54F"
                initial={{ scale: 0 }}
                key={index}
                r="4"
                transition={{ delay: index * 0.1 + 1, duration: 0.3 }}
              />
            ))}

            {/* Gradient definition */}
            <defs>
              <linearGradient id="gradient" x1="0%" x2="0%" y1="0%" y2="100%">
                <stop offset="0%" stopColor="#FFD54F" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#FFD54F" stopOpacity="0" />
              </linearGradient>
            </defs>
          </svg>

          {/* X-axis labels */}
          <div className="mt-4 flex justify-between text-medium-gray text-xs">
            {chartData.map((point) => (
              <span key={point.day}>{point.day}</span>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
