"use client";

export function MinimalActiveAudience() {
  return (
    <div className="minimal-card relative h-80 overflow-hidden bg-forest-green text-white">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-medium text-sm text-white/70 uppercase tracking-wide">
          GENERAL
        </h3>
        <button className="text-white/70 hover:text-white">
          <svg fill="currentColor" height="16" viewBox="0 0 16 16" width="16">
            <circle cx="8" cy="3" r="1" />
            <circle cx="8" cy="8" r="1" />
            <circle cx="8" cy="13" r="1" />
          </svg>
        </button>
      </div>

      <div className="mb-4">
        <h4 className="mb-2 font-semibold text-lg text-white">
          Active Audience
        </h4>
      </div>

      {/* Illustration Area */}
      <div className="mb-6 flex h-24 items-center justify-center">
        {/* Simple person illustrations */}
        <div className="flex space-x-2">
          {[1, 2, 3, 4].map((person) => (
            <div
              className="flex h-12 w-8 items-end justify-center rounded-full bg-white/20 pb-1"
              key={person}
            >
              <div className="h-4 w-4 rounded-full bg-white/40" />
            </div>
          ))}
        </div>
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-white/70">World Widely</div>
        <div className="font-bold text-2xl text-white">730k</div>
      </div>

      {/* Background decoration */}
      <div className="-bottom-4 -right-4 absolute h-16 w-16 rounded-full bg-white/5" />
      <div className="-top-2 -left-2 absolute h-8 w-8 rounded-full bg-white/5" />
    </div>
  );
}
