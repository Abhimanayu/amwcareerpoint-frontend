export type HomeSeoSettings = {
  metaTitle: string;
  metaDescription: string;
  keywords: string;
  canonicalUrl: string;
  schemaMarkup: string;
};

export type HomeHeroSettings = {
  badge: string;
  heading: string;
  highlightedText: string;
  trailingText: string;
  description: string;
  primaryCtaText: string;
  primaryCtaHref: string;
  secondaryCtaText: string;
  secondaryCtaHref: string;
};

export type HomeStatItem = {
  number: string;
  label: string;
  desc: string;
};

export type HomeCuratedCountry = {
  _id: string;
  name: string;
  slug: string;
  flagImage: string;
  cardImage: string;
  heroImage?: string;
  feeRange: string;
  annualFeeRange?: string;
  fees?: string;
  duration: string;
  dur?: string;
  highlights?: string[];
};

export type HomeCuratedUniversity = {
  _id: string;
  name: string;
  slug: string;
  logo: string;
  heroImage: string;
  annualFees: string;
  country?: {
    name?: string;
    flagImage?: string;
  };
};

export type HomeCuratedBlog = {
  _id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string | { name?: string };
  author: string;
  createdAt: string;
};

export type HomeSectionVisibility = {
  hero: boolean;
  stats: boolean;
  whyChoose: boolean;
  experts: boolean;
  universities: boolean;
  countries: boolean;
  comparison: boolean;
  process: boolean;
  predictor: boolean;
  reviews: boolean;
  videos: boolean;
  blogs: boolean;
  cta: boolean;
  faq: boolean;
};

export type HomeSettings = {
  seo: HomeSeoSettings;
  hero: HomeHeroSettings;
  stats: HomeStatItem[];
  sections: HomeSectionVisibility;
  homeCountries: HomeCuratedCountry[];
  homeUniversities: HomeCuratedUniversity[];
  homeBlogs: HomeCuratedBlog[];
};

export const defaultHomeSettings: HomeSettings = {
  seo: {
    metaTitle: "Study MBBS Abroad for Indian Students",
    metaDescription:
      "AMW Career Point helps Indian students study MBBS abroad in Russia, Kazakhstan, Georgia, Kyrgyzstan, and Europe at affordable fees with complete admission support.",
    keywords:
      "MBBS abroad, study MBBS abroad, MBBS consultancy, NEET counselling, AMW Career Point",
    canonicalUrl: "https://amwcareerpoint.com/",
    schemaMarkup: "",
  },
  hero: {
    badge: "India's #1 Trusted Medical Consultancy",
    heading: "Dream of Becoming a Doctor?",
    highlightedText: "MBBS Abroad",
    trailingText: "Might Be Your Smartest Move.",
    description:
      "India has one MBBS seat for every ten NEET-qualified students. Studying MBBS abroad at universities that follow the NMC FMGL Gazette 2021 provides students with a proven path to their dream of becoming a doctor, and we have helped 18,500+ students make that dream a reality since 2009.",
    primaryCtaText: "Use College Predictor",
    primaryCtaHref: "#predictor",
    secondaryCtaText: "Meet Our Experts",
    secondaryCtaHref: "#experts",
  },
  stats: [
    { number: "18,500+", label: "Students Guided", desc: "Across India & abroad" },
    { number: "18+", label: "Years of Trust", desc: "Experienced counselling team" },
    { number: "5/5", label: "Student Rating", desc: "Consistent parent confidence" },
    { number: "45+", label: "Top Destinations", desc: "India plus global options" },
  ],
  sections: {
    hero: true,
    stats: true,
    whyChoose: true,
    experts: true,
    universities: true,
    countries: true,
    comparison: true,
    process: true,
    predictor: true,
    reviews: true,
    videos: true,
    blogs: true,
    cta: true,
    faq: true,
  },
  homeCountries: [],
  homeUniversities: [],
  homeBlogs: [],
};

function readString(value: unknown, fallback: string) {
  if (typeof value === "string" && value.trim() !== "") return value;
  return fallback;
}

function readBoolean(value: unknown, fallback: boolean) {
  return typeof value === "boolean" ? value : fallback;
}

function readArray<T>(value: unknown): T[] {
  return Array.isArray(value) ? (value as T[]) : [];
}

export function mergeHomeSettings(input: unknown): HomeSettings {
  const source = input && typeof input === "object" ? (input as Partial<HomeSettings>) : {};
  const seo: Partial<HomeSeoSettings> =
    source.seo && typeof source.seo === "object" ? source.seo : {};
  const hero: Partial<HomeHeroSettings> =
    source.hero && typeof source.hero === "object" ? source.hero : {};
  const sections =
    source.sections && typeof source.sections === "object"
      ? (source.sections as Partial<HomeSectionVisibility>)
      : {};
  const rawStats =
    Array.isArray(source.stats) && source.stats.length > 0
      ? source.stats
      : defaultHomeSettings.stats;

  // Pad to up to 4 slots — remaining slots fall back to corresponding defaults
  const paddedStats = [
    ...rawStats,
    ...defaultHomeSettings.stats.slice(rawStats.length),
  ].slice(0, 4);

  return {
    seo: {
      metaTitle: readString(seo.metaTitle, defaultHomeSettings.seo.metaTitle),
      metaDescription: readString(
        seo.metaDescription,
        defaultHomeSettings.seo.metaDescription
      ),
      keywords: readString(seo.keywords, defaultHomeSettings.seo.keywords),
      canonicalUrl: readString(seo.canonicalUrl, defaultHomeSettings.seo.canonicalUrl),
      schemaMarkup: readString(seo.schemaMarkup, defaultHomeSettings.seo.schemaMarkup),
    },
    hero: {
      badge: readString(hero.badge, defaultHomeSettings.hero.badge),
      heading: readString(hero.heading, defaultHomeSettings.hero.heading),
      highlightedText: readString(
        hero.highlightedText,
        defaultHomeSettings.hero.highlightedText
      ),
      trailingText: readString(hero.trailingText, defaultHomeSettings.hero.trailingText),
      description: readString(hero.description, defaultHomeSettings.hero.description),
      primaryCtaText: readString(
        hero.primaryCtaText,
        defaultHomeSettings.hero.primaryCtaText
      ),
      primaryCtaHref: readString(
        hero.primaryCtaHref,
        defaultHomeSettings.hero.primaryCtaHref
      ),
      secondaryCtaText: readString(
        hero.secondaryCtaText,
        defaultHomeSettings.hero.secondaryCtaText
      ),
      secondaryCtaHref: readString(
        hero.secondaryCtaHref,
        defaultHomeSettings.hero.secondaryCtaHref
      ),
    },
    stats: paddedStats.map((stat, index) => {
      const item = stat && typeof stat === "object" ? (stat as Partial<HomeStatItem>) : {};
      const fallback = defaultHomeSettings.stats[index] ?? defaultHomeSettings.stats[0];
      return {
        number: readString(item.number, fallback.number),
        label: readString(item.label, fallback.label),
        desc: readString(item.desc, fallback.desc),
      };
    }),
    sections: {
      hero: readBoolean(sections.hero, defaultHomeSettings.sections.hero),
      stats: readBoolean(sections.stats, defaultHomeSettings.sections.stats),
      whyChoose: readBoolean(sections.whyChoose, defaultHomeSettings.sections.whyChoose),
      experts: readBoolean(sections.experts, defaultHomeSettings.sections.experts),
      universities: readBoolean(
        sections.universities,
        defaultHomeSettings.sections.universities
      ),
      countries: readBoolean(sections.countries, defaultHomeSettings.sections.countries),
      comparison: readBoolean(
        sections.comparison,
        defaultHomeSettings.sections.comparison
      ),
      process: readBoolean(sections.process, defaultHomeSettings.sections.process),
      predictor: readBoolean(sections.predictor, defaultHomeSettings.sections.predictor),
      reviews: readBoolean(sections.reviews, defaultHomeSettings.sections.reviews),
      videos: readBoolean(sections.videos, defaultHomeSettings.sections.videos),
      blogs: readBoolean(sections.blogs, defaultHomeSettings.sections.blogs),
      cta: readBoolean(sections.cta, defaultHomeSettings.sections.cta),
      faq: readBoolean(sections.faq, defaultHomeSettings.sections.faq),
    },
    homeCountries: readArray<HomeCuratedCountry>(source.homeCountries),
    homeUniversities: readArray<HomeCuratedUniversity>(source.homeUniversities),
    homeBlogs: readArray<HomeCuratedBlog>(source.homeBlogs),
  };
}

export function parseSchemaMarkup(schemaMarkup: string) {
  const value = schemaMarkup.trim();
  if (!value) return null;

  try {
    return JSON.parse(value) as unknown;
  } catch {
    return null;
  }
}
