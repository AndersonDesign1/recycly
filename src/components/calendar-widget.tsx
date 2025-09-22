"use client";

import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";

export function CalendarWidget() {
  const [currentDate, setCurrentDate] = useState(new Date(2024, 0)); // January 2024

  const daysOfWeek = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
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
  ];

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = (firstDay.getDay() + 6) % 7; // Adjust for Monday start

    const days = [];

    // Add empty cells for days before the first day of the month
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const days = getDaysInMonth(currentDate);
  const highlightedDays = [13, 19]; // Example highlighted days

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

  return (
    <motion.div
      animate={{ opacity: 1, y: 0 }}
      className="dashboard-card"
      initial={{ opacity: 0, y: 20 }}
      transition={{ delay: 0.2 }}
    >
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <h3 className="font-semibold text-dark-charcoal text-lg">
          {monthNames[currentDate.getMonth()]}
        </h3>
        <div className="flex items-center space-x-2">
          <button
            className="rounded p-1 hover:bg-light-gray"
            onClick={() => navigateMonth("prev")}
          >
            <ChevronLeft className="h-4 w-4 text-medium-gray" />
          </button>
          <button
            className="rounded p-1 hover:bg-light-gray"
            onClick={() => navigateMonth("next")}
          >
            <ChevronRight className="h-4 w-4 text-medium-gray" />
          </button>
        </div>
      </div>

      {/* Days of week header */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {daysOfWeek.map((day) => (
          <div
            className="py-2 text-center font-medium text-medium-gray text-xs"
            key={day}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1">
        {days.map((day, index) => (
          <div
            className={`flex h-8 cursor-pointer items-center justify-center rounded-lg text-sm ${day === null ? "" : "hover:bg-light-gray"}
              ${highlightedDays.includes(day as number) ? "bg-reward-gold-500 font-semibold text-white" : ""}
            `}
            key={index}
          >
            {day}
          </div>
        ))}
      </div>

      {/* Set Reminder Button */}
      <div className="mt-6 border-light-gray border-t pt-4">
        <button className="font-medium text-ocean-blue-500 text-sm hover:text-ocean-blue-600">
          Set a Reminder
        </button>
      </div>
    </motion.div>
  );
}
