"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Copy, User, Shield, Settings, Crown } from "lucide-react"
import { getRoleColor } from "@/lib/utils/roles"
import { UserRole } from "@prisma/client"

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
]

export function DemoAccounts() {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
  }

  const loginWithDemo = (email: string, password: string) => {
    // Auto-fill the login form if it exists
    const emailInput = document.querySelector('input[name="email"]') as HTMLInputElement
    const passwordInput = document.querySelector('input[name="password"]') as HTMLInputElement

    if (emailInput && passwordInput) {
      emailInput.value = email
      passwordInput.value = password

      // Trigger change events
      emailInput.dispatchEvent(new Event("change", { bubbles: true }))
      passwordInput.dispatchEvent(new Event("change", { bubbles: true }))
    }
  }

  return (
    <Card className="w-full max-w-4xl mx-auto mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Settings className="h-5 w-5" />
          Demo Accounts
        </CardTitle>
        <CardDescription>Use these demo accounts to test different user roles and permissions</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {demoAccounts.map((account) => {
            const Icon = account.icon
            return (
              <Card key={account.role} className="border-2 hover:border-primary/50 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="h-5 w-5" />
                      <CardTitle className="text-lg">{account.name}</CardTitle>
                    </div>
                    <Badge className={getRoleColor(account.role)}>{account.role.replace("_", " ")}</Badge>
                  </div>
                  <CardDescription className="text-sm">{account.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Email:</span>
                      <div className="flex items-center gap-1">
                        <code className="text-xs bg-muted px-2 py-1 rounded">{account.email}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(account.email)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm font-medium">Password:</span>
                      <div className="flex items-center gap-1">
                        <code className="text-xs bg-muted px-2 py-1 rounded">{account.password}</code>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => copyToClipboard(account.password)}
                          className="h-6 w-6 p-0"
                        >
                          <Copy className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <span className="text-sm font-medium">Permissions:</span>
                    <div className="flex flex-wrap gap-1">
                      {account.permissions.map((permission) => (
                        <Badge key={permission} variant="secondary" className="text-xs">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button
                    onClick={() => loginWithDemo(account.email, account.password)}
                    className="w-full"
                    variant="outline"
                  >
                    Auto-fill Login Form
                  </Button>
                </CardContent>
              </Card>
            )
          })}
        </div>

        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-start gap-2">
            <div className="text-yellow-600 mt-0.5">⚠️</div>
            <div className="text-sm text-yellow-800">
              <strong>Development Only:</strong> These demo accounts are for development and testing purposes. In
              production, use proper user registration and strong passwords.
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
