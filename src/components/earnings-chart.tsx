"use client";

import { motion } from "framer-motion";

interface EarningsChartProps {
  data: any;
}

export function EarningsChart({ data }: EarningsChartProps) {
  const earningsData = [
    { category: "Paper", value: 47, color: "#FFD54F" },
    { category: "Glass", value: 58, color: "#FFD54F" },
    { category: "Organic", value: 18, color: "#FFD54F" },
    { category: "Plastic", value: 49, color: "#FFD54F" },
  ];

  const maxValue = Math.max(...earningsData.map((d) => d.value));

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card"
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.6 }}
    >
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-medium text-medium-gray text-sm uppercase tracking-wide">
          EARNINGS
        </h3>
      </div>

      <div className="mb-6">
        <h4 className="mb-2 font-semibold text-dark-charcoal text-lg">
          Total Amount
        </h4>
        <div className="flex items-center space-x-4 text-medium-gray text-sm">
          <span>Paper</span>
          <span>Glass</span>
          <span>Organic</span>
          <span>Plastic</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex h-32 items-end justify-between space-x-2">
        {earningsData.map((item, index) => (
          <div
            className="flex flex-1 flex-col items-center"
            key={item.category}
          >
            <motion.div
              animate={{ height: `${(item.value / maxValue) * 100}%` }}
              className="relative min-h-[20px] w-full rounded-t-lg bg-reward-gold-500"
              initial={{ height: 0 }}
              style={{ backgroundColor: "#FFD54F" }}
              transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
            />
            <span className="mt-2 text-medium-gray text-xs">{item.value}$</span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
