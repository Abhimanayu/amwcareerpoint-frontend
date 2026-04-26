'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import UniversityForm from '@/components/admin/UniversityForm';
import { adminGetUniversityById } from '@/lib/universities';

export default function EditUniversityPage() {
  const { id } = useParams();
  const universityId = Array.isArray(id) ? id[0] : id;
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!universityId) {
      return;
    }

    const load = async () => {
      try {
        const res = await adminGetUniversityById(universityId);
        const university = (res?.data || res) as Record<string, unknown> | null;
        if (university && typeof university === 'object') {
          setData(university);
        }
      } catch {
        // silent
      }
      setLoading(false);
    };
    load();
  }, [universityId]);

  if (!universityId) {
    return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">University not found</p></div>;
  }

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#F26419] border-t-transparent rounded-full animate-spin" /></div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">University not found</p></div>;

  return <UniversityForm initialData={data} isEdit />;
}
