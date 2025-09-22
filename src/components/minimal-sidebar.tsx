"use client";

import {
  BarChart3,
  LayoutDashboard,
  MapPin,
  Phone,
  Settings,
  User,
} from "lucide-react";

const navigation = [
  { icon: LayoutDashboard, href: "/dashboard", active: true },
  { icon: BarChart3, href: "/analytics", active: false },
  { icon: MapPin, href: "/locations", active: false },
  { icon: Phone, href: "/contact", active: false },
  { icon: Settings, href: "/settings", active: false },
];

export function MinimalSidebar() {
  return (
    <div className="minimal-sidebar fixed top-0 left-0 flex h-full w-20 flex-col items-center py-6">
      {/* Logo */}
      <div className="mb-8 flex h-8 w-8 items-center justify-center rounded-full bg-white">
        <div className="h-3 w-3 rounded-full bg-forest-green" />
      </div>

      {/* Navigation Icons */}
      <nav className="flex flex-1 flex-col space-y-6">
        {navigation.map((item, index) => (
          <button
            className={`flex h-10 w-10 items-center justify-center rounded-lg transition-colors ${
              item.active
                ? "bg-white/20 text-white"
                : "text-white/60 hover:bg-white/10 hover:text-white"
            }`}
            key={index}
          >
            <item.icon size={20} />
          </button>
        ))}
      </nav>

      {/* User Avatar */}
      <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/20">
        <User className="text-white" size={20} />
      </div>
    </div>
  );
}
