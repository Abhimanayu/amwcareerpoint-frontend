'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import BlogForm from '@/components/admin/BlogForm';
import { adminGetBlogById } from '@/lib/blogs';

export default function EditBlogPage() {
  const { id } = useParams();
  const blogId = Array.isArray(id) ? id[0] : id;
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!blogId) {
      return;
    }

    const load = async () => {
      try {
        const res = await adminGetBlogById(blogId);
        const fullPost = (res?.data || res) as Record<string, unknown> | null;
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
  }, [blogId]);

  if (!blogId) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">Blog not found</p></div>;

  if (loading) return <div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-2 border-orange border-t-transparent rounded-full animate-spin" /></div>;
  if (error || !data) return <div className="min-h-screen flex items-center justify-center"><p className="text-gray-500">{error || 'Blog not found'}</p></div>;

  return <BlogForm initialData={data} isEdit />;
}
