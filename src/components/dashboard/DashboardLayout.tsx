"use client";

import { useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { NotificationPanel } from "./NotificationPanel";
import { LoadingSpinner } from "../ui/loading-spinner";

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
          user={user}
          isOpen={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <Header
            user={user}
            onMenuClick={() => setSidebarOpen(true)}
            onNotificationsClick={() => setNotificationsOpen(true)}
          />

          {/* Main Dashboard Content */}
          <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50">
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
