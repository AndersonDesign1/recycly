"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function MinimalCalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">(
    "week"
  );

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const daysInMonth = lastDay.getDate();
  const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Convert Sunday=0 to Monday=0

  // Generate calendar days
  const calendarDays = [];

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null);
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev);
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1);
      } else {
        newDate.setMonth(prev.getMonth() + 1);
      }
      return newDate;
    });
  };

  // Highlighted dates (example: 13th and 19th)
  const highlightedDates = [13, 19];

  return (
    <div className="minimal-card h-80">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h3 className="mb-1 font-medium text-medium-gray text-sm uppercase tracking-wide">
            DATE
          </h3>
          <div className="flex items-center space-x-4">
            <button
              className={`text-sm ${selectedPeriod === "week" ? "font-medium text-dark-charcoal" : "text-medium-gray"}`}
              onClick={() => setSelectedPeriod("week")}
            >
              Week
            </button>
            <button
              className={`text-sm ${
                selectedPeriod === "month"
                  ? "font-medium text-dark-charcoal"
                  : "text-medium-gray"
              }`}
              onClick={() => setSelectedPeriod("month")}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="mb-4 flex items-center justify-between">
        <h4 className="font-semibold text-dark-charcoal text-lg">
          {months[month]}
        </h4>
        <div className="flex items-center space-x-2">
          <button
            className="rounded p-1 hover:bg-light-gray"
            onClick={() => navigateMonth("prev")}
          >
            <ChevronLeft className="text-medium-gray" size={16} />
          </button>
          <button
            className="rounded p-1 hover:bg-light-gray"
            onClick={() => navigateMonth("next")}
          >
            <ChevronRight className="text-medium-gray" size={16} />
          </button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {daysOfWeek.map((day) => (
          <div className="py-1 text-center text-medium-gray text-xs" key={day}>
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div
            className={`flex h-8 cursor-pointer items-center justify-center rounded-md text-sm ${
              day === null
                ? ""
                : highlightedDates.includes(day)
                  ? "bg-warm-yellow font-medium text-dark-charcoal"
                  : "text-dark-charcoal hover:bg-light-gray"
            }
            `}
            key={index}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Set Reminder */}
      <div className="mt-4 border-light-gray border-t pt-4">
        <button className="font-medium text-forest-green text-sm hover:text-forest-green/80">
          Set a Reminder
        </button>
      </div>
    </div>
  );
}
