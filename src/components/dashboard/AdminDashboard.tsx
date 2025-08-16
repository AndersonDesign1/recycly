"use client";

import { useState } from "react";
import {
  Users,
  MapPin,
  TrendingUp,
  DollarSign,
  Recycle,
  Target,
  CheckCircle,
  Clock,
  AlertTriangle,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";

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
    monthlyRevenue: 125000,
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
        return <Users className="w-4 h-4" />;
      case "collection_update":
        return <Recycle className="w-4 h-4" />;
      case "waste_manager":
        return <Users className="w-4 h-4" />;
      case "approval_required":
        return <Clock className="w-4 h-4" />;
      default:
        return <TrendingUp className="w-4 h-4" />;
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
          <h1 className="text-3xl font-bold text-gray-900">
            Regional Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your region and track performance metrics
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Export Report
          </Button>
          <Button variant="outline" size="sm">
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
            key={range}
            variant={timeRange === range ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange(range)}
            className={
              timeRange === range
                ? "bg-forest-green-600 hover:bg-forest-green-700"
                : ""
            }
          >
            {range}
          </Button>
        ))}
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.totalUsers.toLocaleString()}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <span className="text-green-600">+{stats.monthlyGrowth}%</span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Monthly Revenue
            </CardTitle>
            <DollarSign className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ${(stats.monthlyRevenue / 1000).toFixed(0)}K
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <span className="text-green-600">+{stats.monthlyGrowth}%</span>{" "}
              from last month
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Waste Managers
            </CardTitle>
            <Users className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.activeWasteManagers}/{stats.wasteManagers}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <span className="text-green-600">Active</span> managers
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Pending Approvals
            </CardTitle>
            <Clock className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.pendingApprovals}
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <span className="text-yellow-600">Requires</span> attention
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Collection Targets & Performance */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-forest-green-600" />
              <span>Collection Targets</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {collectionTargets.map((target, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">
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
                <div className="w-full bg-gray-200 rounded-full h-2">
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
            <div className="flex items-center justify-between p-3 bg-forest-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                CO2 Saved
              </span>
              <span className="text-lg font-bold text-forest-green-600">
                {stats.environmentalImpact.toLocaleString()} tons
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-sage-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Trees Equivalent
              </span>
              <span className="text-lg font-bold text-sage-green-600">
                {Math.round(stats.environmentalImpact * 50).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-ocean-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Energy Saved
              </span>
              <span className="text-lg font-bold text-ocean-blue-600">
                {Math.round(stats.environmentalImpact * 2.5).toLocaleString()}{" "}
                MWh
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regional Performance & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-forest-green-600" />
              <span>Regional Performance</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-forest-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Collection Progress
              </span>
              <span className="text-lg font-bold text-forest-green-600">
                {Math.round(collectionProgress)}%
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div
                className="h-3 bg-forest-green-600 rounded-full transition-all duration-300"
                style={{ width: `${collectionProgress}%` }}
              />
            </div>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div className="p-3 bg-sage-green-50 rounded-lg">
                <div className="text-2xl font-bold text-sage-green-600">
                  {stats.wasteCollected}
                </div>
                <div className="text-xs text-gray-600">Tons Collected</div>
              </div>
              <div className="p-3 bg-ocean-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-ocean-blue-600">
                  {stats.collectionTarget}
                </div>
                <div className="text-xs text-gray-600">Monthly Target</div>
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
                key={activity.id}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div
                  className={`p-2 rounded-full ${getActivityColor(
                    activity.status
                  )}`}
                >
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">
                    {activity.message}
                  </p>
                  <p className="text-xs text-gray-500">{activity.timestamp}</p>
                </div>
                <Badge
                  variant="outline"
                  className={getActivityColor(activity.status)}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Users className="h-6 w-6" />
              <span className="text-sm">Manage Users</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <MapPin className="h-6 w-6" />
              <span className="text-sm">View Locations</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Target className="h-6 w-6" />
              <span className="text-sm">Set Targets</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <CheckCircle className="h-6 w-6" />
              <span className="text-sm">Approve Transactions</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
