"use client";

import { Eye, Recycle, X } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signIn, signUp } from "@/lib/auth-client";

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
        callbackURL: "/auth/verify-email", // Redirect to email verification
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
        // Success - redirect to email verification
        // Better Auth will handle the redirect automatically
        console.log("Account created successfully:", result.user);
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
    <div className="flex min-h-screen bg-white">
      {/* Left side - Image */}
      <div className="relative hidden overflow-hidden bg-gradient-to-br from-forest-green-50 to-sage-green-50 lg:flex lg:w-1/2">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-green-600/10 to-sage-green-600/10" />
        <img
          alt="Recycly team collaboration"
          className="h-full w-full object-cover"
          src="/images/environmental-signup.png"
        />
        {/* Enhanced dark overlay for better content visibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-black/20" />

        {/* Logo section at the top */}
        <div className="absolute top-8 left-8 z-10">
          <div className="flex items-center space-x-3">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/90 shadow-lg backdrop-blur-sm">
              <Recycle className="h-8 w-8 text-forest-green-600" />
            </div>
            <div className="text-white">
              <h1 className="font-bold text-3xl">Recycly</h1>
              <p className="text-sm text-white/90">Sustainability Platform</p>
            </div>
          </div>
        </div>

        {/* Content section at the bottom */}
        <div className="absolute bottom-8 left-8 z-10 text-white">
          <h2 className="mb-3 font-bold text-3xl">
            Start your sustainability journey
          </h2>
          <p className="max-w-md text-lg text-white/90 leading-relaxed">
            Join thousands of organizations making a measurable impact on the
            environment with our comprehensive tracking platform.
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
                Create account
              </h1>
              <p className="text-gray-600 text-sm">
                Start tracking your environmental impact
              </p>
            </div>
          </div>

          {/* Form */}
          <form className="space-y-5" onSubmit={handleSubmit} ref={formRef}>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  className="font-medium text-gray-700 text-sm"
                  htmlFor="fullName"
                >
                  Full name
                </Label>
                <Input
                  className="h-11 border-gray-200 focus:border-forest-green-500 focus:ring-forest-green-500/20"
                  id="fullName"
                  name="fullName"
                  placeholder="Enter your full name"
                  type="text"
                />
              </div>

              <div className="space-y-2">
                <Label
                  className="font-medium text-gray-700 text-sm"
                  htmlFor="email"
                >
                  Email address
                </Label>
                <Input
                  className="h-11 border-gray-200 focus:border-forest-green-500 focus:ring-forest-green-500/20"
                  id="email"
                  name="email"
                  placeholder="Enter your email"
                  type="email"
                />
              </div>

              <div className="space-y-2">
                <Label
                  className="font-medium text-gray-700 text-sm"
                  htmlFor="password"
                >
                  Password
                </Label>
                <div className="relative">
                  <Input
                    className="h-11 border-gray-200 pr-10 focus:border-forest-green-500 focus:ring-forest-green-500/20"
                    id="password"
                    name="password"
                    onChange={handlePasswordChange}
                    placeholder="Create a strong password"
                    ref={passwordInputRef}
                    type="password"
                  />
                  <button
                    className="-translate-y-1/2 absolute top-1/2 right-3 text-gray-400 transition-colors hover:text-gray-600"
                    data-password-toggle
                    onClick={() => togglePasswordVisibility("password")}
                    type="button"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>

                {/* Password Strength Indicator */}
                <div
                  className="mt-3 space-y-2"
                  data-password-strength
                  style={{ display: "none" }}
                >
                  <div className="flex space-x-1">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <div
                        className="h-1 flex-1 rounded bg-gray-200"
                        data-strength-bar
                        key={level}
                      />
                    ))}
                  </div>
                  <div className="space-y-1 text-xs">
                    {Object.entries({
                      length: "8+ characters",
                      uppercase: "Uppercase letter",
                      lowercase: "Lowercase letter",
                      number: "Number",
                      special: "Special character",
                    }).map(([key, label]) => (
                      <div
                        className="flex items-center space-x-2"
                        data-check={key}
                        key={key}
                      >
                        <X className="h-3 w-3 text-gray-400" />
                        <span className="text-gray-500">{label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label
                  className="font-medium text-gray-700 text-sm"
                  htmlFor="confirmPassword"
                >
                  Confirm password
                </Label>
                <div className="relative">
                  <Input
                    className="h-11 border-gray-200 pr-10 focus:border-forest-green-500 focus:ring-forest-green-500/20"
                    id="confirmPassword"
                    name="confirmPassword"
                    placeholder="Confirm your password"
                    ref={confirmPasswordInputRef}
                    type="password"
                  />
                  <button
                    className="-translate-y-1/2 absolute top-1/2 right-3 text-gray-400 transition-colors hover:text-gray-600"
                    data-confirm-password-toggle
                    onClick={() => togglePasswordVisibility("confirm")}
                    type="button"
                  >
                    <Eye className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Terms and Privacy - Combined */}
            <div className="flex items-start space-x-3">
              <Checkbox
                className="mt-0.5 data-[state=checked]:border-forest-green-600 data-[state=checked]:bg-forest-green-600"
                id="agreeToTerms"
                name="agreeToTerms"
                value="true"
              />
              <Label
                className="text-gray-600 text-sm leading-relaxed"
                htmlFor="agreeToTerms"
              >
                I agree to the{" "}
                <Link
                  className="font-medium text-forest-green-600 transition-colors hover:text-forest-green-700"
                  href="/terms"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  className="font-medium text-forest-green-600 transition-colors hover:text-forest-green-700"
                  href="/privacy"
                >
                  Privacy Policy
                </Link>
              </Label>
            </div>

            {/* Create Account Button */}
            <Button
              className="h-11 w-full bg-forest-green-600 font-medium text-white shadow-sm transition-colors hover:bg-forest-green-700"
              ref={submitButtonRef}
              type="submit"
            >
              Create Account
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-gray-200 border-t" />
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-white px-3 text-gray-500">
                  Or continue with
                </span>
              </div>
            </div>

            {/* Google Sign In */}
            <Button
              className="h-11 w-full border-gray-200 bg-white font-medium text-gray-700 transition-colors hover:bg-gray-50"
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

            {/* Sign in link */}
            <p className="mt-6 text-center text-gray-600 text-sm">
              Already have an account?{" "}
              <Link
                className="font-medium text-forest-green-600 transition-colors hover:text-forest-green-700"
                href="/auth/signin"
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
