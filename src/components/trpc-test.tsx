"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { trpc } from "@/lib/trpc/client";

export function TRPCTest() {
  const { data: user, isLoading, error } = trpc.user.me.useQuery();
  const { data: categories } = trpc.waste.getCategories.useQuery();
  const { data: rewards } = trpc.reward.getRewardCategories.useQuery();

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Testing tRPC</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Testing tRPC</CardTitle>
          <CardDescription>Error: {error.message}</CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>tRPC Connection Test</CardTitle>
          <CardDescription>Testing the tRPC setup</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            <p>
              <strong>User:</strong> {user?.name || "Not authenticated"}
            </p>
            <p>
              <strong>Email:</strong> {user?.email || "N/A"}
            </p>
            <p>
              <strong>Role:</strong> {user?.role || "N/A"}
            </p>
            <p>
              <strong>Points:</strong> {user?.points || 0}
            </p>
            <p>
              <strong>Level:</strong> {user?.level || 1}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Waste Categories</CardTitle>
          <CardDescription>Available waste categories</CardDescription>
        </CardHeader>
        <CardContent>
          {categories && categories.length > 0 ? (
            <div className="space-y-2">
              {categories.map((category) => (
                <div className="flex justify-between" key={category.id}>
                  <span>{category.name}</span>
                  <span className="text-gray-500 text-sm">
                    {category.pointsPerUnit} pts/unit
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No waste categories found</p>
          )}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Reward Categories</CardTitle>
          <CardDescription>Available reward categories</CardDescription>
        </CardHeader>
        <CardContent>
          {rewards && rewards.length > 0 ? (
            <div className="space-y-2">
              {rewards.map((reward) => (
                <div className="flex justify-between" key={reward.id}>
                  <span>{reward.name}</span>
                  <span className="text-gray-500 text-sm">
                    {reward.description || "No description"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500">No reward categories found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
