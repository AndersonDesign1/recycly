"use client"

import { motion } from "framer-motion"
import { Home, BarChart3, Recycle, MapPin, Phone, Settings, LogOut } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"
import { signOut, useSession } from "@/src/lib/auth-client"
import { cn } from "@/lib/utils"

const sidebarItems = [
  {
    id: "dashboard",
    icon: <Home className="w-5 h-5" />,
    href: "/dashboard",
  },
  {
    id: "grid",
    icon: <BarChart3 className="w-5 h-5" />,
    href: "/analytics",
  },
  {
    id: "recycle",
    icon: <Recycle className="w-5 h-5" />,
    href: "/scan",
  },
  {
    id: "location",
    icon: <MapPin className="w-5 h-5" />,
    href: "/bins",
  },
  {
    id: "phone",
    icon: <Phone className="w-5 h-5" />,
    href: "/support",
  },
  {
    id: "settings",
    icon: <Settings className="w-5 h-5" />,
    href: "/settings",
  },
]

export function CleanSidebar() {
  const { data: session } = useSession()
  const router = useRouter()
  const pathname = usePathname()

  const handleSignOut = async () => {
    await signOut()
    router.push("/")
  }

  return (
    <div className="fixed left-0 top-0 h-full w-20 bg-forest-green-500 flex flex-col items-center py-6 z-50 rounded-r-3xl">
      {/* Logo */}
      <div className="w-12 h-12 bg-clean-white rounded-full flex items-center justify-center mb-8">
        <div className="w-3 h-3 bg-forest-green-500 rounded-full" />
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 flex flex-col space-y-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href

          return (
            <motion.button
              key={item.id}
              onClick={() => router.push(item.href)}
              className={cn("sidebar-item", isActive && "active")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {item.icon}
            </motion.button>
          )
        })}
      </nav>

      {/* User Profile */}
      <div className="mt-auto space-y-4">
        <button onClick={handleSignOut} className="sidebar-item text-white/70 hover:text-white hover:bg-white/10">
          <LogOut className="w-5 h-5" />
        </button>

        <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white/20">
          {session?.user?.image ? (
            <img
              src={session.user.image || "/placeholder.svg"}
              alt={session.user.name || "User"}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-white/20 flex items-center justify-center">
              <span className="text-white font-semibold text-sm">{session?.user?.name?.charAt(0) || "U"}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
