"use client"

const earningsData = [
  { material: "Paper", value: 47, color: "var(--color-warm-yellow)" },
  { material: "Glass", value: 58, color: "var(--color-warm-yellow)" },
  { material: "Organic", value: 18, color: "var(--color-warm-yellow)" },
  { material: "Plastic", value: 49, color: "var(--color-warm-yellow)" },
]

export function MinimalEarningsChart() {
  const maxValue = Math.max(...earningsData.map((d) => d.value))

  return (
    <div className="minimal-card h-80">
      <div className="mb-6">
        <h3 className="text-sm font-medium text-medium-gray uppercase tracking-wide mb-4">EARNINGS</h3>
        <div className="text-lg font-semibold text-dark-charcoal mb-4">Total Amount</div>

        {/* Material Legend */}
        <div className="flex space-x-4 text-xs text-medium-gray mb-6">
          <span>Paper</span>
          <span>Glass</span>
          <span>Organic</span>
          <span>Plastic</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex items-end justify-between space-x-2 h-32">
        {earningsData.map((item, index) => (
          <div key={index} className="flex flex-col items-center flex-1">
            <div
              className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
              style={{
                backgroundColor: item.color,
                height: `${(item.value / maxValue) * 100}%`,
                minHeight: "20px",
              }}
            />
            <div className="text-xs text-dark-charcoal font-medium mt-2">{item.value}$</div>
          </div>
        ))}
      </div>
    </div>
  )
}
