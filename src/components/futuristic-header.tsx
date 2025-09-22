"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Bell, ChevronDown, Search, Settings } from "lucide-react";
import { useState } from "react";
import { useSession } from "@/src/lib/auth-client";

export function FuturisticHeader() {
  const [showNotifications, setShowNotifications] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { data: session } = useSession();

  return (
    <header className="flex h-16 items-center justify-between border-border border-b bg-card px-6">
      {/* Search */}
      <div className="max-w-md flex-1">
        <div className="relative">
          <Search className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-muted-foreground" />
          <input
            className="input-glass w-full py-2 pr-4 pl-10"
            placeholder="Search anything..."
            type="text"
          />
        </div>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Global Stats */}
        <div className="hidden items-center space-x-6 rounded-lg border border-border bg-muted/20 px-6 py-2 lg:flex">
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            <span className="text-muted-foreground text-sm">3,259 Members</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-cyan-500" />
            <span className="text-muted-foreground text-sm">
              500g CO₂ Saved
            </span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="h-2 w-2 animate-pulse rounded-full bg-orange-500" />
            <span className="text-muted-foreground text-sm">
              3,259 Containers
            </span>
          </div>
        </div>

        {/* Notifications */}
        <div className="relative">
          <button
            className="relative rounded-lg p-2 transition-colors hover:bg-muted/50"
            onClick={() => setShowNotifications(!showNotifications)}
          >
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div className="-top-1 -right-1 absolute h-3 w-3 rounded-full bg-red-500" />
          </button>

          <AnimatePresence>
            {showNotifications && (
              <motion.div
                animate={{ opacity: 1, y: 0 }}
                className="absolute top-12 right-0 z-50 w-80 rounded-lg border border-border bg-card shadow-xl"
                exit={{ opacity: 0, y: 10 }}
                initial={{ opacity: 0, y: 10 }}
              >
                <div className="border-border border-b p-4">
                  <h3 className="font-semibold text-foreground">
                    Notifications
                  </h3>
                </div>
                <div className="space-y-3 p-4">
                  <div className="flex items-start space-x-3">
                    <div className="mt-2 h-2 w-2 rounded-full bg-green-500" />
                    <div>
                      <p className="text-foreground text-sm">
                        New reward available!
                      </p>
                      <p className="text-muted-foreground text-xs">
                        2 minutes ago
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="mt-2 h-2 w-2 rounded-full bg-cyan-500" />
                    <div>
                      <p className="text-foreground text-sm">
                        Level up achieved
                      </p>
                      <p className="text-muted-foreground text-xs">
                        1 hour ago
                      </p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Settings */}
        <button className="rounded-lg p-2 transition-colors hover:bg-muted/50">
          <Settings className="h-5 w-5 text-muted-foreground" />
        </button>

        {/* Profile */}
        <div className="relative">
          <button
            className="flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-muted/50"
            onClick={() => setShowProfile(!showProfile)}
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-r from-cyan-500 to-blue-500">
              <span className="font-semibold text-sm text-white">
                {session?.user?.name?.charAt(0) || "U"}
              </span>
            </div>
            <div className="hidden text-left md:block">
              <p className="font-medium text-foreground text-sm">
                {session?.user?.name || "User"}
              </p>
              <p className="text-muted-foreground text-xs">
                {(session?.user as any)?.role
                  ?.toLowerCase()
                  .replace("_", " ") || "user"}
              </p>
            </div>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </button>
        </div>
      </div>
    </header>
  );
}
