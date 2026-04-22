'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BlogForm from '@/components/admin/BlogForm';
import { adminGetBlogs } from '@/lib/blogs';

export default function EditBlogPage() {
  const { id } = useParams();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await adminGetBlogs({ limit: 200 });
        const list = Array.isArray(res.data) ? res.data : res.data?.blogs || res.blogs || [];
        const item = list.find((b: Record<string, unknown>) => b._id === id);
        if (item) setData(item);
      } catch {
        // silent
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" /></div>;
  if (!data) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Blog not found</p></div>;

  return <BlogForm initialData={data} isEdit />;
}
