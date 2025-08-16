"use client"

const statisticsData = [
  {
    title: "Paper",
    value: 34,
    unit: "kg",
    percentage: 83,
    color: "var(--color-reward-gold)",
  },
  {
    title: "Glass",
    value: 29,
    unit: "kg",
    percentage: 62,
    color: "var(--color-reward-gold)",
  },
  {
    title: "Organic",
    value: 15,
    unit: "kg",
    percentage: 51,
    color: "var(--color-reward-gold)",
  },
  {
    title: "Plastic",
    value: 13,
    unit: "kg",
    percentage: 23,
    color: "var(--color-reward-gold)",
  },
]

function CircularProgress({ percentage, color }: { percentage: number; color: string }) {
  const radius = 20
  const circumference = 2 * Math.PI * radius
  const strokeDasharray = circumference
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  return (
    <div className="relative w-12 h-12">
      <svg className="w-12 h-12 transform -rotate-90" viewBox="0 0 44 44">
        {/* Background circle */}
        <circle cx="22" cy="22" r={radius} stroke="#f5f5f5" strokeWidth="4" fill="none" />
        {/* Progress circle */}
        <circle
          cx="22"
          cy="22"
          r={radius}
          stroke={color}
          strokeWidth="4"
          fill="none"
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          className="transition-all duration-300 ease-in-out"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-xs font-medium text-dark-charcoal">{percentage}%</span>
      </div>
    </div>
  )
}

export function MinimalStatisticsCards() {
  return (
    <div className="minimal-card">
      <div className="mb-6">
        <h3 className="text-sm font-medium text-medium-gray uppercase tracking-wide">STATISTICS</h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {statisticsData.map((stat, index) => (
          <div key={index} className="flex items-center justify-between">
            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="text-sm font-medium text-dark-charcoal">{stat.title}</h4>
                <button className="text-medium-gray hover:text-dark-charcoal">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                    <circle cx="8" cy="3" r="1" />
                    <circle cx="8" cy="8" r="1" />
                    <circle cx="8" cy="13" r="1" />
                  </svg>
                </button>
              </div>
              <div className="flex items-end space-x-3">
                <div className="text-2xl font-semibold text-dark-charcoal">
                  {stat.value}
                  <span className="text-sm font-normal text-medium-gray ml-1">{stat.unit}</span>
                </div>
                <CircularProgress percentage={stat.percentage} color={stat.color} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
