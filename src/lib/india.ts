import { api, adminApi } from './api';
export type IndiaPage = {
  _id?: string; kind: 'overview' | 'state'; name: string; slug: string; previousSlugs?: string[];
  title: string; intro: string; image: string; imageAlt: string; academicYear: string; verifiedAt: string;
  authority: string; officialUrl: string; ctaLabel: string; sortOrder: number; featured: boolean;
  status: 'draft' | 'published'; updatedAt?: string;
  sections: { title: string; body: string; visible: boolean }[];
  highlights: { label: string; value: string }[]; faqs: { question: string; answer: string }[];
  sources: { label: string; url: string }[];
  seo: { metaTitle: string; metaDescription: string; canonicalUrl: string; ogImage: string; noindex: boolean };
};
export type IndiaCollegeData = {
  management: string; deemed: boolean; annualTuition: number | null; seats: number | null;
  academicYear: string; verifiedAt: string; sourceUrl: string; otherFees: string; admission: string;
  cutoffs: { year: number; category: string; quota: string; round: string; closingRank: number; sourceUrl: string }[];
};
export type IndiaCollege = { _id: string; name: string; slug: string; city: string; heroImage?: string; heroImageAlt?: string; description?: string; hostelFees?: string; eligibility?: string; indiaState: string; india: IndiaCollegeData; faqs?: { question: string; answer: string }[] };
export const emptyIndiaCollege = (): IndiaCollegeData => ({ management: '', deemed: false, annualTuition: null, seats: null, academicYear: '', verifiedAt: '', sourceUrl: '', otherFees: '', admission: '', cutoffs: [] });
export const emptyIndiaPage = (kind: IndiaPage['kind'] = 'state'): IndiaPage => ({ kind, name: kind === 'overview' ? 'India' : '', slug: kind === 'overview' ? 'india' : '', title: '', intro: '', image: '', imageAlt: '', academicYear: '', verifiedAt: '', authority: '', officialUrl: '', ctaLabel: 'Get free counselling', sortOrder: 0, featured: false, status: 'draft', sections: [], highlights: [], faqs: [], sources: [], seo: { metaTitle: '', metaDescription: '', canonicalUrl: '', ogImage: '', noindex: false } });
export const indiaPath = (p: Pick<IndiaPage, 'kind' | 'slug'>) => p.kind === 'overview' ? '/mbbs-india' : `/mbbs-india/${p.slug}`;
export const getIndiaStates = async () => (await api.get<{ data: IndiaPage[] }>('/india/states')).data.data;
export const getIndiaAdminPages = async () => (await adminApi.get<{ data: IndiaPage[] }>('/india/admin/pages')).data.data;
export function httpUrl(value?: string) { return value && /^https?:\/\//i.test(value) ? value : undefined; }
