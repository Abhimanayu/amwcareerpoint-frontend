import { Metadata } from 'next';
import { 
  HeroSection,
  StatsSection,
  WhyChooseSection,
  ExpertCounsellorsSection,
  UniversitiesSection,
  CountriesSection,
  ComparisonSection,
  ProcessSection,
  PredictorSection,
  ReviewsSection,
  VideosSection,
  BlogsSection,
  CTASection,
  FAQSection
} from '@/components/home';
import { getPublicFaqs, homeFallbackFaqs } from '@/lib/server/faqs';
import { SEO_HOLD } from '@/lib/seoHold';

export const revalidate = 60;

export const metadata: Metadata = {
  ...(SEO_HOLD
    ? {
        title: 'AMW Career Point',
        description: 'AMW Career Point official website.',
        robots: {
          index: false,
          follow: false,
        },
      }
    : {
        title: 'Study MBBS Abroad for Indian Students',
        description: 'AMW Career Point helps Indian students study MBBS abroad in Russia, Kazakhstan, Georgia, Kyrgyzstan, and Europe at affordable fees with complete admission support.',
        openGraph: {
          title: 'AMW Career Point - MBBS Abroad Consultancy',
          description: 'India\'s most trusted MBBS abroad consultancy since 2009. 20,000+ students placed in top NMC-approved universities.',
          type: 'website',
        },
      }),
};

export default async function Home() {
  const faqs = await getPublicFaqs('home', { fallback: homeFallbackFaqs });

  return (
    <>
      <HeroSection />
      <StatsSection />
      <WhyChooseSection />
      <ExpertCounsellorsSection />
      <UniversitiesSection />
      <CountriesSection />
      <ComparisonSection />
      <ProcessSection />
      <PredictorSection />
      <ReviewsSection />
      <VideosSection />
      <BlogsSection />
      <CTASection />
      <FAQSection faqs={faqs} />
    </>
  );
}
