'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import UniversityForm from '@/components/admin/UniversityForm';
import { adminGetUniversities, getUniversityBySlug } from '@/lib/universities';

export default function EditUniversityPage() {
  const { id } = useParams();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        // Step 1: Lightweight list fetch to find the slug for this _id
        const res = await adminGetUniversities({ limit: 200 });
        const list = Array.isArray(res.data) ? res.data : res.data?.universities || res.universities || [];
        const item = list.find((u: Record<string, unknown>) => u._id === id);
        if (item?.slug) {
          // Step 2: Full detail fetch by slug (returns ALL fields)
          const detail = await getUniversityBySlug(item.slug as string);
          const full = detail.data || detail;
          setData(full);
        }
      } catch {
        // silent
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#F26419] border-t-transparent rounded-full animate-spin" /></div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">University not found</p></div>;

  return <UniversityForm initialData={data} isEdit />;
}
