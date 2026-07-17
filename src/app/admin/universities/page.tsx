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
import { revalidateContentPages } from '@/lib/server/revalidate';

export default function AdminUniversitiesPage() {
  const router = useRouter();
  const [universities, setUniversities] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, total: 0 });
  const [deleteTarget, setDeleteTarget] = useState<Record<string, unknown> | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortOrder, setSortOrder] = useState('sortOrder');

  const fetchData = useCallback(async (page = 1) => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = { page, limit: 10, sort: sortOrder };
      if (statusFilter !== 'all') params.status = statusFilter;
      if (debouncedSearch.trim()) params.search = debouncedSearch.trim();

      const res = await adminGetUniversities(params);
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
  }, [debouncedSearch, sortOrder, statusFilter]);

  useEffect(() => {
    const frameId = globalThis.requestAnimationFrame(() => {
      void fetchData(1);
    });

    return () => globalThis.cancelAnimationFrame(frameId);
  }, [fetchData]);

  useEffect(() => {
    const timeoutId = globalThis.setTimeout(() => {
      setDebouncedSearch(searchInput);
    }, 300);

    return () => globalThis.clearTimeout(timeoutId);
  }, [searchInput]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteUniversity(deleteTarget._id as string);
      const targetCountry = typeof deleteTarget.country === 'object'
        ? deleteTarget.country as Record<string, unknown>
        : null;
      await revalidateContentPages({
        type: 'university',
        slug: deleteTarget.slug as string,
        countrySlug: targetCountry?.slug as string,
      }).catch(() => {});
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
              alt={(item.logoAlt as string) || `${item.name as string} logo`}
              width={32}
              height={32}
              className="w-8 h-8 rounded object-cover"
              fallbackElement={
                <div className="w-8 h-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-[7px] leading-tight text-gray-500 text-center px-0.5">
                  Image unavailable / replace image
                </div>
              }
            />
          ) : (
            <div className="w-8 h-8 rounded bg-gray-100 border border-gray-200 flex items-center justify-center text-[7px] leading-tight text-gray-500 text-center px-0.5">
              Image unavailable / replace image
            </div>
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
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Universities</h1>
              <p className="mt-1 text-sm text-gray-500">
                Search and sort universities. Total: {pagination.total}
              </p>
            </div>
            <button onClick={() => router.push('/admin/universities/new')} className="w-full sm:w-auto px-4 py-2 bg-orange hover:bg-orange-hover text-white text-sm font-semibold rounded-xl transition-colors">
              + Add University
            </button>
          </div>

          <div className="rounded-2xl border border-gray-200 bg-white p-3 shadow-sm">
            <div className="grid gap-2 md:grid-cols-[minmax(260px,1fr)_150px_190px]">
              <div className="relative">
                <svg className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <input
                  type="search"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Search university, country, slug..."
                  className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-[#F26419] focus:ring-2 focus:ring-[#F26419]/20"
                />
              </div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#F26419] focus:ring-2 focus:ring-[#F26419]/20"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
              <select
                value={sortOrder}
                onChange={(e) => setSortOrder(e.target.value)}
                className="w-full rounded-xl border border-gray-200 px-3 py-2.5 text-sm outline-none focus:border-[#F26419] focus:ring-2 focus:ring-[#F26419]/20"
              >
                <option value="sortOrder">Manual Order</option>
                <option value="-sortOrder">Manual Order Reverse</option>
                <option value="-createdAt">Newest First</option>
                <option value="createdAt">Oldest First</option>
                <option value="name">Name A-Z</option>
                <option value="-name">Name Z-A</option>
                <option value="city">City A-Z</option>
                <option value="-city">City Z-A</option>
              </select>
            </div>
          </div>
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
          searchable={false}
        />
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete University"
        message={`Are you sure you want to delete "${typeof deleteTarget?.name === 'string' ? deleteTarget.name : ''}"?`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </AdminLayout>
  );
}
