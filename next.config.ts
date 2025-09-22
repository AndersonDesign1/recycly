import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration - now stable in Next.js 15
  turbopack: {
    // Turbopack handles SVG files natively, no need for webpack loaders
  },

  // External packages that should not be bundled
  serverExternalPackages: ["@prisma/client"],

  eslint: {
    ignoreDuringBuilds: true,
  },

  typescript: {
    ignoreBuildErrors: true,
  },

  images: {
    domains: ["utfs.io", "uploadthing.com"],
    unoptimized: true,
  },

  env: {
    customKey: process.env.CUSTOM_KEY,
  },
};

export default nextConfig;
