'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import DataTable from '@/components/admin/DataTable';
import ConfirmModal from '@/components/admin/ConfirmModal';
import StatusBadge from '@/components/admin/StatusBadge';
import { adminGetFaqs, deleteFaq } from '@/lib/faqs';
import { handleApiError } from '@/lib/handleApiError';

const PAGE_LABELS: Record<string, string> = {
  home: 'Home',
  contact: 'Contact',
  general: 'General',
};

interface AdminFaqItem extends Record<string, unknown> {
  _id: string;
  question: string;
  answer: string;
  page: string;
  pageSlug?: string | null;
  order?: number;
  isActive?: boolean;
}

function normalizeFaqItems(payload: unknown): AdminFaqItem[] {
  const items = Array.isArray(payload)
    ? payload
    : payload && typeof payload === 'object' && Array.isArray((payload as { data?: unknown }).data)
      ? (payload as { data: unknown[] }).data
      : [];

  return items.flatMap((item) => {
    if (!item || typeof item !== 'object') {
      return [];
    }

    const faq = item as Record<string, unknown>;
    if (typeof faq._id !== 'string' || typeof faq.question !== 'string' || typeof faq.answer !== 'string' || typeof faq.page !== 'string') {
      return [];
    }

    return [{
      _id: faq._id,
      question: faq.question,
      answer: faq.answer,
      page: faq.page,
      pageSlug: typeof faq.pageSlug === 'string' ? faq.pageSlug : null,
      order: typeof faq.order === 'number' ? faq.order : 0,
      isActive: typeof faq.isActive === 'boolean' ? faq.isActive : false,
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

  const handleDelete = async () => {
    if (!deleteTarget) return;
    setDeleting(true);
    try {
      await deleteFaq(deleteTarget._id as string);
      setDeleteTarget(null);
      fetchFaqs();
    } catch (err) {
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
    { key: 'order', label: 'Order' },
    {
      key: 'isActive',
      label: 'Status',
      render: (item: AdminFaqItem) => (
        <StatusBadge status={item.isActive ? 'active' : 'inactive'} />
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
            </select>
            <button
              onClick={() => router.push('/admin/faqs/new')}
              className="px-4 py-2 bg-[#F26419] hover:bg-[#FF8040] text-white text-sm font-semibold rounded-xl transition-colors"
            >
              + Add FAQ
            </button>
          </div>
        </div>

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
