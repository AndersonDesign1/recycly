"use client"

import { motion } from "framer-motion"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"

export function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0)) // January 2024

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"]
  const monthNames = [
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

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear()
    const month = date.getMonth()
    const firstDay = new Date(year, month, 1)
    const lastDay = new Date(year, month + 1, 0)
    const daysInMonth = lastDay.getDate()
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7 // Adjust for Monday start

    const days = []

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null)
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day)
    }

    return days
  }

  const days = getDaysInMonth(currentDate)
  const highlightedDays = [13, 19] // Example highlighted days

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

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="dashboard-card"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-dark-charcoal">{monthNames[currentDate.getMonth()]}</h3>
        <div className="flex items-center space-x-2">
          <button onClick={() => navigateMonth("prev")} className="p-1 hover:bg-light-gray rounded">
            <ChevronLeft className="w-4 h-4 text-medium-gray" />
          </button>
          <button onClick={() => navigateMonth("next")} className="p-1 hover:bg-light-gray rounded">
            <ChevronRight className="w-4 h-4 text-medium-gray" />
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {daysOfWeek.map((day) => (
          <div key={day} className="text-center text-xs font-medium text-medium-gray py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            key={index}
            className={`
              h-8 flex items-center justify-center text-sm rounded-lg cursor-pointer
              ${day === null ? "" : "hover:bg-light-gray"}
              ${highlightedDays.includes(day as number) ? "bg-reward-gold-500 text-white font-semibold" : ""}
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Set Reminder Button */}
      <div className="mt-6 pt-4 border-t border-light-gray">
        <button className="text-sm text-ocean-blue-500 hover:text-ocean-blue-600 font-medium">Set a Reminder</button>
      </div>
    </motion.div>
  )
}
