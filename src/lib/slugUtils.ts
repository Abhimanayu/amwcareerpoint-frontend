/**
 * Utility functions for handling country slugs
 */

const COUNTRY_SLUG_FALLBACKS: Record<string, string> = {
  russia: 'mbbs-in-russia',
  uzbekistan: 'mbbs-in-uzbekistan',
  kazakhstan: 'mbbs-in-kazakhstan',
  kyrgyzstan: 'mbbs-in-kyrgyzstan',
  georgia: 'mbbs-in-georgia',
};

const normalizeSlugToken = (value?: string) => {
  if (!value) return '';
  return value
    .toLowerCase()
    .replaceAll(/[^a-z0-9]/g, '-')
    .replaceAll(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Get the URL-friendly slug for a country
 * Converts country names to the slug format used by country detail pages.
 */
export const getCountrySlug = (countryName?: string): string => {
  const normalized = normalizeSlugToken(countryName);
  if (!normalized) return '';

  if (normalized.startsWith('mbbs-in-')) {
    return normalized;
  }

  if (COUNTRY_SLUG_FALLBACKS[normalized]) {
    return COUNTRY_SLUG_FALLBACKS[normalized];
  }

  return `mbbs-in-${normalized}`;
};

/**
 * Get slug from country object (API response or fallback data)
 * Prioritizes the slug field if available
 */
export const getCountrySlugFromObject = (country: { slug?: string; name?: string } | null | undefined): string => {
  if (country?.slug) {
    const normalizedSlug = normalizeSlugToken(country.slug);
    if (normalizedSlug.startsWith('mbbs-in-')) return normalizedSlug;
    if (COUNTRY_SLUG_FALLBACKS[normalizedSlug]) return COUNTRY_SLUG_FALLBACKS[normalizedSlug];
    return normalizedSlug;
  }

  return getCountrySlug(country?.name);
};

export const stripMbbsSlugPrefix = (slug?: string): string => {
  const normalized = normalizeSlugToken(slug);
  if (!normalized) return '';

  return normalized.startsWith('mbbs-in-') ? normalized.slice('mbbs-in-'.length) : normalized;
};

export const getCountrySlugCandidates = (slug?: string): string[] => {
  const normalized = normalizeSlugToken(slug);
  if (!normalized) return [];

  const direct = normalized;
  const prefixed = normalized.startsWith('mbbs-in-') ? normalized : `mbbs-in-${normalized}`;
  const baseSlug = stripMbbsSlugPrefix(normalized);
  const canonical = COUNTRY_SLUG_FALLBACKS[baseSlug] ?? prefixed;
  const canonicalBase = stripMbbsSlugPrefix(canonical);

  const candidates = [direct, canonical, prefixed, baseSlug, canonicalBase].filter(
    (value): value is string => Boolean(value)
  );

  return Array.from(new Set(candidates));
};
