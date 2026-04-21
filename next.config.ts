import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true, // This is the most important line for your 404/Redirect issue
  images: {
    unoptimized: true,
  },
};

export default nextConfig;