'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import FaqForm from '@/components/admin/FaqForm';
import { adminGetFaqs } from '@/lib/faqs';

export default function EditFaqPage() {
  const { id } = useParams();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminGetFaqs();
        const items = Array.isArray(res.data) ? res.data : res.data?.faqs || res.faqs || [];
        const faq = items.find((f: Record<string, unknown>) => f._id === id);
        if (faq) setData(faq);
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
        <p className="text-gray-500">FAQ not found</p>
      </div>
    );
  }

  return <FaqForm initialData={data} isEdit />;
}
