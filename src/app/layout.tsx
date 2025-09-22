import type { Metadata } from "next";
import { Inter } from "next/font/google";
import type React from "react";
import { Providers } from "./providers";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "Recycly - Waste Disposal Rewards",
  description:
    "Earn rewards for responsible waste disposal and help create a cleaner environment",
  keywords: [
    "recycling",
    "waste disposal",
    "environmental",
    "rewards",
    "sustainability",
  ],
  authors: [{ name: "Recycly Team" }],
  creator: "Recycly",
  publisher: "Recycly",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"
  ),
  openGraph: {
    title: "Recycly - Waste Disposal Rewards",
    description:
      "Earn rewards for responsible waste disposal and help create a cleaner environment",
    url: "/",
    siteName: "Recycly",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Recycly - Waste Disposal Rewards",
    description:
      "Earn rewards for responsible waste disposal and help create a cleaner environment",
    creator: "@recycly",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html className="scroll-smooth" lang="en">
      <body className={`${inter.className} antialiased`}>
        <Providers>
          <div className="min-h-screen bg-gradient-to-br from-sage-green-50 via-background to-fresh-mint-50/30">
            {children}
          </div>
        </Providers>
      </body>
    </html>
  );
}
