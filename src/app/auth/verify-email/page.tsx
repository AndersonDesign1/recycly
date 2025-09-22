"use client";

import {
  AlertCircle,
  ArrowLeft,
  CheckCircle,
  Mail,
  Recycle,
} from "lucide-react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";

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
      // TODO: Integrate with Better Auth email verification
      // For now, simulate API call
      setTimeout(() => {
        setVerificationStatus("success");
        setMessage(
          "Email verified successfully! You can now sign in to your account."
        );
        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          router.push("/auth/signin");
        }, 3000);
      }, 2000);
    } catch (err) {
      setVerificationStatus("error");
      setMessage("Email verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const resendVerification = async () => {
    setIsLoading(true);
    try {
      // TODO: Integrate with Better Auth resend verification
      setTimeout(() => {
        setMessage("Verification email sent! Please check your inbox.");
        setIsLoading(false);
      }, 1500);
    } catch (err) {
      setMessage("An unexpected error occurred. Please try again.");
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

  return (
    <div className="flex min-h-screen bg-white">
      {/* Left side - Image */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-forest-green-50 to-sage-green-50 lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-green-600/10 to-sage-green-600/10" />
        <img
          alt="Recycly email verification"
          className="h-full w-full object-cover"
          src="/placeholder.svg?height=800&width=600&text=Recycly+Email+Verification"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <div className="mb-4 flex items-center space-x-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
              <Recycle className="h-5 w-5 text-white" />
            </div>
            <span className="font-semibold text-xl">Recycly</span>
          </div>
          <h2 className="mb-2 font-semibold text-2xl">Email verification</h2>
          <p className="max-w-md text-white/80">
            Secure your account by verifying your email address to access all
            features.
          </p>
        </div>
      </div>

      {/* Right side - Content */}
      <div className="flex flex-1 items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-6 text-center">
            <div className="flex justify-center lg:hidden">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-forest-green-600 shadow-sm">
                <Recycle className="h-7 w-7 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="font-semibold text-2xl text-gray-900">
                {getStatusTitle()}
              </h1>
            </div>
          </div>

          {/* Status Icon */}
          <div className="text-center">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-gray-100">
              {getStatusIcon()}
            </div>
          </div>

          {/* Content */}
          <div className="space-y-6">
            {message && (
              <div
                className={`rounded-lg border p-4 ${
                  verificationStatus === "success"
                    ? "border-green-200 bg-green-50"
                    : verificationStatus === "error"
                      ? "border-red-200 bg-red-50"
                      : "border-blue-200 bg-blue-50"
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

            {verificationStatus === "success" && (
              <div className="space-y-4 text-center">
                <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-forest-green-600 border-t-transparent" />
                <p className="text-gray-500 text-sm">
                  Redirecting to sign in page...
                </p>
              </div>
            )}

            {/* Back to sign in */}
            <div className="text-center">
              <Link
                className="inline-flex items-center font-medium text-forest-green-600 text-sm transition-colors hover:text-forest-green-700"
                href="/auth/signin"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
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
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
