import { createAuthClient } from "better-auth/react";
import { twoFactorClient } from "better-auth/client/plugins";

export const { signIn, signUp, signOut, useSession, getSession } =
  createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    plugins: [
      twoFactorClient({
        onTwoFactorRedirect() {
          // Handle the 2FA verification redirect
          window.location.href = "/auth/verify-2fa";
        },
      }),
    ],
  });

// Export the twoFactor methods directly for easier access
export const { twoFactor } = createAuthClient({
  baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  plugins: [
    twoFactorClient({
      onTwoFactorRedirect() {
        window.location.href = "/auth/verify-2fa";
      },
    }),
  ],
});

// Helper function to get role-based redirect URL
export function getRoleBasedRedirectUrl(user: any) {
  if (!user) return "/auth/signin";

  // If user has USER role, redirect to role selection
  if (!user.role || user.role === "USER") {
    return "/auth/select-role";
  }

  // Otherwise, redirect to dashboard
  return "/dashboard";
}

export async function handleSignUp(data: {
  name: string;
  email: string;
  password: string;
}) {
  try {
    const { data: result, error } = await signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
      callbackURL: "/auth/verify-email", // Redirect to email verification
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (result?.user) {
      return {
        success: true,
        user: result.user,
        redirectUrl: "/auth/verify-email", // Always redirect to email verification after signup
      };
    }

    return { success: false, error: "Failed to create account" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to create account",
    };
  }
}

export async function handleSignIn(data: {
  email: string;
  password: string;
  rememberMe?: boolean;
}) {
  try {
    const { data: result, error } = await signIn.email({
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe ?? true,
      callbackURL: "/auth/verify-2fa", // Redirect to 2FA verification
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (result?.user) {
      // Store email for 2FA verification
      localStorage.setItem("userEmail", data.email);
      
      // Better Auth will handle the redirect to 2FA verification
      // If 2FA is not required, it will redirect to the callbackURL
      // If 2FA is required, it will stay on the current page and show 2FA input
      console.log("Sign in successful, user:", result.user);
    }

    return { success: false, error: "Invalid email or password" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Invalid email or password",
    };
  }
}

export async function handleGoogleSignIn() {
  try {
    const { data: result, error } = await signIn.social({
      provider: "google",
      callbackURL: "/auth/select-role", // Redirect to role selection after Google OAuth
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (result?.user) {
      return {
        success: true,
        user: result.user,
        redirectUrl: getRoleBasedRedirectUrl(result.user as any),
      };
    }

    return { success: false, error: "Google sign-in failed" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Google sign-in failed",
    };
  }
}

// Helper function to handle 2FA verification using official plugin
export async function handle2FAVerification(code: string) {
  try {
    // Use the official 2FA plugin's verifyOtp method
    const { data, error } = await twoFactor.verifyOtp({
      code,
      trustDevice: true, // Trust this device for 30 days
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data) {
      return { success: true, user: data.user };
    }

    return { success: false, error: "Invalid verification code" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Verification failed",
    };
  }
}

// Helper function to resend 2FA code using official plugin
export async function resend2FACode() {
  try {
    const { data, error } = await twoFactor.sendOtp({
      trustDevice: true,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (data) {
      return { success: true };
    }

    return { success: false, error: "Failed to send code" };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to send code",
    };
  }
}
