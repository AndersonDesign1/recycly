import type { Metadata } from "next";
import "./globals.css";
import { DM_Mono, Geist, Geist_Mono } from "next/font/google";
import { AuthProvider } from "@/components/auth-provider";
import { cn } from "@/lib/utils";

const geistSans = Geist({ subsets: ["latin"], variable: "--font-sans" });
const geistMono = Geist_Mono({ subsets: ["latin"], variable: "--font-mono" });
const dmMono = DM_Mono({
  weight: ["400", "500"],
  subsets: ["latin"],
  variable: "--font-data",
});

export const metadata: Metadata = {
  title: "Recycly Dashboard",
  description: "Pickup-first recycling rewards dashboard for Recycly.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      className={cn(
        "font-sans",
        geistSans.variable,
        geistMono.variable,
        dmMono.variable
      )}
      lang="en"
    >
      <body>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
