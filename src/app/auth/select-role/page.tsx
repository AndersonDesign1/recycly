"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Users,
  MapPin,
  TrendingUp,
  Shield,
  Truck,
  Recycle,
  Award,
  Wallet,
  BarChart3,
  Settings,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

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
    if (!loading && user) {
      // If user already has a role, redirect to dashboard
      if (user.role) {
        router.push("/dashboard");
        return;
      }
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
      <div className="min-h-screen flex items-center justify-center">
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
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-forest-green-600 rounded-lg flex items-center justify-center mr-3">
              <Recycle className="w-7 h-7 text-white" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900">Recycly</h1>
          </div>
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Welcome, {user.name}! 🌱
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Choose your role to get started with Recycly. Your role determines
            your access level, features, and benefits within the platform.
          </p>
        </div>

        {/* Role Selection */}
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {roleOptions.map((role) => (
              <Card
                key={role.id}
                className={`cursor-pointer transition-all duration-200 hover:shadow-lg border-2 ${
                  selectedRole === role.id
                    ? "border-forest-green-500 shadow-lg"
                    : "border-gray-200 hover:border-gray-300"
                }`}
                onClick={() => handleRoleSelection(role.id)}
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-12 h-12 ${role.bgColor} rounded-lg flex items-center justify-center`}
                      >
                        <role.icon className={`w-6 h-6 ${role.color}`} />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-semibold text-gray-900">
                          {role.name}
                        </CardTitle>
                        <p className="text-sm text-gray-600">
                          {role.description}
                        </p>
                      </div>
                    </div>
                    {selectedRole === role.id && (
                      <CheckCircle className="w-6 h-6 text-forest-green-600" />
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Features */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Settings className="w-4 h-4 mr-2 text-gray-500" />
                      Key Features
                    </h4>
                    <ul className="space-y-1">
                      {role.features.map((feature, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-600 flex items-start"
                        >
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Benefits */}
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2 flex items-center">
                      <Award className="w-4 h-4 mr-2 text-gray-500" />
                      Benefits
                    </h4>
                    <ul className="space-y-1">
                      {role.benefits.map((benefit, index) => (
                        <li
                          key={index}
                          className="text-sm text-gray-600 flex items-start"
                        >
                          <CheckCircle className="w-3 h-3 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
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
            <div className="max-w-2xl mx-auto mb-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-center">
                <AlertCircle className="w-5 h-5 text-red-600 mr-3" />
                <span className="text-red-800">{error}</span>
              </div>
            </div>
          )}

          {/* Submit Button */}
          <div className="text-center">
            <Button
              onClick={handleSubmit}
              disabled={!selectedRole || isSubmitting}
              className="bg-forest-green-600 hover:bg-forest-green-700 px-8 py-3 text-lg"
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
            <p className="text-sm text-gray-500 mt-3">
              You can change your role later in your account settings
            </p>
          </div>
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="max-w-3xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">
              Why Choose Your Role?
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-sm text-gray-600">
              <div>
                <BarChart3 className="w-8 h-8 text-forest-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800 mb-1">
                  Personalized Experience
                </h4>
                <p>
                  Get access to features and tools specifically designed for your
                  role and responsibilities.
                </p>
              </div>
              <div>
                <Wallet className="w-8 h-8 text-forest-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800 mb-1">
                  Role-Based Benefits
                </h4>
                <p>
                  Enjoy benefits, commissions, and rewards tailored to your
                  contribution level.
                </p>
              </div>
              <div>
                <TrendingUp className="w-8 h-8 text-forest-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-800 mb-1">
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
