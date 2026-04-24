import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { getCountryBySlug, getCountries } from '@/lib/countries';
import { getUniversities } from '@/lib/universities';
import { CounsellingForm } from '@/components/home/CounsellingForm';
import { extractCollectionData, resolveMediaUrl } from '@/lib/utils';
import { CountryFAQSection } from './CountryFAQSection';
import { getPublicFaqs } from '@/lib/server/faqs';

export const revalidate = 60;

type Props = Readonly<{ params: Promise<{ slug: string }> }>;

type CountryFaq = { question?: string; answer?: string };

type CountryFeature = {
  icon?: string;
  title?: string;
  description?: string;
};

type CountryProcess = {
  step?: string | number;
  title?: string;
  description?: string;
};

type SupportProgressItem = {
  label?: string;
  value?: number;
  status?: string;
};

type SupportCard = {
  title?: string;
  subtitle?: string;
};

type StudentLifeCard = {
  icon?: string;
  title?: string;
  description?: string;
};

type StudentLife = {
  eyebrow?: string;
  title?: string;
  description?: string;
  cards?: StudentLifeCard[];
};

type DocumentsChecklistItem = {
  label?: string;
};

type DocumentsChecklist = {
  eyebrow?: string;
  title?: string;
  items?: DocumentsChecklistItem[];
};

type SupportExperience = {
  eyebrow?: string;
  title?: string;
  description?: string;
  progressItems?: SupportProgressItem[];
  supportCards?: SupportCard[];
};

type CountrySummary = {
  _id?: string;
  slug?: string;
  name?: string;
  feeRange?: string;
  duration?: string;
  flagImage?: string;
};

type UniversitySummary = {
  _id?: string;
  slug?: string;
  name?: string;
  heroImage?: string;
  logo?: string;
  annualFees?: string;
  hostelFees?: string;
  courseDuration?: string;
  medium?: string;
  accreditation?: string;
  description?: string;
  recognition?: string[];
};

const CARD_ACCENTS = [
  'from-[#F26419]/16 to-[#F26419]/6',
  'from-[#0D1B3E]/14 to-[#0D1B3E]/5',
  'from-[#00A6A6]/16 to-[#00A6A6]/6',
  'from-[#7C3AED]/14 to-[#7C3AED]/5',
  'from-[#1D4ED8]/14 to-[#1D4ED8]/5',
  'from-[#15803D]/14 to-[#15803D]/5',
];

const LIFE_CARD_BACKGROUNDS = [
  'bg-[#1E3A5F]',
  'bg-[#1D6F5F]',
  'bg-[#80512B]',
  'bg-[#583C8C]',
  'bg-[#8B304D]',
  'bg-[#176B73]',
];

const DOCUMENTS_REQUIRED = [
  '10th and 12th mark sheets',
  'NEET scorecard',
  'Valid passport',
  'Passport-size photographs',
  'Medical fitness certificate',
  'Birth certificate or ID proof',
  'Admission or invitation letter',
  'Visa support documents',
];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amwcareerpoint.com';
  const res = await getCountryBySlug(slug).catch(() => null);
  const country = res?.data || res;
  if (!country) return { title: 'Country not found' };
  const title = country.seo?.metaTitle || `${country.name} | MBBS Abroad`;
  const description = country.seo?.metaDescription || country.metaDescription || country.tagline || country.description || '';
  const canonical = country.seo?.canonicalUrl || `${siteUrl}/countries/${slug}`;
  return {
    title,
    description,
    alternates: { canonical },
    openGraph: { title, description, type: 'website' },
  };
}

function pickImageSource(university: UniversitySummary) {
  return resolveMediaUrl(university.heroImage || university.logo || '');
}

function getFallbackLifeCards(countryName: string) {
  return [
    {
      title: 'Accommodation and student comfort',
      description: `Indian students in ${countryName} usually look for safe housing, manageable daily costs, and campus support from day one.`,
      icon: '🏠',
    },
    {
      title: 'Food and daily routine',
      description: 'AMW helps students understand hostel life, meal options, and what to expect from their first semester abroad.',
      icon: '🍲',
    },
    {
      title: 'Campus and classroom culture',
      description: `The academic environment in ${countryName} combines structured teaching with steady clinical exposure over time.`,
      icon: '🎓',
    },
  ];
}

function resolveLifeCards(
  countryName: string,
  studentLifeCards: StudentLifeCard[],
  reasonCards: Array<{ title: string; description: string; icon: string }>
) {
  if (studentLifeCards.length > 0) {
    return studentLifeCards.slice(0, 6).map((card) => ({
      icon: card.icon || '🎓',
      title: card.title || 'Student life',
      description:
        card.description ||
        `Students in ${countryName} can expect practical academic support, cultural adjustment guidance, and day-to-day clarity after arrival.`,
    }));
  }

  if (reasonCards.length > 0) {
    return reasonCards.slice(0, 6);
  }

  return getFallbackLifeCards(countryName);
}

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  const res = await getCountryBySlug(slug).catch(() => null);
  const country = res?.data || res;

  if (!country) return notFound();

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amwcareerpoint.com';
  let schemaJsonLd: object | null = null;
  if (country.seo?.schemaMarkup) {
    try { schemaJsonLd = JSON.parse(country.seo.schemaMarkup); } catch { /* invalid JSON */ }
  }
  if (!schemaJsonLd) {
    schemaJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `MBBS in ${country.name}`,
      description: country.description || country.tagline || '',
      url: `${siteUrl}/countries/${slug}`,
      publisher: { '@type': 'Organization', name: 'AMW Career Point', url: siteUrl },
    };
  }

  const countryId = typeof country._id === 'string' ? country._id : '';
  const heroImage = resolveMediaUrl(country.heroImage);
  const flagImage = resolveMediaUrl(country.flagImage);

  // Parallelize independent data fetches
  const [universityRes, countriesRes, apiFaqs] = await Promise.all([
    countryId ? getUniversities({ country: countryId, limit: 12 }).catch(() => null) : null,
    getCountries({ limit: 12 }).catch(() => null),
    getPublicFaqs('country', { pageSlug: slug }).catch(() => []),
  ]);

  const universities = extractCollectionData<UniversitySummary>(universityRes, ['universities']);
  const otherCountries = extractCollectionData<CountrySummary>(countriesRes, ['countries'])
    .filter((item) => item.slug !== slug)
    .slice(0, 5);

  const highlights = Array.isArray(country.highlights)
    ? (country.highlights as string[]).filter(Boolean)
    : [];
  const features = Array.isArray(country.features)
    ? (country.features as CountryFeature[]).filter(
        (feature) => Boolean(feature?.title || feature?.description || feature?.icon)
      )
    : [];
  const eligibility = Array.isArray(country.eligibility)
    ? (country.eligibility as string[]).filter(Boolean)
    : [];
  const admissionSteps = Array.isArray(country.admissionProcess)
    ? (country.admissionProcess as CountryProcess[]).filter(
        (step) => Boolean(step?.title || step?.description)
      )
    : [];
  const countryFaqs = (Array.isArray(country.faqs) ? country.faqs : []).filter(
    (faq: CountryFaq): faq is Required<CountryFaq> => Boolean(faq?.question && faq?.answer)
  );
  const faqs = apiFaqs.length > 0
    ? [...apiFaqs, ...countryFaqs.filter((cf: { question: string }) => !apiFaqs.some((af) => af.question === cf.question))]
    : countryFaqs;
  const studentLife =
    country.studentLife && typeof country.studentLife === 'object'
      ? (country.studentLife as StudentLife)
      : {};
  const documentsChecklist =
    country.documentsChecklist && typeof country.documentsChecklist === 'object'
      ? (country.documentsChecklist as DocumentsChecklist)
      : {};
  const supportExperience =
    country.supportExperience && typeof country.supportExperience === 'object'
      ? (country.supportExperience as SupportExperience)
      : {};

  const heroStats = [
    { label: 'Tuition fee', value: country.feeRange ?? 'On request' },
    { label: 'Course duration', value: country.duration ?? '6 years' },
    { label: 'Medium of study', value: country.medium ?? 'English medium' },
    { label: 'Living cost', value: country.livingCost ?? 'Budget friendly' },
  ];

  const countrySnapshot = [
    { value: `${universities.length || 0}+`, label: 'Partner universities' },
    { value: `${features.length || highlights.length || 0}+`, label: 'Why students choose it' },
    { value: `${admissionSteps.length || 0}`, label: 'Admission steps' },
    { value: `${eligibility.length || 0}+`, label: 'Eligibility checkpoints' },
  ];

  const reasonCards =
    features.length > 0
      ? features.slice(0, 6).map((feature) => ({
          title: feature.title || 'Why choose this destination',
          description:
            feature.description ||
            country.description ||
            `Students choose ${country.name} for quality medical education and structured support.`,
          icon: feature.icon || '✦',
        }))
      : highlights.slice(0, 6).map((highlight) => ({
          title: highlight,
          description:
            country.tagline ||
            `Study MBBS in ${country.name} with a balance of affordability, recognition, and student support.`,
          icon: '✦',
        }));

  const studentLifeCards = Array.isArray(studentLife.cards)
    ? studentLife.cards.filter(
        (card): card is Required<Pick<StudentLifeCard, 'title'>> & StudentLifeCard =>
          Boolean(card?.title)
      )
    : [];
  const lifeCards = resolveLifeCards(country.name || 'this destination', studentLifeCards, reasonCards);

  const resolvedDocumentsChecklistItems = Array.isArray(documentsChecklist.items)
    ? documentsChecklist.items
        .filter((item): item is Required<DocumentsChecklistItem> => Boolean(item?.label))
        .slice(0, 12)
    : [];

  const trustPills =
    highlights.length > 0
      ? highlights.slice(0, 4)
      : [
          'Internationally recognised options',
          'Student-first counselling support',
          'Affordable fee planning',
          'Visa and travel guidance',
        ];

  const supportProgressItems = Array.isArray(supportExperience.progressItems)
    ? supportExperience.progressItems.filter(
        (item): item is Required<SupportProgressItem> =>
          Boolean(item?.label) && typeof item?.value === 'number'
      )
    : [];

  const supportCards = Array.isArray(supportExperience.supportCards)
    ? supportExperience.supportCards.filter(
        (item): item is Required<SupportCard> => Boolean(item?.title)
      )
    : [];

  const resolvedSupportProgressItems =
    supportProgressItems.length > 0
      ? supportProgressItems.slice(0, 6)
      : [
          { label: 'Country shortlisting and options', value: 92, status: 'Included' },
          { label: 'University comparison and counselling', value: 86, status: 'Included' },
          { label: 'Application and documentation help', value: 88, status: 'Included' },
          { label: 'Visa, travel, and arrival coordination', value: 80, status: 'Included' },
        ];

  const resolvedSupportCards =
    supportCards.length > 0
      ? supportCards.slice(0, 6)
      : [
          { title: 'Day 1', subtitle: 'Counselling support begins' },
          { title: '1:1', subtitle: 'Application guidance' },
          { title: 'Visa', subtitle: 'Documentation assistance' },
          { title: 'Stay', subtitle: 'Travel and arrival support' },
          { title: 'Funds', subtitle: 'Fee planning assistance' },
          { title: 'After', subtitle: 'Post-arrival support' },
        ];

  return (
    <div className="overflow-x-hidden bg-[#F8F4EC] text-[#0D1B3E]">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />
      <section className="relative overflow-hidden border-b border-[#E6DFD3] px-4 pb-16 pt-8 sm:px-6 lg:px-8 lg:pb-20 lg:pt-12">
        {/* Base background — visible when no hero image */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(242,100,25,0.12),_transparent_30%),linear-gradient(180deg,#FFF9F1_0%,#F8F4EC_100%)]" />
        {/* Hero image — prominent but softened */}
        {heroImage && (
          <div className="pointer-events-none absolute inset-0">
            <SafeImage
              src={heroImage}
              alt={country.name}
              fill
              priority
              className="object-cover object-center opacity-[0.42] sm:opacity-[0.48]"
              fallbackElement={<div className="absolute inset-0 bg-gradient-to-br from-[#0D1B3E]/10 to-[#F26419]/5" />}
            />
            {/* Single subtle overlay for text readability */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#FFF9F1]/40 via-transparent to-[#F8F4EC]/50" />
            <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-[#0D1B3E]/18 to-transparent" />
          </div>
        )}

        {/* Decorative blurs */}
        <div className="absolute right-[-8rem] top-28 h-72 w-72 rounded-full bg-[#E9D8C3]/40 blur-3xl" />
        <div className="absolute left-[-6rem] top-44 h-60 w-60 rounded-full bg-white/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_370px] lg:items-start">
            <div className="pt-14 lg:pt-16">
              <div className="mb-6 flex flex-wrap items-center gap-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F26419]">
                <span className="rounded-full border border-[#F4C8B0] bg-white/90 px-3 py-1.5 shadow-sm">
                  Abroad destination
                </span>
                <span className="rounded-full border border-[#DDD9D2] bg-white/80 px-3 py-1.5 shadow-sm">
                  NMC-oriented guidance
                </span>
              </div>

              <div className="max-w-3xl">
                {flagImage && (
                  <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-[#DDD9D2] bg-white/85 px-3 py-2 text-xs font-medium text-[#4A4742] shadow-sm backdrop-blur">
                    <SafeImage
                      src={flagImage}
                      alt={`${country.name} flag`}
                      width={24}
                      height={16}
                      className="rounded-sm object-cover"
                      fallbackElement={
                        <div className="w-6 h-4 rounded-sm bg-[#DDD9D2] flex items-center justify-center text-xs">🏳️</div>
                      }
                    />
                    <span>Study destination: {country.name}</span>
                  </div>
                )}

                <h1 className="font-heading text-[1.75rem] font-bold leading-[1.02] text-[#0D1B3E] sm:text-[3rem] lg:text-[4rem]">
                  MBBS in {country.name}
                </h1>
                {country.tagline && (
                  <p className="mt-3 max-w-3xl text-[17px] font-medium leading-snug text-[#0D1B3E]/80">
                    {country.tagline}
                  </p>
                )}
                <p className="mt-4 max-w-3xl text-[15px] leading-7 text-[#4A4742] sm:text-[16px]">
                  {country.description ||
                    `${country.name} offers international medical education with practical guidance on fees, admission, documentation, and university selection.`}
                </p>
              </div>

              <div className="mt-7 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {heroStats.map((item) => (
                  <div key={item.label} className="rounded-2xl border border-[#E7DECF] bg-white/90 px-4 py-4 shadow-sm backdrop-blur">
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-[#8A8175]">
                      {item.label}
                    </div>
                    <div className="mt-2 text-[15px] font-bold text-[#0D1B3E]">{item.value}</div>
                  </div>
                ))}
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <Link
                  href="#counselling"
                  className="inline-flex items-center justify-center rounded-full bg-[#F26419] px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#FF8040]"
                >
                  Apply for Admission Now
                </Link>
                <Link
                  href="#universities"
                  className="inline-flex items-center justify-center rounded-full border border-[#0D1B3E] px-6 py-3 text-sm font-semibold text-[#0D1B3E] transition-colors hover:bg-[#0D1B3E] hover:text-white"
                >
                  View Universities
                </Link>
              </div>
            </div>

            <div className="relative z-10 lg:sticky lg:top-24">
              <CounsellingForm />
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-[#E6DFD3] bg-white px-4 py-4 sm:px-6 lg:px-8">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-3 lg:gap-5">
          {trustPills.map((pill, idx) => (
            <div key={`${idx}-${pill}`} className="inline-flex items-center gap-2 rounded-full border border-[#E7DECF] bg-[#F8F4EC] px-4 py-2 text-[12px] font-medium text-[#4A4742]">
              <span className="text-[#F26419]">✦</span>
              <span>{pill}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-[#10244B] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 text-center">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F7B37E]">
              Country Snapshot
            </span>
            <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold">AMW&apos;s {country.name} MBBS overview</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
            {countrySnapshot.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/6 px-5 py-6 backdrop-blur">
                <div className="text-2xl sm:text-3xl font-heading font-bold text-[#F7B37E]">{item.value}</div>
                <div className="mt-2 text-sm text-white/72">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {reasonCards.length > 0 && (
        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-3xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F26419]">
                Why Students Choose {country.name}
              </span>
              <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#0D1B3E]">
                Why Indian students are considering {country.name} for MBBS
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-[#4A4742]">
                We blend country research, university comparison, and admission guidance so students can evaluate the right path without guesswork.
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {reasonCards.map((card, index) => (
                <article
                  key={`${index}-${card.title}`}
                  className="rounded-[28px] border border-[#E7DECF] bg-white p-6 shadow-[0_18px_55px_rgba(13,27,62,0.06)]"
                >
                  <div className={`mb-5 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br ${CARD_ACCENTS[index % CARD_ACCENTS.length]} text-lg text-[#0D1B3E]`}>
                    {card.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-[#0D1B3E]">{card.title}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#4A4742]">{card.description}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      {universities.length > 0 && (
        <section id="universities" className="bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-3xl">
                <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F26419]">
                  Partner Universities
                </span>
                <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#0D1B3E]">
                  Top medical universities in {country.name}
                </h2>
                <p className="mt-3 text-[15px] leading-7 text-[#4A4742]">
                  Explore active university options with fee, duration, and accreditation details before you shortlist your preferred campus.
                </p>
              </div>
              <Link
                href={`/universities?country=${encodeURIComponent(country.name || '')}`}
                className="inline-flex items-center justify-center rounded-full border border-[#0D1B3E] px-5 py-2.5 text-sm font-semibold text-[#0D1B3E] transition-colors hover:bg-[#0D1B3E] hover:text-white"
              >
                Explore all universities
              </Link>
            </div>

            <div className="grid gap-5 lg:grid-cols-2">
              {universities.slice(0, 6).map((university) => {
                const imageSrc = pickImageSource(university);

                return (
                  <article
                    key={university._id || university.slug || university.name}
                    className="overflow-hidden rounded-[28px] border border-[#E7DECF] bg-[#FFFDF9] shadow-[0_18px_55px_rgba(13,27,62,0.05)]"
                  >
                    <div className="grid gap-0 md:grid-cols-[180px_minmax(0,1fr)]">
                      <div className="relative min-h-[170px] bg-[#10244B]">
                        {imageSrc ? (
                          <SafeImage
                            src={imageSrc}
                            alt={university.name || 'University'}
                            fill
                            className="object-cover"
                            fallbackElement={
                              <div className="flex h-full items-center justify-center text-5xl text-white/20">🏫</div>
                            }
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-5xl text-white/20">🏫</div>
                        )}
                      </div>

                      <div className="flex flex-col p-6">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <h3 className="text-lg font-semibold text-[#0D1B3E]">
                              {university.name || 'University'}
                            </h3>
                            {university.accreditation && (
                              <p className="mt-1 text-sm text-[#4A4742]">{university.accreditation}</p>
                            )}
                          </div>
                          {university.annualFees && (
                            <div className="rounded-full bg-[#F8F4EC] px-3 py-1.5 text-xs font-semibold text-[#F26419]">
                              {university.annualFees}
                            </div>
                          )}
                        </div>

                        <p className="mt-4 line-clamp-3 text-sm leading-7 text-[#4A4742]">
                          {university.description ||
                            `Find course duration, fees, eligibility, and application guidance for ${university.name || 'this university'}.`}
                        </p>

                        <div className="mt-5 grid gap-2 text-[13px] text-[#4A4742] sm:grid-cols-3">
                          <div className="rounded-xl border border-[#EFE6D8] bg-white px-3 py-2.5">
                            <div className="text-[10px] uppercase tracking-[0.16em] text-[#8A8175]">Duration</div>
                            <div className="mt-1 font-semibold text-[#0D1B3E]">
                              {university.courseDuration || country.duration || '6 years'}
                            </div>
                          </div>
                          <div className="rounded-xl border border-[#EFE6D8] bg-white px-3 py-2.5">
                            <div className="text-[10px] uppercase tracking-[0.16em] text-[#8A8175]">Hostel</div>
                            <div className="mt-1 font-semibold text-[#0D1B3E]">
                              {university.hostelFees || 'Ask counsellor'}
                            </div>
                          </div>
                          <div className="rounded-xl border border-[#EFE6D8] bg-white px-3 py-2.5">
                            <div className="text-[10px] uppercase tracking-[0.16em] text-[#8A8175]">Medium</div>
                            <div className="mt-1 font-semibold text-[#0D1B3E]">
                              {university.medium || 'English'}
                            </div>
                          </div>
                        </div>

                        <div className="mt-5 flex flex-wrap gap-2">
                          {(Array.isArray(university.recognition) ? university.recognition : [])
                            .slice(0, 3)
                            .map((item, recIdx) => (
                              <span
                                key={`${university.slug}-${recIdx}-${item}`}
                                className="rounded-full border border-[#EFE6D8] bg-[#F8F4EC] px-3 py-1 text-[11px] font-medium text-[#4A4742]"
                              >
                                {item}
                              </span>
                            ))}
                        </div>

                        <div className="mt-6 flex flex-wrap gap-3">
                          <Link
                            href={`/universities/${university.slug}`}
                            className="inline-flex flex-1 items-center justify-center rounded-full border border-[#0D1B3E] px-4 py-2.5 text-sm font-semibold text-[#0D1B3E] transition-colors hover:bg-[#0D1B3E] hover:text-white"
                          >
                            View details
                          </Link>
                          <Link
                            href="#counselling"
                            className="inline-flex flex-1 items-center justify-center rounded-full bg-[#F26419] px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#FF8040]"
                          >
                            Apply now
                          </Link>
                        </div>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {universities.length > 0 && (
        <section className="px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl overflow-hidden rounded-[28px] border border-[#E7DECF] bg-white shadow-[0_18px_55px_rgba(13,27,62,0.04)]">
            <div className="border-b border-[#EFE6D8] px-6 py-5">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F26419]">
                Fee Comparison
              </span>
              <h2 className="mt-2 font-heading text-2xl sm:text-3xl font-bold text-[#0D1B3E]">
                MBBS {country.name} fee structure
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-[600px] w-full text-left text-sm">
                <thead className="bg-[#10244B] text-white">
                  <tr>
                    <th className="px-5 py-3 font-semibold">University</th>
                    <th className="px-5 py-3 font-semibold">Annual Tuition</th>
                    <th className="px-5 py-3 font-semibold">Hostel Fee</th>
                    <th className="px-5 py-3 font-semibold">Duration</th>
                    <th className="px-5 py-3 font-semibold">Medium</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#EFE6D8] bg-white">
                  {universities.slice(0, 8).map((university) => (
                    <tr key={university._id || university.slug || university.name} className="hover:bg-[#F8F4EC]">
                      <td className="px-5 py-4 font-medium text-[#0D1B3E]">{university.name || 'University'}</td>
                      <td className="px-5 py-4 text-[#4A4742]">{university.annualFees || country.feeRange || 'On request'}</td>
                      <td className="px-5 py-4 text-[#4A4742]">{university.hostelFees || 'Ask counsellor'}</td>
                      <td className="px-5 py-4 text-[#4A4742]">{university.courseDuration || country.duration || '6 years'}</td>
                      <td className="px-5 py-4 text-[#4A4742]">{university.medium || 'English'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {admissionSteps.length > 0 && (
        <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-3xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F26419]">
                Admission Process
              </span>
              <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#0D1B3E]">
                {country.name} MBBS admission process
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-[#4A4742]">
                From counselling to visa readiness, here is the usual sequence students follow when planning admission in {country.name}.
              </p>
            </div>

            <div className="grid gap-4 lg:grid-cols-4">
              {admissionSteps.map((step) => (
                <article
                  key={`${step.step}-${step.title}`}
                  className="rounded-[26px] border border-[#E7DECF] bg-[#FFFDF9] p-6 shadow-[0_14px_40px_rgba(13,27,62,0.04)]"
                >
                  <div className="mb-4 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#10244B] text-sm font-semibold text-white">
                    {step.step || '•'}
                  </div>
                  <h3 className="text-lg font-semibold text-[#0D1B3E]">{step.title || 'Step'}</h3>
                  <p className="mt-3 text-sm leading-7 text-[#4A4742]">{step.description || 'Admission support details will be shared by our counselling team.'}</p>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-[#E7DECF] bg-white p-6 shadow-[0_16px_48px_rgba(13,27,62,0.04)]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F26419]">
              Eligibility and Entry Basics
            </span>
            <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#0D1B3E]">
              {country.name} MBBS eligibility at a glance
            </h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {eligibility.length > 0 ? (
                eligibility.map((item, idx) => (
                  <div
                    key={`${idx}-${item}`}
                    className="rounded-2xl border border-[#EFE6D8] bg-[#FFFDF9] px-4 py-4 text-sm font-medium text-[#0D1B3E]"
                  >
                    <span className="mr-2 text-[#22A06B]">✓</span>
                    {item}
                  </div>
                ))
              ) : (
                <div className="rounded-2xl border border-[#EFE6D8] bg-[#FFFDF9] px-4 py-4 text-sm text-[#4A4742]">
                  Eligibility details will be confirmed during counselling.
                </div>
              )}
            </div>
          </div>

          <div className="rounded-[28px] border border-[#E7DECF] bg-white p-6 shadow-[0_16px_48px_rgba(13,27,62,0.04)]">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F26419]">
              {documentsChecklist.eyebrow || 'Documents Checklist'}
            </span>
            <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#0D1B3E]">
              {documentsChecklist.title || 'Documents commonly needed'}
            </h2>
            <ul className="mt-6 space-y-3 text-sm leading-7 text-[#4A4742]">
              {(resolvedDocumentsChecklistItems.length > 0
                ? resolvedDocumentsChecklistItems.map((item) => item.label)
                : DOCUMENTS_REQUIRED).map((item, idx) => (
                <li key={`${idx}-${item}`} className="flex items-start gap-3 rounded-2xl border border-[#EFE6D8] bg-[#FFFDF9] px-4 py-3">
                  <span className="mt-1 text-[#F26419]">•</span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {lifeCards.length > 0 && (
        <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-3xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F26419]">
                {studentLife.eyebrow || 'Student Life'}
              </span>
              <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#0D1B3E]">
                {studentLife.title || `What is life like in ${country.name} for Indian students?`}
              </h2>
              <p className="mt-3 text-[15px] leading-7 text-[#4A4742]">
                {studentLife.description || 'Beyond admission, students want clarity on accommodation, classroom culture, practical training, and day-to-day comfort abroad.'}
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {lifeCards.map((card, index) => (
                <article
                  key={`${index}-${card.title}`}
                  className="overflow-hidden rounded-[24px] border border-[#E7DECF] bg-white shadow-[0_12px_36px_rgba(13,27,62,0.04)]"
                >
                  <div className={`flex items-center gap-3 px-5 py-4 text-white ${LIFE_CARD_BACKGROUNDS[index % LIFE_CARD_BACKGROUNDS.length]}`}>
                    <span className="text-2xl">{card.icon}</span>
                    <h3 className="text-base font-semibold">{card.title}</h3>
                  </div>
                  <div className="p-5 text-sm leading-7 text-[#4A4742]">{card.description}</div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#10244B] px-4 py-14 text-white sm:px-6 lg:px-8">
        <div className="mx-auto grid max-w-7xl gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-start">
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F7B37E]">
              {supportExperience.eyebrow || 'AMW Support Experience'}
            </span>
            <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold">
              {supportExperience.title || 'We prepare students from counselling to campus arrival'}
            </h2>
            <p className="mt-4 max-w-2xl text-[15px] leading-7 text-white/72">
              {supportExperience.description || `Students choosing ${country.name} usually need more than university names. They need clear selection support, document guidance, fee planning, and dependable follow-through.`}
            </p>
            <div className="mt-6 space-y-4">
              {resolvedSupportProgressItems.map((item, idx) => (
                <div key={`${idx}-${item.label}`}>
                  <div className="mb-2 flex flex-col gap-0.5 text-sm text-white/75 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
                    <span className="min-w-0 break-words">{item.label}</span>
                    <span className="break-words text-right text-white/90 sm:text-white/75">{item.status || 'Included'}</span>
                  </div>
                  <div className="h-2 rounded-full bg-white/10">
                    <div className="h-2 rounded-full bg-[#F26419]" style={{ width: `${Math.min(100, Math.max(0, item.value))}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {resolvedSupportCards.map((item, idx) => (
              <div key={`${idx}-${item.title}`} className="rounded-[24px] border border-white/10 bg-white/6 px-5 py-6 backdrop-blur">
                <div className="break-words text-2xl sm:text-3xl font-heading font-bold leading-none text-[#F7B37E] sm:text-[2rem]">{item.title}</div>
                <div className="mt-3 break-words text-sm leading-6 text-white/72">{item.subtitle || 'Support available'}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="px-4 py-14 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-6xl rounded-[30px] border border-[#E7DECF] bg-[linear-gradient(135deg,#FFFFFF_0%,#F4FBFF_52%,#FFF6EC_100%)] px-4 py-8 text-center shadow-[0_18px_55px_rgba(13,27,62,0.05)] sm:px-10 sm:py-10">
          <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F26419]">
            Free Career Guidance Session
          </span>
          <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#0D1B3E]">
            Book a free career guidance session today
          </h2>
          <p className="mx-auto mt-4 max-w-3xl text-[15px] leading-7 text-[#4A4742]">
            Choose the right country, shortlist the right university, and understand your next steps with one clear plan built around your NEET score and budget.
          </p>
          <Link
            href="#counselling"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#F26419] px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#FF8040]"
          >
            Arrange a free counselling session
          </Link>
        </div>
      </section>

      {otherCountries.length > 0 && (
        <section className="bg-white px-4 pb-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-3xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F26419]">
                Explore More Destinations
              </span>
              <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#0D1B3E]">
                Also consider these countries for MBBS
              </h2>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-5">
              {otherCountries.map((item, index) => {
                const backgrounds = [
                  'bg-[#1F6472]',
                  'bg-[#7B6A25]',
                  'bg-[#5E3D99]',
                  'bg-[#8A2525]',
                  'bg-[#254F82]',
                ];

                return (
                  <Link
                    key={item._id || item.slug || item.name}
                    href={`/countries/${item.slug}`}
                    className={`block rounded-[22px] p-5 text-white shadow-[0_10px_24px_rgba(13,27,62,0.08)] transition-transform hover:-translate-y-1 ${backgrounds[index % backgrounds.length]}`}
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-[0.16em] text-white/70">{item.slug?.toUpperCase()}</div>
                    <div className="mt-2 text-lg font-semibold">{item.name}</div>
                    <div className="mt-3 space-y-1 text-sm text-white/75">
                      <div>{item.feeRange || 'Affordable options'}</div>
                      <div>{item.duration || '6 years'}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {faqs.length > 0 && <CountryFAQSection faqs={faqs} countryName={country.name} />}
    </div>
  );
}
