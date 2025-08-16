"use client"

import { useState } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"

const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
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
]

export function MinimalCalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [selectedPeriod, setSelectedPeriod] = useState<"week" | "month">("week")

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  // Get first day of month and number of days
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const daysInMonth = lastDay.getDate()
  const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // Convert Sunday=0 to Monday=0

  // Generate calendar days
  const calendarDays = []

  // Add empty cells for days before month starts
  for (let i = 0; i < startingDayOfWeek; i++) {
    calendarDays.push(null)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day)
  }

  const navigateMonth = (direction: "prev" | "next") => {
    setCurrentDate((prev) => {
      const newDate = new Date(prev)
      if (direction === "prev") {
        newDate.setMonth(prev.getMonth() - 1)
      } else {
        newDate.setMonth(prev.getMonth() + 1)
      }
      return newDate
    })
  }

  // Highlighted dates (example: 13th and 19th)
  const highlightedDates = [13, 19]

  return (
    <div className="minimal-card h-80">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-sm font-medium text-medium-gray uppercase tracking-wide mb-1">DATE</h3>
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setSelectedPeriod("week")}
              className={`text-sm ${selectedPeriod === "week" ? "text-dark-charcoal font-medium" : "text-medium-gray"}`}
            >
              Week
            </button>
            <button
              onClick={() => setSelectedPeriod("month")}
              className={`text-sm ${
                selectedPeriod === "month" ? "text-dark-charcoal font-medium" : "text-medium-gray"
              }`}
            >
              Month
            </button>
          </div>
        </div>
      </div>

      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold text-dark-charcoal">{months[month]}</h4>
        <div className="flex items-center space-x-2">
          <button onClick={() => navigateMonth("prev")} className="p-1 hover:bg-light-gray rounded">
            <ChevronLeft size={16} className="text-medium-gray" />
          </button>
          <button onClick={() => navigateMonth("next")} className="p-1 hover:bg-light-gray rounded">
            <ChevronRight size={16} className="text-medium-gray" />
          </button>
        </div>
      </div>

      {/* Days of Week */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-xs text-medium-gray text-center py-1">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((day, index) => (
          <div
            key={index}
            className={`
              h-8 flex items-center justify-center text-sm rounded-md cursor-pointer
              ${
                day === null
                  ? ""
                  : highlightedDates.includes(day)
                    ? "bg-warm-yellow text-dark-charcoal font-medium"
                    : "text-dark-charcoal hover:bg-light-gray"
              }
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Set Reminder */}
      <div className="mt-4 pt-4 border-t border-light-gray">
        <button className="text-sm text-forest-green hover:text-forest-green/80 font-medium">Set a Reminder</button>
      </div>
    </div>
  )
}
