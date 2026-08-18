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
  'favicon.ico',
  'favicon.svg',
  'manifest.webmanifest',
  'robots.txt',
  'sitemap.xml',
]);

function isPublicAssetPath(slug: string) {
  return slug.includes('.')
    || slug.startsWith('google')
    || slug.startsWith('favicon-')
    || slug.startsWith('apple-touch-icon')
    || slug.startsWith('android-chrome')
    || slug === 'og-image';
}

export function proxy(request: NextRequest) {
  if (request.method !== 'GET' && request.method !== 'HEAD') {
    return NextResponse.next();
  }

  const { pathname } = request.nextUrl;
  const parts = pathname.split('/').filter(Boolean);

  if (parts.length !== 1) {
    return NextResponse.next();
  }

  const slug = parts[0].toLowerCase();
  if (RESERVED_ROOT_PATHS.has(slug) || isPublicAssetPath(slug)) {
    return NextResponse.next();
  }

  const url = request.nextUrl.clone();
  url.pathname = `/college/${parts[0]}`;
  url.search = '';

  return NextResponse.redirect(url, 308);
}

export const config = {
  matcher: '/:path*',
};
