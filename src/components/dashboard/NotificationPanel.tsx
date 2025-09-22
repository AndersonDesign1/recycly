"use client";

import { AlertCircle, Bell, CheckCircle, Clock, Info, X } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  points: number;
  level: number;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  timestamp: Date;
  read: boolean;
  actionUrl?: string;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

// Mock notifications based on user role
const getMockNotifications = (role: string): Notification[] => {
  const baseNotifications: Notification[] = [
    {
      id: "1",
      title: "Welcome to Recycly!",
      message: "Thank you for joining our recycling platform.",
      type: "success",
      timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
      read: false,
    },
  ];

  switch (role) {
    case "SUPERADMIN":
      return [
        ...baseNotifications,
        {
          id: "2",
          title: "System Health Alert",
          message: "Database performance is below optimal levels.",
          type: "warning",
          timestamp: new Date(Date.now() - 1000 * 60 * 30), // 30 minutes ago
          read: false,
          actionUrl: "/dashboard/system",
        },
        {
          id: "3",
          title: "New User Registration",
          message: "50 new users registered in the last 24 hours.",
          type: "info",
          timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 minutes ago
          read: false,
          actionUrl: "/dashboard/users",
        },
        {
          id: "4",
          title: "Revenue Milestone",
          message: "Monthly revenue target achieved!",
          type: "success",
          timestamp: new Date(Date.now() - 1000 * 60 * 5), // 5 minutes ago
          read: false,
          actionUrl: "/dashboard/revenue",
        },
      ];
    case "ADMIN":
      return [
        ...baseNotifications,
        {
          id: "2",
          title: "Collection Target Update",
          message: "Weekly collection target is 85% complete.",
          type: "info",
          timestamp: new Date(Date.now() - 1000 * 60 * 45), // 45 minutes ago
          read: false,
          actionUrl: "/dashboard/targets",
        },
        {
          id: "3",
          title: "New Waste Manager",
          message: "John Doe has been assigned to your region.",
          type: "info",
          timestamp: new Date(Date.now() - 1000 * 60 * 20), // 20 minutes ago
          read: false,
          actionUrl: "/dashboard/waste-managers",
        },
      ];
    case "WASTE_MANAGER":
      return [
        ...baseNotifications,
        {
          id: "2",
          title: "Bin Capacity Alert",
          message: "3 bins in your area are at 90% capacity.",
          type: "warning",
          timestamp: new Date(Date.now() - 1000 * 60 * 35), // 35 minutes ago
          read: false,
          actionUrl: "/dashboard/bins",
        },
        {
          id: "3",
          title: "Vehicle Maintenance",
          message: "Collection vehicle #3 requires maintenance.",
          type: "warning",
          timestamp: new Date(Date.now() - 1000 * 60 * 10), // 10 minutes ago
          read: false,
          actionUrl: "/dashboard/vehicles",
        },
      ];
    case "USER":
      return [
        ...baseNotifications,
        {
          id: "2",
          title: "Points Earned!",
          message: "You earned 150 points for your last recycling deposit.",
          type: "success",
          timestamp: new Date(Date.now() - 1000 * 60 * 25), // 25 minutes ago
          read: false,
          actionUrl: "/dashboard/stats",
        },
        {
          id: "3",
          title: "Level Up!",
          message: "Congratulations! You've reached Level 3.",
          type: "success",
          timestamp: new Date(Date.now() - 1000 * 60 * 8), // 8 minutes ago
          read: false,
          actionUrl: "/dashboard/achievements",
        },
        {
          id: "4",
          title: "New Achievement Unlocked",
          message: "You've unlocked the 'Eco Warrior' badge!",
          type: "success",
          timestamp: new Date(Date.now() - 1000 * 60 * 2), // 2 minutes ago
          read: false,
          actionUrl: "/dashboard/achievements",
        },
      ];
    default:
      return baseNotifications;
  }
};

export function NotificationPanel({
  isOpen,
  onClose,
  user,
}: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  useEffect(() => {
    if (isOpen) {
      setNotifications(getMockNotifications(user.role));
    }
  }, [isOpen, user.role]);

  const markAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((notif) => (notif.id === id ? { ...notif, read: true } : notif))
    );
  };

  const markAllAsRead = () => {
    setNotifications((prev) => prev.map((notif) => ({ ...notif, read: true })));
  };

  const getNotificationIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "warning":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case "info":
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getNotificationColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "border-green-200 bg-green-50";
      case "warning":
        return "border-yellow-200 bg-yellow-50";
      case "error":
        return "border-red-200 bg-red-50";
      case "info":
      default:
        return "border-blue-200 bg-blue-50";
    }
  };

  const filteredNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.read)
      : notifications;

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-40 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 z-50 h-full w-96 transform bg-white shadow-xl transition-transform duration-300 ease-in-out">
        {/* Header */}
        <div className="flex items-center justify-between border-gray-200 border-b p-4">
          <div className="flex items-center space-x-2">
            <Bell className="h-5 w-5 text-forest-green-600" />
            <h2 className="font-semibold text-gray-900 text-lg">
              Notifications
            </h2>
            {unreadCount > 0 && (
              <Badge className="bg-forest-green-600 text-white">
                {unreadCount}
              </Badge>
            )}
          </div>
          <Button onClick={onClose} size="sm" variant="ghost">
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Tabs */}
        <div className="flex border-gray-200 border-b">
          <button
            className={`flex-1 px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "all"
                ? "border-forest-green-600 border-b-2 text-forest-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("all")}
          >
            All ({notifications.length})
          </button>
          <button
            className={`flex-1 px-4 py-2 font-medium text-sm transition-colors ${
              activeTab === "unread"
                ? "border-forest-green-600 border-b-2 text-forest-green-600"
                : "text-gray-500 hover:text-gray-700"
            }`}
            onClick={() => setActiveTab("unread")}
          >
            Unread ({unreadCount})
          </button>
        </div>

        {/* Actions */}
        {unreadCount > 0 && (
          <div className="border-gray-200 border-b p-4">
            <Button
              className="w-full"
              onClick={markAllAsRead}
              size="sm"
              variant="outline"
            >
              Mark all as read
            </Button>
          </div>
        )}

        {/* Notifications List */}
        <div className="flex-1 space-y-3 overflow-y-auto p-4">
          {filteredNotifications.length === 0 ? (
            <div className="py-8 text-center">
              <Bell className="mx-auto mb-3 h-12 w-12 text-gray-400" />
              <p className="text-gray-500">
                {activeTab === "unread"
                  ? "No unread notifications"
                  : "No notifications"}
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <Card
                className={`cursor-pointer transition-all hover:shadow-md ${
                  notification.read ? "opacity-75" : ""
                } ${getNotificationColor(notification.type)}`}
                key={notification.id}
                onClick={() => {
                  markAsRead(notification.id);
                  if (notification.actionUrl) {
                    window.location.href = notification.actionUrl;
                  }
                }}
              >
                <CardContent className="p-3">
                  <div className="flex items-start space-x-3">
                    {getNotificationIcon(notification.type)}
                    <div className="min-w-0 flex-1">
                      <h4 className="mb-1 font-medium text-gray-900 text-sm">
                        {notification.title}
                      </h4>
                      <p className="mb-2 text-gray-600 text-xs">
                        {notification.message}
                      </p>
                      <div className="flex items-center space-x-2 text-gray-500 text-xs">
                        <Clock className="h-3 w-3" />
                        <span>
                          {notification.timestamp.toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </span>
                        {!notification.read && (
                          <Badge className="bg-forest-green-600 px-1 py-0 text-white text-xs">
                            New
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </>
  );
}
