"use client";

import { ArrowLeft, CheckCircle, Mail, Recycle } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type React from "react";
import { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { handle2FAVerification, resend2FACode } from "@/lib/auth-client";

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
      const result = await handle2FAVerification(verificationCode);

      if (result.success) {
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
        router.push("/auth/select-role");
      }, 2000);
    }
  };

  const handleResend = async () => {
    console.log("Resending code via email");

    // Clear any errors
    const errorEl = document.querySelector(".error-message");
    if (errorEl) errorEl.remove();

    try {
      const result = await resend2FACode();

      if (result.success) {
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

  const handleMethodChange = (method: "email") => {
    verificationMethodRef.current = method;

    // Update UI
    const emailBtn = document.querySelector('[data-method="email"]');
    const description = document.querySelector("[data-method-description]");

    if (emailBtn && description) {
      emailBtn.className =
        "flex-1 flex items-center justify-center space-x-2 py-2 px-4 rounded-md transition-colors bg-white text-gray-900 shadow-sm";
      description.textContent = "Enter the 6-digit code sent to your email";
    }
  };

  return (
    <div className="flex min-h-screen bg-white">
      {/* Success State */}
      <div
        className="flex min-h-screen items-center justify-center bg-white p-4"
        data-success-content
        style={{ display: "none" }}
      >
        <div className="max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 animate-bounce items-center justify-center rounded-full bg-green-500">
            <CheckCircle className="h-10 w-10 text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="font-semibold text-2xl text-gray-900">
              Verification Successful!
            </h1>
            <p className="text-gray-600">Setting up your account...</p>
          </div>
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-forest-green-600 border-t-transparent" />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-screen w-full bg-white" data-main-content>
        {/* Left side - Image */}
        <div className="relative hidden overflow-hidden bg-gradient-to-br from-forest-green-50 to-sage-green-50 lg:flex lg:w-1/2">
          <div className="absolute inset-0 bg-gradient-to-br from-forest-green-600/10 to-sage-green-600/10" />
          <img
            alt="Recycly security verification"
            className="h-full w-full object-cover"
            src="/images/environmental-2fa.png"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
          <div className="absolute bottom-8 left-8 text-white">
            <div className="mb-4 flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                <Recycle className="h-5 w-5 text-white" />
              </div>
              <span className="font-semibold text-xl">Recycly</span>
            </div>
            <h2 className="mb-2 font-semibold text-2xl">
              Secure account verification
            </h2>
            <p className="max-w-md text-white/80">
              We're protecting your environmental data with industry-leading
              security measures and verification protocols.
            </p>
          </div>
        </div>

        {/* Right side - Form */}
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
                  Verify your account
                </h1>
                <p className="text-gray-600 text-sm" data-method-description>
                  Enter the 6-digit code sent to your email address
                </p>
              </div>
            </div>

            {/* Email Verification Info */}
            <div className="rounded-lg border border-forest-green-200 bg-forest-green-50 p-4">
              <div className="flex items-center space-x-3">
                <Mail className="h-5 w-5 text-forest-green-600" />
                <div>
                  <p className="font-medium text-forest-green-800 text-sm">
                    Email Verification
                  </p>
                  <p className="text-forest-green-600 text-xs">
                    We've sent a 6-digit code to your email address
                  </p>
                </div>
              </div>
            </div>

            {/* Code Input */}
            <div className="space-y-6" data-code-container>
              <div className="flex justify-center space-x-3">
                {[0, 1, 2, 3, 4, 5].map((index) => (
                  <Input
                    className="h-12 w-12 border-2 border-gray-200 text-center font-semibold text-lg focus:border-forest-green-500 focus:ring-forest-green-500/20"
                    inputMode="numeric"
                    key={index}
                    maxLength={1}
                    onChange={(e) => handleCodeChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    ref={(el) => {
                      inputRefs.current[index] = el;
                    }}
                    type="text"
                  />
                ))}
              </div>

              {/* Verify Button */}
              <Button
                className="h-11 w-full bg-forest-green-600 font-medium text-white shadow-sm transition-colors hover:bg-forest-green-700"
                onClick={() => handleVerify()}
                ref={submitButtonRef}
              >
                Verify Code
              </Button>

              {/* Resend Code */}
              <div className="space-y-2 text-center">
                <p className="text-gray-600 text-sm">
                  Didn't receive the code?
                </p>
                <Button
                  className="font-medium text-forest-green-600 hover:bg-gray-50 hover:text-forest-green-700"
                  onClick={handleResend}
                  ref={resendButtonRef}
                  type="button"
                  variant="ghost"
                >
                  Resend code via email
                </Button>
              </div>
            </div>

            {/* Back Button */}
            <div className="text-center">
              <Link
                className="inline-flex items-center text-gray-600 text-sm transition-colors hover:text-forest-green-700"
                href="/auth/signup"
              >
                <ArrowLeft className="mr-1 h-4 w-4" />
                Back to sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
