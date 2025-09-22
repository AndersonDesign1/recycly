"use client";

import type React from "react";
import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Recycle } from "lucide-react";
import { signIn } from "@/lib/auth-client";

function useFormValidation() {
  const errorsRef = useRef<Record<string, string>>({});

  const validateForm = (formData: FormData) => {
    const newErrors: Record<string, string> = {};
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    if (!email) newErrors.email = "Email is required";
    if (!password) newErrors.password = "Password is required";

    errorsRef.current = newErrors;
    return Object.keys(newErrors).length === 0;
  };

  const getError = (field: string) => errorsRef.current[field];
  const clearErrors = () => {
    errorsRef.current = {};
  };

  return { validateForm, getError, clearErrors };
}

export default function SignInPage() {
  const showPasswordRef = useRef(false);
  const formRef = useRef<HTMLFormElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const { validateForm, getError, clearErrors } = useFormValidation();
  const router = useRouter();

  const togglePasswordVisibility = (inputId: string) => {
    const input = document.getElementById(inputId) as HTMLInputElement;
    const button = input.nextElementSibling as HTMLButtonElement;
    const icon = button.querySelector("svg");

    showPasswordRef.current = !showPasswordRef.current;
    input.type = showPasswordRef.current ? "text" : "password";

    // Update icon
    if (showPasswordRef.current) {
      icon?.setAttribute("data-lucide", "eye-off");
    } else {
      icon?.setAttribute("data-lucide", "eye");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const formData = new FormData(formRef.current!);

    // Clear previous errors
    clearErrors();

    // Validate form
    if (!validateForm(formData)) {
      // Re-render to show errors
      formRef.current?.dispatchEvent(new Event("input", { bubbles: true }));
      return;
    }

    const button = submitButtonRef.current!;
    const originalContent = button.innerHTML;
    button.disabled = true;
    button.innerHTML = `
      <svg class="w-4 h-4 mr-2 animate-spin" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
        <path class="opacity-75" fill="currentColor" d="m4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      Signing in...
    `;

    // Extract form data
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const rememberMe = formData.get("rememberMe") === "true";

    try {
      const { data: result, error: signInError } = await signIn.email({
        email,
        password,
        rememberMe,
        callbackURL: "/auth/verify-2fa", // Redirect to 2FA verification
      });

      if (signInError) {
        // Show error
        const errorEl = document.createElement("p");
        errorEl.className =
          "text-red-500 text-sm text-center mt-2 error-message";
        errorEl.textContent =
          signInError.message || "Invalid email or password";
        formRef.current?.appendChild(errorEl);

        button.disabled = false;
        button.innerHTML = originalContent;
        return;
      }

      if (result?.user) {
        // Store email for 2FA verification
        localStorage.setItem("userEmail", email);

        // Better Auth will handle the redirect to 2FA verification
        // If 2FA is not required, it will redirect to the callbackURL
        // If 2FA is required, it will stay on the current page and show 2FA input
        console.log("Sign in successful, user:", result.user);
      }
    } catch (err: any) {
      // Show error
      const errorEl = document.createElement("p");
      errorEl.className = "text-red-500 text-sm text-center mt-2 error-message";
      errorEl.textContent = err.message || "An unexpected error occurred";
      formRef.current?.appendChild(errorEl);

      button.disabled = false;
      button.innerHTML = originalContent;
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const field = e.target.name;
    if (getError(field)) {
      clearErrors();
      // Clear error display
      const errorElement =
        e.target.parentElement?.querySelector(".text-red-500");
      if (errorElement) {
        errorElement.textContent = "";
      }
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const result = await signIn.social({ provider: "google" });

      // Better Auth handles the redirect automatically for social signin
      // The role check will happen after the redirect completes
      // No need to manually redirect here
    } catch (error: any) {
      const errorEl = document.createElement("p");
      errorEl.className = "text-red-500 text-sm text-center mt-2 error-message";
      errorEl.textContent =
        error.message || "Google sign-in failed. Please try again.";
      formRef.current?.appendChild(errorEl);
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-forest-green-50 to-sage-green-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-green-600/10 to-sage-green-600/10" />
        <img
          src="/images/environmental-signin.png"
          alt="Recycly sustainable office environment"
          className="w-full h-full object-cover"
        />
        {/* Enhanced dark overlay for better content visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />

        {/* Logo section at the top */}
        <div className="absolute top-8 left-8 z-10">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-2xl flex items-center justify-center shadow-lg">
              <Recycle className="w-8 h-8 text-forest-green-600" />
            </div>
            <div className="text-white">
              <h1 className="text-3xl font-bold">Recycly</h1>
              <p className="text-white/90 text-sm">Sustainability Platform</p>
            </div>
          </div>
        </div>

        {/* Content section at the bottom */}
        <div className="absolute bottom-8 left-8 text-white z-10">
          <h2 className="text-3xl font-bold mb-3">
            Track your environmental impact
          </h2>
          <p className="text-white/90 text-lg max-w-md leading-relaxed">
            Join thousands of businesses making a positive difference with
            data-driven sustainability insights.
          </p>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex items-center justify-center p-4 lg:p-8">
        <div className="w-full max-w-md">
          {/* Logo and Header */}
          <div className="text-center space-y-6 mb-8">
            <div className="flex justify-center lg:hidden">
              <div className="w-14 h-14 bg-forest-green-600 rounded-2xl flex items-center justify-center shadow-sm">
                <Recycle className="w-7 h-7 text-white" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-2xl font-semibold text-gray-900">
                Welcome back
              </h1>
              <p className="text-gray-600 text-sm">
                Sign in to your Recycly account
              </p>
            </div>
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
              <div className="space-y-2">
                <Label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700"
                >
                  Email address
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  onChange={handleInputChange}
                  className="h-11 border-gray-200 focus:border-forest-green-500 focus:ring-forest-green-500/20"
                  placeholder="Enter your email"
                />
                <p className="text-red-500 text-xs mt-1" data-error="email"></p>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    onChange={handleInputChange}
                    className="h-11 pr-10 border-gray-200 focus:border-forest-green-500 focus:ring-forest-green-500/20"
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    onClick={() => togglePasswordVisibility("password")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
                <p
                  className="text-red-500 text-xs mt-1"
                  data-error="password"
                ></p>
              </div>
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="remember"
                  name="rememberMe"
                  className="data-[state=checked]:bg-forest-green-600 data-[state=checked]:border-forest-green-600"
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-gray-600 font-normal"
                >
                  Remember me
                </Label>
              </div>
              <Link
                href="/auth/forgot-password"
                className="text-sm text-forest-green-600 hover:text-forest-green-700 font-medium transition-colors"
              >
                Forgot password?
              </Link>
            </div>

            {/* Sign In Button */}
            <Button
              ref={submitButtonRef}
              type="submit"
              className="w-full h-11 bg-forest-green-600 hover:bg-forest-green-700 text-white font-medium transition-colors shadow-sm"
            >
              Sign In
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="px-3 bg-white text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Social Login */}
            <Button
              type="button"
              variant="outline"
              onClick={handleGoogleSignIn}
              className="w-full h-11 border-gray-200 text-gray-700 hover:bg-gray-50 bg-white font-medium transition-colors"
            >
              <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24">
                <path
                  fill="currentColor"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="currentColor"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="currentColor"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                />
                <path
                  fill="currentColor"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                />
              </svg>
              Continue with Google
            </Button>

            {/* Sign up link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Don't have an account?{" "}
              <Link
                href="/auth/signup"
                className="text-forest-green-600 hover:text-forest-green-700 font-medium transition-colors"
              >
                Sign up
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
