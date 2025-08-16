"use client"

import { useState, useEffect, Suspense } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { Recycle, Mail, CheckCircle, AlertCircle, ArrowLeft } from "lucide-react"

function VerifyEmailContent() {
  const [verificationStatus, setVerificationStatus] = useState<"pending" | "success" | "error">("pending")
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const token = searchParams.get("token")

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    }
  }, [token])

  const verifyEmail = async (verificationToken: string) => {
    setIsLoading(true)
    try {
      // TODO: Integrate with Better Auth email verification
      // For now, simulate API call
      setTimeout(() => {
        setVerificationStatus("success")
        setMessage("Email verified successfully! You can now sign in to your account.")
        // Redirect to sign in after 3 seconds
        setTimeout(() => {
          router.push("/auth/signin")
        }, 3000)
      }, 2000)
    } catch (err) {
      setVerificationStatus("error")
      setMessage("Email verification failed. Please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const resendVerification = async () => {
    setIsLoading(true)
    try {
      // TODO: Integrate with Better Auth resend verification
      setTimeout(() => {
        setMessage("Verification email sent! Please check your inbox.")
        setIsLoading(false)
      }, 1500)
    } catch (err) {
      setMessage("An unexpected error occurred. Please try again.")
      setIsLoading(false)
    }
  }

  const getStatusIcon = () => {
    switch (verificationStatus) {
      case "success":
        return <CheckCircle className="h-8 w-8 text-forest-green-600" />
      case "error":
        return <AlertCircle className="h-8 w-8 text-red-500" />
      default:
        return <Mail className="h-8 w-8 text-forest-green-600" />
    }
  }

  const getStatusTitle = () => {
    switch (verificationStatus) {
      case "success":
        return "Email Verified Successfully!"
      case "error":
        return "Verification Failed"
      default:
        return "Verifying Your Email"
    }
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-forest-green-50 to-sage-green-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-green-600/10 to-sage-green-600/10" />
        <img
          src="/placeholder.svg?height=800&width=600&text=Recycly+Email+Verification"
          alt="Recycly email verification"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
        <div className="absolute bottom-8 left-8 text-white">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center">
              <Recycle className="w-5 h-5 text-white" />
            </div>
            <span className="text-xl font-semibold">Recycly</span>
          </div>
          <h2 className="text-2xl font-semibold mb-2">Email verification</h2>
          <p className="text-white/80 max-w-md">
            Secure your account by verifying your email address to access all features.
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
                <Recycle className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900">{getStatusTitle()}</h1>
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

            {verificationStatus === "success" && (
              <div className="text-center space-y-4">
                <div className="w-8 h-8 border-4 border-forest-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
                <p className="text-sm text-gray-500">Redirecting to sign in page...</p>
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
  )
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  )
}
