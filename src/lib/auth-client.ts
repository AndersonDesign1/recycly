import { createAuthClient } from "better-auth/react";

export const { signIn, signUp, signOut, useSession, getSession } =
  createAuthClient({
    baseURL: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
  });

// Helper function to get role-based redirect URL
export function getRoleBasedRedirectUrl(role: string): string {
  switch (role) {
    case "SUPERADMIN":
      return "/dashboard/superadmin";
    case "ADMIN":
      return "/dashboard/admin";
    case "WASTE_MANAGER":
      return "/dashboard/waste-manager";
    case "USER":
    default:
      return "/dashboard";
  }
}

// Client-side auth helpers
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
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (result?.user) {
      return {
        success: true,
        user: result.user,
        redirectUrl: getRoleBasedRedirectUrl(
          (result.user as any).role || "USER"
        ),
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

export async function handleSignIn(data: { email: string; password: string }) {
  try {
    const { data: result, error } = await signIn.email({
      email: data.email,
      password: data.password,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (result?.user) {
      return {
        success: true,
        user: result.user,
        redirectUrl: getRoleBasedRedirectUrl(
          (result.user as any).role || "USER"
        ),
      };
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
    await signIn.social({
      provider: "google",
      callbackURL: "/dashboard",
    });
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "Failed to sign in with Google",
    };
  }
}
