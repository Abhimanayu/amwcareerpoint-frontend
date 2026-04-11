'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import CountryForm from '@/components/admin/CountryForm';
import { adminGetCountries } from '@/lib/countries';

export default function EditCountryPage() {
  const { id } = useParams();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminGetCountries({ limit: 200 });
        const countries = Array.isArray(res.data) ? res.data : res.data?.countries || res.countries || [];
        const country = countries.find((c: Record<string, unknown>) => c._id === id);
        if (country) setData(country);
      } catch {
        // silent
      }
      setLoading(false);
    };
    load();
  }, [id]);

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
