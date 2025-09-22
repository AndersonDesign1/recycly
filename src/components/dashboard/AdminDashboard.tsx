"use client";

import {
  AlertTriangle,
  CheckCircle,
  Clock,
  DollarSign,
  MapPin,
  Recycle,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";
import { useState } from "react";
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

interface AdminDashboardProps {
  user: User;
}

export function AdminDashboard({ user }: AdminDashboardProps) {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">(
    "7d"
  );

  // Mock data for Admin dashboard
  const stats = {
    totalUsers: 2840,
    activeUsers: 2150,
    wasteManagers: 12,
    activeWasteManagers: 11,
    monthlyRevenue: 125_000,
    monthlyGrowth: 8.5,
    wasteCollected: 280, // tons
    collectionTarget: 350, // tons
    environmentalImpact: 560, // CO2 saved in tons
    pendingApprovals: 8,
    activePartnerships: 15,
  };

  const collectionTargets = [
    { period: "Daily", target: 12, achieved: 10.5, status: "on-track" },
    { period: "Weekly", target: 84, achieved: 78, status: "on-track" },
    { period: "Monthly", target: 350, achieved: 280, status: "behind" },
  ];

  const recentActivities = [
    {
      id: "1",
      type: "user_registration",
      message: "15 new users registered this week",
      timestamp: "2 hours ago",
      status: "completed",
    },
    {
      id: "2",
      type: "collection_update",
      message: "Weekly collection target is 85% complete",
      timestamp: "1 hour ago",
      status: "info",
    },
    {
      id: "3",
      type: "waste_manager",
      message: "John Doe assigned to North Region",
      timestamp: "30 minutes ago",
      status: "completed",
    },
    {
      id: "4",
      type: "approval_required",
      message: "High-value transaction requires approval",
      timestamp: "15 minutes ago",
      status: "pending",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registration":
        return <Users className="h-4 w-4" />;
      case "collection_update":
        return <Recycle className="h-4 w-4" />;
      case "waste_manager":
        return <Users className="h-4 w-4" />;
      case "approval_required":
        return <Clock className="h-4 w-4" />;
      default:
        return <TrendingUp className="h-4 w-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "info":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getTargetStatusColor = (status: string) => {
    switch (status) {
      case "on-track":
        return "text-green-600 bg-green-100";
      case "behind":
        return "text-red-600 bg-red-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  const collectionProgress = (stats.achieved / stats.target) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-gray-900">
            Regional Admin Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Manage your region and track performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button size="sm" variant="outline">
            Export Report
          </Button>
          <Button size="sm" variant="outline">
            Manage Staff
          </Button>
          <Button className="bg-forest-green-600 hover:bg-forest-green-700">
            Regional Settings
          </Button>
        </div>
      </div>

      {/* Time Range Selector */}
      <div className="flex items-center space-x-2">
        {(["24h", "7d", "30d", "90d"] as const).map((range) => (
          <Button
            className={
              timeRange === range
                ? "bg-forest-green-600 hover:bg-forest-green-700"
                : ""
            }
            key={range}
            onClick={() => setTimeRange(range)}
            size="sm"
            variant={timeRange === range ? "default" : "outline"}
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Total Users</CardTitle>
            <Users className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-gray-900">
              {stats.totalUsers.toLocaleString()}
            </div>
            <p className="mt-1 text-gray-600 text-xs">
              <span className="text-green-600">+{stats.monthlyGrowth}%</span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-gray-900">
              ${(stats.monthlyRevenue / 1000).toFixed(0)}K
            </div>
            <p className="mt-1 text-gray-600 text-xs">
              <span className="text-green-600">+{stats.monthlyGrowth}%</span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Waste Managers
            </CardTitle>
            <Users className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-gray-900">
              {stats.activeWasteManagers}/{stats.wasteManagers}
            </div>
            <p className="mt-1 text-gray-600 text-xs">
              <span className="text-green-600">Active</span> managers
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Pending Approvals
            </CardTitle>
            <Clock className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-gray-900">
              {stats.pendingApprovals}
            </div>
            <p className="mt-1 text-gray-600 text-xs">
              <span className="text-yellow-600">Requires</span> attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Collection Targets & Performance */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-forest-green-600" />
              <span>Collection Targets</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {collectionTargets.map((target, index) => (
              <div className="space-y-2" key={index}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 text-sm">
                    {target.period}
                  </span>
                  <Badge className={getTargetStatusColor(target.status)}>
                    {target.status === "on-track" ? "On Track" : "Behind"}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {target.achieved} / {target.target} tons
                  </span>
                  <span className="font-medium text-forest-green-600">
                    {Math.round((target.achieved / target.target) * 100)}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full ${
                      target.status === "on-track"
                        ? "bg-forest-green-600"
                        : "bg-red-500"
                    }`}
                    style={{
                      width: `${Math.min(
                        (target.achieved / target.target) * 100,
                        100
                      )}%`,
                    }}
                  />
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Recycle className="h-5 w-5 text-forest-green-600" />
              <span>Environmental Impact</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-forest-green-50 p-3">
              <span className="font-medium text-gray-700 text-sm">
                CO2 Saved
              </span>
              <span className="font-bold text-forest-green-600 text-lg">
                {stats.environmentalImpact.toLocaleString()} tons
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-sage-green-50 p-3">
              <span className="font-medium text-gray-700 text-sm">
                Trees Equivalent
              </span>
              <span className="font-bold text-lg text-sage-green-600">
                {Math.round(stats.environmentalImpact * 50).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-ocean-blue-50 p-3">
              <span className="font-medium text-gray-700 text-sm">
                Energy Saved
              </span>
              <span className="font-bold text-lg text-ocean-blue-600">
                {Math.round(stats.environmentalImpact * 2.5).toLocaleString()}{" "}
                MWh
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Performance & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-forest-green-600" />
              <span>Regional Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-forest-green-50 p-3">
              <span className="font-medium text-gray-700 text-sm">
                Collection Progress
              </span>
              <span className="font-bold text-forest-green-600 text-lg">
                {Math.round(collectionProgress)}%
              </span>
            </div>
            <div className="h-3 w-full rounded-full bg-gray-200">
              <div
                className="h-3 rounded-full bg-forest-green-600 transition-all duration-300"
                style={{ width: `${collectionProgress}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="rounded-lg bg-sage-green-50 p-3">
                <div className="font-bold text-2xl text-sage-green-600">
                  {stats.wasteCollected}
                </div>
                <div className="text-gray-600 text-xs">Tons Collected</div>
              </div>
              <div className="rounded-lg bg-ocean-blue-50 p-3">
                <div className="font-bold text-2xl text-ocean-blue-600">
                  {stats.collectionTarget}
                </div>
                <div className="text-gray-600 text-xs">Monthly Target</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Activity className="h-5 w-5 text-forest-green-600" />
              <span>Recent Activity</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {recentActivities.map((activity) => (
              <div
                className="flex items-center space-x-3 rounded-lg p-2 transition-colors hover:bg-gray-50"
                key={activity.id}
              >
                <div
                  className={`rounded-full p-2 ${getActivityColor(
                    activity.status
                  )}`}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {activity.message}
                  </p>
                  <p className="text-gray-500 text-xs">{activity.timestamp}</p>
                </div>
                <Badge
                  className={getActivityColor(activity.status)}
                  variant="outline"
                >
                  {activity.status}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="dashboard-card">
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <Users className="h-6 w-6" />
              <span className="text-sm">Manage Users</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <MapPin className="h-6 w-6" />
              <span className="text-sm">View Locations</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <Target className="h-6 w-6" />
              <span className="text-sm">Set Targets</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <CheckCircle className="h-6 w-6" />
              <span className="text-sm">Approve Transactions</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
