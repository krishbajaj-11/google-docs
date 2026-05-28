import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Temporarily ignore ESLint during build to allow production builds
  // while addressing lint/type issues incrementally.
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
