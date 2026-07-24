import type { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'AMW Career Point',
    short_name: 'AMW',
    description: 'AMW Career Point - MBBS Abroad Consultancy for Indian Students',
    start_url: '/',
    display: 'standalone',
    background_color: '#F8F4EC',
    theme_color: '#0D1B3E',
    icons: [
      {
        src: '/favicon-48x48.png',
        sizes: '48x48',
        type: 'image/png',
      },
      {
        src: '/android-chrome-192x192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: '/android-chrome-512x512.png',
        sizes: '512x512',
        type: 'image/png',
      },
      {
        src: '/favicon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
