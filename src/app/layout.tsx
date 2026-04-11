import type { Metadata } from "next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amwcareerpoint.com';

export const metadata: Metadata = {
  title: {
    template: "%s | AMW Career Point - MBBS Abroad Consultancy",
    default: "AMW Career Point - MBBS Abroad Consultancy | Study Medicine Overseas",
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
  },
  twitter: {
    card: 'summary_large_image',
    title: 'AMW Career Point - MBBS Abroad Consultancy',
    description: 'Expert consultancy for MBBS abroad. Trusted by 20,000+ students since 2009.',
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
    canonical: siteUrl,
  },
};

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
    <html lang="en" className="h-full antialiased">
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="min-h-full flex flex-col bg-white font-sans">
        {children}
      </body>
    </html>
  );
}
