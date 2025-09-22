"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session, User } from "@/lib/auth";

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("/api/auth/session");
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
          setSession(data.session);

          // Check if user needs to select a role
          if (data.user && !data.user.role) {
            // Don't redirect here, let the component handle it
            // This prevents infinite redirects
          }
        }
      } catch (error) {
        console.error("Auth check failed:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const signOut = async () => {
    try {
      await fetch("/api/auth/sign-out", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });
      setUser(null);
      setSession(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Sign out failed:", error);
    }
  };

  const updateUserRole = async (role: string) => {
    try {
      const response = await fetch("/api/auth/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        return { success: true, user: data.user };
      }
      const errorData = await response.json();
      return { success: false, error: errorData.error };
    } catch (error) {
      return { success: false, error: "Failed to update role" };
    }
  };

  const hasRole = user?.role && user.role !== "USER";

  return {
    user,
    session,
    loading,
    signOut,
    updateUserRole,
    isAuthenticated: !!user,
    hasRole,
  };
}
