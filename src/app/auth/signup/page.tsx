"use client";

import type React from "react";
import { useRef } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, X, Recycle } from "lucide-react";
import { useRouter } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";

function usePasswordStrength(password: string) {
  const checks = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /\d/.test(password),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(checks).filter(Boolean).length;
  return { checks, score };
}

function useFormValidation() {
  const validateForm = (formData: FormData) => {
    const errors: Record<string, string> = {};
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const confirmPassword = formData.get("confirmPassword") as string;
    const agreeToTerms = formData.get("agreeToTerms");

    if (!fullName) errors.fullName = "Full name is required";
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!agreeToTerms)
      errors.agreeToTerms = "You must agree to the terms and privacy policy";

    return errors;
  };

  return { validateForm };
}

export default function SignUpPage() {
  const showPasswordRef = useRef(false);
  const showConfirmPasswordRef = useRef(false);
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const confirmPasswordInputRef = useRef<HTMLInputElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const errorsRef = useRef<Record<string, string>>({});
  const passwordStrengthRef = useRef<{
    checks: Record<string, boolean>;
    score: number;
  }>({ checks: {}, score: 0 });
  const router = useRouter();

  const { validateForm } = useFormValidation();

  const handleGoogleSignIn = async () => {
    try {
      await signIn.social({ provider: "google" });
    } catch (error: any) {
      // Show error
      const errorEl = document.createElement("p");
      errorEl.className = "text-red-500 text-sm text-center mt-2 error-message";
      errorEl.textContent =
        error.message || "Google sign-in failed. Please try again.";
      formRef.current?.appendChild(errorEl);
    }
  };

  const getPasswordStrength = (password: string) => {
    const checks = {
      length: password.length >= 8,
      uppercase: /[A-Z]/.test(password),
      lowercase: /[a-z]/.test(password),
      number: /\d/.test(password),
      special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    };

    const score = Object.values(checks).filter(Boolean).length;
    return { checks, score };
  };

  const togglePasswordVisibility = (field: "password" | "confirm") => {
    const isPassword = field === "password";
    const ref = isPassword ? showPasswordRef : showConfirmPasswordRef;
    const inputRef = isPassword ? passwordInputRef : confirmPasswordInputRef;

    ref.current = !ref.current;
    if (inputRef.current) {
      inputRef.current.type = ref.current ? "text" : "password";
    }

    // Update button icon
    const button = isPassword
      ? document.querySelector("[data-password-toggle]")
      : document.querySelector("[data-confirm-password-toggle]");

    if (button) {
      const icon = button.querySelector("svg");
      if (icon) {
        icon.outerHTML = ref.current
          ? '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"></path></svg>'
          : '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>';
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = true;
      submitButtonRef.current.innerHTML =
        '<svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>Creating account...';
    }

    const formData = new FormData(formRef.current!);
    const errors = validateForm(formData);

    // Clear previous errors
    document.querySelectorAll(".error-message").forEach((el) => el.remove());
    document.querySelectorAll(".border-red-300").forEach((el) => {
      el.classList.remove("border-red-300", "focus:border-red-500");
      el.classList.add("border-gray-200", "focus:border-forest-green-500");
    });

    if (Object.keys(errors).length > 0) {
      errorsRef.current = errors;

      // Display errors in DOM
      Object.entries(errors).forEach(([field, message]) => {
        const input =
          document.querySelector(`[name="${field}"]`) ||
          document.querySelector(`#${field}`);
        if (input) {
          input.classList.add("border-red-300", "focus:border-red-500");
          input.classList.remove(
            "border-gray-200",
            "focus:border-forest-green-500"
          );

          const errorEl = document.createElement("p");
          errorEl.className = "text-red-500 text-xs mt-1 error-message";
          errorEl.textContent = message;
          input.parentNode?.appendChild(errorEl);
        }
      });

      if (submitButtonRef.current) {
        submitButtonRef.current.disabled = false;
        submitButtonRef.current.innerHTML = "Create Account";
      }
      return;
    }

    // Extract form data for Better Auth
    const fullName = formData.get("fullName") as string;
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    try {
      const { data: result, error: signUpError } = await signUp.email({
        email,
        password,
        name: fullName,
      });

      if (signUpError) {
        // Show error
        const errorEl = document.createElement("p");
        errorEl.className =
          "text-red-500 text-sm text-center mt-2 error-message";
        errorEl.textContent =
          signUpError.message || "Sign up failed. Please try again.";
        formRef.current?.appendChild(errorEl);

        if (submitButtonRef.current) {
          submitButtonRef.current.disabled = false;
          submitButtonRef.current.innerHTML = "Create Account";
        }
        return;
      }

      if (result?.user) {
        // Success - redirect to 2FA verification
        setTimeout(() => {
          router.push("/auth/verify-2fa");
        }, 1000);
      }
    } catch (err: any) {
      // Show error
      const errorEl = document.createElement("p");
      errorEl.className = "text-red-500 text-sm text-center mt-2 error-message";
      errorEl.textContent =
        err.message || "An unexpected error occurred. Please try again.";
      formRef.current?.appendChild(errorEl);

      if (submitButtonRef.current) {
        submitButtonRef.current.disabled = false;
        submitButtonRef.current.innerHTML = "Create Account";
      }
    }
  };

  const handlePasswordChange = () => {
    const strengthContainer = document.querySelector(
      "[data-password-strength]"
    );
    const password = passwordInputRef.current?.value || "";

    if (password && strengthContainer) {
      const { checks, score } = getPasswordStrength(password);
      passwordStrengthRef.current = { checks, score };

      // Update strength bars
      const bars = strengthContainer.querySelectorAll("[data-strength-bar]");
      bars.forEach((bar, index) => {
        const level = index + 1;
        if (score >= level) {
          const color =
            score <= 2
              ? "bg-red-500"
              : score <= 3
              ? "bg-yellow-500"
              : "bg-green-500";
          bar.className = `h-1 flex-1 rounded ${color}`;
        } else {
          bar.className = "h-1 flex-1 rounded bg-gray-200";
        }
      });

      // Update check indicators
      Object.entries(checks).forEach(([key, passed]) => {
        const indicator = strengthContainer.querySelector(
          `[data-check="${key}"]`
        );
        if (indicator) {
          const icon = indicator.querySelector("svg");
          const text = indicator.querySelector("span");
          if (icon && text) {
            if (passed) {
              icon.outerHTML =
                '<svg class="w-3 h-3 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>';
              text.className = "text-green-600";
            } else {
              icon.outerHTML =
                '<svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>';
              text.className = "text-gray-500";
            }
          }
        }
      });

      if (strengthContainer instanceof HTMLElement) {
        strengthContainer.style.display = "block";
      }
    } else if (strengthContainer && strengthContainer instanceof HTMLElement) {
      strengthContainer.style.display = "none";
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-forest-green-50 to-sage-green-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-green-600/10 to-sage-green-600/10" />
        <img
          src="/images/environmental-signup.png"
          alt="Recycly team collaboration"
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
            Start your sustainability journey
          </h2>
          <p className="text-white/90 text-lg max-w-md leading-relaxed">
            Join thousands of organizations making a measurable impact on the
            environment with our comprehensive tracking platform.
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
              <h1 className="text-2xl font-semibold text-gray-900">
                Create account
              </h1>
              <p className="text-gray-600 text-sm">
                Start tracking your environmental impact
              </p>
            </div>
          </div>

          {/* Form */}
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="fullName"
                  className="text-sm font-medium text-gray-700"
                >
                  Full name
                </Label>
                <Input
                  id="fullName"
                  name="fullName"
                  type="text"
                  className="h-11 border-gray-200 focus:border-forest-green-500 focus:ring-forest-green-500/20"
                  placeholder="Enter your full name"
                />
              </div>

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
                  className="h-11 border-gray-200 focus:border-forest-green-500 focus:ring-forest-green-500/20"
                  placeholder="Enter your email"
                />
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
                    ref={passwordInputRef}
                    id="password"
                    name="password"
                    type="password"
                    onChange={handlePasswordChange}
                    className="h-11 pr-10 border-gray-200 focus:border-forest-green-500 focus:ring-forest-green-500/20"
                    placeholder="Create a strong password"
                  />
                  <button
                    type="button"
                    data-password-toggle
                    onClick={() => togglePasswordVisibility("password")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>

                {/* Password Strength Indicator */}
                <div
                  data-password-strength
                  className="mt-3 space-y-2"
                  style={{ display: "none" }}
                >
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        key={level}
                        data-strength-bar
                        className="h-1 flex-1 rounded bg-gray-200"
                      />
                    ))}
                  </div>
                  <div className="text-xs space-y-1">
                    {Object.entries({
                      length: "8+ characters",
                      uppercase: "Uppercase letter",
                      lowercase: "Lowercase letter",
                      number: "Number",
                      special: "Special character",
                    }).map(([key, label]) => (
                      <div
                        key={key}
                        data-check={key}
                        className="flex items-center space-x-2"
                      >
                        <X className="w-3 h-3 text-gray-400" />
                        <span className="text-gray-500">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  htmlFor="confirmPassword"
                  className="text-sm font-medium text-gray-700"
                >
                  Confirm password
                </Label>
                <div className="relative">
                  <Input
                    ref={confirmPasswordInputRef}
                    id="confirmPassword"
                    name="confirmPassword"
                    type="password"
                    className="h-11 pr-10 border-gray-200 focus:border-forest-green-500 focus:ring-forest-green-500/20"
                    placeholder="Confirm your password"
                  />
                  <button
                    type="button"
                    data-confirm-password-toggle
                    onClick={() => togglePasswordVisibility("confirm")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Privacy - Combined */}
            <div className="flex items-start space-x-3">
              <Checkbox
                id="agreeToTerms"
                name="agreeToTerms"
                value="true"
                className="data-[state=checked]:bg-forest-green-600 data-[state=checked]:border-forest-green-600 mt-0.5"
              />
              <Label
                htmlFor="agreeToTerms"
                className="text-sm text-gray-600 leading-relaxed"
              >
                I agree to the{" "}
                <Link
                  href="/terms"
                  className="text-forest-green-600 hover:text-forest-green-700 font-medium transition-colors"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  href="/privacy"
                  className="text-forest-green-600 hover:text-forest-green-700 font-medium transition-colors"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>

            {/* Create Account Button */}
            <Button
              ref={submitButtonRef}
              type="submit"
              className="w-full h-11 bg-forest-green-600 hover:bg-forest-green-700 text-white font-medium transition-colors shadow-sm"
            >
              Create Account
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

            {/* Google Sign In */}
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

            {/* Sign in link */}
            <p className="text-center text-sm text-gray-600 mt-6">
              Already have an account?{" "}
              <Link
                href="/auth/signin"
                className="text-forest-green-600 hover:text-forest-green-700 font-medium transition-colors"
              >
                Sign in
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
