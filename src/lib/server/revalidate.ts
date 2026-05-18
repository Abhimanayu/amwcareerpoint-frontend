'use server';

import { revalidatePath } from 'next/cache';

export async function revalidateFaqPages(page?: string, pageSlug?: string) {
  revalidatePath('/');
  revalidatePath('/contact');
  if (page === 'about') revalidatePath('/about');
  if (page === 'country' && pageSlug) revalidatePath(`/countries/${pageSlug}`);
  if (page === 'university' && pageSlug) revalidatePath(`/college/${pageSlug}`);
}
