"use client";

import { motion } from "framer-motion";
import { MoreHorizontal } from "lucide-react";

interface StatisticsCardsProps {
  stats: any;
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
  ];

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card"
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.4 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-medium text-medium-gray text-sm uppercase tracking-wide">
          STATISTICS
        </h3>
      </div>

      <div className="space-y-6">
        {statisticsData.map((item, index) => (
          <motion.div
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between"
            initial={{ opacity: 0, x: -20 }}
            key={item.title}
            transition={{ delay: 0.5 + index * 0.1 }}
          >
            <div className="flex items-center space-x-4">
              <div>
                <h4 className="font-medium text-dark-charcoal text-sm">
                  {item.title}
                </h4>
                <div className="flex items-baseline space-x-1">
                  <span className="font-bold text-2xl text-dark-charcoal">
                    {item.value}
                  </span>
                  <span className="text-medium-gray text-sm">{item.unit}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center space-x-3">
              {/* Circular Progress */}
              <div className="relative h-12 w-12">
                <svg className="progress-ring h-12 w-12" viewBox="0 0 48 48">
                  <circle
                    className="progress-ring-background"
                    cx="24"
                    cy="24"
                    r="20"
                  />
                  <motion.circle
                    animate={{ pathLength: item.percentage / 100 }}
                    className="progress-ring-circle"
                    cx="24"
                    cy="24"
                    initial={{ pathLength: 0 }}
                    r="20"
                    style={{
                      strokeDasharray: "125.6",
                      strokeDashoffset: 125.6 * (1 - item.percentage / 100),
                    }}
                    transition={{ duration: 1, delay: 0.5 + index * 0.1 }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="font-semibold text-dark-charcoal text-xs">
                    {item.percentage}%
                  </span>
                </div>
              </div>

              <button className="rounded p-1 hover:bg-light-gray">
                <MoreHorizontal className="h-4 w-4 text-medium-gray" />
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
