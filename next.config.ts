import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Static export for GitHub Pages
  output: 'export',

  // GitHub Pages doesn't support Next.js image optimization
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
      },
      {
        protocol: 'https',
        hostname: 'link.coupang.com',
      },
      {
        protocol: 'https',
        hostname: '*.coupang.com',
      },
    ],
  },

  // Trailing slash for static hosting compatibility
  trailingSlash: true,
};

export default nextConfig;
