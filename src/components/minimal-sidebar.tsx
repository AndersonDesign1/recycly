"use client"

import { LayoutDashboard, BarChart3, MapPin, Phone, Settings, User } from "lucide-react"

const navigation = [
  { icon: LayoutDashboard, href: "/dashboard", active: true },
  { icon: BarChart3, href: "/analytics", active: false },
  { icon: MapPin, href: "/locations", active: false },
  { icon: Phone, href: "/contact", active: false },
  { icon: Settings, href: "/settings", active: false },
]

export function MinimalSidebar() {
  return (
    <div className="minimal-sidebar fixed left-0 top-0 h-full w-20 flex flex-col items-center py-6">
      {/* Logo */}
      <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mb-8">
        <div className="w-3 h-3 bg-forest-green rounded-full"></div>
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-col space-y-6 flex-1">
        {navigation.map((item, index) => (
          <button
            key={index}
            className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
              item.active ? "bg-white/20 text-white" : "text-white/60 hover:text-white hover:bg-white/10"
            }`}
          >
            <item.icon size={20} />
          </button>
        ))}
      </nav>

      {/* User Avatar */}
      <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
        <User size={20} className="text-white" />
      </div>
    </div>
  )
}
