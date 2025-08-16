"use client";

import { useState } from "react";
import {
  Users,
  MapPin,
  TrendingUp,
  DollarSign,
  Recycle,
  Shield,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
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

interface SuperAdminDashboardProps {
  user: User;
}

export function SuperAdminDashboard({ user }: SuperAdminDashboardProps) {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">(
    "7d"
  );

  // Mock data for SuperAdmin dashboard
  const stats = {
    totalUsers: 15420,
    activeUsers: 12850,
    totalLocations: 45,
    activeLocations: 42,
    totalRevenue: 1250000,
    monthlyGrowth: 12.5,
    wasteCollected: 1250, // tons
    environmentalImpact: 2500, // CO2 saved in tons
    systemHealth: 98.5,
    fraudAlerts: 3,
    pendingApprovals: 15,
  };

  const recentActivities = [
    {
      id: "1",
      type: "user_registration",
      message: "50 new users registered",
      timestamp: "2 hours ago",
      status: "completed",
    },
    {
      id: "2",
      type: "system_alert",
      message: "Database performance alert",
      timestamp: "1 hour ago",
      status: "warning",
    },
    {
      id: "3",
      type: "revenue_milestone",
      message: "Monthly revenue target achieved",
      timestamp: "30 minutes ago",
      status: "success",
    },
    {
      id: "4",
      type: "fraud_detection",
      message: "Suspicious activity detected in Region 3",
      timestamp: "15 minutes ago",
      status: "alert",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "user_registration":
        return <Users className="w-4 h-4" />;
      case "system_alert":
        return <AlertTriangle className="w-4 h-4" />;
      case "revenue_milestone":
        return <DollarSign className="w-4 h-4" />;
      case "fraud_detection":
        return <Shield className="w-4 h-4" />;
      default:
        return <Activity className="w-4 h-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case "success":
        return "text-green-600 bg-green-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "alert":
        return "text-red-600 bg-red-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            Super Admin Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Global system overview and master controls
          </p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="sm">
            Export Data
          </Button>
          <Button variant="outline" size="sm">
            Generate Report
          </Button>
          <Button className="bg-forest-green-600 hover:bg-forest-green-700">
            System Settings
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
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ${(stats.totalRevenue / 1000000).toFixed(1)}M
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
              Waste Collected
            </CardTitle>
            <Recycle className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.wasteCollected.toLocaleString()} tons
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <span className="text-green-600">+8.2%</span> from last month
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">System Health</CardTitle>
            <Activity className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {stats.systemHealth}%
            </div>
            <p className="text-xs text-gray-600 mt-1">
              <span className="text-green-600">Optimal</span> performance
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Environmental Impact & Financial Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
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

        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-forest-green-600" />
              <span>Financial Overview</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-forest-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Monthly Revenue
              </span>
              <span className="text-lg font-bold text-forest-green-600">
                ${(stats.totalRevenue / 12).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-sage-green-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Commission Paid
              </span>
              <span className="text-lg font-bold text-sage-green-600">
                ${(stats.totalRevenue * 0.15).toLocaleString()}
              </span>
            </div>
            <div className="flex items-center justify-between p-3 bg-ocean-blue-50 rounded-lg">
              <span className="text-sm font-medium text-gray-700">
                Net Profit
              </span>
              <span className="text-lg font-bold text-ocean-blue-600">
                ${(stats.totalRevenue * 0.25).toLocaleString()}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts & Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-forest-green-600" />
              <span>System Alerts</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between p-3 bg-red-50 border border-red-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <AlertTriangle className="h-4 w-4 text-red-600" />
                <span className="text-sm font-medium text-red-800">
                  Fraud Detection
                </span>
              </div>
              <Badge className="bg-red-600 text-white">
                {stats.fraudAlerts} alerts
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Clock className="h-4 w-4 text-yellow-600" />
                <span className="text-sm font-medium text-yellow-800">
                  Pending Approvals
                </span>
              </div>
              <Badge className="bg-yellow-600 text-white">
                {stats.pendingApprovals} pending
              </Badge>
            </div>
            <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-800">
                  System Status
                </span>
              </div>
              <Badge className="bg-green-600 text-white">Optimal</Badge>
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
              <span className="text-sm">User Management</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <MapPin className="h-6 w-6" />
              <span className="text-sm">Location Management</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <TrendingUp className="h-6 w-6" />
              <span className="text-sm">Revenue Analytics</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2">
              <Shield className="h-6 w-6" />
              <span className="text-sm">System Health</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
