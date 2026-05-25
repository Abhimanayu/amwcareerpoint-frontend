import type { Metadata } from 'next';
import { CollegePredictorClient } from '@/components/college/CollegePredictorClient';

export const metadata: Metadata = {
  title: {
    absolute: 'NEET College Predictor 2025 | MBBS Admission Predictor | AMW Career Point',
  },
  description:
    'Paid NEET MBBS college predictor with 7-day access. Find colleges based on your NEET 2025 rank, category, sub category, state, and quota.',
  alternates: { canonical: 'https://amwcareerpoint.com/college-predictor' },
  openGraph: {
    title: 'NEET MBBS College Predictor 2025 - AMW Career Point',
    description: 'Unlock 7-day access to predict MBBS college chances from backend-managed NEET cutoff data.',
    url: 'https://amwcareerpoint.com/college-predictor',
  },
};

export default function CollegePredictorPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebApplication',
            name: 'NEET MBBS College Predictor 2025',
            applicationCategory: 'EducationApplication',
            description: 'Paid MBBS college predictor using backend-managed NEET cutoff data.',
            url: 'https://amwcareerpoint.com/college-predictor',
            operatingSystem: 'All',
            offers: { '@type': 'Offer', price: '588.82', priceCurrency: 'INR' },
          }),
        }}
      />
      <CollegePredictorClient />
    </>
  );
}
