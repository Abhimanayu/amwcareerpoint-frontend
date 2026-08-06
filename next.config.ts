import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    cpus: 2,
    staticGenerationMaxConcurrency: 2,
    staticGenerationMinPagesPerWorker: 10,
  },
  async redirects() {
    return [
      {
        source: '/universities',
        destination: '/college',
        permanent: true,
      },
      {
        source: '/universities/:slug',
        destination: '/college/:slug',
        permanent: true,
      },
      {
        source: '/index.php',
        destination: '/',
        permanent: true,
      },
      {
        source: '/contact-us',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/contact-us/',
        destination: '/contact',
        permanent: true,
      },
      {
        source: '/colleges',
        destination: '/college',
        permanent: true,
      },
      {
        source: '/colleges/',
        destination: '/college',
        permanent: true,
      },
      {
        source: '/blog/:slug',
        destination: '/blogs/:slug',
        permanent: true,
      },
      {
        source: '/blog/:slug/',
        destination: '/blogs/:slug',
        permanent: true,
      },
      {
        source: '/mbbs-in-kazakhstan-for-indian-students',
        destination: '/countries/mbbs-in-kazakhstan',
        permanent: true,
      },
      {
        source: '/mbbs-in-kazakhstan-for-indian-students/',
        destination: '/countries/mbbs-in-kazakhstan',
        permanent: true,
      },
      {
        source: '/mbbs-in-:country',
        destination: '/countries/mbbs-in-:country',
        permanent: true,
      },
      {
        source: '/mbbs-in-:country/',
        destination: '/countries/mbbs-in-:country',
        permanent: true,
      },
      {
        source: '/countries/uk',
        destination: '/countries/mbbs-in-uk',
        permanent: true,
      },
      {
        source: '/countries/russia',
        destination: '/countries/mbbs-in-russia',
        permanent: true,
      },
      {
        source: '/countries/georgia',
        destination: '/countries/mbbs-in-georgia',
        permanent: true,
      },
      {
        source: '/countries/kazakhstan',
        destination: '/countries/mbbs-in-kazakhstan',
        permanent: true,
      },
      {
        source: '/countries/uzbekistan',
        destination: '/countries/mbbs-in-uzbekistan',
        permanent: true,
      },
      {
        source: '/countries/kyrgyzstan',
        destination: '/countries/mbbs-in-kyrgyzstan',
        permanent: true,
      },
      {
        source: '/countries/uk/',
        destination: '/countries/mbbs-in-uk',
        permanent: true,
      },
      {
        source: '/countries/russia/',
        destination: '/countries/mbbs-in-russia',
        permanent: true,
      },
      {
        source: '/countries/georgia/',
        destination: '/countries/mbbs-in-georgia',
        permanent: true,
      },
      {
        source: '/countries/kazakhstan/',
        destination: '/countries/mbbs-in-kazakhstan',
        permanent: true,
      },
      {
        source: '/countries/uzbekistan/',
        destination: '/countries/mbbs-in-uzbekistan',
        permanent: true,
      },
      {
        source: '/countries/kyrgyzstan/',
        destination: '/countries/mbbs-in-kyrgyzstan',
        permanent: true,
      },
    ];
  },
  async headers() {
    return [
      {
        source: '/admin',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
      {
        source: '/admin/:path*',
        headers: [
          { key: 'Cache-Control', value: 'no-store, no-cache, must-revalidate, proxy-revalidate' },
          { key: 'Pragma', value: 'no-cache' },
          { key: 'Expires', value: '0' },
        ],
      },
    ];
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'ik.imagekit.io',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'img.youtube.com',
      },
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
      },
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
    // Allow localhost images to be unoptimized to avoid private IP issues
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
