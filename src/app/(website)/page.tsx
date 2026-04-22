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

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'AMW Career Point - MBBS Abroad Consultancy | Study Medicine Overseas',
  description: 'India\'s most trusted MBBS abroad consultancy since 2009. Expert guidance for NEET counselling, MBBS in Russia, Georgia, Kazakhstan & more. 20,000+ students placed.',
  openGraph: {
    title: 'AMW Career Point - MBBS Abroad Consultancy',
    description: 'India\'s most trusted MBBS abroad consultancy since 2009. 20,000+ students placed in top NMC-approved universities.',
    type: 'website',
  },
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
