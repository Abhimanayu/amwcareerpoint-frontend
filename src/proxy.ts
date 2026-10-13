import { NextRequest, NextResponse } from 'next/server';
import { getApiBaseUrl } from '@/lib/apiBaseUrl';
import { getCountrySlugCandidates } from '@/lib/slugUtils';

const RESERVED_ROOT_PATHS = new Set([
  'mbbs-india',
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

function normalizeMalformedDetailSlug(slug: string) {
  return slug.replace(/[.,;]+$/g, '');
}

async function legacyDetailStatus(resource: 'universities' | 'blogs', slug: string) {
  const apiBaseUrl = getApiBaseUrl();

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

type PublicResource = 'universities' | 'blogs' | 'countries';
type PublicDetailStatus =
  | { state: 'exists'; slug: string }
  | { state: 'missing' | 'unavailable' };

const DETAIL_ROUTE_ALIASES: Record<string, { canonicalSegment: string; resource: PublicResource }> = {
  blog: { canonicalSegment: 'blogs', resource: 'blogs' },
  blogs: { canonicalSegment: 'blogs', resource: 'blogs' },
  college: { canonicalSegment: 'college', resource: 'universities' },
  colleges: { canonicalSegment: 'college', resource: 'universities' },
  countries: { canonicalSegment: 'countries', resource: 'countries' },
  universities: { canonicalSegment: 'college', resource: 'universities' },
};

async function publicDetailStatus(resource: PublicResource, slug: string): Promise<PublicDetailStatus> {
  const candidates = resource === 'countries' ? getCountrySlugCandidates(slug) : [slug];
  let sawUnavailable = false;

  for (const candidate of candidates) {
    try {
      const response = await fetch(
        `${getApiBaseUrl()}/${resource}/${encodeURIComponent(candidate)}/seo-status`,
        {
          cache: 'no-store',
          headers: { accept: 'application/json' },
          signal: AbortSignal.timeout(2500),
        },
      );

      if (response.ok) {
        const payload = await response.json();
        if (payload?.data?.slug === candidate) return { state: 'exists', slug: candidate };
        sawUnavailable = true;
      } else if (response.status !== 404) {
        sawUnavailable = true;
      }
    } catch {
      sawUnavailable = true;
    }
  }

  return { state: sawUnavailable ? 'unavailable' : 'missing' };
}

function goneResponse(request: NextRequest) {
  const headers = {
    'Cache-Control': 'no-store, max-age=0',
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

function serviceUnavailableResponse(request: NextRequest) {
  const headers = {
    'Cache-Control': 'no-store, max-age=0',
    'Content-Type': 'text/html; charset=utf-8',
    'Retry-After': '60',
    'X-Robots-Tag': 'noindex, follow',
  };

  if (request.method === 'HEAD') {
    return new NextResponse(null, { status: 503, headers });
  }

  return new NextResponse(
    '<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="robots" content="noindex,follow"><title>Temporarily unavailable</title></head><body><h1>Temporarily unavailable</h1><p>Please try again shortly.</p></body></html>',
    { status: 503, headers },
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
  const lastPathSegment = parts.at(-1) || '';
  if (parts.length === 1 && isPublicAssetPath(lastPathSegment)) {
    return NextResponse.next();
  }

  const isIndexPhpDetail = parts.length === 3 && parts[0].toLowerCase() === 'index.php';
  const detailParts = isIndexPhpDetail ? parts.slice(1) : parts;

  if (detailParts.length === 2) {
    const originalSegment = detailParts[0].toLowerCase();
    const route = DETAIL_ROUTE_ALIASES[originalSegment];

    if (route) {
      const originalSlug = detailParts[1];
      const normalizedSlug = normalizeMalformedDetailSlug(originalSlug);
      const status = await publicDetailStatus(route.resource, normalizedSlug);
      const canonicalSlug = status.state === 'exists' ? status.slug : normalizedSlug;
      const needsCanonicalRedirect = isIndexPhpDetail
        || originalSegment !== route.canonicalSegment
        || canonicalSlug !== originalSlug;

      if (status.state === 'exists' && needsCanonicalRedirect) {
        const destination = request.nextUrl.clone();
        destination.pathname = `/${route.canonicalSegment}/${canonicalSlug}`;
        return NextResponse.redirect(destination, 308);
      }

      if (status.state === 'missing') return goneResponse(request);
      if (status.state === 'unavailable') return serviceUnavailableResponse(request);
    }
  }

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

    if (blogStatus === 'unavailable' || universityStatus === 'unavailable') {
      return serviceUnavailableResponse(request);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|favicon.svg|manifest.webmanifest|robots.txt|sitemap.xml).*)',
  ],
};
