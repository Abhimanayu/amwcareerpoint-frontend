'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BlogForm from '@/components/admin/BlogForm';
import { adminGetBlogs, getBlogBySlug } from '@/lib/blogs';

export default function EditBlogPage() {
  const { id } = useParams();
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const load = async () => {
      try {
        // Step 1: lightweight list fetch to find the slug for this ID
        const res = await adminGetBlogs({ limit: 200 });
        const list = Array.isArray(res.data) ? res.data : res.data?.blogs || res.blogs || [];
        const item = list.find((b: Record<string, unknown>) => b._id === id);
        if (!item || !item.slug) {
          setError('Blog not found');
          setLoading(false);
          return;
        }

        // Step 2: fetch full detail by slug (includes content, SEO, etc.)
        const detail = await getBlogBySlug(item.slug as string);
        const fullPost = detail?.data || detail;
        if (fullPost) {
          setData(fullPost);
        } else {
          setError('Could not load blog detail');
        }
      } catch {
        setError('Failed to load blog');
      }
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" /></div>;
  if (error || !data) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">{error || 'Blog not found'}</p></div>;

  return <BlogForm initialData={data} isEdit />;
}
