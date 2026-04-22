'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import ConfirmModal from '@/components/admin/ConfirmModal';
import StatusBadge from '@/components/admin/StatusBadge';
import { SafeImage } from '@/components/ui/SafeImage';
import { adminGetUniversities, deleteUniversity } from '@/lib/universities';
import { handleApiError } from '@/lib/handleApiError';

export default function AdminUniversitiesPage() {
  const router = useRouter();
  const [universities, setUniversities] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminGetUniversities({ page, limit: 10 });
      const items = Array.isArray(res.data) ? res.data : res.data?.universities || res.universities || [];
      setUniversities(items);
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
      await deleteUniversity(deleteTarget._id as string);
      setDeleteTarget(null);
      fetchData(pagination.page);
    } catch (err) {
      alert(handleApiError(err));
    }
    setDeleting(false);
  };

  const columns = [
    {
      key: 'name',
      label: 'University',
      render: (item: Record<string, unknown>) => (
        <div className="flex items-center gap-3">
          {item.logo ? (
            <SafeImage 
              src={item.logo as string} 
              alt="" 
              width={32}
              height={32}
              className="w-8 h-8 rounded object-cover"
              fallbackElement={<div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-xs">🏫</div>}
            />
          ) : (
            <div className="w-8 h-8 rounded bg-gray-200 flex items-center justify-center text-xs">🏫</div>
          )}
          <div className="min-w-0">
            <div className="font-medium truncate">{item.name as string}</div>
            <div className="text-xs text-gray-500 truncate">{(item.country as Record<string, unknown>)?.name as string || item.country as string || ''}</div>
          </div>
        </div>
      ),
    },
    { key: 'establishedYear', label: 'Est.' },
    {
      key: 'status',
      label: 'Status',
      render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} />,
    },
    {
      key: 'featured',
      label: 'Featured',
      render: (item: Record<string, unknown>) => (
        <span className={`text-xs px-2 py-0.5 rounded-full ${item.featured ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
          {item.featured ? 'Yes' : 'No'}
        </span>
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Universities</h1>
          <button onClick={() => router.push('/admin/universities/new')} className="px-4 py-2 bg-[#F26419] hover:bg-[#FF8040] text-white text-sm font-semibold rounded-xl transition-colors">
            + Add University
          </button>
        </div>

        <DataTable
          columns={columns}
          data={universities}
          loading={loading}
          onEdit={(item) => router.push(`/admin/universities/${item._id}/edit`)}
          onDelete={(item) => setDeleteTarget(item)}
          pagination={pagination}
          onPageChange={(p) => fetchData(p)}
          emptyMessage="No universities found"
        />
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete University"
        message={`Are you sure you want to delete "${deleteTarget?.name}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </AdminLayout>
  );
}
