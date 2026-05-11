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

const homeJsonLd = {
  '@context': 'https://schema.org',
  '@graph': [
    {
      '@type': 'Organization',
      '@id': 'https://amwcareerpoint.com/#organization',
      name: 'AMW Career Point',
      url: 'https://amwcareerpoint.com/',
      logo: 'https://amwcareerpoint.com/wp-content/uploads/logo.png',
    },
    {
      '@type': 'WebSite',
      '@id': 'https://amwcareerpoint.com/#website',
      url: 'https://amwcareerpoint.com/',
      name: 'AMW Career Point',
      publisher: {
        '@id': 'https://amwcareerpoint.com/#organization',
      },
    },
    {
      '@type': 'BreadcrumbList',
      '@id': 'https://amwcareerpoint.com/#breadcrumb',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Home',
          item: 'https://amwcareerpoint.com/',
        },
      ],
    },
    {
      '@type': 'Article',
      '@id': 'https://amwcareerpoint.com/#article',
      headline: 'Study MBBS Abroad for Indian Students',
      description: 'AMW Career Point helps Indian students study MBBS abroad in Russia, Kazakhstan, Georgia, Kyrgyzstan, Nepal, and Europe with affordable fees and admission support.',
      author: {
        '@id': 'https://amwcareerpoint.com/#organization',
      },
      publisher: {
        '@id': 'https://amwcareerpoint.com/#organization',
      },
      mainEntityOfPage: 'https://amwcareerpoint.com/',
    },
    {
      '@type': 'FAQPage',
      '@id': 'https://amwcareerpoint.com/#faq',
      mainEntity: [
        {
          '@type': 'Question',
          name: 'What NEET score do I need to get into MBBS abroad?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'For MBBS abroad (Russia, Uzbekistan, Kazakhstan, etc.), students generally need a NEET score between 180–550 for the General category as per current NMC guidelines. Individual universities may set higher eligibility criteria.',
          },
        },
        {
          '@type': 'Question',
          name: 'How much does an MBBS in Russia cost for Indian students?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'The total cost for MBBS in Russia, including tuition and living expenses, is approximately ₹22–38 Lakhs over 6 years. Fees vary depending on the university and city.',
          },
        },
        {
          '@type': 'Question',
          name: 'Do I need to know Russian to study MBBS in Russia?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'No. Most universities recommended by AMW Career Point offer MBBS programs fully in English. Basic Russian is useful for clinical interaction and daily communication.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is NEET necessary for MBBS?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Yes. NEET qualification is mandatory for Indian students pursuing MBBS in India or abroad according to NMC guidelines.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are the eligibility criteria for NEET?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Students must complete Class 12 with Physics, Chemistry, and Biology and obtain at least 50% aggregate marks for the General category and 40% for reserved categories.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are the MBBS fees in India?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'MBBS fees in India vary widely depending on the college. Government medical colleges have significantly lower fees, while private medical colleges may charge between ₹25 Lakhs and ₹1 Crore or more.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are the career options after MBBS?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'After MBBS, students can pursue careers as doctors, resident medical officers, researchers, lecturers, medical writers, and healthcare consultants. Students graduating from abroad must clear FMGE or NExT to practise in India.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which is the best country to study MBBS abroad for Indian students?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Russia, Georgia, Kazakhstan, Kyrgyzstan, Nepal, and several European countries are popular choices for Indian students seeking affordable and quality MBBS education abroad.',
          },
        },
        {
          '@type': 'Question',
          name: 'Which country has the lowest cost for MBBS abroad?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Kyrgyzstan, Uzbekistan, Kazakhstan, Russia, Georgia, and Nepal offer some of the most affordable MBBS programs, starting from approximately ₹15–20 Lakhs total cost.',
          },
        },
        {
          '@type': 'Question',
          name: 'What is the FMGE test?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'FMGE (Foreign Medical Graduate Examination) is the licensing examination conducted in India for students who complete their MBBS degree from foreign medical universities.',
          },
        },
        {
          '@type': 'Question',
          name: 'What are the top universities to pursue MBBS abroad in 2026?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Top universities for MBBS abroad include Perm State Medical University, Orenburg State Medical University, Mari State University, and Avicenna International Medical University.',
          },
        },
        {
          '@type': 'Question',
          name: 'Is it better to study MBBS in India or abroad?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'MBBS abroad is a strong option for Indian students due to limited medical seats and intense competition in India. Many foreign universities provide affordable fees, modern infrastructure, and global exposure.',
          },
        },
        {
          '@type': 'Question',
          name: 'Why study MBBS abroad?',
          acceptedAnswer: {
            '@type': 'Answer',
            text: 'Studying MBBS abroad offers affordable tuition fees, modern medical infrastructure, international exposure, practical clinical training, English-medium education, and globally recognised medical degrees.',
          },
        },
      ],
    },
  ],
};

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
        alternates: {
          canonical: 'https://amwcareerpoint.com/',
        },
      }),
};

export default async function Home() {
  const faqs = await getPublicFaqs('home', { fallback: homeFallbackFaqs });

  return (
    <>
      {!SEO_HOLD && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(homeJsonLd).replace(/</g, '\\u003c'),
          }}
        />
      )}
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
