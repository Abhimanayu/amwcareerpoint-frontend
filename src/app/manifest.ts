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
        src: '/logo.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
    ],
  };
}
