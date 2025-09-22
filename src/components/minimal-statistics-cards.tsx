"use client";

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
];

function CircularProgress({
  percentage,
  color,
}: {
  percentage: number;
  color: string;
}) {
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const strokeDasharray = circumference;
  const strokeDashoffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="relative h-12 w-12">
      <svg className="-rotate-90 h-12 w-12 transform" viewBox="0 0 44 44">
        {/* Background circle */}
        <circle
          cx="22"
          cy="22"
          fill="none"
          r={radius}
          stroke="#f5f5f5"
          strokeWidth="4"
        />
        {/* Progress circle */}
        <circle
          className="transition-all duration-300 ease-in-out"
          cx="22"
          cy="22"
          fill="none"
          r={radius}
          stroke={color}
          strokeDasharray={strokeDasharray}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          strokeWidth="4"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="font-medium text-dark-charcoal text-xs">
          {percentage}%
        </span>
      </div>
    </div>
  );
}

export function MinimalStatisticsCards() {
  return (
    <div className="minimal-card">
      <div className="mb-6">
        <h3 className="font-medium text-medium-gray text-sm uppercase tracking-wide">
          STATISTICS
        </h3>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {statisticsData.map((stat, index) => (
          <div className="flex items-center justify-between" key={index}>
            <div className="flex-1">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="font-medium text-dark-charcoal text-sm">
                  {stat.title}
                </h4>
                <button className="text-medium-gray hover:text-dark-charcoal">
                  <svg
                    fill="currentColor"
                    height="16"
                    viewBox="0 0 16 16"
                    width="16"
                  >
                    <circle cx="8" cy="3" r="1" />
                    <circle cx="8" cy="8" r="1" />
                    <circle cx="8" cy="13" r="1" />
                  </svg>
                </button>
              </div>
              <div className="flex items-end space-x-3">
                <div className="font-semibold text-2xl text-dark-charcoal">
                  {stat.value}
                  <span className="ml-1 font-normal text-medium-gray text-sm">
                    {stat.unit}
                  </span>
                </div>
                <CircularProgress
                  color={stat.color}
                  percentage={stat.percentage}
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
