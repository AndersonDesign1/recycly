"use client";

import {
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  MapPin,
  Recycle,
  Shield,
  Target,
  Truck,
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

interface WasteManagerDashboardProps {
  user: User;
}

export function WasteManagerDashboard({ user }: WasteManagerDashboardProps) {
  const [timeRange, setTimeRange] = useState<"24h" | "7d" | "30d" | "90d">(
    "7d"
  );

  // Mock data for Waste Manager dashboard
  const stats = {
    totalUsers: 450,
    activeUsers: 380,
    wasteCollected: 45, // tons
    collectionTarget: 60, // tons
    environmentalImpact: 90, // CO2 saved in tons
    pendingVerifications: 12,
    activeVehicles: 3,
    totalVehicles: 4,
    binCapacityAlerts: 5,
    qualityScore: 94.5,
  };

  const collectionRoutes = [
    {
      id: "1",
      name: "North Route",
      status: "active",
      progress: 75,
      bins: 8,
      vehicle: "Truck #1",
    },
    {
      id: "2",
      name: "South Route",
      status: "completed",
      progress: 100,
      bins: 6,
      vehicle: "Truck #2",
    },
    {
      id: "3",
      name: "East Route",
      status: "pending",
      progress: 0,
      bins: 7,
      vehicle: "Truck #3",
    },
    {
      id: "4",
      name: "West Route",
      status: "active",
      progress: 45,
      bins: 9,
      vehicle: "Truck #1",
    },
  ];

  const recentActivities = [
    {
      id: "1",
      type: "collection_completed",
      message: "North Route collection completed",
      timestamp: "1 hour ago",
      status: "completed",
    },
    {
      id: "2",
      type: "bin_alert",
      message: "3 bins at 90% capacity",
      timestamp: "30 minutes ago",
      status: "warning",
    },
    {
      id: "3",
      type: "verification_required",
      message: "5 waste deposits need verification",
      timestamp: "15 minutes ago",
      status: "pending",
    },
    {
      id: "4",
      type: "vehicle_maintenance",
      message: "Truck #2 requires maintenance",
      timestamp: "10 minutes ago",
      status: "alert",
    },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "collection_completed":
        return <CheckCircle className="h-4 w-4" />;
      case "bin_alert":
        return <AlertTriangle className="h-4 w-4" />;
      case "verification_required":
        return <Shield className="h-4 w-4" />;
      case "vehicle_maintenance":
        return <Truck className="h-4 w-4" />;
      default:
        return <Activity className="h-4 w-4" />;
    }
  };

  const getActivityColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "warning":
        return "text-yellow-600 bg-yellow-100";
      case "alert":
        return "text-red-600 bg-red-100";
      default:
        return "text-blue-600 bg-blue-100";
    }
  };

  const getRouteStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-blue-600 bg-blue-100";
      case "completed":
        return "text-green-600 bg-green-100";
      case "pending":
        return "text-gray-600 bg-gray-100";
      default:
        return "text-yellow-600 bg-yellow-100";
    }
  };

  const collectionProgress =
    (stats.wasteCollected / stats.collectionTarget) * 100;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-bold text-3xl text-gray-900">
            Waste Manager Dashboard
          </h1>
          <p className="mt-2 text-gray-600">
            Monitor collections and manage operations
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
            Start Collection
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
            <CardTitle className="font-medium text-sm">
              Waste Collected
            </CardTitle>
            <Recycle className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-gray-900">
              {stats.wasteCollected} tons
            </div>
            <p className="mt-1 text-gray-600 text-xs">
              <span className="text-green-600">
                {Math.round(collectionProgress)}%
              </span>{" "}
              of target
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Active Vehicles
            </CardTitle>
            <Truck className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-gray-900">
              {stats.activeVehicles}/{stats.totalVehicles}
            </div>
            <p className="mt-1 text-gray-600 text-xs">
              <span className="text-green-600">Operational</span> vehicles
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">
              Pending Verifications
            </CardTitle>
            <Shield className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-gray-900">
              {stats.pendingVerifications}
            </div>
            <p className="mt-1 text-gray-600 text-xs">
              <span className="text-yellow-600">Requires</span> attention
            </p>
          </CardContent>
        </Card>

        <Card className="dashboard-card">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="font-medium text-sm">Quality Score</CardTitle>
            <Target className="h-4 w-4 text-forest-green-600" />
          </CardHeader>
          <CardContent>
            <div className="font-bold text-2xl text-gray-900">
              {stats.qualityScore}%
            </div>
            <p className="mt-1 text-gray-600 text-xs">
              <span className="text-green-600">Excellent</span> quality
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Collection Routes & Environmental Impact */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <MapPin className="h-5 w-5 text-forest-green-600" />
              <span>Collection Routes</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {collectionRoutes.map((route) => (
              <div className="space-y-2" key={route.id}>
                <div className="flex items-center justify-between">
                  <span className="font-medium text-gray-700 text-sm">
                    {route.name}
                  </span>
                  <Badge className={getRouteStatusColor(route.status)}>
                    {route.status}
                  </Badge>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">
                    {route.bins} bins • {route.vehicle}
                  </span>
                  <span className="font-medium text-forest-green-600">
                    {route.progress}%
                  </span>
                </div>
                <div className="h-2 w-full rounded-full bg-gray-200">
                  <div
                    className={`h-2 rounded-full ${
                      route.status === "completed"
                        ? "bg-forest-green-600"
                        : route.status === "active"
                          ? "bg-blue-500"
                          : "bg-gray-400"
                    }`}
                    style={{ width: `${route.progress}%` }}
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

      {/* Collection Progress & Recent Activity */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Card className="dashboard-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Target className="h-5 w-5 text-forest-green-600" />
              <span>Collection Progress</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg bg-forest-green-50 p-3">
              <span className="font-medium text-gray-700 text-sm">
                Monthly Progress
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
            {stats.binCapacityAlerts > 0 && (
              <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-3">
                <div className="flex items-center space-x-2">
                  <AlertTriangle className="h-4 w-4 text-yellow-600" />
                  <span className="font-medium text-sm text-yellow-800">
                    {stats.binCapacityAlerts} bins need attention
                  </span>
                </div>
              </div>
            )}
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
              <Truck className="h-6 w-6" />
              <span className="text-sm">Start Route</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <Shield className="h-6 w-6" />
              <span className="text-sm">Verify Deposits</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <MapPin className="h-6 w-6" />
              <span className="text-sm">Check Bins</span>
            </Button>
            <Button className="h-20 flex-col space-y-2" variant="outline">
              <Users className="h-6 w-6" />
              <span className="text-sm">Manage Staff</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
