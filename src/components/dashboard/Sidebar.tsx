"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Users,
  MapPin,
  BarChart3,
  Settings,
  Shield,
  Truck,
  Recycle,
  Award,
  Wallet,
  TrendingUp,
  FileText,
  Bell,
  HelpCircle,
  LogOut,
  X,
  Menu,
} from "lucide-react";
import { Button } from "../ui/button";
import { Badge } from "../ui/badge";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  points: number;
  level: number;
}

interface SidebarProps {
  user: User;
  isOpen: boolean;
  onClose: () => void;
}

const navigationItems = {
  SUPERADMIN: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "User Management", href: "/dashboard/users", icon: Users },
    { name: "Location Management", href: "/dashboard/locations", icon: MapPin },
    { name: "Global Analytics", href: "/dashboard/analytics", icon: BarChart3 },
    { name: "Revenue Analytics", href: "/dashboard/revenue", icon: TrendingUp },
    { name: "Environmental Impact", href: "/dashboard/impact", icon: Recycle },
    { name: "Fraud Detection", href: "/dashboard/fraud", icon: Shield },
    { name: "System Health", href: "/dashboard/system", icon: Settings },
    {
      name: "Commission Management",
      href: "/dashboard/commissions",
      icon: Wallet,
    },
    { name: "Reports", href: "/dashboard/reports", icon: FileText },
    { name: "Announcements", href: "/dashboard/announcements", icon: Bell },
  ],
  ADMIN: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    {
      name: "Regional Analytics",
      href: "/dashboard/analytics",
      icon: BarChart3,
    },
    { name: "Waste Managers", href: "/dashboard/waste-managers", icon: Users },
    { name: "Local Users", href: "/dashboard/users", icon: Users },
    {
      name: "Pricing & Incentives",
      href: "/dashboard/pricing",
      icon: TrendingUp,
    },
    { name: "Collection Targets", href: "/dashboard/targets", icon: BarChart3 },
    {
      name: "Transaction Approval",
      href: "/dashboard/approvals",
      icon: Shield,
    },
    {
      name: "Inventory Management",
      href: "/dashboard/inventory",
      icon: MapPin,
    },
    { name: "Regional Reports", href: "/dashboard/reports", icon: FileText },
    { name: "Partnerships", href: "/dashboard/partnerships", icon: Users },
    { name: "Staff Management", href: "/dashboard/staff", icon: Users },
  ],
  WASTE_MANAGER: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    {
      name: "Collection Monitoring",
      href: "/dashboard/collection",
      icon: Truck,
    },
    { name: "User Management", href: "/dashboard/users", icon: Users },
    {
      name: "Waste Verification",
      href: "/dashboard/verification",
      icon: Recycle,
    },
    { name: "Vehicle Status", href: "/dashboard/vehicles", icon: Truck },
    { name: "Bin Management", href: "/dashboard/bins", icon: MapPin },
    { name: "User Support", href: "/dashboard/support", icon: HelpCircle },
    { name: "Daily Reports", href: "/dashboard/reports", icon: FileText },
    { name: "Quality Control", href: "/dashboard/quality", icon: Shield },
    {
      name: "Compliance Tracking",
      href: "/dashboard/compliance",
      icon: Shield,
    },
    { name: "Staff Coordination", href: "/dashboard/staff", icon: Users },
  ],
  USER: [
    { name: "Dashboard", href: "/dashboard", icon: Home },
    { name: "My Statistics", href: "/dashboard/stats", icon: BarChart3 },
    { name: "Deposit History", href: "/dashboard/history", icon: FileText },
    { name: "My Balance", href: "/dashboard/balance", icon: Wallet },
    { name: "Achievements", href: "/dashboard/achievements", icon: Award },
    { name: "Environmental Impact", href: "/dashboard/impact", icon: Recycle },
    { name: "Referral Program", href: "/dashboard/referrals", icon: Users },
    { name: "Collection Points", href: "/dashboard/points", icon: MapPin },
    { name: "Recycling Tips", href: "/dashboard/tips", icon: HelpCircle },
    { name: "Loyalty Rewards", href: "/dashboard/loyalty", icon: Award },
    { name: "Community", href: "/dashboard/community", icon: Users },
  ],
};

export function Sidebar({ user, isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);

  const userRole = user.role as keyof typeof navigationItems;
  const items = navigationItems[userRole] || navigationItems.USER;

  const getRoleColor = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "bg-red-600 text-white";
      case "ADMIN":
        return "bg-purple-600 text-white";
      case "WASTE_MANAGER":
        return "bg-blue-600 text-white";
      case "USER":
        return "bg-forest-green-600 text-white";
      default:
        return "bg-gray-600 text-white";
    }
  };

  const getRoleDisplayName = (role: string) => {
    switch (role) {
      case "SUPERADMIN":
        return "Super Admin";
      case "ADMIN":
        return "Admin";
      case "WASTE_MANAGER":
        return "Waste Manager";
      case "USER":
        return "Recycler";
      default:
        return role;
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <div
        className={`
        fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0
        ${isOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-forest-green-600 rounded-lg flex items-center justify-center">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <span className="text-lg font-semibold text-gray-900">
              {collapsed ? "R" : "Recycly"}
            </span>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setCollapsed(!collapsed)}
            className="hidden lg:flex"
          >
            {collapsed ? (
              <Menu className="w-4 h-4" />
            ) : (
              <X className="w-4 h-4" />
            )}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="lg:hidden"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-forest-green-100 rounded-full flex items-center justify-center">
              <span className="text-forest-green-600 font-semibold">
                {user.name.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.name}
              </p>
              <div className="flex items-center space-x-2">
                <Badge className={getRoleColor(user.role)}>
                  {getRoleDisplayName(user.role)}
                </Badge>
                {user.role === "USER" && (
                  <Badge variant="outline" className="text-xs">
                    Level {user.level}
                  </Badge>
                )}
              </div>
            </div>
          </div>
          {user.role === "USER" && (
            <div className="mt-3 p-2 bg-forest-green-50 rounded-lg">
              <div className="flex items-center justify-between text-xs">
                <span className="text-forest-green-700">Points</span>
                <span className="font-semibold text-forest-green-800">
                  {user.points.toLocaleString()}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-4">
          <ul className="space-y-1 px-3">
            {items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${
                        isActive
                          ? "bg-forest-green-100 text-forest-green-700"
                          : "text-gray-700 hover:bg-gray-100"
                      }
                    `}
                    onClick={onClose}
                  >
                    <item.icon className="w-5 h-5" />
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          <div className="space-y-2">
            <Link
              href="/dashboard/help"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <HelpCircle className="w-5 h-5" />
              <span>Help & Support</span>
            </Link>
            <Link
              href="/dashboard/profile"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              <Settings className="w-5 h-5" />
              <span>Settings</span>
            </Link>
            <Link
              href="/auth/signout"
              className="flex items-center space-x-3 px-3 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
            >
              <LogOut className="w-5 h-5" />
              <span>Sign Out</span>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
