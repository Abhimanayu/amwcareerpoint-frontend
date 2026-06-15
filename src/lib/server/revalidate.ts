'use server';

import { revalidatePath } from 'next/cache';
import { invalidateServerCacheByPrefix } from '@/lib/serverRequestCache';

type ContentRevalidationInput = {
  type: 'home' | 'about' | 'blog' | 'country' | 'university' | 'faq';
  slug?: string | null;
  previousSlug?: string | null;
  page?: string | null;
  pageSlug?: string | null;
  countrySlug?: string | null;
};

const cleanSlug = (value?: string | null) => (
  typeof value === 'string' && value.trim() ? value.trim() : null
);

function revalidateIfPath(path: string | null) {
  if (path) revalidatePath(path);
}

export async function revalidateFaqPages(page?: string, pageSlug?: string) {
  await revalidateContentPages({ type: 'faq', page, pageSlug });
}

export async function revalidateContentPages(input: ContentRevalidationInput) {
  const slug = cleanSlug(input.slug);
  const previousSlug = cleanSlug(input.previousSlug);
  const pageSlug = cleanSlug(input.pageSlug);
  const countrySlug = cleanSlug(input.countrySlug);
  const relatedSlugs = Array.from(new Set([slug, previousSlug].filter(Boolean)));

  if (input.type === 'home') {
    invalidateServerCacheByPrefix(['home-settings']);
    revalidatePath('/');
    return;
  }

  if (input.type === 'about') {
    invalidateServerCacheByPrefix(['about-settings']);
    revalidatePath('/about');
    return;
  }

  if (input.type === 'blog') {
    invalidateServerCacheByPrefix(['blogs:list:', 'blogs:slug:', 'blogs:categories']);
    revalidatePath('/blogs');
    relatedSlugs.forEach((item) => revalidatePath(`/blogs/${item}`));
    return;
  }

  if (input.type === 'country') {
    invalidateServerCacheByPrefix(['countries:list:', 'countries:slug:', 'universities:list:']);
    revalidatePath('/');
    revalidatePath('/countries');
    revalidatePath('/college');
    relatedSlugs.forEach((item) => revalidatePath(`/countries/${item}`));
    return;
  }

  if (input.type === 'university') {
    invalidateServerCacheByPrefix(['universities:list:', 'universities:slug:', 'countries:slug:']);
    revalidatePath('/');
    revalidatePath('/college');
    relatedSlugs.forEach((item) => revalidatePath(`/college/${item}`));
    revalidateIfPath(countrySlug ? `/countries/${countrySlug}` : null);
    return;
  }

  if (input.type === 'faq') {
    invalidateServerCacheByPrefix(['faqs:']);
    revalidatePath('/');
    revalidatePath('/contact');

    if (input.page === 'about') revalidatePath('/about');
    if (input.page === 'country' && pageSlug) revalidatePath(`/countries/${pageSlug}`);
    if (input.page === 'university' && pageSlug) revalidatePath(`/college/${pageSlug}`);
  }
}
