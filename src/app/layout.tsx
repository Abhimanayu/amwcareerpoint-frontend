import type { Metadata } from "next";
import "./globals.css";
import { SEO_HOLD } from '@/lib/seoHold';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amwcareerpoint.com';
const iconVersion = '20260520a';

const siteIcons: Metadata['icons'] = {
  icon: [
    { url: `/favicon.ico?v=${iconVersion}`, sizes: 'any' },
    { url: `/favicon-32x32.png?v=${iconVersion}`, sizes: '32x32', type: 'image/png' },
    { url: `/favicon-16x16.png?v=${iconVersion}`, sizes: '16x16', type: 'image/png' },
    { url: `/favicon.svg?v=${iconVersion}`, type: 'image/svg+xml' },
  ],
  shortcut: [`/favicon.ico?v=${iconVersion}`],
  apple: [{ url: `/apple-touch-icon.png?v=${iconVersion}`, sizes: '180x180', type: 'image/png' }],
};

const defaultMetadata: Metadata = {
  title: {
    template: "%s | AMW Career Point",
    default: "AMW Career Point - MBBS Abroad Consultancy",
  },
  description: "Expert consultancy for MBBS abroad. We help students achieve their dream of becoming doctors through quality education in top international medical universities.",
  keywords: ['MBBS abroad', 'MBBS consultancy', 'study medicine abroad', 'NEET counselling', 'medical education', 'AMW Career Point', 'MBBS in Russia', 'MBBS in Georgia', 'MBBS in Kazakhstan'],
  metadataBase: new URL(siteUrl),
  openGraph: {
    type: 'website',
    locale: 'en_IN',
    siteName: 'AMW Career Point',
    title: 'AMW Career Point - MBBS Abroad Consultancy',
    description: 'Expert consultancy for MBBS abroad. Trusted by 20,000+ students since 2009.',
    url: siteUrl,
    images: [{ url: '/og-image.png', width: 1200, height: 630, alt: 'AMW Career Point - MBBS Abroad Consultancy' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AMW Career Point - MBBS Abroad Consultancy',
    description: 'Expert consultancy for MBBS abroad. Trusted by 20,000+ students since 2009.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: '/',
  },
  icons: siteIcons,
};

const holdMetadata: Metadata = {
  title: {
    template: "%s | AMW Career Point",
    default: 'AMW Career Point',
  },
  description: 'AMW Career Point official website.',
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
  icons: siteIcons,
};

export const metadata: Metadata = SEO_HOLD ? holdMetadata : defaultMetadata;

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased" suppressHydrationWarning>
      <body className="min-h-full flex flex-col bg-white font-sans" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
