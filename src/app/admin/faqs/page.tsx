'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { AxiosError } from 'axios';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import ConfirmModal from '@/components/admin/ConfirmModal';
import StatusBadge from '@/components/admin/StatusBadge';
import { adminGetFaqs, deleteFaq } from '@/lib/faqs';
import { revalidateFaqPages } from '@/lib/server/revalidate';
import { handleApiError } from '@/lib/handleApiError';

const PAGE_LABELS: Record<string, string> = {
  home: 'Home',
  contact: 'Contact',
  general: 'General',
  country: 'Country',
  university: 'University',
};

interface AdminFaqItem extends Record<string, unknown> {
  _id: string;
  question: string;
  answer: string;
  page: string;
  pageSlug?: string | null;
  sortOrder?: number;
  status?: string;
}

function normalizeFaqItems(payload: unknown): AdminFaqItem[] {
  let items: unknown[] = [];
  if (Array.isArray(payload)) {
    items = payload;
  } else if (payload && typeof payload === 'object') {
    const payloadData = (payload as { data?: unknown }).data;
    if (Array.isArray(payloadData)) {
      items = payloadData;
    }
  }

  return items.flatMap((item) => {
    if (!item || typeof item !== 'object') {
      return [];
    }

    const faq = item as Record<string, unknown>;
    if (typeof faq._id !== 'string' || typeof faq.question !== 'string' || typeof faq.answer !== 'string' || typeof faq.page !== 'string') {
      return [];
    }

    let sortOrder = 0;
    if (typeof faq.sortOrder === 'number') {
      sortOrder = faq.sortOrder;
    } else if (typeof faq.order === 'number') {
      sortOrder = faq.order;
    }

    let status = 'active';
    if (typeof faq.status === 'string') {
      status = faq.status;
    } else if (faq.isActive === false) {
      status = 'inactive';
    }

    return [{
      _id: faq._id,
      question: faq.question,
      answer: faq.answer,
      page: faq.page,
      pageSlug: typeof faq.pageSlug === 'string' ? faq.pageSlug : null,
      sortOrder,
      status,
    }];
  });
}

export default function AdminFaqsPage() {
  const router = useRouter();
  const [faqs, setFaqs] = useState<AdminFaqItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageFilter, setPageFilter] = useState('');
  const [deleteTarget, setDeleteTarget] = useState<AdminFaqItem | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<string>('');

  const fetchFaqs = useCallback(async () => {
    setLoading(true);
    try {
      const params: Record<string, unknown> = {};
      if (pageFilter) params.page = pageFilter;
      const res = await adminGetFaqs(params);
      const items = normalizeFaqItems(Array.isArray(res?.data) ? res.data : res?.data?.faqs || res?.faqs || []);
      setFaqs(items);
    } catch {
      // silent
    }
    setLoading(false);
  }, [pageFilter]);

  useEffect(() => { fetchFaqs(); }, [fetchFaqs]);

  useEffect(() => {
    if (!notice) return;
    const timeoutId = globalThis.setTimeout(() => setNotice(''), 3000);
    return () => globalThis.clearTimeout(timeoutId);
  }, [notice]);

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    const target = deleteTarget;
    try {
      await deleteFaq(target._id);
      await revalidateFaqPages(target.page, target.pageSlug || undefined).catch(() => {});
      setNotice('FAQ deleted successfully.');
      setDeleteTarget(null);
      await fetchFaqs();
    } catch (err) {
      if (err instanceof AxiosError && err.response?.status === 404) {
        // Treat stale entries as already deleted to keep admin UX unblocked.
        setNotice('FAQ was already removed. List refreshed.');
        setDeleteTarget(null);
        await fetchFaqs();
        setDeleting(false);
        return;
      }
      alert(handleApiError(err));
    }
    setDeleting(false);
  };

  const columns = [
    {
      key: 'question',
      label: 'Question',
      render: (item: AdminFaqItem) => (
        <span className="line-clamp-2 text-sm">{item.question}</span>
      ),
    },
    {
      key: 'page',
      label: 'Page',
      render: (item: AdminFaqItem) => (
        <div className="flex flex-col">
          <span className="text-sm font-medium">{PAGE_LABELS[item.page] || item.page}</span>
          {typeof item.pageSlug === 'string' && item.pageSlug.length > 0 && (
            <span className="text-xs text-gray-400">{item.pageSlug}</span>
          )}
        </div>
      ),
    },
    { key: 'sortOrder', label: 'Order' },
    {
      key: 'status',
      label: 'Status',
      render: (item: AdminFaqItem) => (
        <StatusBadge status={item.status === 'active' ? 'active' : 'inactive'} />
      ),
    },
  ];

  return (
    <AdminLayout>
      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h1 className="text-2xl font-bold text-gray-900">FAQs</h1>
          <div className="flex items-center gap-3">
            <select
              value={pageFilter}
              onChange={(e) => setPageFilter(e.target.value)}
              className="px-3 py-2 text-sm rounded-lg border border-gray-200 focus:ring-2 focus:ring-[#F26419]/30 focus:border-[#F26419] outline-none"
            >
              <option value="">All Pages</option>
              <option value="home">Home</option>
              <option value="contact">Contact</option>
              <option value="general">General</option>
              <option value="country">Country</option>
              <option value="university">University</option>
            </select>
            <button
              onClick={() => router.push('/admin/faqs/new')}
              className="px-4 py-2 bg-[#F26419] hover:bg-[#FF8040] text-white text-sm font-semibold rounded-xl transition-colors"
            >
              + Add FAQ
            </button>
          </div>
        </div>

        {notice && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-800">
            {notice}
          </div>
        )}

        <DataTable
          columns={columns}
          data={faqs}
          loading={loading}
          onEdit={(item) => router.push(`/admin/faqs/${item._id}/edit`)}
          onDelete={(item) => setDeleteTarget(item)}
          emptyMessage="No FAQs found"
          searchKeys={['question', 'answer', 'page', 'pageSlug']}
        />
      </div>

      <ConfirmModal
        isOpen={!!deleteTarget}
        title="Delete FAQ"
        message={`Are you sure you want to delete this FAQ? This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setDeleteTarget(null)}
        loading={deleting}
      />
    </AdminLayout>
  );
}
