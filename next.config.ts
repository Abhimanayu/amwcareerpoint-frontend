import type { NextConfig } from "next";

const legacyCollegeSlugRedirects = {
  'alexandria-national-university-faculty-of-medicine-alexandria': 'alexandria-national-university-faculty-medicine',
  'armenian-medical-institute': 'armenian-medical-institute-medicine',
  'bicol-christian-college-of-medicine': 'bicol-christian-college-medicine',
  'bukhara-state-medical-institute-bsmi-uzbekistan': 'bukhara-state-medical-institute-bsmi-bukhara-uzbekistan',
  'fergana-medical-institute-of-public-health-uzbekistan': 'fergana-medical-institute-public-health-uzbekistan',
  'lobachevsky-state-university-of-nizhny-novgorod-institute-of-biology-and-biomedicine-nizhny-novgorod': 'lobachevsky-state-university-nizhny-novgorod-biology-biomedicine',
  'nahda-university-in-beni-suef-faculty-of-medicine-beni-suef': 'nahda-university-faculty-of-medicine',
  'opole-university-faculty-of-medicine-opole': 'opole-medicine-faculty',
  'samarkand-state-medical-university-ssmu-uzbekistan': 'samarkand-state-medical-university-ssmu-samarkand-uzbekistan',
  'tashkent-state-medical-university-tsmu-uzbekistan': 'tashkent-state-medical-university-tsmu-tashkent-uzbekistan',
  'universidad-rey-juan-carlos-facultad-de-ciencias-de-la-salud-alcorcon': 'universidad-rey-juan-carlos-facultad-de-ciencias-de-la-salud',
  'universitat-de-les-illes-balears-facultat-de-medicina-palma': 'de-les-illes-balears-facultat-de-medicina',
  'university-of-new-england-faculty-of-medicine-health-school-of-rural-medicine-armidale': 'new-england-university-faculty-medicine-health-school-rural-medicine',
  'university-of-zielona-gora-faculty-of-medicine-and-health-sciences-zielona-gora': 'university-of-zielona-gora-faculty-of-medicine-and-health-sciences',
  'victor-papilian-faculty-of-medicine-at-lucian-blaga-university-of-sibiu-ulbs': 'lucian-blaga-university-faculty-of-medicine-romania',
} as const;

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
        source: '/index.php/:path*',
        destination: '/:path*',
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
        source: '/colleges/mbbs-in-kyrgyzstan',
        destination: '/countries/mbbs-in-kyrgyzstan',
        permanent: true,
      },
      {
        source: '/colleges/bicol-christian-college-of-medicine',
        destination: '/college/bicol-christian-college-medicine',
        permanent: true,
      },
      {
        source: '/colleges/:slug',
        destination: '/college/:slug',
        permanent: true,
      },
      {
        source: '/colleges/:slug/',
        destination: '/college/:slug',
        permanent: true,
      },
      {
        source: '/country-colleges/:country',
        destination: '/college?country=:country',
        permanent: true,
      },
      {
        source: '/country-colleges/:country/',
        destination: '/college?country=:country',
        permanent: true,
      },
      {
        source: '/blog',
        destination: '/blogs',
        permanent: true,
      },
      {
        source: '/blog/',
        destination: '/blogs',
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
        source: '/predictor',
        destination: '/college-predictor',
        permanent: true,
      },
      {
        source: '/predictor/',
        destination: '/college-predictor',
        permanent: true,
      },
      {
        source: '/predictors',
        destination: '/college-predictor',
        permanent: true,
      },
      {
        source: '/predictors/',
        destination: '/college-predictor',
        permanent: true,
      },
      {
        source: '/package',
        destination: '/college-predictor',
        permanent: true,
      },
      {
        source: '/package/',
        destination: '/college-predictor',
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
      {
        source: '/study-abroad/mbbs-abroad/mbbs-in-moldova',
        destination: '/countries/mbbs-in-moldova',
        permanent: true,
      },
      {
        source: '/study-abroad/mbbs-abroad/mbbs-in-czech-republic',
        destination: '/countries/mbbs-in-czech-republic',
        permanent: true,
      },
      {
        source: '/countiries/:path*',
        destination: '/countries/:path*',
        permanent: true,
      },
      {
        source: '/countires/:path*',
        destination: '/countries/:path*',
        permanent: true,
      },
      {
        source: '/coutnries/:path*',
        destination: '/countries/:path*',
        permanent: true,
      },
      ...Object.entries(legacyCollegeSlugRedirects).flatMap(([sourceSlug, destinationSlug]) => [
        {
          source: `/college/${sourceSlug}`,
          destination: `/college/${destinationSlug}`,
          permanent: true,
        },
        {
          source: `/${sourceSlug}`,
          destination: `/college/${destinationSlug}`,
          permanent: true,
        },
      ]),
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
