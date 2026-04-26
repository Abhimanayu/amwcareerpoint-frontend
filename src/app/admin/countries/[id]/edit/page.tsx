'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CountryForm from '@/components/admin/CountryForm';
import { adminGetCountryById } from '@/lib/countries';

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
        const country = (res?.data || res) as Record<string, unknown> | null;
        if (country && typeof country === 'object') {
          setData(country);
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
