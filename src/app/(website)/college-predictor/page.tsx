import type { Metadata } from 'next';
import { CollegePredictorClient } from '@/components/college/CollegePredictorClient';

export const metadata: Metadata = {
  title: {
    absolute: 'NEET College Predictor 2025 | MBBS Admission Predictor | AMW Career Point',
  },
  description:
    'Find MBBS colleges you can get admission in based on your NEET 2025 rank and category. State-wise cutoff data for 21 states — Andhra Pradesh, Bihar, Gujarat, Karnataka, Maharashtra, Rajasthan & more.',
  alternates: { canonical: 'https://amwcareerpoint.com/college-predictor' },
  openGraph: {
    title: 'NEET MBBS College Predictor 2025 — AMW Career Point',
    description: 'Know your MBBS college chances based on NEET 2025 rank & category across 21 states.',
    url: 'https://amwcareerpoint.com/college-predictor',
  },
};

export default function CollegePredictorPage() {
  return (
    <>
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'NEET MBBS College Predictor 2025',
            applicationCategory: 'EducationApplication',
            description:
              'Predict MBBS college admission chances based on NEET 2025 rank and category across 21 Indian states.',
            url: 'https://amwcareerpoint.com/college-predictor',
            operatingSystem: 'All',
            offers: { '@type': 'Offer', price: '0', priceCurrency: 'INR' },
          }),
        }}
      />
      <CollegePredictorClient />
    </>
  );
}
