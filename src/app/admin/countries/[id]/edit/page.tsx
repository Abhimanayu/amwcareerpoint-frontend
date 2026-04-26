'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CountryForm from '@/components/admin/CountryForm';
import { adminGetCountryById, getCountryBySlugFresh } from '@/lib/countries';

const COUNTRY_NESTED_KEYS = [
  'studentLife',
  'documentsChecklist',
  'supportExperience',
  'features',
  'eligibility',
  'admissionProcess',
  'faqs',
  'seo',
] as const;

function extractCountryRecord(payload: unknown): Record<string, unknown> | null {
  if (!payload || typeof payload !== 'object') {
    return null;
  }

  const root = payload as Record<string, unknown>;

  if (root.data && typeof root.data === 'object') {
    const data = root.data as Record<string, unknown>;
    if (data.country && typeof data.country === 'object') {
      return data.country as Record<string, unknown>;
    }

    return data;
  }

  if (root.country && typeof root.country === 'object') {
    return root.country as Record<string, unknown>;
  }

  return root;
}

function hasMeaningfulNestedValue(value: unknown) {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>).length > 0;
  }

  return false;
}

function mergeCountryForEdit(
  adminCountry: Record<string, unknown>,
  detailCountry: Record<string, unknown>
) {
  const merged = {
    ...detailCountry,
    ...adminCountry,
  } as Record<string, unknown>;

  for (const key of COUNTRY_NESTED_KEYS) {
    if (!hasMeaningfulNestedValue(adminCountry[key]) && hasMeaningfulNestedValue(detailCountry[key])) {
      merged[key] = detailCountry[key];
    }
  }

  return merged;
}

export default function EditCountryPage() {
  const { id } = useParams();
  const countryId = Array.isArray(id) ? id[0] : id;
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!countryId) {
      return;
    }

    const load = async () => {
      try {
        const res = await adminGetCountryById(countryId);
        const country = extractCountryRecord(res);
        if (country && typeof country === 'object') {
          const slug = typeof country.slug === 'string' ? country.slug : '';
          if (slug) {
            const detailRes = await getCountryBySlugFresh(slug).catch(() => null);
            const detailCountry = extractCountryRecord(detailRes);
            if (detailCountry) {
              setData(mergeCountryForEdit(country, detailCountry));
            } else {
              setData(country);
            }
          } else {
            setData(country);
          }
        }
      } catch {
        // silent
      }
      setLoading(false);
    };
    load();
  }, [countryId]);

  if (!countryId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Country not found</p>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#F26419] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!data) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Country not found</p>
      </div>
    );
  }

  return <CountryForm initialData={data} isEdit />;
}
