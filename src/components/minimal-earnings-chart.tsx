"use client";

const earningsData = [
  { material: "Paper", value: 47, color: "var(--color-warm-yellow)" },
  { material: "Glass", value: 58, color: "var(--color-warm-yellow)" },
  { material: "Organic", value: 18, color: "var(--color-warm-yellow)" },
  { material: "Plastic", value: 49, color: "var(--color-warm-yellow)" },
];

export function MinimalEarningsChart() {
  const maxValue = Math.max(...earningsData.map((d) => d.value));

  return (
    <div className="minimal-card h-80">
      <div className="mb-6">
        <h3 className="mb-4 font-medium text-medium-gray text-sm uppercase tracking-wide">
          EARNINGS
        </h3>
        <div className="mb-4 font-semibold text-dark-charcoal text-lg">
          Total Amount
        </div>

        {/* Material Legend */}
        <div className="mb-6 flex space-x-4 text-medium-gray text-xs">
          <span>Paper</span>
          <span>Glass</span>
          <span>Organic</span>
          <span>Plastic</span>
        </div>
      </div>

      {/* Bar Chart */}
      <div className="flex h-32 items-end justify-between space-x-2">
        {earningsData.map((item, index) => (
          <div className="flex flex-1 flex-col items-center" key={index}>
            <div
              className="w-full rounded-t-md transition-all duration-300 hover:opacity-80"
              style={{
                backgroundColor: item.color,
                height: `${(item.value / maxValue) * 100}%`,
                minHeight: "20px",
              }}
            />
            <div className="mt-2 font-medium text-dark-charcoal text-xs">
              {item.value}$
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
