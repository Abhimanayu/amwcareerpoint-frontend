import 'server-only';

import { cache } from 'react';

export interface PublicFaqItem {
  question: string;
  answer: string;
}

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

export const homeFallbackFaqs: PublicFaqItem[] = [
  {
    question: 'Are foreign MBBS degrees valid in India?',
    answer:
      'Yes, MBBS degrees from NMC-approved universities are valid. You must clear FMGE/NExT to practise in India. AMW only partners with NMC-approved universities.',
  },
  {
    question: 'How much does MBBS in Russia cost?',
    answer:
      'Total cost ranges from ₹20–35 lakhs for the complete 6-year program including tuition, hostel, and living expenses — far less than Indian private colleges.',
  },
  {
    question: 'Do I need to know Russian?',
    answer:
      'No. Most universities offer English-medium MBBS programs. Learning basic Russian helps with clinical rotations but is not required.',
  },
  {
    question: 'What is the FMGE pass rate for AMW students?',
    answer:
      'AMW students have a 78% FMGE pass rate — nearly 1.6× higher than the national average. We start prep from the 4th year.',
  },
  {
    question: 'How does the admission process work?',
    answer:
      '1) Share your NEET score, 2) We present matched college options, 3) We handle docs, applications & visa, 4) Support throughout your 6-year journey.',
  },
  {
    question: 'Can I visit home during the year?',
    answer:
      'Yes — most universities have winter and summer breaks. Typically 2–3 months vacation per year.',
  },
];

export const contactFallbackFaqs: PublicFaqItem[] = [
  {
    question: 'What is the admission process?',
    answer:
      'The admission process typically involves NEET qualification, document submission, university selection, and visa processing. We guide you through each step.',
  },
  {
    question: 'What are the fees involved?',
    answer:
      'Tuition fees vary by country and university, typically ranging from $3,000-$8,000 per year. We help you choose affordable options that fit your budget.',
  },
  {
    question: 'Is NEET mandatory?',
    answer:
      'Yes, NEET qualification is mandatory for Indian students to study MBBS abroad and to practice medicine in India after graduation.',
  },
  {
    question: 'How long does the process take?',
    answer:
      'The complete process from application to visa usually takes 2-4 months. We ensure timely processing of all documents and procedures.',
  },
];

function normalizeFaqs(payload: unknown): PublicFaqItem[] {
  const items = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)
      ? (payload as { data: unknown[] }).data
      : [];

  return items
    .map((item) => {
      if (!item || typeof item !== 'object') {
        return null;
      }

      const question = typeof (item as { question?: unknown }).question === 'string'
        ? (item as { question: string }).question.trim()
        : '';
      const answer = typeof (item as { answer?: unknown }).answer === 'string'
        ? (item as { answer: string }).answer.trim()
        : '';

      if (!question || !answer) {
        return null;
      }

      return { question, answer };
    })
    .filter((item): item is PublicFaqItem => item !== null);
}

const fetchFaqs = cache(async (page: string, pageSlug?: string) => {
  const searchParams = new URLSearchParams({ faqPage: page });

  if (pageSlug) {
    searchParams.set('pageSlug', pageSlug);
  }

  const response = await fetch(`${API_BASE_URL}/faqs?${searchParams.toString()}`, {
    next: { revalidate: 60 },
  });

  if (!response.ok) {
    throw new Error(`Failed to load FAQs for ${page}`);
  }

  return normalizeFaqs(await response.json());
});

export async function getPublicFaqs(
  page: string,
  options?: { pageSlug?: string; fallback?: PublicFaqItem[] }
) {
  try {
    const faqs = await fetchFaqs(page, options?.pageSlug);
    if (faqs.length > 0) {
      return faqs;
    }
  } catch {}

  return options?.fallback ?? [];
}