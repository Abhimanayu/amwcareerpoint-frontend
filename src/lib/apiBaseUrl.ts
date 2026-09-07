const LOCAL_API_BASE_URL = 'http://localhost:5000/api/v1';
const PRODUCTION_API_BASE_URL = 'https://gray-alligator-918491.hostingersite.com/api/v1';

export function getApiBaseUrl() {
  const configured = process.env.NEXT_PUBLIC_API_URL?.trim();
  if (configured) return configured.replace(/\/+$/, '');

  return process.env.NODE_ENV === 'production'
    ? PRODUCTION_API_BASE_URL
    : LOCAL_API_BASE_URL;
}
