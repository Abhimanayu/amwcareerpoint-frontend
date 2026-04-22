import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

function parseDateInput(value: string | number | Date | null | undefined) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(
  value: string | number | Date | null | undefined,
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = {}
) {
  const date = parseDateInput(value);
  if (!date) return '';

  return new Intl.DateTimeFormat(locale, {
    timeZone: 'UTC',
    ...options,
  }).format(date);
}

export function formatDateTime(
  value: string | number | Date | null | undefined,
  locale = 'en-US',
  options: Intl.DateTimeFormatOptions = {}
) {
  const date = parseDateInput(value);
  if (!date) return '';

  return new Intl.DateTimeFormat(locale, {
    timeZone: 'UTC',
    ...options,
  }).format(date);
}

export function getCurrentYear() {
  return new Date().getUTCFullYear();
}

export function isRemoteImageUrl(src: unknown): src is string {
  return typeof src === 'string' && /^https?:\/\//i.test(src);
}

function getApiOrigin() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

  try {
    return new URL(apiUrl).origin;
  } catch {
    return '';
  }
}

export function resolveMediaUrl(src: unknown) {
  if (typeof src !== 'string') {
    return '';
  }

  const value = src.trim();
  if (!value) {
    return '';
  }

  // Handle absolute URLs
  if (/^(https?:)?\/\//i.test(value) || value.startsWith('data:') || value.startsWith('blob:')) {
    return value;
  }

  if (value.startsWith('/uploads/')) {
    const apiOrigin = getApiOrigin();
    return apiOrigin ? `${apiOrigin}${value}` : value;
  }

  if (value.startsWith('uploads/')) {
    const apiOrigin = getApiOrigin();
    return apiOrigin ? `${apiOrigin}/${value}` : `/${value}`;
  }

  if (value.startsWith('/')) {
    return value;
  }

  const apiOrigin = getApiOrigin();
  if (!apiOrigin) {
    return `/${value}`;
  }

  return `${apiOrigin}/${value}`;
}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function extractCollectionData<T>(payload: unknown, collectionKeys: string[] = []) {
  const queue: unknown[] = [payload];
  const visited = new Set<unknown>();
  const candidateKeys = [...collectionKeys, 'items', 'results', 'rows'];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current)) {
      continue;
    }

    if (Array.isArray(current)) {
      return current as T[];
    }

    if (!isObjectRecord(current)) {
      continue;
    }

    visited.add(current);

    for (const key of candidateKeys) {
      const value = current[key];
      if (Array.isArray(value)) {
        return value as T[];
      }
      if (isObjectRecord(value)) {
        queue.push(value);
      }
    }

    if ('data' in current) {
      queue.push(current.data);
    }
  }

  return [] as T[];
}

export function pickUniversityImageSource(university: Record<string, unknown> | null | undefined) {
  if (!university) {
    return '';
  }

  const gallery = Array.isArray(university.gallery) ? university.gallery : [];

  return ([
    university.heroImage,
    university.logo,
    university.cardImage,
    gallery[0],
    university.image,
  ].find((value) => typeof value === 'string' && value.trim()) as string | undefined) || '';
}

export function pickBlogImageSource(post: Record<string, unknown> | null | undefined) {
  if (!post) {
    return '';
  }

  return ([post.coverImage, post.image, post.heroImage].find(
    (value) => typeof value === 'string' && value.trim()
  ) as string | undefined) || '';
}

/** Sanitize HTML: strip script tags, event handlers, and dangerous elements */
export function sanitizeHtml(html: string): string {
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^>]*>.*?<\/iframe>/gi, '')
    .replace(/<object\b[^>]*>.*?<\/object>/gi, '')
    .replace(/<embed\b[^>]*\/?>/gi, '')
    .replace(/<link\b[^>]*\/?>/gi, '')
    .replace(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
    .replace(/\son\w+\s*=\s*[^\s>]*/gi, '')
    .replace(/javascript\s*:/gi, '')
    .replace(/data\s*:\s*text\/html/gi, '');
}