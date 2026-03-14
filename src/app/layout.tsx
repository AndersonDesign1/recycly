import { ClerkProvider } from "@clerk/nextjs";
import type { Metadata } from "next";
import { Manrope, Outfit } from "next/font/google";

import "./globals.css";
import { cn } from "@/lib/utils";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-sans",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-display",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://recycly.app"),
  title: {
    default: "Recycly",
    template: "%s | Recycly",
  },
  description:
    "Pickup-first recycling for Lagos households. Book collections, follow each handoff, and earn points after verified recycling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn(
        "grain-overlay font-sans",
        manrope.variable,
        outfit.variable
      )}
      lang="en"
    >
      <body>
        <ClerkProvider
          afterSignOutUrl="/"
          signInFallbackRedirectUrl="/dashboard"
          signInUrl="/sign-in"
          signUpFallbackRedirectUrl="/dashboard"
          signUpUrl="/sign-up"
        >
          {children}
        </ClerkProvider>
      </body>
    </html>
  );
}
