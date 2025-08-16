"use client";

import { useAuth } from "@/hooks/use-auth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { SuperAdminDashboard } from "@/components/dashboard/SuperAdminDashboard";
import { AdminDashboard } from "@/components/dashboard/AdminDashboard";
import { WasteManagerDashboard } from "@/components/dashboard/WasteManagerDashboard";
import { UserDashboard } from "@/components/dashboard/UserDashboard";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user && !user.role) {
      // Redirect users without roles to role selection
      router.push("/auth/select-role");
    }
  }, [user, loading, router]);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!user) {
    return <div>Access denied. Please sign in.</div>;
  }

  if (!user.role) {
    // Show loading while redirecting
    return <LoadingSpinner />;
  }

  const renderDashboardContent = () => {
    switch (user.role) {
      case "SUPERADMIN":
        return <SuperAdminDashboard user={user} />;
      case "ADMIN":
        return <AdminDashboard user={user} />;
      case "WASTE_MANAGER":
        return <WasteManagerDashboard user={user} />;
      case "USER":
        return <UserDashboard user={user} />;
      default:
        return <UserDashboard user={user} />;
    }
  };

  return <DashboardLayout>{renderDashboardContent()}</DashboardLayout>;
}
