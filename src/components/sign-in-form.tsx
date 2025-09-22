"use client";

import { motion } from "framer-motion";
import { Eye, EyeOff, Loader2, Lock, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import type React from "react";
import { useState } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn } from "@/src/lib/auth-client";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await signIn.email(
        {
          email,
          password,
          callbackURL: "/dashboard",
        },
        {
          onRequest: () => {
            setIsLoading(true);
            setError("");
          },
          onSuccess: (ctx) => {
            setIsLoading(false);
            if (ctx.data?.user) {
              // Check if email verification is required
              if (ctx.data.user.emailVerified) {
                // Check for 2FA redirect
                if (ctx.data.twoFactorRedirect) {
                  // Handle 2FA verification
                  router.push("/2fa");
                } else {
                  router.push("/dashboard");
                }
              } else {
                setError("Please verify your email before signing in.");
              }
            }
          },
          onError: (ctx) => {
            setIsLoading(false);
            setError(ctx.error.message || "Invalid email or password");
          },
        }
      );
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Invalid email or password");
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    setError("");

    try {
      const { data, error } = await signIn.social(
        {
          provider: "google",
          callbackURL: "/dashboard",
        },
        {
          onRequest: () => {
            setIsLoading(true);
            setError("");
          },
          onSuccess: (ctx) => {
            setIsLoading(false);
            if (ctx.data?.user) {
              router.push("/dashboard");
            }
          },
          onError: (ctx) => {
            setIsLoading(false);
            setError(ctx.error.message || "Failed to sign in with Google");
          },
        }
      );
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || "Failed to sign in with Google");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-light-gray p-4">
      <motion.div
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md"
        initial={{ opacity: 0, y: 20 }}
        transition={{ duration: 0.5 }}
      >
        <Card className="minimal-card border-0 shadow-card">
          <CardHeader className="pb-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-forest-green">
              <div className="h-8 w-8 rounded-full bg-white" />
            </div>
            <CardTitle className="font-semibold text-2xl text-dark-charcoal">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-medium-gray">
              Sign in to your Recycly account
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {error && (
              <Alert className="border-red-200 bg-red-50">
                <AlertDescription className="text-red-600">
                  {error}
                </AlertDescription>
              </Alert>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
              <div className="space-y-2">
                <Label
                  className="font-medium text-dark-charcoal"
                  htmlFor="email"
                >
                  Email
                </Label>
                <div className="relative">
                  <Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-medium-gray" />
                  <Input
                    className="border-0 bg-light-gray pl-10 focus:ring-2 focus:ring-forest-green"
                    id="email"
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    type="email"
                    value={email}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  className="font-medium text-dark-charcoal"
                  htmlFor="password"
                >
                  Password
                </Label>
                <div className="relative">
                  <Lock className="-translate-y-1/2 absolute top-1/2 left-3 h-4 w-4 transform text-medium-gray" />
                  <Input
                    className="border-0 bg-light-gray pr-10 pl-10 focus:ring-2 focus:ring-forest-green"
                    id="password"
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    required
                    type={showPassword ? "text" : "password"}
                    value={password}
                  />
                  <button
                    className="-translate-y-1/2 absolute top-1/2 right-3 transform text-medium-gray hover:text-dark-charcoal"
                    onClick={() => setShowPassword(!showPassword)}
                    type="button"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              <Button
                className="w-full bg-forest-green py-3 font-medium text-white hover:bg-forest-green/90"
                disabled={isLoading}
                type="submit"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Signing in...
                  </>
                ) : (
                  "Sign In"
                )}
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-light-gray border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-white px-2 text-medium-gray">
                  Or continue with
                </span>
              </div>
            </div>

            <Button
              className="w-full border-light-gray bg-transparent hover:bg-light-gray"
              disabled={isLoading}
              onClick={handleGoogleSignIn}
              type="button"
              variant="outline"
            >
              <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="currentColor"
                />
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="currentColor"
                />
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  fill="currentColor"
                />
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="currentColor"
                />
              </svg>
              Continue with Google
            </Button>

            <div className="text-center">
              <p className="text-medium-gray text-sm">
                Don't have an account?{" "}
                <a
                  className="font-medium text-forest-green hover:text-forest-green/80"
                  href="/auth/signup"
                >
                  Sign up
                </a>
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
