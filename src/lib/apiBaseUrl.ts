const LOCAL_API_BASE_URL = 'http://localhost:5000/api/v1';
const PRODUCTION_API_BASE_URL = 'https://gray-alligator-918491.hostingersite.com/api/v1';

export function getApiBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) {
    const normalized = configured.replace(/\/+$/, '');

    if (process.env.NODE_ENV === 'production') {
      try {
        const hostname = new URL(normalized).hostname;
        if (
          hostname === 'localhost' ||
          hostname === '127.0.0.1' ||
          hostname === '[::1]' ||
          hostname.endsWith('.localhost')
        ) {
          return PRODUCTION_API_BASE_URL;
        }
      } catch {
        // Preserve existing behavior for non-URL configuration values.
      }
    }

    return normalized;
  }

  return process.env.NODE_ENV === 'production'
    ? PRODUCTION_API_BASE_URL
    : LOCAL_API_BASE_URL;
}
