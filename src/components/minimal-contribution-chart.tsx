"use client"

import { useState } from "react"

const chartData = [
  { day: "Mon", value: 1.5 },
  { day: "Tue", value: 1.3 },
  { day: "Wed", value: 2.1 },
  { day: "Thu", value: 2.2 },
  { day: "Fri", value: 1.9 },
  { day: "Sat", value: 2.4 },
  { day: "Sun", value: 1.2 },
]

export function MinimalContributionChart() {
  const [filter, setFilter] = useState<"delivered" | "thrown">("delivered")
  const [period, setPeriod] = useState<"week" | "month">("week")

  // Create SVG path for the line chart
  const maxValue = Math.max(...chartData.map((d) => d.value))
  const width = 600
  const height = 200
  const padding = 40

  const points = chartData
    .map((d, i) => {
      const x = padding + (i * (width - 2 * padding)) / (chartData.length - 1)
      const y = height - padding - (d.value / maxValue) * (height - 2 * padding)
      return `${x},${y}`
    })
    .join(" ")

  const pathD = `M ${points
    .split(" ")
    .map((point, i) => (i === 0 ? `M ${point}` : `L ${point}`))
    .join(" ")}`

  const areaD = `${pathD} L ${width - padding},${height - padding} L ${padding},${height - padding} Z`

  return (
    <div className="minimal-card h-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-medium-gray uppercase tracking-wide mb-1">CONTRIBUTION</h3>
          <div className="text-2xl font-semibold text-dark-charcoal">
            3.5<span className="text-sm font-normal text-medium-gray ml-1">kg</span>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          {/* Filter Toggle */}
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => setFilter("delivered")}
              className={`flex items-center space-x-1 ${
                filter === "delivered" ? "text-fresh-mint" : "text-medium-gray"
              }`}
            >
              <div className="w-2 h-2 bg-fresh-mint rounded-full"></div>
              <span>Delivered</span>
            </button>
            <button
              onClick={() => setFilter("thrown")}
              className={`flex items-center space-x-1 ${filter === "thrown" ? "text-medium-gray" : "text-medium-gray"}`}
            >
              <div className="w-2 h-2 bg-medium-gray rounded-full"></div>
              <span>Thrown</span>
            </button>
          </div>

          {/* Period Toggle */}
          <div className="flex items-center space-x-2 text-sm">
            <button
              onClick={() => setPeriod("week")}
              className={`px-2 py-1 rounded ${
                period === "week" ? "text-dark-charcoal font-medium" : "text-medium-gray"
              }`}
            >
              Week
            </button>
            <button
              onClick={() => setPeriod("month")}
              className={`px-2 py-1 rounded ${
                period === "month" ? "text-dark-charcoal font-medium" : "text-medium-gray"
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="relative">
        <svg width="100%" height="200" viewBox={`0 0 ${width} ${height}`} className="overflow-visible">
          {/* Grid lines */}
          {[1, 2, 3].map((i) => (
            <line
              key={i}
              x1={padding}
              y1={height - padding - (i * (height - 2 * padding)) / 3}
              x2={width - padding}
              y2={height - padding - (i * (height - 2 * padding)) / 3}
              stroke="#f5f5f5"
              strokeWidth="1"
            />
          ))}

          {/* Area fill */}
          <path d={areaD} className="chart-area" />

          {/* Line */}
          <path d={pathD} className="chart-line" />

          {/* Data points */}
          {chartData.map((d, i) => {
            const x = padding + (i * (width - 2 * padding)) / (chartData.length - 1)
            const y = height - padding - (d.value / maxValue) * (height - 2 * padding)
            return <circle key={i} cx={x} cy={y} r="4" fill="var(--color-warm-yellow)" stroke="white" strokeWidth="2" />
          })}

          {/* X-axis labels */}
          {chartData.map((d, i) => {
            const x = padding + (i * (width - 2 * padding)) / (chartData.length - 1)
            return (
              <text key={i} x={x} y={height - 10} textAnchor="middle" className="text-xs fill-medium-gray">
                {d.day}
              </text>
            )
          })}

          {/* Y-axis labels */}
          {[1, 2, 3].map((i) => (
            <text
              key={i}
              x={20}
              y={height - padding - (i * (height - 2 * padding)) / 3 + 4}
              textAnchor="middle"
              className="text-xs fill-medium-gray"
            >
              {i}.0kg
            </text>
          ))}
        </svg>
      </div>
    </div>
  )
}
