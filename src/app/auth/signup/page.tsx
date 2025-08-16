"use client";

import type React from "react";
import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, Leaf, X } from "lucide-react";
import { signUp } from "@/lib/auth-client";

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
    const agreeToPrivacy = formData.get("agreeToPrivacy");

    if (!fullName) errors.fullName = "Full name is required";
    if (!email) errors.email = "Email is required";
    if (!password) errors.password = "Password is required";
    if (password !== confirmPassword) {
      errors.confirmPassword = "Passwords do not match";
    }
    if (!agreeToTerms) errors.agreeToTerms = "You must agree to the terms";
    if (!agreeToPrivacy)
      errors.agreeToPrivacy = "You must agree to the privacy policy";

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
          : '<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path></svg>';
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
    const company = formData.get("company") as string;

    try {
      // Call Better Auth signup
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

      (strengthContainer as HTMLElement).style.display = "block";
    } else if (strengthContainer) {
      (strengthContainer as HTMLElement).style.display = "none";
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Left side - Image */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-forest-green-50 to-sage-green-50 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-forest-green-600/10 to-sage-green-600/10" />
        <img
          src="/placeholder.svg?height=800&width=600"
          alt="EcoTrack team collaboration"
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
            Start your sustainability journey
          </h2>
          <p className="text-white/80 max-w-md">
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
                <Leaf className="w-7 h-7 text-white" />
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
          <form ref={formRef} onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-5">
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
                  htmlFor="company"
                  className="text-sm font-medium text-gray-700"
                >
                  Company/Organization{" "}
                  <span className="text-gray-500">(optional)</span>
                </Label>
                <Input
                  id="company"
                  name="company"
                  type="text"
                  className="h-11 border-gray-200 focus:border-forest-green-500 focus:ring-forest-green-500/20"
                  placeholder="Enter your company name"
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

            {/* Terms and Privacy */}
            <div className="space-y-4">
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
                  </Link>
                </Label>
              </div>

              <div className="flex items-start space-x-3">
                <Checkbox
                  id="agreeToPrivacy"
                  name="agreeToPrivacy"
                  value="true"
                  className="data-[state=checked]:bg-forest-green-600 data-[state=checked]:border-forest-green-600 mt-0.5"
                />
                <Label
                  htmlFor="agreeToPrivacy"
                  className="text-sm text-gray-600 leading-relaxed"
                >
                  I agree to the{" "}
                  <Link
                    href="/privacy"
                    className="text-forest-green-600 hover:text-forest-green-700 font-medium transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </Label>
              </div>
            </div>

            {/* Create Account Button */}
            <Button
              ref={submitButtonRef}
              type="submit"
              className="w-full h-11 bg-forest-green-600 hover:bg-forest-green-700 text-white font-medium transition-colors shadow-sm"
            >
              Create Account
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
