import 'server-only';
import { cache } from 'react';
import type { Metadata } from 'next';
import { getApiBaseUrl } from '../apiBaseUrl';
import { IndiaPage, IndiaCollege, indiaPath } from '../india';
import { SEO_HOLD } from '../seoHold';
async function read<T>(path: string): Promise<T | null> {
  const response = await fetch(`${getApiBaseUrl()}/india/${path}`, { cache: 'no-store', signal: AbortSignal.timeout(12000) });
  if (response.status === 404) return null;
  if (!response.ok) throw new Error('MBBS India information is temporarily unavailable. Please try again.');
  return (await response.json()).data;
}
export const readIndiaPage = cache((slug: string) => read<IndiaPage>(`pages/${encodeURIComponent(slug)}`));
export const readIndiaStates = cache(async () => await read<IndiaPage[]>('states') || []);
export const readIndiaColleges = cache(async (slug: string) => await read<IndiaCollege[]>(`states/${encodeURIComponent(slug)}/colleges`) || []);
export function indiaMetadata(page: IndiaPage | null): Metadata {
  if (!page) return { title: 'MBBS India', robots: { index: false, follow: true } };
  const title = page.seo.metaTitle || page.title;
  const description = page.seo.metaDescription || page.intro;
  const canonical = page.seo.canonicalUrl || indiaPath(page);
  return { title: { absolute: title }, description, alternates: { canonical }, robots: { index: !SEO_HOLD && !page.seo.noindex, follow: !SEO_HOLD }, openGraph: { title, description, url: canonical, images: page.seo.ogImage || page.image ? [page.seo.ogImage || page.image] : [] }, twitter: { card: 'summary_large_image', title, description, images: page.seo.ogImage || page.image ? [page.seo.ogImage || page.image] : [] } };
}
