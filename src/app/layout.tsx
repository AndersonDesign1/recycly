import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Recycly - Making Recycling Rewarding",
  description: "A role-based recycling app for Nigeria. Users deposit waste, get rewarded, and admins manage the system.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} antialiased`}>
        <Navbar />
        <main className="max-w-page mx-auto px-lg py-xl">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
