"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Leaf, Mail, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react";

function VerifyEmailContent() {
  const [verificationStatus, setVerificationStatus] = useState<
    "pending" | "success" | "error"
  >("pending");
  const [message, setMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    }
  }, [token]);

  const verifyEmail = async (verificationToken: string) => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: verificationToken }),
      });

      const data = await response.json();

      if (response.ok) {
        setVerificationStatus("success");
        setMessage(
          "Email verified successfully! You can now sign in to your account."
        );
        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          router.push("/auth/signin");
        }, 3000);
      } else {
        setVerificationStatus("error");
        setMessage(
          data.error || "Email verification failed. Please try again."
        );
      }
    } catch (err) {
      setVerificationStatus("error");
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();

      if (response.ok) {
        setMessage("Verification email sent! Please check your inbox.");
      } else {
        setMessage(data.error || "Failed to resend verification email.");
      }
    } catch (err) {
      setMessage("An unexpected error occurred. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case "success":
        return <CheckCircle className="h-8 w-8 text-forest-green-600" />;
      case "error":
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      default:
        return <Mail className="h-8 w-8 text-forest-green-600" />;
    }
  };

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case "success":
        return "Email Verified Successfully!";
      case "error":
        return "Verification Failed";
      default:
        return "Verifying Your Email";
    }
  };

  const getStatusDescription = () => {
    switch (verificationStatus) {
      case "success":
        return "Your email has been verified successfully. You can now sign in to your account.";
      case "error":
        return "We couldn't verify your email. Please try again or contact support.";
      default:
        return "We've sent a verification link to your email address. Please check your inbox and click the link to verify your account.";
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-forest-green-50 to-sage-green-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-green-600/10 to-sage-green-600/10" />
        <img
          src="/placeholder.svg?height=800&width=600"
          alt="EcoTrack email verification"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Leaf className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">EcoTrack</span>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Email verification</h2>
          <p className="text-white/80 max-w-md">
            Secure your account by verifying your email address to access all
            features.
          </p>
        </div>
      </div>

      {/* Right side - Content */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="text-center space-y-6">
            <div className="flex justify-center lg:hidden">
              <div className="w-14 h-14 bg-forest-green-600 rounded-2xl flex items-center justify-center shadow-sm">
                <Leaf className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900">
                {getStatusTitle()}
              </h1>
              <p className="text-gray-600 text-sm">{getStatusDescription()}</p>
            </div>
          </div>

          {/* Status Icon */}
          <div className="text-center">
            <div className="mx-auto w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center">
              {getStatusIcon()}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {message && (
              <div
                className={`border rounded-lg p-4 ${
                  verificationStatus === "success"
                    ? "bg-green-50 border-green-200"
                    : verificationStatus === "error"
                    ? "bg-red-50 border-red-200"
                    : "bg-blue-50 border-blue-200"
                }`}
              >
                <p
                  className={`text-sm ${
                    verificationStatus === "success"
                      ? "text-green-800"
                      : verificationStatus === "error"
                      ? "text-red-800"
                      : "text-blue-800"
                  }`}
                >
                  {message}
                </p>
              </div>
            )}

            {verificationStatus === "pending" && !token && (
              <div className="text-center space-y-4">
                <p className="text-gray-600">
                  Didn't receive a verification email? We can send you a new
                  one.
                </p>
                <Button
                  onClick={resendVerification}
                  disabled={isLoading}
                  className="w-full h-11 bg-forest-green-600 hover:bg-forest-green-700 text-white font-medium transition-colors shadow-sm"
                >
                  {isLoading ? (
                    <>
                      <svg
                        className="w-4 h-4 mr-2 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      Sending...
                    </>
                  ) : (
                    <>
                      <Mail className="w-4 h-4 mr-2" />
                      Resend Verification Email
                    </>
                  )}
                </Button>
              </div>
            )}

            {verificationStatus === "error" && (
              <div className="space-y-4">
                <Button
                  onClick={() => window.location.reload()}
                  className="w-full h-11 border-gray-200 text-gray-700 hover:bg-gray-50 bg-white font-medium transition-colors"
                  variant="outline"
                >
                  Try Again
                </Button>

                <Button
                  onClick={resendVerification}
                  disabled={isLoading}
                  className="w-full h-11 border-gray-200 text-gray-700 hover:bg-gray-50 bg-white font-medium transition-colors"
                  variant="outline"
                >
                  {isLoading ? "Sending..." : "Resend Verification Email"}
                </Button>
              </div>
            )}

            {verificationStatus === "success" && (
              <div className="text-center space-y-4">
                <div className="w-8 h-8 border-4 border-forest-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-gray-500">
                  Redirecting to sign in page...
                </p>
              </div>
            )}

            {/* Back to sign in */}
            <div className="text-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center text-sm text-forest-green-600 hover:text-forest-green-700 font-medium transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-white flex">
          {/* Left side - Image */}
          <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-forest-green-50 to-sage-green-50 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-forest-green-600/10 to-sage-green-600/10" />
            <img
              src="/placeholder.svg?height=800&width=600"
              alt="EcoTrack email verification"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            <div className="absolute bottom-8 left-8 text-white">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                  <Leaf className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-semibold">EcoTrack</span>
              </div>
              <h2 className="text-2xl font-semibold mb-2">
                Email verification
              </h2>
              <p className="text-white/80 max-w-md">
                Secure your account by verifying your email address to access
                all features.
              </p>
            </div>
          </div>

          {/* Right side - Loading Content */}
          <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
            <div className="w-full max-w-md text-center space-y-6">
              <div className="flex justify-center lg:hidden">
                <div className="w-14 h-14 bg-forest-green-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <Leaf className="w-7 h-7 text-white" />
                </div>
              </div>
              <div className="space-y-2">
                <h1 className="text-2xl font-semibold text-gray-900">
                  Loading...
                </h1>
                <p className="text-gray-600 text-sm">
                  Please wait while we load the verification page.
                </p>
              </div>
              <div className="w-8 h-8 border-4 border-forest-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
            </div>
          </div>
        </div>
      }
    >
      <VerifyEmailContent />
    </Suspense>
  );
}
