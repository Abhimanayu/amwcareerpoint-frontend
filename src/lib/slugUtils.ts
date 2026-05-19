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
