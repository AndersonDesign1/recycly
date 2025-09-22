"use client";

import { useState } from "react";

const chartData = [
  { day: "Mon", value: 1.5 },
  { day: "Tue", value: 1.3 },
  { day: "Wed", value: 2.1 },
  { day: "Thu", value: 2.2 },
  { day: "Fri", value: 1.9 },
  { day: "Sat", value: 2.4 },
  { day: "Sun", value: 1.2 },
];

export function MinimalContributionChart() {
  const [filter, setFilter] = useState<"delivered" | "thrown">("delivered");
  const [period, setPeriod] = useState<"week" | "month">("week");

  // Create SVG path for the line chart
  const maxValue = Math.max(...chartData.map((d) => d.value));
  const width = 600;
  const height = 200;
  const padding = 40;

  const points = chartData
    .map((d, i) => {
      const x = padding + (i * (width - 2 * padding)) / (chartData.length - 1);
      const y =
        height - padding - (d.value / maxValue) * (height - 2 * padding);
      return `${x},${y}`;
    })
    .join(" ");

  const pathD = `M ${points
    .split(" ")
    .map((point, i) => (i === 0 ? `M ${point}` : `L ${point}`))
    .join(" ")}`;

  const areaD = `${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`;

  return (
    <div className="minimal-card h-80">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="mb-1 font-medium text-medium-gray text-sm uppercase tracking-wide">
            CONTRIBUTION
          </h3>
          <div className="font-semibold text-2xl text-dark-charcoal">
            3.5
            <span className="ml-1 font-normal text-medium-gray text-sm">
              kg
            </span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Filter Toggle */}
          <div className="flex items-center space-x-2 text-sm">
            <button
              className={`flex items-center space-x-1 ${
                filter === "delivered" ? "text-fresh-mint" : "text-medium-gray"
              }`}
              onClick={() => setFilter("delivered")}
            >
              <div className="h-2 w-2 rounded-full bg-fresh-mint" />
              <span>Delivered</span>
            </button>
            <button
              className={`flex items-center space-x-1 ${filter === "thrown" ? "text-medium-gray" : "text-medium-gray"}`}
              onClick={() => setFilter("thrown")}
            >
              <div className="h-2 w-2 rounded-full bg-medium-gray" />
              <span>Thrown</span>
            </button>
          </div>

          {/* Period Toggle */}
          <div className="flex items-center space-x-2 text-sm">
            <button
              className={`rounded px-2 py-1 ${
                period === "week"
                  ? "font-medium text-dark-charcoal"
                  : "text-medium-gray"
              }`}
              onClick={() => setPeriod("week")}
            >
              Week
            </button>
            <button
              className={`rounded px-2 py-1 ${
                period === "month"
                  ? "font-medium text-dark-charcoal"
                  : "text-medium-gray"
              }`}
              onClick={() => setPeriod("month")}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg
          className="overflow-visible"
          height="200"
          viewBox={`0 0 ${width} ${height}`}
          width="100%"
        >
          {/* Grid lines */}
          {[1, 2, 3].map((i) => (
            <line
              key={i}
              stroke="#f5f5f5"
              strokeWidth="1"
              x1={padding}
              x2={width - padding}
              y1={height - padding - (i * (height - 2 * padding)) / 3}
              y2={height - padding - (i * (height - 2 * padding)) / 3}
            />
          ))}

          {/* Area fill */}
          <path className="chart-area" d={areaD} />

          {/* Line */}
          <path className="chart-line" d={pathD} />

          {/* Data points */}
          {chartData.map((d, i) => {
            const x =
              padding + (i * (width - 2 * padding)) / (chartData.length - 1);
            const y =
              height - padding - (d.value / maxValue) * (height - 2 * padding);
            return (
              <circle
                cx={x}
                cy={y}
                fill="var(--color-warm-yellow)"
                key={i}
                r="4"
                stroke="white"
                strokeWidth="2"
              />
            );
          })}

          {/* X-axis labels */}
          {chartData.map((d, i) => {
            const x =
              padding + (i * (width - 2 * padding)) / (chartData.length - 1);
            return (
              <text
                className="fill-medium-gray text-xs"
                key={i}
                textAnchor="middle"
                x={x}
                y={height - 10}
              >
                {d.day}
              </text>
            );
          })}

          {/* Y-axis labels */}
          {[1, 2, 3].map((i) => (
            <text
              className="fill-medium-gray text-xs"
              key={i}
              textAnchor="middle"
              x={20}
              y={height - padding - (i * (height - 2 * padding)) / 3 + 4}
            >
              {i}.0kg
            </text>
          ))}
        </svg>
      </div>
    </div>
  );
}
