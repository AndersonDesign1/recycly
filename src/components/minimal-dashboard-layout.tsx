"use client";

import { MinimalSidebar } from "@/components/minimal-sidebar";
import { MinimalActiveAudience } from "./minimal-active-audience";
import { MinimalCalendarWidget } from "./minimal-calendar-widget";
import { MinimalContributionChart } from "./minimal-contribution-chart";
import { MinimalEarningsChart } from "./minimal-earnings-chart";
import { MinimalStatisticsCards } from "./minimal-statistics-cards";

export function MinimalDashboardLayout() {
  return (
    <div className="min-h-screen bg-light-gray">
      <MinimalSidebar />

      <main className="ml-20 p-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="mb-2 font-semibold text-2xl text-dark-charcoal">
            Dashboard
          </h1>
          <p className="text-medium-gray">
            Hello, Thor. Great to see you again!
          </p>
        </div>

        {/* Main Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Contribution Chart - Spans 8 columns */}
          <div className="col-span-8">
            <MinimalContributionChart />
          </div>

          {/* Calendar Widget - Spans 4 columns */}
          <div className="col-span-4">
            <MinimalCalendarWidget />
          </div>

          {/* Statistics Cards - Spans 6 columns */}
          <div className="col-span-6">
            <MinimalStatisticsCards />
          </div>

          {/* Earnings Chart - Spans 3 columns */}
          <div className="col-span-3">
            <MinimalEarningsChart />
          </div>

          {/* Active Audience - Spans 3 columns */}
          <div className="col-span-3">
            <MinimalActiveAudience />
          </div>
        </div>
      </main>
    </div>
  );
}
