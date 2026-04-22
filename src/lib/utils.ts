import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type DateInput = string | number | Date | null | undefined;

function parseDateInput(value: DateInput) {
  if (!value) return null;

  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

export function formatDate(
  value: DateInput,
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

/** @deprecated Use formatDate instead */
export const formatDateTime = formatDate;

export function getCurrentYear() {
  return new Date().getUTCFullYear();
}

function normalizeDisplayText(value: unknown) {
  if (typeof value !== 'string') {
    return '';
  }

  return value.replace(/\s+/g, ' ').trim();
}

type ClampTextOptions = {
  fallback?: string;
  preserveWords?: boolean;
};

export function clampText(
  value: unknown,
  maxLength: number,
  options: ClampTextOptions = {}
) {
  const { fallback = '', preserveWords = true } = options;
  const text = normalizeDisplayText(value);

  if (!text) return fallback;
  if (text.length <= maxLength) return text;
  if (maxLength <= 1) return '…';

  const limit = maxLength - 1;
  let trimmed = text.slice(0, limit);

  if (preserveWords) {
    const lastSpace = trimmed.lastIndexOf(' ');
    if (lastSpace >= Math.max(8, Math.floor(limit * 0.4))) {
      trimmed = trimmed.slice(0, lastSpace);
    }
  }

  return `${trimmed.trimEnd()}…`;
}

export function clampList(
  values: unknown,
  maxItems: number,
  maxLength: number,
  options: ClampTextOptions = {}
) {
  if (!Array.isArray(values)) {
    return [] as string[];
  }

  return values
    .map((item) => clampText(item, maxLength, options))
    .filter(Boolean)
    .slice(0, maxItems);
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
  const candidateKeys = [...collectionKeys, 'items', 'results', 'rows'];
  return extractFromPayload<T>(payload, candidateKeys, new Set<unknown>());
}

function extractFromPayload<T>(payload: unknown, candidateKeys: string[], visited: Set<unknown>): T[] {
  const queue: unknown[] = [payload];

  while (queue.length > 0) {
    const current = queue.shift();
    if (!current || visited.has(current)) continue;

    if (Array.isArray(current)) return current as T[];
    if (!isObjectRecord(current)) continue;

    visited.add(current);

    const found = findArrayInRecord<T>(current, candidateKeys, queue);
    if (found) return found;
  }

  return [] as T[];
}

function findArrayInRecord<T>(record: Record<string, unknown>, keys: string[], queue: unknown[]): T[] | null {
  for (const key of keys) {
    const value = record[key];
    if (Array.isArray(value)) return value as T[];
    if (isObjectRecord(value)) queue.push(value);
  }
  if ('data' in record) queue.push(record.data);
  return null;
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
    .replaceAll(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replaceAll(/<iframe\b[^>]*>.*?<\/iframe>/gi, '')
    .replaceAll(/<object\b[^>]*>.*?<\/object>/gi, '')
    .replaceAll(/<embed\b[^>]*\/?>/gi, '')
    .replaceAll(/<link\b[^>]*\/?>/gi, '')
    .replaceAll(/\son\w+\s*=\s*["'][^"']*["']/gi, '')
    .replaceAll(/\son\w+\s*=\s*[^\s>]*/gi, '')
    .replaceAll(/javascript\s*:/gi, '')
    .replaceAll(/data\s*:\s*text\/html/gi, '');
}
