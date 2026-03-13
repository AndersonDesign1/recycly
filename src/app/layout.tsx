import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";

import "./globals.css";
import { Geist } from "next/font/google";
import { cn } from "@/lib/utils";

const geist = Geist({subsets:['latin'],variable:'--font-sans'});

export const metadata: Metadata = {
  metadataBase: new URL("https://recycly.app"),
  title: {
    default: "Recycly",
    template: "%s | Recycly",
  },
  description:
    "Pickup-first recycling rewards for urban households. Schedule collections, track progress, and earn points for verified recycling.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={cn("font-sans", geist.variable)}>
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
