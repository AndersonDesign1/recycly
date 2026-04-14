"use client";

import { AuthKitProvider } from "@workos-inc/authkit-nextjs/components";
import type { ReactNode } from "react";

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => (
  <AuthKitProvider>{children}</AuthKitProvider>
);
