"use client";

import {
  AlertCircle,
  Award,
  BarChart3,
  CheckCircle,
  MapPin,
  Recycle,
  Settings,
  Shield,
  TrendingUp,
  Truck,
  Users,
  Wallet,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { useAuth } from "@/hooks/use-auth";

interface RoleOption {
  id: string;
  name: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  features: string[];
  benefits: string[];
  color: string;
  bgColor: string;
}

const roleOptions: RoleOption[] = [
  {
    id: "USER",
    name: "Individual Recycler",
    description: "Recycle waste and earn rewards",
    icon: Recycle,
    features: [
      "Deposit waste at collection points",
      "Earn points and rewards",
      "Track environmental impact",
      "Level up and unlock achievements",
      "Refer friends for bonuses",
    ],
    benefits: [
      "Earn money for recycling",
      "Environmental impact tracking",
      "Loyalty program benefits",
      "Community features",
      "Educational resources",
    ],
    color: "text-forest-green-600",
    bgColor: "bg-forest-green-50",
  },
  {
    id: "WASTE_MANAGER",
    name: "Waste Collection Supervisor",
    description: "Manage collection operations and verify deposits",
    icon: Truck,
    features: [
      "Monitor collection routes",
      "Verify waste deposits",
      "Manage collection vehicles",
      "Quality control oversight",
      "Staff coordination",
    ],
    benefits: [
      "Commission on collections",
      "Performance bonuses",
      "Operational insights",
      "Team management tools",
      "Professional development",
    ],
    color: "text-blue-600",
    bgColor: "bg-blue-50",
  },
  {
    id: "ADMIN",
    name: "Regional/Location Manager",
    description: "Manage regional operations and business development",
    icon: MapPin,
    features: [
      "Regional analytics and reporting",
      "Waste manager oversight",
      "Pricing and incentive management",
      "Partnership development",
      "Staff management",
    ],
    benefits: [
      "Revenue sharing",
      "Performance bonuses",
      "Business development opportunities",
      "Strategic decision making",
      "Leadership growth",
    ],
    color: "text-purple-600",
    bgColor: "bg-purple-50",
  },
  {
    id: "SUPERADMIN",
    name: "System Administrator",
    description: "Global system oversight and master controls",
    icon: Shield,
    features: [
      "Global user management",
      "System health monitoring",
      "Fraud detection and prevention",
      "Revenue analytics",
      "Commission management",
    ],
    benefits: [
      "System-wide oversight",
      "Strategic decision making",
      "Revenue optimization",
      "Security management",
      "Executive insights",
    ],
    color: "text-red-600",
    bgColor: "bg-red-50",
  },
];

export default function SelectRolePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [selectedRole, setSelectedRole] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!loading && user && user.role && user.role !== "USER") {
      // If user already has a specific role (not USER), redirect to dashboard
      router.push("/dashboard");
    }
  }, [user, loading, router]);

  const handleRoleSelection = (roleId: string) => {
    setSelectedRole(roleId);
    setError("");
  };

  const handleSubmit = async () => {
    if (!selectedRole) {
      setError("Please select a role to continue");
      return;
    }

    setIsSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/auth/update-role", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: selectedRole }),
      });

      if (response.ok) {
        // Redirect to dashboard after successful role update
        router.push("/dashboard");
      } else {
        const data = await response.json();
        setError(data.error || "Failed to update role");
      }
    } catch (error) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <LoadingSpinner />
      </div>
    );
  }

  if (!user) {
    router.push("/auth/signin");
    return null;
  }

  if (user.role) {
    router.push("/dashboard");
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-forest-green-50 via-white to-sage-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <div className="mb-4 flex items-center justify-center">
            <div className="mr-3 flex h-12 w-12 items-center justify-center rounded-lg bg-forest-green-600">
              <Recycle className="h-7 w-7 text-white" />
            </div>
            <h1 className="font-bold text-4xl text-gray-900">Recycly</h1>
          </div>
          <h2 className="mb-2 font-semibold text-2xl text-gray-800">
            Welcome, {user.name}! 🌱
          </h2>
          <p className="mx-auto max-w-2xl text-gray-600">
            Choose your role to get started with Recycly. Your role determines
            your access level, features, and benefits within the platform.
          </p>
        </div>

        {/* Role Selection */}
        <div className="mx-auto max-w-6xl">
          <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
            {roleOptions.map((role) => (
              <Card
                className={`cursor-pointer border-2 transition-all duration-200 hover:shadow-lg ${
                  selectedRole === role.id
                    ? "border-forest-green-500 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                key={role.id}
                onClick={() => handleRoleSelection(role.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`h-12 w-12 ${role.bgColor} flex items-center justify-center rounded-lg`}
                      >
                        <role.icon className={`h-6 w-6 ${role.color}`} />
                      </div>
                      <div>
                        <CardTitle className="font-semibold text-gray-900 text-lg">
                          {role.name}
                        </CardTitle>
                        <p className="text-gray-600 text-sm">
                          {role.description}
                        </p>
                      </div>
                    </div>
                    {selectedRole === role.id && (
                      <CheckCircle className="h-6 w-6 text-forest-green-600" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Features */}
                  <div>
                    <h4 className="mb-2 flex items-center font-medium text-gray-900">
                      <Settings className="mr-2 h-4 w-4 text-gray-500" />
                      Key Features
                    </h4>
                    <ul className="space-y-1">
                      {role.features.map((feature, index) => (
                        <li
                          className="flex items-start text-gray-600 text-sm"
                          key={index}
                        >
                          <CheckCircle className="mt-0.5 mr-2 h-3 w-3 flex-shrink-0 text-green-500" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="mb-2 flex items-center font-medium text-gray-900">
                      <Award className="mr-2 h-4 w-4 text-gray-500" />
                      Benefits
                    </h4>
                    <ul className="space-y-1">
                      {role.benefits.map((benefit, index) => (
                        <li
                          className="flex items-start text-gray-600 text-sm"
                          key={index}
                        >
                          <CheckCircle className="mt-0.5 mr-2 h-3 w-3 flex-shrink-0 text-green-500" />
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Role Badge */}
                  <div className="pt-2">
                    <Badge
                      className={`${role.bgColor} ${role.color} border-0`}
                      variant="outline"
                    >
                      {role.id}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Error Message */}
          {error && (
            <div className="mx-auto mb-6 max-w-2xl">
              <div className="flex items-center rounded-lg border border-red-200 bg-red-50 p-4">
                <AlertCircle className="mr-3 h-5 w-5 text-red-600" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <Button
              className="bg-forest-green-600 px-8 py-3 text-lg hover:bg-forest-green-700"
              disabled={!selectedRole || isSubmitting}
              onClick={handleSubmit}
              size="lg"
            >
              {isSubmitting ? (
                <>
                  <LoadingSpinner />
                  <span className="ml-2">Setting up your account...</span>
                </>
              ) : (
                "Continue to Dashboard"
              )}
            </Button>
            <p className="mt-3 text-gray-500 text-sm">
              You can change your role later in your account settings
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="mx-auto max-w-3xl">
            <h3 className="mb-4 font-semibold text-gray-800 text-lg">
              Why Choose Your Role?
            </h3>
            <div className="grid grid-cols-1 gap-6 text-gray-600 text-sm md:grid-cols-3">
              <div>
                <BarChart3 className="mx-auto mb-2 h-8 w-8 text-forest-green-600" />
                <h4 className="mb-1 font-medium text-gray-800">
                  Personalized Experience
                </h4>
                <p>
                  Get access to features and tools specifically designed for
                  your role and responsibilities.
                </p>
              </div>
              <div>
                <Wallet className="mx-auto mb-2 h-8 w-8 text-forest-green-600" />
                <h4 className="mb-1 font-medium text-gray-800">
                  Role-Based Benefits
                </h4>
                <p>
                  Enjoy benefits, commissions, and rewards tailored to your
                  contribution level.
                </p>
              </div>
              <div>
                <TrendingUp className="mx-auto mb-2 h-8 w-8 text-forest-green-600" />
                <h4 className="mb-1 font-medium text-gray-800">
                  Growth Opportunities
                </h4>
                <p>
                  Unlock new features and advance your role as you grow within
                  the platform.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
