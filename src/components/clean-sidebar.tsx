"use client";

import { motion } from "framer-motion";
import {
  BarChart3,
  Home,
  LogOut,
  MapPin,
  Phone,
  Recycle,
  Settings,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { signOut, useSession } from "@/src/lib/auth-client";

const sidebarItems = [
  {
    id: "dashboard",
    icon: <Home className="h-5 w-5" />,
    href: "/dashboard",
  },
  {
    id: "grid",
    icon: <BarChart3 className="h-5 w-5" />,
    href: "/analytics",
  },
  {
    id: "recycle",
    icon: <Recycle className="h-5 w-5" />,
    href: "/scan",
  },
  {
    id: "location",
    icon: <MapPin className="h-5 w-5" />,
    href: "/bins",
  },
  {
    id: "phone",
    icon: <Phone className="h-5 w-5" />,
    href: "/support",
  },
  {
    id: "settings",
    icon: <Settings className="h-5 w-5" />,
    href: "/settings",
  },
];

export function CleanSidebar() {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();

  const handleSignOut = async () => {
    await signOut();
    router.push("/");
  };

  return (
    <div className="fixed top-0 left-0 z-50 flex h-full w-20 flex-col items-center rounded-r-3xl bg-forest-green-500 py-6">
      {/* Logo */}
      <div className="mb-8 flex h-12 w-12 items-center justify-center rounded-full bg-clean-white">
        <div className="h-3 w-3 rounded-full bg-forest-green-500" />
      </div>

      {/* Navigation Items */}
      <nav className="flex flex-1 flex-col space-y-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;

          return (
            <motion.button
              className={cn("sidebar-item", isActive && "active")}
              key={item.id}
              onClick={() => router.push(item.href)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.icon}
            </motion.button>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="mt-auto space-y-4">
        <button
          className="sidebar-item text-white/70 hover:bg-white/10 hover:text-white"
          onClick={handleSignOut}
        >
          <LogOut className="h-5 w-5" />
        </button>

        <div className="h-12 w-12 overflow-hidden rounded-full border-2 border-white/20">
          {session?.user?.image ? (
            <img
              alt={session.user.name || "User"}
              className="h-full w-full object-cover"
              src={session.user.image || "/placeholder.svg"}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center bg-white/20">
              <span className="font-semibold text-sm text-white">
                {session?.user?.name?.charAt(0) || "U"}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
