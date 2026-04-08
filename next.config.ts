import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow mobile browsers to access the development server
  allowedDevOrigins: ['192.168.3.11'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
    ],
  },
};

export default nextConfig;
