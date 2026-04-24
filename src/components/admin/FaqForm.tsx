'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import { createFaq, updateFaq } from '@/lib/faqs';
import { handleApiError } from '@/lib/handleApiError';
import { revalidateFaqPages } from '@/lib/server/revalidate';

interface FaqFormProps {
  initialData?: Record<string, unknown>;
  isEdit?: boolean;
}

const emptyForm = {
  question: '',
  answer: '',
  page: 'home',
  pageSlug: '',
  sortOrder: 0,
  status: 'active' as 'active' | 'inactive',
};

export default function FaqForm({ initialData, isEdit }: FaqFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (initialData) {
      const validPages = ['home', 'contact', 'general', 'country', 'university'];
      setForm({
        question: (initialData.question as string) || '',
        answer: (initialData.answer as string) || '',
        page: validPages.includes((initialData.page as string) || '')
          ? (initialData.page as string)
          : 'general',
        pageSlug: (initialData.pageSlug as string) || '',
        sortOrder: (initialData.sortOrder as number) ?? (initialData.order as number) ?? 0,
        status: initialData.status === 'inactive' ? 'inactive' : 'active',
      });
    }
  }, [initialData]);

  const updateField = (key: string, value: unknown) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.question.trim()) { setError('Question is required'); return; }
    if (!form.answer.trim()) { setError('Answer is required'); return; }

    setSaving(true);
    setError('');
    try {
      const payload: Record<string, unknown> = {
        question: form.question.trim(),
        answer: form.answer.trim(),
        page: form.page,
        pageSlug: (form.page === 'country' || form.page === 'university') ? form.pageSlug.trim() || null : null,
        sortOrder: form.sortOrder,
        status: form.status,
      };

      if (isEdit && initialData?._id) {
        await updateFaq(initialData._id as string, payload);
      } else {
        await createFaq(payload);
      }
      await revalidateFaqPages(form.page, form.pageSlug || undefined).catch(() => {});
      router.push('/admin/faqs');
    } catch (err) {
      setError(handleApiError(err));
    }
    setSaving(false);
  };

  return (
    <AdminLayout>
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {isEdit ? 'Edit FAQ' : 'New FAQ'}
          </h1>
          <button
            onClick={() => router.push('/admin/faqs')}
            className="text-sm text-gray-500 hover:text-gray-700"
          >
            ← Back to FAQs
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-50 border border-red-200 text-sm text-red-700">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            {/* Question */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Question <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                maxLength={300}
                value={form.question}
                onChange={(e) => updateField('question', e.target.value)}
                placeholder="e.g., Are foreign MBBS degrees valid in India?"
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419]/30 focus:border-[#F26419] outline-none"
              />
              <div className="text-xs text-gray-400 mt-1 text-right">{form.question.length}/300</div>
            </div>

            {/* Answer */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Answer <span className="text-red-500">*</span>
              </label>
              <textarea
                maxLength={2000}
                rows={4}
                value={form.answer}
                onChange={(e) => updateField('answer', e.target.value)}
                placeholder="Provide a clear, concise answer..."
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419]/30 focus:border-[#F26419] outline-none resize-y"
              />
              <div className="text-xs text-gray-400 mt-1 text-right">{form.answer.length}/2000</div>
            </div>

            {/* Page */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Page <span className="text-red-500">*</span>
              </label>
              <select
                value={form.page}
                onChange={(e) => { updateField('page', e.target.value); if (e.target.value !== 'country' && e.target.value !== 'university') updateField('pageSlug', ''); }}
                className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419]/30 focus:border-[#F26419] outline-none"
              >
                <option value="home">Home</option>
                <option value="contact">Contact</option>
                <option value="general">General</option>
                <option value="country">Country</option>
                <option value="university">University</option>
              </select>
            </div>

            {/* Page Slug — shown for country/university */}
            {(form.page === 'country' || form.page === 'university') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Page Slug <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={form.pageSlug}
                  onChange={(e) => updateField('pageSlug', e.target.value)}
                  placeholder={form.page === 'country' ? 'e.g., russia' : 'e.g., kazan-federal-university'}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419]/30 focus:border-[#F26419] outline-none"
                />
                <p className="text-xs text-gray-400 mt-1">
                  Enter the slug of the {form.page} this FAQ belongs to
                </p>
              </div>
            )}

            {/* Order + Status */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
                <input
                  type="number"
                  min={0}
                  value={form.sortOrder}
                  onChange={(e) => updateField('sortOrder', parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419]/30 focus:border-[#F26419] outline-none"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => updateField('status', e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419]/30 focus:border-[#F26419] outline-none"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={() => router.push('/admin/faqs')}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-xl hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 bg-[#F26419] hover:bg-[#FF8040] text-white text-sm font-semibold rounded-xl transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : isEdit ? 'Update FAQ' : 'Create FAQ'}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  );
}
