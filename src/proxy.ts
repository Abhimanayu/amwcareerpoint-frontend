import { NextRequest, NextResponse } from 'next/server';

const RESERVED_ROOT_PATHS = new Set([
  'about',
  'admin',
  'api',
  'blogs',
  'college',
  'college-predictor',
  'contact',
  'countries',
]);

const OBSOLETE_WORDPRESS_PATHS = new Set([
  '/blogs_paginate',
  '/colleges_paginate',
  '/comments',
  '/country_colleges_paginate',
  '/country_paginate',
  '/documentation',
  '/guardians',
  '/packages',
  '/predictor-colleges',
  '/tutorials',
  '/videos',
]);

const SPAM_PATH_MARKERS = [
  'aave',
  'bitcoin',
  'blockchain',
  'ethereum',
  'monero',
  'polkadot',
  'solana',
  'tokenomics',
  'vechain',
  'wallet',
  'whitepaper',
];

function isClearlyObsoleteOrSpamPath(pathname: string) {
  const normalizedPath = pathname.toLowerCase().replace(/\/+$/, '') || '/';

  return OBSOLETE_WORDPRESS_PATHS.has(normalizedPath)
    || normalizedPath.startsWith('/public/')
    || /^\/\d+\.shtml$/.test(normalizedPath)
    || normalizedPath.includes('%3clink')
    || normalizedPath.includes('<link')
    || SPAM_PATH_MARKERS.some((marker) => normalizedPath.includes(marker));
}

function isPublicAssetPath(slug: string) {
  return slug.includes('.')
    || slug.startsWith('google')
    || slug.startsWith('favicon-')
    || slug.startsWith('apple-touch-icon')
    || slug.startsWith('android-chrome')
    || slug === 'og-image';
}

async function legacyDetailStatus(resource: 'universities' | 'blogs', slug: string) {
  const apiBaseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(/\/+$/, '');

  try {
    const response = await fetch(`${apiBaseUrl}/${resource}/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
      headers: { accept: 'application/json' },
      signal: AbortSignal.timeout(2500),
    });

    if (response.ok) return 'exists';
    if (response.status === 404) return 'missing';
    return 'unavailable';
  } catch {
    return 'unavailable';
  }
}

function goneResponse(request: NextRequest) {
  const headers = {
    'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    'Content-Type': 'text/html; charset=utf-8',
    'X-Robots-Tag': 'noindex, nofollow',
  };

  if (request.method === 'HEAD') {
    return new NextResponse(null, { status: 410, headers });
  }

  return new NextResponse(
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,nofollow"><title>Content removed</title></head><body><h1>Content removed</h1></body></html>',
    { status: 410, headers },
  );
}

export async function proxy(request: NextRequest) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  if (isClearlyObsoleteOrSpamPath(pathname)) {
    return goneResponse(request);
  }

  const parts = pathname.split('/').filter(Boolean);
  if (parts.length === 1) {
    const originalSlug = parts[0];
    const slug = originalSlug.toLowerCase();
    if (RESERVED_ROOT_PATHS.has(slug) || isPublicAssetPath(slug)) {
      return NextResponse.next();
    }

    const [blogStatus, universityStatus] = await Promise.all([
      legacyDetailStatus('blogs', slug),
      legacyDetailStatus('universities', slug),
    ]);
    const destination = blogStatus === 'exists'
      ? `/blogs/${originalSlug}`
      : universityStatus === 'exists'
        ? `/college/${originalSlug}`
        : null;

    if (destination) {
      return NextResponse.redirect(new URL(destination, request.url), 308);
    }

    if (blogStatus === 'missing' && universityStatus === 'missing') {
      return goneResponse(request);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|manifest.webmanifest|robots.txt|sitemap.xml).*)',
  ],
};
