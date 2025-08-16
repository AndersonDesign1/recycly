"use client";

import type React from "react";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Home,
  BarChart3,
  Recycle,
  Gift,
  Users,
  Settings,
  MapPin,
  Trophy,
  Database,
  Bell,
  LogOut,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import { signOut, useSession } from "@/src/lib/auth-client";
import { cn } from "@/lib/utils";

interface SidebarItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  href: string;
  roles: string[];
  badge?: number;
}

const sidebarItems: SidebarItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <Home className="w-5 h-5" />,
    href: "/dashboard",
    roles: ["USER", "WASTE_MANAGER", "ADMIN", "SUPERADMIN"],
  },
  {
    id: "scan",
    label: "Scan & Dispose",
    icon: <Recycle className="w-5 h-5" />,
    href: "/scan",
    roles: ["USER"],
  },
  {
    id: "bins",
    label: "Waste Bins",
    icon: <MapPin className="w-5 h-5" />,
    href: "/bins",
    roles: ["USER", "WASTE_MANAGER", "ADMIN", "SUPERADMIN"],
  },
  {
    id: "rewards",
    label: "Rewards",
    icon: <Gift className="w-5 h-5" />,
    href: "/rewards",
    roles: ["USER", "ADMIN", "SUPERADMIN"],
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    icon: <Trophy className="w-5 h-5" />,
    href: "/leaderboard",
    roles: ["USER"],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="w-5 h-5" />,
    href: "/analytics",
    roles: ["WASTE_MANAGER", "ADMIN", "SUPERADMIN"],
  },
  {
    id: "users",
    label: "User Management",
    icon: <Users className="w-5 h-5" />,
    href: "/admin/users",
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    id: "system",
    label: "System Admin",
    icon: <Database className="w-5 h-5" />,
    href: "/superadmin",
    roles: ["SUPERADMIN"],
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell className="w-5 h-5" />,
    href: "/notifications",
    roles: ["USER", "WASTE_MANAGER", "ADMIN", "SUPERADMIN"],
    badge: 3,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/settings",
    roles: ["USER", "WASTE_MANAGER", "ADMIN", "SUPERADMIN"],
  },
];

interface FuturisticSidebarProps {
  className?: string;
}

export function FuturisticSidebar({ className }: FuturisticSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const userRole = (session?.user as any)?.role || "USER";
  const filteredItems = sidebarItems.filter((item) =>
    item.roles.includes(userRole)
  );

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      className={cn(
        "fixed left-0 top-0 h-full bg-card border-r border-border z-50 transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex items-center space-x-3"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
                  <Recycle className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-foreground">Recycly</h1>
                  <p className="text-xs text-muted-foreground">Premium</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 rounded-lg hover:bg-muted/50 transition-colors"
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            ) : (
              <ChevronLeft className="w-4 h-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 flex items-center justify-center">
            <span className="text-white font-semibold text-sm">
              {session?.user?.name?.charAt(0) || "U"}
            </span>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex-1 min-w-0"
              >
                <p className="text-sm font-medium text-foreground truncate">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-xs text-muted-foreground capitalize">
                  {userRole.toLowerCase().replace("_", " ")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <motion.button
              key={item.id}
              onClick={() => router.push(item.href)}
              className={cn("sidebar-item w-full", isActive && "active")}
              whileHover={{ x: isCollapsed ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {item.icon}
                  {item.badge && (
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-xs text-white font-medium">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="text-sm font-medium"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </AnimatePresence>
              </div>
            </motion.button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-border">
        <motion.button
          onClick={handleSignOut}
          className="sidebar-item w-full text-red-500 hover:bg-red-500/10"
          whileHover={{ x: isCollapsed ? 0 : 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3">
            <LogOut className="w-5 h-5" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="text-sm font-medium"
                >
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </div>
        </motion.button>
      </div>
    </motion.div>
  );
}
