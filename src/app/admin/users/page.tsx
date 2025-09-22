"use client";

import { useCallback, useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type User = {
  id: string;
  email: string;
  name: string;
  emailVerified: boolean;
  createdAt: string;
  role: string;
  isActive: boolean;
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/admin/users");
      const data = await response.json();

      if (data.success) {
        setUsers(data.users);
      } else {
        setError(data.error || "Failed to fetch users");
      }
    } catch (_err) {
      setError("Failed to fetch users");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const [pendingDelete, setPendingDelete] = useState<{
    id: string;
    email: string;
  } | null>(null);
  const [toast, setToast] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const confirmDeleteUser = (userId: string, email: string) => {
    setPendingDelete({ id: userId, email });
  };

  const performDelete = async () => {
    if (!pendingDelete) {
      return;
    }
    try {
      const response = await fetch(
        `/api/admin/users?userId=${pendingDelete.id}`,
        {
          method: "DELETE",
        }
      );
      const data = await response.json();
      if (data.success) {
        setToast({
          type: "success",
          message: `User ${pendingDelete.email} deleted`,
        });
        setPendingDelete(null);
        fetchUsers();
      } else {
        setToast({ type: "error", message: `Failed: ${data.error}` });
      }
    } catch (_err) {
      setToast({ type: "error", message: "Failed to delete user" });
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="mb-6 font-bold text-2xl">Loading users...</h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <h1 className="mb-6 font-bold text-2xl">Error</h1>
        <p className="text-red-600">{error}</p>
        <Button className="mt-4" onClick={fetchUsers}>
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-bold text-3xl">Registered Users</h1>
        <Button onClick={fetchUsers}>Refresh</Button>
      </div>

      <div className="grid gap-4">
        {users.map((user) => (
          <Card key={user.id}>
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-lg">{user.name}</CardTitle>
                  <p className="text-gray-600">{user.email}</p>
                </div>
                <div className="flex gap-2">
                  <Badge variant={user.emailVerified ? "default" : "secondary"}>
                    {user.emailVerified ? "Verified" : "Unverified"}
                  </Badge>
                  <Badge variant={user.isActive ? "default" : "destructive"}>
                    {user.isActive ? "Active" : "Inactive"}
                  </Badge>
                  <Badge variant="outline">{user.role}</Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-gray-500 text-sm">
                  Created: {new Date(user.createdAt).toLocaleDateString()}
                </div>
                <Button
                  onClick={() => confirmDeleteUser(user.id, user.email)}
                  size="sm"
                  variant="destructive"
                >
                  Delete User
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {users.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center">
            <p className="text-gray-500">No users found</p>
          </CardContent>
        </Card>
      )}

      <div className="mt-6 text-gray-500 text-sm">
        Total Users: {users.length}
      </div>
      {/* Simple inline confirm modal */}
      {pendingDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-md rounded-lg bg-white p-6 shadow-xl">
            <h2 className="mb-2 font-semibold text-xl">Confirm deletion</h2>
            <p className="mb-6 text-gray-600">
              Are you sure you want to delete {pendingDelete.email}?
            </p>
            <div className="flex justify-end gap-3">
              <Button
                onClick={() => setPendingDelete(null)}
                variant="secondary"
              >
                Cancel
              </Button>
              <Button onClick={performDelete} variant="destructive">
                Delete
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="fixed right-4 bottom-4 z-50 rounded bg-gray-900 px-4 py-2 text-sm text-white shadow">
          {toast.message}
        </div>
      )}
    </div>
  );
}
