"use client"

export function MinimalActiveAudience() {
  return (
    <div className="minimal-card h-80 bg-forest-green text-white relative overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-medium text-white/70 uppercase tracking-wide">GENERAL</h3>
        <button className="text-white/70 hover:text-white">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <circle cx="8" cy="3" r="1" />
            <circle cx="8" cy="8" r="1" />
            <circle cx="8" cy="13" r="1" />
          </svg>
        </button>
      </div>

      <div className="mb-4">
        <h4 className="text-lg font-semibold text-white mb-2">Active Audience</h4>
      </div>

      {/* Illustration Area */}
      <div className="flex items-center justify-center mb-6 h-24">
        {/* Simple person illustrations */}
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map((person) => (
            <div key={person} className="w-8 h-12 bg-white/20 rounded-full flex items-end justify-center pb-1">
              <div className="w-4 h-4 bg-white/40 rounded-full"></div>
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between">
        <div className="text-white/70 text-sm">World Widely</div>
        <div className="text-2xl font-bold text-white">730k</div>
      </div>

      {/* Background decoration */}
      <div className="absolute -bottom-4 -right-4 w-16 h-16 bg-white/5 rounded-full"></div>
      <div className="absolute -top-2 -left-2 w-8 h-8 bg-white/5 rounded-full"></div>
    </div>
  )
}
