"use client";

import type React from "react";
import { useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Leaf, CheckCircle, Mail } from "lucide-react";

function useCountdown() {
  const countdownRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const startCountdown = (
    seconds: number,
    callback: (remaining: number) => void
  ) => {
    countdownRef.current = seconds;
    callback(seconds);

    timerRef.current = setInterval(() => {
      countdownRef.current -= 1;
      callback(countdownRef.current);

      if (countdownRef.current <= 0) {
        clearInterval(timerRef.current);
      }
    }, 1000);
  };

  const stopCountdown = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
  };

  return { startCountdown, stopCountdown };
}

export default function Verify2FAPage() {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const verificationMethodRef = useRef<"email">("email");
  const isVerifiedRef = useRef(false);
  const submitButtonRef = useRef<HTMLButtonElement>(null);
  const resendButtonRef = useRef<HTMLButtonElement>(null);
  const router = useRouter();

  const { startCountdown, stopCountdown } = useCountdown();

  const handleCodeChange = (index: number, value: string) => {
    if (value.length > 1) return;

    const input = inputRefs.current[index];
    if (input) {
      input.value = value;

      // Clear any error styling
      input.classList.remove("border-red-300", "focus:border-red-500");
      input.classList.add("border-gray-200", "focus:border-forest-green-500");

      // Clear error message
      const errorEl = document.querySelector(".error-message");
      if (errorEl) errorEl.remove();
    }

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    const allInputs = inputRefs.current.slice(0, 6);
    const code = allInputs.map((input) => input?.value || "").join("");

    if (
      code.length === 6 &&
      submitButtonRef.current &&
      !submitButtonRef.current.disabled
    ) {
      handleVerify(code);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace") {
      const input = inputRefs.current[index];
      if (input && !input.value && index > 0) {
        inputRefs.current[index - 1]?.focus();
      }
    }
  };

  const handleVerify = async (codeToVerify?: string) => {
    const allInputs = inputRefs.current.slice(0, 6);
    const verificationCode =
      codeToVerify || allInputs.map((input) => input?.value || "").join("");

    if (verificationCode.length !== 6) {
      showError("Please enter all 6 digits");
      return;
    }

    // Update button state
    if (submitButtonRef.current) {
      submitButtonRef.current.disabled = true;
      submitButtonRef.current.innerHTML =
        '<svg class="w-4 h-4 mr-2 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path></svg>Verifying...';
    }

    try {
      // Integrate with Better Auth 2FA verification
      const response = await fetch("/api/auth/2fa/verify", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: verificationCode,
          method: verificationMethodRef.current,
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        showSuccess();
      } else {
        showError(
          result.error || "Invalid verification code. Please try again."
        );
        clearInputs();
        if (submitButtonRef.current) {
          submitButtonRef.current.disabled = false;
          submitButtonRef.current.innerHTML = "Verify Code";
        }
      }
    } catch (error) {
      console.error("Verification error:", error);
      showError("An error occurred during verification. Please try again.");
      clearInputs();
      if (submitButtonRef.current) {
        submitButtonRef.current.disabled = false;
        submitButtonRef.current.innerHTML = "Verify Code";
      }
    }
  };

  const showError = (message: string) => {
    // Clear previous error
    const existingError = document.querySelector(".error-message");
    if (existingError) existingError.remove();

    // Add error styling to inputs
    inputRefs.current.forEach((input) => {
      if (input) {
        input.classList.add("border-red-300", "focus:border-red-500");
        input.classList.remove(
          "border-gray-200",
          "focus:border-forest-green-500"
        );
      }
    });

    // Add error message
    const codeContainer = document.querySelector("[data-code-container]");
    if (codeContainer) {
      const errorEl = document.createElement("p");
      errorEl.className = "text-red-500 text-sm text-center error-message";
      errorEl.textContent = message;
      codeContainer.appendChild(errorEl);
    }
  };

  const clearInputs = () => {
    inputRefs.current.forEach((input) => {
      if (input) {
        input.value = "";
        input.classList.remove("border-red-300", "focus:border-red-500");
        input.classList.add("border-gray-200", "focus:border-forest-green-500");
      }
    });
    inputRefs.current[0]?.focus();
  };

  const showSuccess = () => {
    isVerifiedRef.current = true;
    const mainContent = document.querySelector("[data-main-content]");
    const successContent = document.querySelector("[data-success-content]");
    if (mainContent && successContent) {
      (mainContent as HTMLElement).style.display = "none";
      (successContent as HTMLElement).style.display = "block";

      setTimeout(() => {
        router.push("/dashboard");
      }, 2000);
    }
  };

  const handleResend = async () => {
    console.log("Resending code via email");

    // Clear any errors
    const errorEl = document.querySelector(".error-message");
    if (errorEl) errorEl.remove();

    try {
      // Call the resend API
      const response = await fetch("/api/auth/2fa/resend", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          method: "email",
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Start countdown
        startCountdown(60, (remaining) => {
          if (resendButtonRef.current) {
            if (remaining > 0) {
              resendButtonRef.current.disabled = true;
              resendButtonRef.current.textContent = `Resend in ${remaining}s`;
            } else {
              resendButtonRef.current.disabled = false;
              resendButtonRef.current.textContent = "Resend code via email";
            }
          }
        });
      } else {
        showError(result.error || "Failed to resend code. Please try again.");
      }
    } catch (error) {
      console.error("Resend error:", error);
      showError(
        "An error occurred while resending the code. Please try again."
      );
    }
  };

  // Method is always email, no need for method change functionality

  return (
    <div className="min-h-screen bg-white flex">
      {/* Success State */}
      <div
        data-success-content
        className="min-h-screen bg-white flex items-center justify-center p-4"
        style={{ display: "none" }}
      >
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto animate-bounce">
            <CheckCircle className="w-10 h-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold text-gray-900">
              Verification Successful!
            </h1>
            <p className="text-gray-600">Redirecting to your dashboard...</p>
          </div>
          <div className="w-8 h-8 border-4 border-forest-green-600 border-t-transparent rounded-full animate-spin mx-auto" />
        </div>
      </div>

      {/* Main Content */}
      <div data-main-content className="min-h-screen bg-white flex w-full">
        {/* Left side - Image */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-forest-green-50 to-sage-green-50 relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-green-600/10 to-sage-green-600/10" />
          <img
            src="/placeholder.svg?height=800&width=600"
            alt="EcoTrack security verification"
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
              Secure account verification
            </h2>
            <p className="text-white/80 max-w-md">
              We're protecting your environmental data with industry-leading
              security measures and verification protocols.
            </p>
          </div>
        </div>

        {/* Right side - Form */}
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
                  Verify your account
                </h1>
                <p data-method-description className="text-gray-600 text-sm">
                  Enter the 6-digit code sent to your email
                </p>
              </div>
            </div>

            {/* Email Verification Info */}
            <div className="bg-forest-green-50 border border-forest-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-forest-green-600" />
                <div>
                  <p className="text-sm font-medium text-forest-green-800">
                    Email Verification
                  </p>
                  <p className="text-xs text-forest-green-600">
                    We've sent a 6-digit code to your email address
                  </p>
                </div>
              </div>
            </div>

            {/* Code Input */}
            <div data-code-container className="space-y-6">
              <div className="flex justify-center space-x-3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <Input
                    key={index}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    className="w-12 h-12 text-center text-lg font-semibold border-2 border-gray-200 focus:border-forest-green-500 focus:ring-forest-green-500/20"
                  />
                ))}
              </div>

              {/* Verify Button */}
              <Button
                ref={submitButtonRef}
                onClick={() => handleVerify()}
                className="w-full h-11 bg-forest-green-600 hover:bg-forest-green-700 text-white font-medium transition-colors shadow-sm"
              >
                Verify Code
              </Button>

              {/* Resend Code */}
              <div className="text-center space-y-2">
                <p className="text-sm text-gray-600">
                  Didn't receive the code?
                </p>
                <Button
                  ref={resendButtonRef}
                  type="button"
                  variant="ghost"
                  onClick={handleResend}
                  className="text-forest-green-600 hover:text-forest-green-700 hover:bg-gray-50 font-medium"
                >
                  Resend code via email
                </Button>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <Link
                href="/auth/signup"
                className="inline-flex items-center text-sm text-gray-600 hover:text-forest-green-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-1" />
                Back to sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
