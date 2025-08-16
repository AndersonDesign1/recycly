"use client"

import type React from "react"
import { useRef, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Recycle, Mail, CheckCircle } from "lucide-react"

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  const formRef = useRef<HTMLFormElement>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      // TODO: Integrate with Better Auth password reset
      // For now, simulate API call
      setTimeout(() => {
        setIsSubmitted(true)
        setIsLoading(false)
      }, 1500)
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred")
      setIsLoading(false)
    }
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-white flex">
        {/* Left side - Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-forest-green-50 to-sage-green-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-green-600/10 to-sage-green-600/10" />
          <img
            src="/placeholder.svg?height=800&width=600&text=Recycly+Password+Reset"
            alt="Recycly password reset success"
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
            <h2 className="text-2xl font-semibold mb-2">Password reset sent</h2>
            <p className="text-white/80 max-w-md">
              Check your email for the password reset link to get back to tracking your environmental impact.
            </p>
          </div>
        </div>

        {/* Right side - Success Content */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
          <div className="w-full max-w-md text-center space-y-6">
            <div className="w-20 h-20 bg-forest-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
              <CheckCircle className="w-10 h-10 text-white" />
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900">Check your email</h1>
              <p className="text-gray-600">
                We've sent a password reset link to <strong>{email}</strong>
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-sm text-gray-500">
                Didn't receive the email? Check your spam folder or{" "}
                <button
                  onClick={() => setIsSubmitted(false)}
                  className="text-forest-green-600 hover:text-forest-green-700 font-medium"
                >
                  try again
                </button>
              </p>
              <Link
                href="/auth/signin"
                className="inline-flex items-center text-sm text-gray-600 hover:text-forest-green-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-forest-green-50 to-sage-green-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-green-600/10 to-sage-green-600/10" />
        <img
          src="/placeholder.svg?height=800&width=600&text=Recycly+Password+Reset"
          alt="Recycly password reset"
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
          <h2 className="text-2xl font-semibold mb-2">Reset your password</h2>
          <p className="text-white/80 max-w-md">
            Don't worry, we'll help you get back to tracking your environmental impact in no time.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md space-y-8">
          {/* Logo and Header */}
          <div className="text-center space-y-6">
            <div className="flex justify-center lg:hidden">
              <div className="w-14 h-14 bg-forest-green-600 rounded-2xl flex items-center justify-center shadow-sm">
                <Recycle className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900">Forgot password?</h1>
              <p className="text-gray-600 text-sm">
                Enter your email address and we'll send you a link to reset your password
              </p>
            </div>
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="h-11 pl-10 border-gray-200 focus:border-forest-green-500 focus:ring-forest-green-500/20"
                  placeholder="Enter your email"
                  required
                />
              </div>
            </div>

            {/* Error Message */}
            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isLoading || !email}
              className="w-full h-11 bg-forest-green-600 hover:bg-forest-green-700 text-white font-medium transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <div className="flex items-center space-x-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Sending...</span>
                </div>
              ) : (
                "Send reset link"
              )}
            </Button>

            {/* Back to sign in */}
            <div className="text-center">
              <Link
                href="/auth/signin"
                className="inline-flex items-center text-sm text-gray-600 hover:text-forest-green-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to sign in
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
