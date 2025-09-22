"use client";

import { UserRole } from "@prisma/client";
import { Copy, Crown, Settings, Shield, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getRoleColor } from "@/lib/utils/roles";

const demoAccounts = [
  {
    role: UserRole.SUPER_ADMIN,
    email: "superadmin@wasteapp.com",
    password: "SuperAdmin123!",
    name: "Super Administrator",
    icon: Crown,
    description: "Full system access and user management",
    permissions: ["All permissions", "Manage all users", "System settings"],
  },
  {
    role: UserRole.ADMIN,
    email: "admin@wasteapp.com",
    password: "Admin123!",
    name: "System Administrator",
    icon: Settings,
    description: "System administration and user management",
    permissions: ["Manage users", "Campaigns", "Rewards", "Analytics"],
  },
  {
    role: UserRole.WASTE_MANAGER,
    email: "manager@wasteapp.com",
    password: "Manager123!",
    name: "Waste Operations Manager",
    icon: Shield,
    description: "Waste bin and disposal management",
    permissions: ["Manage bins", "Verify disposals", "Handle reports"],
  },
  {
    role: UserRole.USER,
    email: "user@wasteapp.com",
    password: "User123!",
    name: "Regular User",
    icon: User,
    description: "Standard user with disposal and reward features",
    permissions: ["Create disposals", "Redeem rewards", "Submit reports"],
  },
];

export function DemoAccounts() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  const loginWithDemo = (email: string, password: string) => {
    // Auto-fill the login form if it exists
    const emailInput = document.querySelector(
      'input[name="email"]'
    ) as HTMLInputElement;
    const passwordInput = document.querySelector(
      'input[name="password"]'
    ) as HTMLInputElement;

    if (emailInput && passwordInput) {
      emailInput.value = email;
      passwordInput.value = password;

      // Trigger change events
      emailInput.dispatchEvent(new Event("change", { bubbles: true }));
      passwordInput.dispatchEvent(new Event("change", { bubbles: true }));
    }
  };

  return (
    <Card className="mx-auto mt-8 w-full max-w-4xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Demo Accounts
        </CardTitle>
        <CardDescription>
          Use these demo accounts to test different user roles and permissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {demoAccounts.map((account) => {
            const Icon = account.icon;
            return (
              <Card
                className="border-2 transition-colors hover:border-primary/50"
                key={account.role}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <CardTitle className="text-lg">{account.name}</CardTitle>
                    </div>
                    <Badge className={getRoleColor(account.role)}>
                      {account.role.replace("_", " ")}
                    </Badge>
                  </div>
                  <CardDescription className="text-sm">
                    {account.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Email:</span>
                      <div className="flex items-center gap-1">
                        <code className="rounded bg-muted px-2 py-1 text-xs">
                          {account.email}
                        </code>
                        <Button
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(account.email)}
                          size="sm"
                          variant="ghost"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-medium text-sm">Password:</span>
                      <div className="flex items-center gap-1">
                        <code className="rounded bg-muted px-2 py-1 text-xs">
                          {account.password}
                        </code>
                        <Button
                          className="h-6 w-6 p-0"
                          onClick={() => copyToClipboard(account.password)}
                          size="sm"
                          variant="ghost"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="font-medium text-sm">Permissions:</span>
                    <div className="flex flex-wrap gap-1">
                      {account.permissions.map((permission) => (
                        <Badge
                          className="text-xs"
                          key={permission}
                          variant="secondary"
                        >
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    className="w-full"
                    onClick={() =>
                      loginWithDemo(account.email, account.password)
                    }
                    variant="outline"
                  >
                    Auto-fill Login Form
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="mt-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 text-yellow-600">⚠️</div>
            <div className="text-sm text-yellow-800">
              <strong>Development Only:</strong> These demo accounts are for
              development and testing purposes. In production, use proper user
              registration and strong passwords.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
