"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  BarChart3,
  Bell,
  ChevronLeft,
  ChevronRight,
  Database,
  Gift,
  Home,
  LogOut,
  MapPin,
  Recycle,
  Settings,
  Trophy,
  Users,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "@/src/lib/auth-client";

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
    icon: <Home className="h-5 w-5" />,
    href: "/dashboard",
    roles: ["USER", "WASTE_MANAGER", "ADMIN", "SUPERADMIN"],
  },
  {
    id: "scan",
    label: "Scan & Dispose",
    icon: <Recycle className="h-5 w-5" />,
    href: "/scan",
    roles: ["USER"],
  },
  {
    id: "bins",
    label: "Waste Bins",
    icon: <MapPin className="h-5 w-5" />,
    href: "/bins",
    roles: ["USER", "WASTE_MANAGER", "ADMIN", "SUPERADMIN"],
  },
  {
    id: "rewards",
    label: "Rewards",
    icon: <Gift className="h-5 w-5" />,
    href: "/rewards",
    roles: ["USER", "ADMIN", "SUPERADMIN"],
  },
  {
    id: "leaderboard",
    label: "Leaderboard",
    icon: <Trophy className="h-5 w-5" />,
    href: "/leaderboard",
    roles: ["USER"],
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/analytics",
    roles: ["WASTE_MANAGER", "ADMIN", "SUPERADMIN"],
  },
  {
    id: "users",
    label: "User Management",
    icon: <Users className="h-5 w-5" />,
    href: "/admin/users",
    roles: ["ADMIN", "SUPERADMIN"],
  },
  {
    id: "system",
    label: "System Admin",
    icon: <Database className="h-5 w-5" />,
    href: "/superadmin",
    roles: ["SUPERADMIN"],
  },
  {
    id: "notifications",
    label: "Notifications",
    icon: <Bell className="h-5 w-5" />,
    href: "/notifications",
    roles: ["USER", "WASTE_MANAGER", "ADMIN", "SUPERADMIN"],
    badge: 3,
  },
  {
    id: "settings",
    label: "Settings",
    icon: <Settings className="h-5 w-5" />,
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
      animate={{ x: 0 }}
      className={cn(
        "fixed top-0 left-0 z-50 h-full border-border border-r bg-card transition-all duration-300",
        isCollapsed ? "w-16" : "w-64",
        className
      )}
      initial={{ x: -300 }}
    >
      {/* Header */}
      <div className="border-border border-b p-4">
        <div className="flex items-center justify-between">
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                animate={{ opacity: 1 }}
                className="flex items-center space-x-3"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500">
                  <Recycle className="h-5 w-5 text-white" />
                </div>
                <div>
                  <h1 className="font-bold text-foreground text-lg">Recycly</h1>
                  <p className="text-muted-foreground text-xs">Premium</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <button
            className="rounded-lg p-2 transition-colors hover:bg-muted/50"
            onClick={() => setIsCollapsed(!isCollapsed)}
          >
            {isCollapsed ? (
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            ) : (
              <ChevronLeft className="h-4 w-4 text-muted-foreground" />
            )}
          </button>
        </div>
      </div>

      {/* User Profile */}
      <div className="border-border border-b p-4">
        <div className="flex items-center space-x-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500">
            <span className="font-semibold text-sm text-white">
              {session?.user?.name?.charAt(0) || "U"}
            </span>
          </div>
          <AnimatePresence>
            {!isCollapsed && (
              <motion.div
                animate={{ opacity: 1 }}
                className="min-w-0 flex-1"
                exit={{ opacity: 0 }}
                initial={{ opacity: 0 }}
              >
                <p className="truncate font-medium text-foreground text-sm">
                  {session?.user?.name || "User"}
                </p>
                <p className="text-muted-foreground text-xs capitalize">
                  {userRole.toLowerCase().replace("_", " ")}
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-2 p-4">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <motion.button
              className={cn("sidebar-item w-full", isActive && "active")}
              key={item.id}
              onClick={() => router.push(item.href)}
              whileHover={{ x: isCollapsed ? 0 : 4 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center space-x-3">
                <div className="relative">
                  {item.icon}
                  {item.badge && (
                    <div className="-top-1 -right-1 absolute flex h-4 w-4 items-center justify-center rounded-full bg-red-500">
                      <span className="font-medium text-white text-xs">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </div>
                <AnimatePresence>
                  {!isCollapsed && (
                    <motion.span
                      animate={{ opacity: 1 }}
                      className="font-medium text-sm"
                      exit={{ opacity: 0 }}
                      initial={{ opacity: 0 }}
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
      <div className="border-border border-t p-4">
        <motion.button
          className="sidebar-item w-full text-red-500 hover:bg-red-500/10"
          onClick={handleSignOut}
          whileHover={{ x: isCollapsed ? 0 : 4 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center space-x-3">
            <LogOut className="h-5 w-5" />
            <AnimatePresence>
              {!isCollapsed && (
                <motion.span
                  animate={{ opacity: 1 }}
                  className="font-medium text-sm"
                  exit={{ opacity: 0 }}
                  initial={{ opacity: 0 }}
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
