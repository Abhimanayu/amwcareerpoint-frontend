import type { NextConfig } from "next";

const legacyCollegeSlugRedirects = {
  'al-azhar-university-faculty-of-medicine-for-girls-in-asyut': 'faculty-of-medicine-for-girls-asyut-egypt',
  'alexandria-national-university-faculty-of-medicine-alexandria': 'alexandria-national-university-faculty-medicine',
  'armenian-medical-institute': 'armenian-medical-institute-medicine',
  'casimir-pulaski-university-of-radom-faculty-of-medical-sciences-and-health-sciences-radom': 'mbbs-casimir-pulaski-radom-university',
  'canada-schulich-school-of-medicine-and-dentistry-western-university-london-ontario': 'schulich-school-of-medicine-dentistry-canada',
  'cyprus-international-university-faculty-of-medicine': 'cyprus-international-faculty-of-medicine',
  'bicol-christian-college-of-medicine': 'bicol-christian-college-medicine',
  'bukhara-state-medical-institute-bsmi-uzbekistan': 'bukhara-state-medical-institute-bsmi-bukhara-uzbekistan',
  'fergana-medical-institute-of-public-health-uzbekistan': 'fergana-medical-institute-public-health-uzbekistan',
  'istanbul-university-cerrahpasa-medicine': 'istanbul-university-cerrahpasa-cerrahpasa-faculty-of-medicine',
  'lobachevsky-state-university-of-nizhny-novgorod-institute-of-biology-and-biomedicine-nizhny-novgorod': 'lobachevsky-state-university-nizhny-novgorod-biology-biomedicine',
  'luxor-university-faculty-of-medicine-new-tiba': 'faculty-of-medicine-luxor-upper-egypt',
  'max-rady-college-of-medicine-university-of-manitoba-winnipeg': 'max-rady-college-of-medicine-manitoba-canada',
  'mbbs-in-air-force-medical-university': 'air-force-medical-university',
  'mbbs-in-ashiyan-medical-college': 'ashiyan-medical-college',
  'mbbs-in-chester-medical-school-university-of-chester': 'chester-medical-school-university-of-chester',
  'mbbs-in-hubei-university-of-science-and-technolog-faculty-of-medicine': 'hubei-university-of-science-and-technolog-faculty-of-medicine',
  'mbbs-in-ivanovo-state-medical-university': 'ivanovo-state-medical-university',
  'mbbs-in-johannes-kepler-university-linz-medical-faculty': 'medical-faculty-linz-austria',
  'mbbs-in-medizinische-fakult-t-universit-t-des-saarlandes-homburg': 'medizinische-fakult-t-universit-t-des-saarlandes-homburg',
  'mbbs-in-new-ismailia-national-university-college-of-medicine-ismailia': 'new-ismailia-national-university-college-of-medicine-ismailia',
  'mbbs-in-phenikaa-university-faculty-of-medicine': 'phenikaa-university-faculty-of-medicine',
  'mbbs-in-queen-s-university-belfast-school-of-medicine-dentistry-and-biomedical-sciences': 'queen-s-university-belfast-school-of-medicine-dentistry-and-biomedical-sciences',
  'mbbs-in-tum-school-of-medicine-and-health': 'tum-school-of-medicine-and-health',
  'mbbs-in-vita-salute-san-raffaele-university-faculty-of-medicine-and-surgery': 'vita-salute-san-raffaele-university-faculty-of-medicine-and-surgery',
  'mbbs-in-university-of-calabria-school-of-medicine-and-surgery': 'university-of-calabria-school-of-medicine-and-surgery',
  'mcgill-university-faculty-of-medicine-and-health-sciences': 'faculty-of-medicine-health-sciences-mcgill-canada',
  'michael-g-degroote-school-of-medicine-mcmaster-university': 'michael-degroote-school-of-medicine-canada',
  'near-east-university-neu-faculty-of-medicine-lefko-a-nicosia-northern-cyprus-trnc': 'faculty-of-medicine-neu-nicosia-northern-cyprus',
  'nahda-university-in-beni-suef-faculty-of-medicine-beni-suef': 'nahda-university-faculty-of-medicine',
  'opole-university-faculty-of-medicine-opole': 'opole-medicine-faculty',
  'medical-university-of-gdansk-faculty-of-medicine-gdansk': 'medical-university-of-gdansk',
  'medical-university-of-lodz-faculty-of-medicine-lodz': 'lodz-faculty-of-medicine-medical-university',
  'suez-canal-university-faculty-of-medicine': 'suez-canal-university-faculty-medicine',
  'samarkand-state-medical-university-ssmu-uzbekistan': 'samarkand-state-medical-university-ssmu-samarkand-uzbekistan',
  'tashkent-state-medical-university-tsmu-uzbekistan': 'tashkent-state-medical-university-tsmu-tashkent-uzbekistan',
  'universidad-rey-juan-carlos-facultad-de-ciencias-de-la-salud-alcorcon': 'universidad-rey-juan-carlos-facultad-de-ciencias-de-la-salud',
  'universitat-de-les-illes-balears-facultat-de-medicina': 'de-les-illes-balears-facultat-de-medicina',
  'universitat-de-les-illes-balears-facultat-de-medicina-palma': 'de-les-illes-balears-facultat-de-medicina',
  'university-of-new-england-faculty-of-medicine-health-school-of-rural-medicine-armidale': 'new-england-university-faculty-medicine-health-school-rural-medicine',
  'university-of-new-south-wales-faculty-of-medicine-sydney': 'university-of-new-south-wales-sydney-australia',
  'university-of-zielona-gora-faculty-of-medicine-and-health-sciences-zielona-gora': 'university-of-zielona-gora-faculty-of-medicine-and-health-sciences',
  'university-of-brescia-faculty-of-medicine-and-surger': 'university-of-brescia-faculty-of-medicine-and-surgery',
  'surrey-school-of-medicine-guildford': 'university-of-surrey-school-of-medicine',
  'toronto-metropolitan-university-school-of-medicine-school-of-medicine': 'school-of-medicine-toronto-canada',
  'victor-papilian-faculty-of-medicine-at-lucian-blaga-university-of-sibiu-ulbs': 'lucian-blaga-university-faculty-of-medicine-romania',
} as const;

const nextConfig: NextConfig = {
  experimental: {
    cpus: 2,
    staticGenerationMaxConcurrency: 2,
    staticGenerationMinPagesPerWorker: 10,
    inlineCss: true,
  },
  async redirects() {
    return [
      { source: '/countries/mbbs-in-india', destination: '/mbbs-india', permanent: true },
      { source: '/mbbs-in-india', destination: '/mbbs-india', permanent: true },
      {
        source: '/universities',
        destination: '/college',
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
        source: '/college/universities/de-la-salle-medicine',
        destination: '/college/de-la-salle-medicine',
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
          source: `/colleges/${sourceSlug}`,
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
