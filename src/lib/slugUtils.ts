/**
 * Utility functions for handling country slugs
 */

const countrySlugMap: Record<string, string> = {
  'Russia': 'mbbs-in-russia',
  'Uzbekistan': 'mbbs-in-uzbekistan',
  'Kyrgyzstan': 'mbbs-in-kyrgyzstan',
};

/**
 * Get the URL-friendly slug for a country
 * Prefers explicit mapping, falls back to lowercase conversion
 */
export const getCountrySlug = (countryName?: string): string => {
  if (!countryName) return '';
  const mapped = countrySlugMap[countryName];
  if (mapped) return mapped;
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
