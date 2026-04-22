'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import ConfirmModal from '@/components/admin/ConfirmModal';
import StatusBadge from '@/components/admin/StatusBadge';
import { FlagImage } from '@/components/ui/UniversalImage';
import { adminGetCountries, deleteCountry } from '@/lib/countries';
import { handleApiError } from '@/lib/handleApiError';

export default function AdminCountriesPage() {
  const router = useRouter();
  const [countries, setCountries] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchCountries = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const res = await adminGetCountries({ page, limit: 10 });
      const items = Array.isArray(res.data) ? res.data : res.data?.countries || res.countries || [];
      setCountries(items);
      const total = res.total ?? res.data?.total ?? res.pagination?.total ?? items.length;
      const limit = res.limit ?? res.data?.limit ?? 10;
      const pg = res.page ?? res.data?.page ?? res.pagination?.page ?? page;
      setPagination({ page: pg, totalPages: Math.ceil(total / limit) || 1, total });
    } catch {
      // silent
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    const frameId = globalThis.requestAnimationFrame(() => {
      void fetchCountries();
    });

    return () => globalThis.cancelAnimationFrame(frameId);
  }, [fetchCountries]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteCountry(deleteTarget._id as string);
      setDeleteTarget(null);
      fetchCountries(pagination.page);
    } catch (err) {
      alert(handleApiError(err));
    }
    setDeleting(false);
  };

  const columns = [
    {
      key: 'name',
      label: 'Country',
      render: (item: Record<string, unknown>) => (
        <div className="flex items-center gap-3">
          <FlagImage 
            src={item.flagImage as string} 
            alt={`${item.name} flag`} 
            width={32}
            height={24}
            className="w-8 h-6 rounded object-cover"
          />
          <span className="font-medium">{item.name as string}</span>
        </div>
      ),
    },
    { key: 'slug', label: 'Slug' },
    {
      key: 'status',
      label: 'Status',
      render: (item: Record<string, unknown>) => <StatusBadge status={item.status as string} />,
    },
    { key: 'sortOrder', label: 'Order' },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">Countries</h1>
          <button
            onClick={() => router.push('/admin/countries/new')}
            className="px-4 py-2 bg-orange hover:bg-orange-hover text-white text-sm font-semibold rounded-xl transition-colors"
          >
            + Add Country
          </button>
        </div>

        <DataTable
          columns={columns}
          data={countries}
          loading={loading}
          onEdit={(item) => router.push(`/admin/countries/${item._id}/edit`)}
          onDelete={(item) => setDeleteTarget(item)}
          pagination={pagination}
          onPageChange={(p) => fetchCountries(p)}
          emptyMessage="No countries found"
        />
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete Country"
        message={`Are you sure you want to delete "${deleteTarget?.name}"? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </AdminLayout>
  );
}
