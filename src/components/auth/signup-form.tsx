"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { signUp } from "@/lib/auth-client";
import { useRouter } from "next/navigation";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp.email({
        email,
        password,
        name,
      });

      if (result.error) {
        setError(result.error.message || "An error occurred");
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("An unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-h1 text-text">Join Recycly</CardTitle>
        <CardDescription className="text-muted">
          Create your account and start recycling
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-md">
          <div className="space-y-sm">
            <Label htmlFor="name" className="text-body">
              Full Name
            </Label>
            <Input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-sm">
            <Label htmlFor="email" className="text-body">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full"
              placeholder="Enter your email"
            />
          </div>
          
          <div className="space-y-sm">
            <Label htmlFor="password" className="text-body">
              Password
            </Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full"
              placeholder="Create a password"
            />
          </div>

          <div className="space-y-sm">
            <Label htmlFor="confirmPassword" className="text-body">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              className="w-full"
              placeholder="Confirm your password"
            />
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-sm rounded-small">
              {error}
            </div>
          )}

          <Button
            type="submit"
            className="w-full bg-primary hover:bg-primary-dark"
            disabled={isLoading}
          >
            {isLoading ? "Creating account..." : "Sign Up"}
          </Button>
        </form>

        <div className="mt-lg text-center">
          <p className="text-muted">
            Already have an account?{" "}
            <a href="/signin" className="text-primary hover:text-primary-dark">
              Sign in
            </a>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
