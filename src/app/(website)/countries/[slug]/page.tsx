import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { SafeImage } from '@/components/ui/SafeImage';
import { getCountryBySlug, getCountries } from '@/lib/countries';
import { getCountrySlugFromObject } from '@/lib/slugUtils';
import { getPublicFaqs } from '@/lib/server/faqs';
import { getUniversities, getUniversityBySlug } from '@/lib/universities';
import { CounsellingForm } from '@/components/home/CounsellingForm';
import { clampSeoDescription, extractCollectionData, pickUniversityImageSource, resolveCanonicalUrl, resolveMediaUrl, sanitizeHtml, serializeJsonLd, stripHtml } from '@/lib/utils';
import { sanitizeAndOptimizeMobileContent } from '@/lib/contentValidation';
import { SEO_HOLD } from '@/lib/seoHold';
import { CountryFAQSection } from './CountryFAQSection';
import { CountryScrollTop } from './CountryScrollTop';

export const revalidate = 10;

type Props = Readonly<{ params: Promise<{ slug: string }> }>;

type CountryFaq = { question?: string; answer?: string };

function removeStructuredDataType(value: unknown, typeToRemove: string): object | null {
  if (!value || typeof value !== 'object') return null;

  const normalizeTypes = (typeValue: unknown): string[] => {
    if (Array.isArray(typeValue)) {
      return typeValue.filter((entry): entry is string => typeof entry === 'string');
    }

    if (typeof typeValue === 'string') {
      return [typeValue];
    }

    return [];
  };

  const visit = (node: unknown): unknown => {
    if (Array.isArray(node)) {
      const next = node
        .map((entry) => visit(entry))
        .filter((entry) => entry !== null && entry !== undefined);
      return next.length > 0 ? next : null;
    }

    if (!node || typeof node !== 'object') {
      return node;
    }

    const record = node as Record<string, unknown>;
    const types = normalizeTypes(record['@type']);
    if (types.includes(typeToRemove)) {
      const keptTypes = types.filter((entry) => entry !== typeToRemove);
      if (keptTypes.length === 0) {
        return null;
      }

      record['@type'] = keptTypes.length === 1 ? keptTypes[0] : keptTypes;
    }

    const nextRecord: Record<string, unknown> = {};

    for (const [key, entry] of Object.entries(record)) {
      if (key === '@type') {
        nextRecord[key] = record[key];
        continue;
      }

      const nextValue = visit(entry);
      if (nextValue !== null && nextValue !== undefined) {
        nextRecord[key] = nextValue;
      }
    }

    return Object.keys(nextRecord).length > 0 ? nextRecord : null;
  };

  const sanitized = visit(value);
  if (!sanitized || typeof sanitized !== 'object' || Array.isArray(sanitized)) {
    return null;
  }

  return sanitized as object;
}

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
  city?: string;
  location?: string;
  country?: {
    _id?: string;
    slug?: string;
    name?: string;
  };
  heroImage?: string;
  cardImage?: string;
  logo?: string;
  image?: string;
  gallery?: string[];
  annualFees?: string;
  tuitionFee?: string;
  feeRange?: string;
  fees?: string;
  hostelFees?: string;
  hostelFee?: string;
  hostel?: string;
  accommodation?: string;
  duration?: string;
  courseDuration?: string;
  medium?: string;
  language?: string;
  accreditation?: string;
  description?: string;
  recognition?: string[];
};

function getUniversityHostelFee(university: UniversitySummary) {
  return university.hostelFees || university.hostelFee || '';
}

function getHostelFeeLabel(university: UniversitySummary) {
  const fee = getUniversityHostelFee(university);
  if (fee) {
    return { value: fee, isMissing: false };
  }

  return { value: 'Ask counsellor', isMissing: true };
}

async function enrichUniversityHostelFees(universities: UniversitySummary[]) {
  const needsLookup = universities.filter(
    (university) => !getUniversityHostelFee(university) && Boolean(university.slug)
  );

  if (needsLookup.length === 0) {
    return universities;
  }

  const detailBySlug = new Map<string, string>();

  await Promise.all(
    needsLookup.map(async (university) => {
      const slug = university.slug;
      if (!slug) return;

      const response = await getUniversityBySlug(slug).catch(() => null);
      const detail = response?.data || response;
      if (!detail || typeof detail !== 'object') return;

      const hostelFee =
        (detail as { hostelFees?: string; hostelFee?: string }).hostelFees ||
        (detail as { hostelFees?: string; hostelFee?: string }).hostelFee ||
        '';

      if (hostelFee) {
        detailBySlug.set(slug, hostelFee);
      }
    })
  );

  return universities.map((university) => {
    if (getUniversityHostelFee(university) || !university.slug) {
      return university;
    }

    const hostelFee = detailBySlug.get(university.slug);
    return hostelFee ? { ...university, hostelFees: hostelFee } : university;
  });
}

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
  if (SEO_HOLD) {
    return {
      title: 'AMW Career Point',
      description: 'AMW Career Point official website.',
      robots: {
        index: false,
        follow: false,
      },
    };
  }

  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amwcareerpoint.com';
  const res = await getCountryBySlug(slug).catch(() => null);
  const country = res?.data || res;
  if (!country) return { title: 'Country not found' };
  const resolvedSlug = country.slug || slug;
  const title = country.seo?.metaTitle || `${country.name} | MBBS Abroad`;
  const description = clampSeoDescription(
    country.seo?.metaDescription || country.metaDescription || country.tagline || country.description,
    `Study MBBS in ${country.name} with AMW Career Point. Get details on fees, universities, admission, and student support.`
  );
  const canonical = resolveCanonicalUrl(country.seo?.canonicalUrl, `${siteUrl}/countries/${resolvedSlug}`);
  const ogImage = resolveMediaUrl(country.heroImage || country.cardImage || country.bannerImage || country.flagImage || '');
  return {
    title: {
      absolute: title,
    },
    description,
    alternates: { canonical },
    openGraph: {
      title,
      description,
      type: 'website',
      url: canonical,
      images: ogImage ? [{ url: ogImage }] : undefined,
    },
  };
}

function pickImageSource(university: UniversitySummary) {
  return resolveMediaUrl(pickUniversityImageSource(university as Record<string, unknown>));
}

function shouldContainUniversityImage(src?: string) {
  if (!src) return false;
  return /logo|poster|banner|badge|emblem/i.test(src);
}

function getUniversityCity(university: UniversitySummary, countryName?: string) {
  return university.city || university.location || university.country?.name || countryName || 'Campus';
}

function getUniversityFee(university: UniversitySummary, countryFeeRange?: string) {
  return university.annualFees || university.tuitionFee || university.feeRange || university.fees || countryFeeRange || 'On request';
}

function getUniversityDuration(university: UniversitySummary, countryDuration?: string) {
  return university.duration || university.courseDuration || countryDuration || '6 years';
}

function getUniversityHostel(university: UniversitySummary) {
  return getUniversityHostelFee(university) || university.hostel || university.accommodation || 'On-campus hostel';
}

function getUniversityMedium(university: UniversitySummary) {
  return university.medium || university.language || 'English';
}

function hasNmcMention(university: UniversitySummary) {
  const accreditation = university.accreditation || '';
  const recognition = Array.isArray(university.recognition) ? university.recognition.join(' ') : '';
  return /\bnmc\b/i.test(`${accreditation} ${recognition}`);
}

function getFallbackLifeCards(countryName: string) {
  return [
    {
      title: 'Accommodation and student comfort',
      description: `Indian students in ${countryName} usually look for safe housing, manageable daily costs, and campus support from day one.`,
      icon: 'Home',
    },
    {
      title: 'Food and daily routine',
      description: 'AMW helps students understand hostel life, meal options, and what to expect from their first semester abroad.',
      icon: 'Food',
    },
    {
      title: 'Campus and classroom culture',
      description: `The academic environment in ${countryName} combines structured teaching with steady clinical exposure over time.`,
      icon: 'Study',
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
      icon: card.icon || 'Study',
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

function normalizeObjectPosition(value?: string) {
  if (!value) return undefined;

  const normalized = value.trim().toLowerCase();
  if (!normalized || normalized.length > 40) return undefined;

  // Supports values like "50% 30%".
  const percentPair = normalized.match(/^(\d{1,3})%\s+(\d{1,3})%$/);
  if (percentPair) {
    const x = Number(percentPair[1]);
    const y = Number(percentPair[2]);
    if (x >= 0 && x <= 100 && y >= 0 && y <= 100) {
      return `${x}% ${y}%`;
    }
  }

  // Supports values like "center", "top", "left top", "right center".
  const allowed = /^(center|top|bottom|left|right|left\s+top|left\s+center|left\s+bottom|center\s+top|center\s+center|center\s+bottom|right\s+top|right\s+center|right\s+bottom)$/;
  if (allowed.test(normalized)) {
    return normalized;
  }

  return undefined;
}

function normalizeValue(value: unknown) {
  return typeof value === 'string' ? value.trim().toLowerCase() : '';
}

function isUniversityForCountry(
  university: UniversitySummary,
  countryId: string,
  countrySlug: string
) {
  const countryRef = university?.country;
  if (!countryRef || typeof countryRef !== 'object') {
    return true;
  }

  const countryRecord = countryRef as { _id?: string; slug?: string };
  const universityCountryId = normalizeValue(countryRecord._id);
  const universityCountrySlug = normalizeValue(countryRecord.slug);

  const normalizedCountryId = normalizeValue(countryId);
  const normalizedCountrySlug = normalizeValue(countrySlug);

  if (universityCountryId && normalizedCountryId) {
    return universityCountryId === normalizedCountryId;
  }

  if (universityCountrySlug && normalizedCountrySlug) {
    return universityCountrySlug === normalizedCountrySlug;
  }

  return true;
}

async function fetchCountryUniversities(countryId: string, countrySlug: string) {
  const requestAttempts: Array<{ country: string; source: 'id' | 'slug' }> = [];

  if (countryId) {
    requestAttempts.push({ country: countryId, source: 'id' });
  }

  if (countrySlug) {
    requestAttempts.push({ country: countrySlug, source: 'slug' });
  }

  for (const attempt of requestAttempts) {
    const response = await getUniversities({ country: attempt.country, limit: 500, sort: 'sortOrder' }).catch(() => null);
    const list = extractCollectionData<UniversitySummary>(response, ['universities']);
    if (list.length === 0) {
      continue;
    }

    const filtered = list.filter((university) => isUniversityForCountry(university, countryId, countrySlug));
    if (filtered.length > 0 || attempt.source === 'slug') {
      return filtered;
    }
  }

  return [] as UniversitySummary[];
}

export default async function CountryPage({ params }: Props) {
  const { slug } = await params;
  const res = await getCountryBySlug(slug).catch(() => null);
  const country = res?.data || res;

  if (!country) return notFound();
  const resolvedSlug = country.slug || slug;

  // Load FAQs from both sources in parallel
  let apiFaqs: Array<{ question: string; answer: string }> = [];
  try {
    apiFaqs = await getPublicFaqs('country', { pageSlug: resolvedSlug });
  } catch { /* FAQ admin records may not exist */ }

  // Merge FAQs: prefer API admin records first, then append embedded FAQs not already present by question
  const normalizeQuestion = (value?: string) => (value || '').trim().toLowerCase();
  const cleanApiFaqs = apiFaqs.filter((faq) => faq.question?.trim() && faq.answer?.trim());
  const embeddedFaqs = (Array.isArray(country.faqs) ? country.faqs : []).filter(
    (faq: CountryFaq): faq is Required<CountryFaq> => Boolean(faq?.question?.trim() && faq?.answer?.trim())
  );
  const apiQuestionSet = new Set(cleanApiFaqs.map((faq) => normalizeQuestion(faq.question)));
  const mergedFaqs = cleanApiFaqs.length > 0
    ? [...cleanApiFaqs, ...embeddedFaqs.filter((faq: Required<CountryFaq>) => !apiQuestionSet.has(normalizeQuestion(faq.question)))]
    : embeddedFaqs;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amwcareerpoint.com';
  let schemaJsonLd: object | null = null;
  if (country.seo?.schemaMarkup) {
    try {
      schemaJsonLd = removeStructuredDataType(JSON.parse(country.seo.schemaMarkup), 'FAQPage');
    } catch { /* invalid JSON */ }
  }
  schemaJsonLd ??= {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: `MBBS in ${country.name}`,
      description: clampSeoDescription(country.description || country.tagline, `Study MBBS in ${country.name} with AMW Career Point.`),
      url: `${siteUrl}/countries/${slug}`,
      publisher: { '@type': 'Organization', name: 'AMW Career Point', url: siteUrl },
    };
  const breadcrumbSchemaJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        name: 'Home',
        item: `${siteUrl}/`,
      },
      {
        '@type': 'ListItem',
        position: 2,
        name: 'Countries',
        item: `${siteUrl}/countries`,
      },
      {
        '@type': 'ListItem',
        position: 3,
        name: `MBBS in ${country.name}`,
        item: `${siteUrl}/countries/${slug}`,
      },
    ],
  };
  const faqSchemaJsonLd = mergedFaqs.length > 0
    ? {
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: mergedFaqs.slice(0, 20).map((faq: { question: string; answer: string }) => ({
          '@type': 'Question',
          name: faq.question.trim(),
          acceptedAnswer: {
            '@type': 'Answer',
            text: faq.answer.trim(),
          },
        })),
      }
    : null;

  const countryId = typeof country._id === 'string' ? country._id : '';
  const countryFilterSlug = typeof country.slug === 'string' && country.slug.trim() ? country.slug : resolvedSlug;
  const heroImage = resolveMediaUrl(country.heroImage);
  const flagImage = resolveMediaUrl(country.flagImage);
  const heroImageClass = 'object-cover object-center opacity-100 saturate-110 contrast-110';
  const heroImageObjectPosition = normalizeObjectPosition(
    (
      country as {
        heroImagePosition?: string;
        heroImageFocus?: string;
        seo?: { heroImagePosition?: string };
      }
    ).heroImagePosition ||
      (
        country as {
          heroImagePosition?: string;
          heroImageFocus?: string;
          seo?: { heroImagePosition?: string };
        }
      ).heroImageFocus ||
      (
        country as {
          heroImagePosition?: string;
          heroImageFocus?: string;
          seo?: { heroImagePosition?: string };
        }
      ).seo?.heroImagePosition
  );

  // Parallelize independent data fetches
  const [countryUniversities, countriesRes] = await Promise.all([
    fetchCountryUniversities(countryId, countryFilterSlug),
    getCountries({ limit: 12 }).catch(() => null),
  ]);

  const universities = await enrichUniversityHostelFees(countryUniversities);
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
    { value: `${admissionSteps.length || 0}`, label: 'Admission steps' },
    { value: `${eligibility.length || 0}+`, label: 'Eligibility checkpoints' },
  ];

  const reasonCards =
    features.length > 0
      ? features.slice(0, 6).map((feature) => ({
          title: feature.title || 'Why choose this destination',
          description:
            feature.description ||
            stripHtml(country.description || '') ||
            `Students choose ${country.name} for quality medical education and structured support.`,
          icon: feature.icon || '+',
        }))
      : highlights.slice(0, 6).map((highlight) => ({
          title: highlight,
          description:
            country.tagline ||
            `Study MBBS in ${country.name} with a balance of affordability, recognition, and student support.`,
          icon: '+',
        }));

  const studentLifeCards = Array.isArray(studentLife.cards)
    ? studentLife.cards.filter(
        (card): card is Required<Pick<StudentLifeCard, 'title'>> & StudentLifeCard =>
          Boolean(card?.title)
      )
    : [];
  const lifeCards = resolveLifeCards(country.name || 'this destination', studentLifeCards, reasonCards);
  const studentLifeDescriptionHtml = studentLife.description
    ? sanitizeAndOptimizeMobileContent(sanitizeHtml(studentLife.description))
    : '';

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
  const heroTrustItems = [
    { title: 'Trusted by 18,500+ Students', subtitle: 'Successful admissions across top universities' },
    { title: '10+ Years of Experience', subtitle: 'Expert guidance you can rely on' },
    { title: 'Transparent Process', subtitle: 'Clear information, no hidden charges' },
    { title: 'End-to-End Support', subtitle: 'From admission to accommodation' },
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

  const collegesFilterValue = [countryId, countryFilterSlug, resolvedSlug].find(
    (candidate): candidate is string => typeof candidate === 'string' && candidate.trim().length > 0
  ) || '';

  return (
    <div className="overflow-x-hidden bg-[#F8F4EC] text-[#0D1B3E]" suppressHydrationWarning>
      <CountryScrollTop />
      {!SEO_HOLD && (
        <>
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(schemaJsonLd) }}
          />
          <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: serializeJsonLd(breadcrumbSchemaJsonLd) }}
          />
          {faqSchemaJsonLd && (
            <script
              type="application/ld+json"
              dangerouslySetInnerHTML={{ __html: serializeJsonLd(faqSchemaJsonLd) }}
            />
          )}
        </>
      )}
      <section className="relative overflow-hidden border-b border-[#E6DFD3] bg-[#F8F4EC] px-4 py-8 sm:px-6 sm:py-10 lg:min-h-[calc(100svh-112px)] lg:px-8 lg:py-12 xl:min-h-[820px]">
        <div className="absolute inset-0 z-0 bg-[#F8F4EC]" />
        {heroImage && (
          <div className="pointer-events-none absolute inset-0 z-0 hidden sm:block">
            <SafeImage
              src={heroImage}
              alt={country.name}
              fill
              priority
              sizes="100vw"
              className={heroImageClass}
              style={heroImageObjectPosition ? { objectPosition: heroImageObjectPosition } : undefined}
              fallbackElement={<div className="absolute inset-0 bg-gradient-to-br from-[#FFF9F1] to-[#E7DECF]" />}
            />
            <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,249,241,0.93)_0%,rgba(255,249,241,0.78)_26%,rgba(255,249,241,0.2)_50%,rgba(255,249,241,0)_72%)]" />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.08)_0%,rgba(255,255,255,0)_34%,rgba(248,244,236,0.12)_100%)]" />
            <div className="absolute inset-y-0 left-0 w-[42%] bg-[linear-gradient(90deg,rgba(255,249,241,0.9),rgba(255,249,241,0.36)_72%,rgba(255,249,241,0))]" />
          </div>
        )}

        <div className="relative z-10 mx-auto flex max-w-[1440px] flex-col">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,0.98fr)_minmax(350px,430px)] lg:items-start xl:gap-14">
            <div className="max-w-[760px]">
              {flagImage && (
                <div className="mb-6 inline-flex items-center gap-3 rounded-full border border-white/80 bg-white/90 px-4 py-2.5 text-sm font-semibold text-[#1F2B44] shadow-[0_12px_30px_rgba(13,27,62,0.12)] backdrop-blur">
                  <SafeImage
                    src={flagImage}
                    alt={`${country.name} flag`}
                    width={28}
                    height={18}
                    className="rounded-sm object-cover"
                    fallbackElement={<div className="h-[18px] w-7 rounded-sm bg-[#DDD9D2]" />}
                  />
                  <span>Study destination: {country.name}</span>
                </div>
              )}

              <h1 className="font-heading text-[clamp(2.7rem,15vw,4rem)] font-bold leading-[0.98] tracking-normal text-[#0D1B3E] sm:text-[4rem] lg:text-[5.1rem] xl:text-[5.9rem]">
                MBBS in<br className="hidden sm:block" /> {country.name}
              </h1>
              <div className="mt-5 h-1 w-20 rounded-full bg-[#F26419]" />

              {country.tagline && (
                <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-semibold text-[#243454]">
                  {country.tagline.split('|').slice(0, 5).map((item: string, index: number) => (
                    <span key={`${index}-${item.trim()}`} className={`items-center gap-2 ${index > 2 ? 'hidden sm:inline-flex' : 'inline-flex'}`}>
                      {index === 0 && <span className="h-5 w-5 rounded-full border border-[#2B5BB5] text-center text-[11px] leading-[18px] text-[#2B5BB5]">+</span>}
                      <span>{item.trim()}</span>
                    </span>
                  ))}
                </div>
              )}

              {heroImage && (
                  <div className="mt-6 overflow-hidden rounded-[24px] border border-white/72 bg-white/74 p-2 shadow-[0_16px_40px_rgba(13,27,62,0.1)] sm:hidden">
                  <SafeImage
                    src={heroImage}
                    alt={`${country.name} destination view`}
                    width={900}
                    height={560}
                    priority
                    sizes="(max-width: 639px) 100vw, 900px"
                    className="h-[240px] w-full rounded-[18px] object-cover saturate-110 contrast-110 min-[420px]:h-[280px]"
                    style={heroImageObjectPosition ? { objectPosition: heroImageObjectPosition } : undefined}
                    fallbackElement={<div className="flex min-h-[190px] items-center justify-center rounded-[18px] bg-[#E7DECF] text-sm text-[#4A4742]">Image unavailable</div>}
                  />
                </div>
              )}

              <div className="mt-6 grid grid-cols-2 gap-3 xl:grid-cols-4">
                {heroStats.map((item, index) => (
                  <div key={item.label} className="flex min-w-0 items-center gap-2.5 rounded-2xl border border-white/75 bg-white/88 px-3 py-3 shadow-[0_14px_36px_rgba(13,27,62,0.09)] backdrop-blur sm:gap-3 sm:px-3.5 sm:py-3.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#FFF4E9] text-xs font-bold text-[#F26419] sm:h-10 sm:w-10 sm:text-sm">
                      {String(index + 1).padStart(2, '0')}
                    </div>
                    <div className="min-w-0">
                      <div className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8A8175] sm:text-[11px]">
                        {item.label}
                      </div>
                      <div className="mt-1 text-[12px] font-bold leading-snug text-[#0D1B3E] sm:text-[14px]">{item.value}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div id="counselling" className="relative z-10 mx-auto w-full max-w-[470px] lg:pt-8 xl:pt-10">
              <CounsellingForm />
            </div>
          </div>

          <div className="mt-7 flex flex-col gap-4 lg:mt-10">
            <div className="grid overflow-hidden rounded-[20px] border border-white/70 bg-white/76 shadow-[0_20px_60px_rgba(13,27,62,0.11)] backdrop-blur sm:rounded-[24px] md:grid-cols-2 xl:grid-cols-4">
              {heroTrustItems.map((item, index) => (
                <div key={item.title} className="flex items-center gap-3 border-b border-[#E4D8C9] px-4 py-3 last:border-b-0 sm:gap-4 sm:px-5 sm:py-4 md:border-b-0 md:border-r md:last:border-r-0">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-[#0D1B3E]/12 bg-white text-xs font-bold text-[#0D1B3E] sm:h-10 sm:w-10 sm:text-sm">
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#0D1B3E] sm:text-base">{item.title}</div>
                    <div className="mt-1 text-xs leading-snug text-[#4A4742] sm:text-sm">{item.subtitle}</div>
                  </div>
                </div>
              ))}
            </div>

            {trustPills.length > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-3">
                {trustPills.map((pill, idx) => (
                  <div key={`${idx}-${pill}`} className="inline-flex items-center gap-2 rounded-full border border-[#E7DECF] bg-white/82 px-4 py-2 text-[12px] font-medium text-[#4A4742] shadow-sm backdrop-blur">
                    <span className="text-[#F26419]">+</span>
                    <span>{pill}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
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
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {countrySnapshot.map((item) => (
              <div key={item.label} className="rounded-2xl border border-white/10 bg-white/6 px-5 py-6 backdrop-blur">
                <div className="text-2xl sm:text-3xl font-heading font-bold text-[#F7B37E]">{item.value}</div>
                <div className="mt-2 text-sm text-white/72">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {country.description && (
        <section className="px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-4xl">
            <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F26419]">
              About {country.name}
            </span>
            <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#0D1B3E]">
              MBBS in {country.name} — an overview
            </h2>
            <div
              className="blog-content prose prose-sm sm:prose-base max-w-none mt-6 text-[#4A4742] leading-relaxed"
              dangerouslySetInnerHTML={{ __html: sanitizeAndOptimizeMobileContent(sanitizeHtml(country.description)) }}
            />
          </div>
        </section>
      )}

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
        <section id="universities" className="bg-white">
          <div className="mx-auto max-w-[1200px] px-4 py-12 pb-[60px] sm:px-6 sm:py-14 sm:pb-16 lg:px-6 lg:py-[72px] lg:pb-20">
            <div className="mb-10 flex flex-col gap-6 md:mb-12 lg:flex-row lg:items-end lg:justify-between">
              <div className="max-w-[560px]">
                <div className="mb-3 inline-flex items-center gap-2 text-[12px] font-semibold uppercase tracking-[0.1em] text-[#00A99D]">
                  <span className="inline-block h-[2px] w-5 rounded-full bg-[#00A99D]" />
                  Partner Universities
                </div>
                <h2 className="font-heading text-[26px] font-bold leading-[1.25] text-[#0D2240] sm:text-[32px] lg:text-[36px]">
                  Top medical universities in {country.name}
                </h2>
                <p className="mt-2.5 text-[15px] leading-[1.6] text-[#6B7A90]">
                  Explore active university options with fee, duration, and accreditation details before you shortlist your preferred campus.
                </p>
              </div>
              <Link
                href={`/college?country=${encodeURIComponent(collegesFilterValue)}`}
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-[10px] border border-[#0D2240] px-5 py-[11px] text-sm font-semibold text-[#0D2240] transition-colors hover:bg-[#0D2240] hover:text-white"
              >
                Explore all colleges
                <span aria-hidden="true">→</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {universities.slice(0, 6).map((university) => {
                const imageSrc = pickImageSource(university);
                const imageUseContain = shouldContainUniversityImage(imageSrc);
                const city = getUniversityCity(university, country.name);
                const fee = getUniversityFee(university, country.feeRange);
                const duration = getUniversityDuration(university, country.duration);
                const hostel = getUniversityHostel(university);
                const medium = getUniversityMedium(university);
                const isNmcApproved = hasNmcMention(university);
                const hasSlug = typeof university.slug === 'string' && university.slug.trim().length > 0;

                return (
                  <article
                    key={university._id || university.slug || university.name}
                    className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#DDE3EC] bg-white shadow-[0_2px_8px_rgba(13,34,64,0.07),0_0_0_1px_rgba(13,34,64,0.06)] transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(13,34,64,0.13),0_0_0_1px_rgba(242,101,34,0.18)]"
                  >
                    <div className="relative h-[188px] w-full shrink-0 overflow-hidden bg-[#0D2240]">
                      {imageSrc ? (
                        <SafeImage
                          src={imageSrc}
                          alt={`${university.name || 'University'} campus`}
                          fill
                          sizes="(min-width: 1280px) 360px, (min-width: 640px) 50vw, 100vw"
                          className={imageUseContain ? 'object-contain bg-[#F8F9FB] p-2' : 'object-cover object-center transition-transform duration-500 group-hover:scale-[1.04]'}
                          fallbackElement={
                            <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#1A3A5C] via-[#0D2240] to-[#0A1C34] text-white/25">
                              <span className="text-4xl">🏫</span>
                              <span className="text-[11px] font-semibold uppercase tracking-[0.1em]">{city}</span>
                            </div>
                          }
                        />
                      ) : (
                        <div className="flex h-full w-full flex-col items-center justify-center gap-2 bg-gradient-to-br from-[#1A3A5C] via-[#0D2240] to-[#0A1C34] text-white/25">
                          <span className="text-4xl">🏫</span>
                          <span className="text-[11px] font-semibold uppercase tracking-[0.1em]">{city}</span>
                        </div>
                      )}

                      <span className={`absolute left-3 top-3 inline-flex items-center gap-1 rounded-[20px] px-2.5 py-1 text-[11px] font-semibold text-white ${isNmcApproved ? 'bg-[#00A99D]/90' : 'bg-[#F26522]/90'}`}>
                        <span aria-hidden="true">{isNmcApproved ? '✓' : '★'}</span>
                        {isNmcApproved ? 'NMC Approved' : 'Partner'}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-5 pb-[18px]">
                      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium uppercase tracking-[0.07em] text-[#6B7A90]">
                        <span className="text-[#00A99D]">📍</span>
                        <span className="min-w-0 break-words">{city}, {country.name}</span>
                      </div>

                      <h3 className="line-clamp-2 break-words font-heading text-[16px] font-bold leading-[1.35] text-[#0D2240]">
                        {university.name || 'University'}
                      </h3>

                      <span className="mt-3 inline-flex w-fit max-w-full items-center gap-1.5 rounded-[20px] border border-[#FAD0B5] bg-[#FFF4EE] px-3 py-1.5 text-[12.5px] font-semibold leading-tight text-[#9A3E10]">
                        <span aria-hidden="true" className="text-[#F26522]">₹</span>
                        <span className="break-words">{fee}</span>
                      </span>

                      <p className="mt-3 line-clamp-3 break-words text-[13.5px] leading-[1.65] text-[#6B7A90]">
                        {stripHtml(university.description || '') ||
                          `Explore fees, eligibility, and admission guidance for ${university.name || 'this university'} in ${country.name}.`}
                      </p>

                      <div className="mt-4 flex flex-wrap gap-1.5">
                        <span className="inline-flex max-w-full items-center gap-1 rounded-[20px] border border-[#E2E6EC] bg-[#F0F2F5] px-2.5 py-1 text-[12px] text-[#374151]">
                          <span aria-hidden="true" className="text-[#00A99D]">⏱</span>
                          <span className="break-words"><strong className="font-semibold text-[#0D2240]">{duration}</strong></span>
                        </span>
                        <span className="inline-flex max-w-full items-center gap-1 rounded-[20px] border border-[#E2E6EC] bg-[#F0F2F5] px-2.5 py-1 text-[12px] text-[#374151]">
                          <span aria-hidden="true" className="text-[#00A99D]">🏠</span>
                          <span className="break-words"><strong className="font-semibold text-[#0D2240]">{hostel}</strong></span>
                        </span>
                        <span className="inline-flex max-w-full items-center gap-1 rounded-[20px] border border-[#E2E6EC] bg-[#F0F2F5] px-2.5 py-1 text-[12px] text-[#374151]">
                          <span aria-hidden="true" className="text-[#00A99D]">🌐</span>
                          <span className="break-words"><strong className="font-semibold text-[#0D2240]">{medium}</strong></span>
                        </span>
                      </div>

                      <div className="mt-auto h-px bg-[#F0F2F5]" />

                      <div className="mt-4 flex flex-wrap gap-2.5">
                        {hasSlug ? (
                          <Link
                            href={`/college/${university.slug}`}
                            className="inline-flex min-h-10 min-w-[132px] flex-1 items-center justify-center gap-1 rounded-[10px] border border-[#0D2240] px-3 text-[13px] font-semibold text-[#0D2240] transition-colors hover:bg-[#0D2240] hover:text-white"
                          >
                            View details
                          </Link>
                        ) : (
                          <span className="inline-flex min-h-10 min-w-[132px] flex-1 items-center justify-center gap-1 rounded-[10px] border border-[#C8CFDA] px-3 text-[13px] font-semibold text-[#6B7A90]">
                            View details
                          </span>
                        )}
                        <Link
                          href="#counselling"
                          className="inline-flex min-h-10 min-w-[132px] flex-1 items-center justify-center gap-1 rounded-[10px] border border-[#F26522] bg-[#F26522] px-3 text-[13px] font-semibold text-white transition-colors hover:border-[#D45818] hover:bg-[#D45818]"
                        >
                          Apply now
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>

            <div className="mt-10 flex items-start gap-3 rounded-xl border-l-4 border-l-[#00A99D] bg-[#E8EDF4] px-4 py-4 sm:px-6">
              <span className="text-xl text-[#00A99D]" aria-hidden="true">ℹ️</span>
              <p className="text-[13.5px] leading-[1.55] text-[#0D2240]">
                {country.name?.toLowerCase().includes('russia')
                  ? 'FMGE outcomes in Russia can vary by university. Our team provides university-specific guidance and a full Russia context briefing at every intake. '
                  : `Our team provides university-specific guidance and a full ${country.name} context briefing at every intake. `}
                <Link href="#counselling" className="font-semibold text-[#F26522] hover:underline">
                  Book a free counselling session →
                </Link>
              </p>
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
              <table className="min-w-max w-full text-left text-sm">
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
                  {universities.slice(0, 8).map((university) => {
                    const hostelFee = getHostelFeeLabel(university);

                    return (
                      <tr key={university._id || university.slug || university.name} className="hover:bg-[#F8F4EC]">
                        <td className="px-5 py-4 font-medium text-[#0D1B3E] whitespace-normal break-words">{university.name || 'University'}</td>
                        <td className="px-5 py-4 text-[#4A4742] whitespace-normal break-words">{university.annualFees || country.feeRange || 'On request'}</td>
                        <td className="px-5 py-4">
                          <span
                            className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold ${
                              hostelFee.isMissing
                                ? 'bg-[#FFF7ED] text-[#B45309] border border-[#FDE68A]'
                                : 'bg-[#ECFDF3] text-[#047857] border border-[#A7F3D0]'
                            }`}
                          >
                            {hostelFee.value}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-[#4A4742] whitespace-normal break-words">{university.courseDuration || country.duration || '6 years'}</td>
                        <td className="px-5 py-4 text-[#4A4742] whitespace-normal break-words">{university.medium || 'English'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </section>
      )}

      {typeof country.visaInfo === 'string' && country.visaInfo.trim() && (
        <section className="bg-white px-4 py-14 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            <div className="mb-8 max-w-3xl">
              <span className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#F26419]">
                Visa Information
              </span>
              <h2 className="mt-3 font-heading text-2xl sm:text-3xl font-bold text-[#0D1B3E]">
                Visa requirements for {country.name}
              </h2>
            </div>
            <div className="rounded-[24px] border border-[#E7DECF] bg-[#FFFDF9] p-6 shadow-[0_12px_36px_rgba(13,27,62,0.04)]">
              <p className="whitespace-pre-line text-[15px] leading-7 text-[#4A4742]">{country.visaInfo}</p>
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
                    {step.step || <>&bull;</>}
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
                    <span className="mr-2 text-[#22A06B]">&#10003;</span>
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
                  <span className="mt-1 text-[#F26419]">&bull;</span>
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
              {studentLifeDescriptionHtml ? (
                <div
                  className="blog-content prose prose-sm sm:prose-base mt-3 max-w-none text-[#4A4742] prose-a:text-[#F26419] prose-a:no-underline hover:prose-a:underline"
                  dangerouslySetInnerHTML={{ __html: studentLifeDescriptionHtml }}
                />
              ) : (
                <p className="mt-3 text-[15px] leading-7 text-[#4A4742]">
                  Beyond admission, students want clarity on accommodation, classroom culture, practical training, and day-to-day comfort abroad.
                </p>
              )}
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
                    href={`/countries/${getCountrySlugFromObject(item)}`}
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

      {mergedFaqs.length > 0 && <CountryFAQSection faqs={mergedFaqs} countryName={country.name} />}
    </div>
  );
}
