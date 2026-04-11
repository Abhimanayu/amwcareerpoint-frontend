'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import ConfirmModal from '@/components/admin/ConfirmModal';
import StatusBadge from '@/components/admin/StatusBadge';
import { adminGetBlogs, deleteBlog } from '@/lib/blogs';
import { handleApiError } from '@/lib/handleApiError';

export default function AdminBlogsPage() {
  const router = useRouter();
  const [blogs, setBlogs] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminGetBlogs({ page, limit: 10 });
      const items = Array.isArray(res.data) ? res.data : res.data?.blogs || res.blogs || [];
      setBlogs(items);
      const total = res.total ?? res.data?.total ?? res.pagination?.total ?? items.length;
      const limit = res.limit ?? res.data?.limit ?? 10;
      const pg = res.page ?? res.data?.page ?? res.pagination?.page ?? page;
      setPagination({ page: pg, totalPages: Math.ceil(total / limit) || 1, total });
    } catch {
      // silent
    }
    setLoading(false);
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteBlog(deleteTarget._id as string);
      setDeleteTarget(null);
      fetchData(pagination.page);
    } catch (err) {
      alert(handleApiError(err));
    }
    setDeleting(false);
  };

  const columns = [
    {
      key: 'title',
      label: 'Blog',
      render: (item: Record<string, unknown>) => (
        <div className="flex items-center gap-3">
          {item.coverImage ? (
            <img src={item.coverImage as string} alt="" className="w-12 h-8 rounded object-cover" />
          ) : (
            <div className="w-12 h-8 rounded bg-gray-200" />
          )}
          <div className="min-w-0">
            <div className="font-medium truncate max-w-[300px]">{item.title as string}</div>
            <div className="text-xs text-gray-500">{(item.category as Record<string, unknown>)?.name as string || ''}</div>
          </div>
        </div>
      ),
    },
    { key: 'author', label: 'Author' },
    {
      key: 'status',
      label: 'Status',
      render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} />,
    },
    {
      key: 'createdAt',
      label: 'Date',
      render: (item: Record<string, unknown>) => (
        <span className="text-sm text-gray-500">
          {item.createdAt ? new Date(item.createdAt as string).toLocaleDateString() : '—'}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Blogs</h1>
          <button onClick={() => router.push('/admin/blogs/new')} className="px-4 py-2 bg-[#F26419] hover:bg-[#FF8040] text-white text-sm font-semibold rounded-xl transition-colors">
            + Add Blog
          </button>
        </div>

        <DataTable
          columns={columns}
          data={blogs}
          loading={loading}
          onEdit={(item) => router.push(`/admin/blogs/${item._id}/edit`)}
          onDelete={(item) => setDeleteTarget(item)}
          pagination={pagination}
          onPageChange={(p) => fetchData(p)}
          emptyMessage="No blogs found"
        />
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Blog"
        message={`Delete blog "${deleteTarget?.title}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </AdminLayout>
  );
}
