"use client";

import { ArrowLeft, CheckCircle, Mail, Recycle } from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const SUBMIT_SIMULATION_DELAY_MS = 1500 as const;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // TODO: Integrate with Better Auth password reset
      // For now, simulate API call
      setTimeout(() => {
        setIsSubmitted(true);
        setIsLoading(false);
      }, SUBMIT_SIMULATION_DELAY_MS);
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "An unexpected error occurred";
      setError(message);
      setIsLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="flex min-h-screen bg-white">
        {/* Left side - Image */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-forest-green-50 to-sage-green-50 lg:flex lg:w-1/2">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-green-600/10 to-sage-green-600/10" />
          <img
            alt="Recycly password reset success"
            className="h-full w-full object-cover"
            src="/placeholder.svg?height=800&width=600&text=Recycly+Password+Reset"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Recycle className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-xl">Recycly</span>
            </div>
            <h2 className="mb-2 font-semibold text-2xl">Password reset sent</h2>
            <p className="max-w-md text-white/80">
              Check your email for the password reset link to get back to
              tracking your environmental impact.
            </p>
          </div>
        </div>

        {/* Right side - Success Content */}
        <div className="flex flex-1 items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md space-y-6 text-center">
            <div className="mx-auto flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-forest-green-500">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="font-semibold text-2xl text-gray-900">
                Check your email
              </h1>
              <p className="text-gray-600">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-gray-500 text-sm">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  className="font-medium text-forest-green-600 hover:text-forest-green-700"
                  onClick={() => setIsSubmitted(false)}
                >
                  try again
                </button>
              </p>
              <Link
                className="inline-flex items-center text-gray-600 text-sm transition-colors hover:text-forest-green-700"
                href="/auth/signin"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Image */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-forest-green-50 to-sage-green-50 lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-green-600/10 to-sage-green-600/10" />
        <img
          alt="Recycly password reset"
          className="h-full w-full object-cover"
          src="/placeholder.svg?height=800&width=600&text=Recycly+Password+Reset"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <div className="mb-4 flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Recycle className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-xl">Recycly</span>
          </div>
          <h2 className="mb-2 font-semibold text-2xl">Reset your password</h2>
          <p className="max-w-md text-white/80">
            Don't worry, we'll help you get back to tracking your environmental
            impact in no time.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex flex-1 items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="space-y-6 text-center">
            <div className="flex justify-center lg:hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-green-600 shadow-sm">
                <Recycle className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="font-semibold text-2xl text-gray-900">
                Forgot password?
              </h1>
              <p className="text-gray-600 text-sm">
                Enter your email address and we'll send you a link to reset your
                password
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-6" onSubmit={handleSubmit} ref={formRef}>
            <div className="space-y-2">
              <Label
                className="font-medium text-gray-700 text-sm"
                htmlFor="email"
              >
                Email address
              </Label>
              <div className="relative">
                <Mail className="-translate-y-1/2 absolute top-1/2 left-3 h-5 w-5 transform text-gray-400" />
                <Input
                  className="h-11 border-gray-200 pl-10 focus:border-forest-green-500 focus:ring-forest-green-500/20"
                  id="email"
                  name="email"
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  type="email"
                  value={email}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <p className="text-center text-red-500 text-sm">{error}</p>
            )}

            {/* Submit Button */}
            <Button
              className="h-11 w-full bg-forest-green-600 font-medium text-white shadow-sm transition-colors hover:bg-forest-green-700 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={isLoading || !email}
              type="submit"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  <span>Sending...</span>
                </div>
              ) : (
                "Send reset link"
              )}
            </Button>

            {/* Back to sign in */}
            <div className="text-center">
              <Link
                className="inline-flex items-center text-gray-600 text-sm transition-colors hover:text-forest-green-700"
                href="/auth/signin"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
