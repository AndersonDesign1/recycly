"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { LoadingSpinner } from "../ui/loading-spinner";
import { Header } from "./Header";
import { NotificationPanel } from "./NotificationPanel";
import { Sidebar } from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <div>Access denied. Please sign in.</div>;
  }

  return (
    <div className="min-h-screen">
      <div className="flex h-screen bg-gray-50">
        {/* Sidebar */}
        <Sidebar
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
          user={user}
        />

        {/* Main Content */}
        <div className="flex flex-1 flex-col overflow-hidden">
          {/* Header */}
          <Header
            onMenuClick={() => setSidebarOpen(true)}
            onNotificationsClick={() => setNotificationsOpen(true)}
            user={user}
          />

          {/* Main Dashboard Content */}
          <main className="flex-1 overflow-y-auto overflow-x-hidden bg-gray-50">
            <div className="container mx-auto px-4 py-6">{children}</div>
          </main>
        </div>

        {/* Notification Panel */}
        <NotificationPanel
          isOpen={notificationsOpen}
          onClose={() => setNotificationsOpen(false)}
          user={user}
        />
      </div>
    </div>
  );
}
