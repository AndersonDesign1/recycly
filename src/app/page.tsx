"use client"

import { api } from "@/lib/trpc/client"
import { useAuth } from "@/hooks/use-auth"
import { LoginForm } from "@/components/auth/login-form"
import { DemoAccounts } from "@/components/auth/demo-accounts"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Award, MapPin, TrendingUp, LogOut, Crown, Settings, Shield, User } from "lucide-react"
import { getRoleColor, getRoleDisplayName } from "@/lib/utils/roles"
import { UserRole } from "@prisma/client"

const roleIcons = {
  [UserRole.SUPER_ADMIN]: Crown,
  [UserRole.ADMIN]: Settings,
  [UserRole.WASTE_MANAGER]: Shield,
  [UserRole.USER]: User,
}

export default function Dashboard() {
  const { user, loading, signOut, isAuthenticated } = useAuth()
  const { data: userStats, isLoading: statsLoading } = api.user.getStats.useQuery(undefined, {
    enabled: isAuthenticated,
  })
  const { data: nearbyBins, isLoading: binsLoading } = api.wasteBin.getNearby.useQuery(
    {
      latitude: 40.7829,
      longitude: -73.9654,
      radiusKm: 5,
    },
    {
      enabled: isAuthenticated,
    },
  )
  const { data: leaderboard, isLoading: leaderboardLoading } = api.user.getLeaderboard.useQuery({
    limit: 5,
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="w-full max-w-6xl space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">Waste Disposal Incentive App</h1>
            <p className="text-xl text-gray-600 mb-8">
              Earn rewards for proper waste disposal and help create a cleaner environment
            </p>
          </div>
          <div className="flex flex-col lg:flex-row gap-8 items-start">
            <div className="flex-1">
              <LoginForm />
            </div>
            <div className="flex-1">
              <DemoAccounts />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (statsLoading || binsLoading || leaderboardLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="h-32 bg-gray-200 rounded-lg"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    )
  }

  const RoleIcon = user?.role ? roleIcons[user.role as UserRole] : User

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 p-4">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8 flex justify-between items-center">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-bold text-gray-900">Welcome back, {user?.name}!</h1>
              <div className="flex items-center gap-2">
                <RoleIcon className="h-5 w-5" />
                <Badge className={getRoleColor(user?.role as UserRole)}>
                  {getRoleDisplayName(user?.role as UserRole)}
                </Badge>
              </div>
            </div>
            <p className="text-gray-600">Track your environmental impact and earn rewards</p>
          </div>
          <Button onClick={signOut} variant="outline" className="flex items-center gap-2 bg-transparent">
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </header>

        {/* Role-specific welcome message */}
        {user?.role !== UserRole.USER && (
          <Card className="mb-8 border-l-4 border-l-blue-500">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 mb-2">
                <RoleIcon className="h-5 w-5 text-blue-600" />
                <h3 className="font-semibold text-blue-900">
                  {user?.role === UserRole.SUPER_ADMIN && "Super Administrator Dashboard"}
                  {user?.role === UserRole.ADMIN && "Administrator Dashboard"}
                  {user?.role === UserRole.WASTE_MANAGER && "Waste Manager Dashboard"}
                </h3>
              </div>
              <p className="text-blue-700 text-sm">
                {user?.role === UserRole.SUPER_ADMIN &&
                  "You have full system access and can manage all users and settings."}
                {user?.role === UserRole.ADMIN &&
                  "You can manage users, campaigns, rewards, and view system analytics."}
                {user?.role === UserRole.WASTE_MANAGER &&
                  "You can manage waste bins, verify disposals, and handle reports."}
              </p>
            </CardContent>
          </Card>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Disposals</CardTitle>
              <Trash2 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats?.totalDisposals || 0}</div>
              <p className="text-xs text-muted-foreground">Items properly disposed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Points Earned</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats?.totalPoints || user?.points || 0}</div>
              <p className="text-xs text-muted-foreground">Environmental impact points</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rewards Earned</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{userStats?.totalRewards || 0}</div>
              <p className="text-xs text-muted-foreground">Rewards redeemed</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Level</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{user?.level || 1}</div>
              <p className="text-xs text-muted-foreground">User level</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Nearby Bins */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Nearby Waste Bins
              </CardTitle>
              <CardDescription>Find waste disposal locations near you</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {nearbyBins?.slice(0, 5).map((bin) => (
                  <div key={bin.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{bin.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {bin.type} • {bin.distance?.toFixed(1)}km away
                      </p>
                    </div>
                    <Button variant="outline" size="sm">
                      Navigate
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Leaderboard */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                Leaderboard
              </CardTitle>
              <CardDescription>Top environmental champions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard?.map((leaderUser, index) => {
                  const LeaderRoleIcon = roleIcons[leaderUser.role as UserRole] || User
                  return (
                    <div key={leaderUser.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-400 to-blue-500 flex items-center justify-center text-white font-bold text-sm">
                          {index + 1}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium">{leaderUser.name}</h4>
                            <LeaderRoleIcon className="h-3 w-3 text-muted-foreground" />
                          </div>
                          <p className="text-sm text-muted-foreground">Level {leaderUser.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-green-600">{leaderUser.points}</div>
                        <div className="text-xs text-muted-foreground">points</div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        {userStats?.recentDisposals && userStats.recentDisposals.length > 0 && (
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
              <CardDescription>Your latest waste disposal activities</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {userStats.recentDisposals.map((disposal) => (
                  <div key={disposal.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{disposal.wasteBin.name}</h4>
                      <p className="text-sm text-muted-foreground">
                        {disposal.wasteType} • {new Date(disposal.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-green-600">+{disposal.pointsEarned}</div>
                      <div className="text-xs text-muted-foreground">points</div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
