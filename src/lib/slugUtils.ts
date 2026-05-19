/**
 * Utility functions for handling country slugs
 */

/**
 * Get the URL-friendly slug for a country
 * Converts country names to the slug format used by country detail pages.
 */
export const getCountrySlug = (countryName?: string): string => {
  if (!countryName) return '';

  // Generate slug: convert to lowercase, replace non-alphanumeric with hyphens then collapse/trim
  return countryName
    .toLowerCase()
    .replaceAll(/[^a-z0-9]/g, '-')
    .replaceAll(/-+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');
};

/**
 * Get slug from country object (API response or fallback data)
 * Prioritizes the slug field if available
 */
export const getCountrySlugFromObject = (country: { slug?: string; name?: string } | null | undefined): string => {
  if (country?.slug) return country.slug;
  return getCountrySlug(country?.name);
};

export const stripMbbsSlugPrefix = (slug?: string): string => {
  const normalized = getCountrySlug(slug);
  if (!normalized) return '';

  return normalized.startsWith('mbbs-in-') ? normalized.slice('mbbs-in-'.length) : normalized;
};

export const getCountrySlugCandidates = (slug?: string): string[] => {
  const normalized = getCountrySlug(slug);
  const baseSlug = stripMbbsSlugPrefix(normalized);
  const candidates = [normalized, baseSlug && `mbbs-in-${baseSlug}`, baseSlug].filter(
    (value): value is string => Boolean(value)
  );

  return Array.from(new Set(candidates));
};
