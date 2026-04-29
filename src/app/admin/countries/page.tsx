'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import ConfirmModal from '@/components/admin/ConfirmModal';
import StatusBadge from '@/components/admin/StatusBadge';
import { SafeImage } from '@/components/ui/SafeImage';
import { adminGetCountries, deleteCountry } from '@/lib/countries';
import { handleApiError } from '@/lib/handleApiError';

const ADMIN_COUNTRIES_LIST_LIMIT = 100;

export default function AdminCountriesPage() {
  const router = useRouter();
  const [countries, setCountries] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [sortBy, setSortBy] = useState<string | null>(null);

  const fetchCountries = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: ADMIN_COUNTRIES_LIST_LIMIT };
      if (sortBy) {
        params.sort = sortBy;
      }
      const res = await adminGetCountries(params);
      const items = Array.isArray(res.data) ? res.data : res.data?.countries || res.countries || [];
      setCountries(items);
      const total = res.total ?? res.data?.total ?? res.pagination?.total ?? items.length;
      const limit = res.limit ?? res.data?.limit ?? ADMIN_COUNTRIES_LIST_LIMIT;
      const pg = res.page ?? res.data?.page ?? res.pagination?.page ?? page;
      setPagination({ page: pg, totalPages: Math.ceil(total / limit) || 1, total });
    } catch {
      // silent
    }
    setLoading(false);
  }, [sortBy]);

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
          <SafeImage
            src={item.flagImage as string}
            alt={`${item.name} flag`}
            width={32}
            height={24}
            className="w-8 h-6 rounded object-cover"
            fallbackElement={
              <div className="w-8 h-6 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-[7px] leading-tight text-gray-500 text-center px-0.5">
                Image unavailable / replace image
              </div>
            }
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
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <h1 className="text-2xl font-bold text-gray-900">Countries</h1>
          
          {/* Sort controls */}
          <div className="flex gap-2 flex-wrap">
            <button
              onClick={() => setSortBy(sortBy === 'sortOrder' ? null : 'sortOrder')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'sortOrder'
                  ? 'bg-orange text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Sort by order (ascending: lowest to highest)"
            >
              ↑ Sort Order
            </button>
            <button
              onClick={() => setSortBy(sortBy === '-sortOrder' ? null : '-sortOrder')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === '-sortOrder'
                  ? 'bg-orange text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Sort by order (descending: highest to lowest)"
            >
              ↓ Sort Order
            </button>
            <button
              onClick={() => setSortBy(sortBy === 'name' ? null : 'name')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === 'name'
                  ? 'bg-orange text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Sort alphabetically by country name"
            >
              ↑ Name (A-Z)
            </button>
            <button
              onClick={() => setSortBy(sortBy === '-name' ? null : '-name')}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                sortBy === '-name'
                  ? 'bg-orange text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
              title="Sort reverse alphabetically by country name"
            >
              ↓ Name (Z-A)
            </button>
            {sortBy && (
              <button
                onClick={() => setSortBy(null)}
                className="px-3 py-2 rounded-lg text-sm font-medium bg-gray-100 text-gray-700 hover:bg-gray-200 transition-colors"
                title="Clear sort and show default order"
              >
                Clear
              </button>
            )}
          </div>
          
          <button
            onClick={() => router.push('/admin/countries/new')}
            className="px-4 py-2 bg-orange hover:bg-orange-hover text-white text-sm font-semibold rounded-xl transition-colors whitespace-nowrap"
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
