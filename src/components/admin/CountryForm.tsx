'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';
import { createCountry, updateCountry } from '@/lib/countries';
import { handleApiError } from '@/lib/handleApiError';
import { validateCountryForm, getFieldError, LIMITS, type ValidationError } from '@/lib/validation';
import { FieldError, CharCount, ValidationBanner } from '@/components/admin/FormValidation';

interface CountryFormProps {
  initialData?: Record<string, unknown>;
  isEdit?: boolean;
}

const emptyForm = {
  name: '',
  slug: '',
  tagline: '',
  description: '',
  flagImage: '',
  heroImage: '',
  status: 'active',
  sortOrder: 0,
  highlights: [''],
  features: [] as { icon: string; title: string; description: string }[],
  eligibility: [''],
  admissionProcess: [{ step: 1, title: '', description: '' }],
  seo: { metaTitle: '', metaDescription: '', keywords: '' },
};

export default function CountryForm({ initialData, isEdit }: CountryFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const L = LIMITS.country;

  useEffect(() => {
    if (initialData) {
      setForm({
        name: (initialData.name as string) || '',
        slug: (initialData.slug as string) || '',
        tagline: (initialData.tagline as string) || '',
        description: (initialData.description as string) || '',
        flagImage: (initialData.flagImage as string) || '',
        heroImage: (initialData.heroImage as string) || '',
        status: (initialData.status as string) || 'active',
        sortOrder: (initialData.sortOrder as number) || 0,
        highlights: (initialData.highlights as string[])?.length ? (initialData.highlights as string[]) : [''],
        features: (initialData.features as { icon: string; title: string; description: string }[]) || [],
        eligibility: (initialData.eligibility as string[])?.length ? (initialData.eligibility as string[]) : [''],
        admissionProcess: (initialData.admissionProcess as { step: number; title: string; description: string }[])?.length
          ? (initialData.admissionProcess as { step: number; title: string; description: string }[])
          : [{ step: 1, title: '', description: '' }],
        seo: {
          metaTitle: ((initialData.seo as Record<string, string>)?.metaTitle) || '',
          metaDescription: ((initialData.seo as Record<string, string>)?.metaDescription) || '',
          keywords: ((initialData.seo as Record<string, string>)?.keywords) || '',
        },
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateCountryForm(form);
    setValidationErrors(errors);
    if (errors.length > 0) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        highlights: form.highlights.filter(Boolean),
        features: form.features.filter((f) => f.title),
        eligibility: form.eligibility.filter(Boolean),
        admissionProcess: form.admissionProcess.filter((a) => a.title),
        seo: {
          ...form.seo,
          keywords: form.seo.keywords,
        },
      };
      if (isEdit && initialData?._id) {
        await updateCountry(initialData._id as string, payload);
      } else {
        await createCountry(payload);
      }
      router.push('/admin/countries');
    } catch (err) {
      setError(handleApiError(err));
    }
    setSaving(false);
  };

  const updateField = (key: string, value: unknown) => setForm((p) => ({ ...p, [key]: value }));
  const autoSlug = (name: string) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Country' : 'Add Country'}</h1>
          <button type="button" onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">{error}</div>}
        <ValidationBanner errors={validationErrors} />

        {/* Basic Info */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Basic Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                required
                maxLength={L.name.max}
                value={form.name}
                onChange={(e) => { updateField('name', e.target.value); if (!isEdit) updateField('slug', autoSlug(e.target.value)); }}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none"
              />
              <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'name')} /><CharCount current={form.name.length} max={L.name.max} /></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                value={form.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input
              maxLength={L.tagline.max}
              value={form.tagline}
              onChange={(e) => updateField('tagline', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none"
            />
            <div className="flex justify-end"><CharCount current={form.tagline.length} max={L.tagline.max} /></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              rows={4}
              maxLength={L.description.max}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none resize-none"
            />
            <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'description')} /><CharCount current={form.description.length} max={L.description.max} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                value={form.status}
                onChange={(e) => updateField('status', e.target.value)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none"
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sort Order</label>
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => updateField('sortOrder', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none"
              />
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Flag Image</label>
              <ImageUploader
                folder="countries"
                currentImage={form.flagImage}
                onUpload={(url) => updateField('flagImage', url)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
              <ImageUploader
                folder="countries"
                currentImage={form.heroImage}
                onUpload={(url) => updateField('heroImage', url)}
              />
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Highlights <span className="text-xs text-gray-400 font-normal">({form.highlights.filter(Boolean).length}/{L.highlights.maxItems})</span></h2>
            {form.highlights.length < L.highlights.maxItems && (
            <button type="button" onClick={() => updateField('highlights', [...form.highlights, ''])} className="text-sm text-[#F26419] font-medium">+ Add</button>
            )}
          </div>
          <FieldError message={getFieldError(validationErrors, 'highlights')} />
          {form.highlights.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input
                maxLength={L.highlights.maxLen}
                value={h}
                onChange={(e) => { const arr = [...form.highlights]; arr[i] = e.target.value; updateField('highlights', arr); }}
                placeholder={`Highlight ${i + 1}`}
                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none"
              />
              {form.highlights.length > 1 && (
                <button type="button" onClick={() => updateField('highlights', form.highlights.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 px-2">×</button>
              )}
            </div>
          ))}
        </section>

        {/* Eligibility */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Eligibility Criteria <span className="text-xs text-gray-400 font-normal">({form.eligibility.filter(Boolean).length}/{L.eligibility.maxItems})</span></h2>
            {form.eligibility.length < L.eligibility.maxItems && (
            <button type="button" onClick={() => updateField('eligibility', [...form.eligibility, ''])} className="text-sm text-[#F26419] font-medium">+ Add</button>
            )}
          </div>
          <FieldError message={getFieldError(validationErrors, 'eligibility')} />
          {form.eligibility.map((e, i) => (
            <div key={i} className="flex gap-2">
              <input
                maxLength={L.eligibility.maxLen}
                value={e}
                onChange={(ev) => { const arr = [...form.eligibility]; arr[i] = ev.target.value; updateField('eligibility', arr); }}
                placeholder={`Criterion ${i + 1}`}
                className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none"
              />
              {form.eligibility.length > 1 && (
                <button type="button" onClick={() => updateField('eligibility', form.eligibility.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 px-2">×</button>
              )}
            </div>
          ))}
        </section>

        {/* Admission Process */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Admission Process <span className="text-xs text-gray-400 font-normal">({form.admissionProcess.filter(a => a.title).length}/{L.admissionProcess.maxItems})</span></h2>
            {form.admissionProcess.length < L.admissionProcess.maxItems && (
            <button type="button" onClick={() => updateField('admissionProcess', [...form.admissionProcess, { step: form.admissionProcess.length + 1, title: '', description: '' }])} className="text-sm text-[#F26419] font-medium">+ Add Step</button>
            )}
          </div>
          <FieldError message={getFieldError(validationErrors, 'admissionProcess')} />
          {form.admissionProcess.map((s, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-[60px_1fr_1fr_auto] gap-2 p-3 bg-gray-50 rounded-xl items-center">
              <input type="number" value={s.step} onChange={(e) => { const arr = [...form.admissionProcess]; arr[i] = { ...arr[i], step: parseInt(e.target.value) || 0 }; updateField('admissionProcess', arr); }} placeholder="#" className="px-3 py-2 rounded-lg border border-gray-200 text-sm text-center" />
              <input maxLength={L.admissionProcess.titleMax} value={s.title} onChange={(e) => { const arr = [...form.admissionProcess]; arr[i] = { ...arr[i], title: e.target.value }; updateField('admissionProcess', arr); }} placeholder="Step title" className="px-3 py-2 rounded-lg border border-gray-200 text-sm" />
              <input maxLength={L.admissionProcess.descMax} value={s.description} onChange={(e) => { const arr = [...form.admissionProcess]; arr[i] = { ...arr[i], description: e.target.value }; updateField('admissionProcess', arr); }} placeholder="Step description" className="px-3 py-2 rounded-lg border border-gray-200 text-sm" />
              {form.admissionProcess.length > 1 && (
                <button type="button" onClick={() => updateField('admissionProcess', form.admissionProcess.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 px-2">×</button>
              )}
            </div>
          ))}
        </section>

        {/* SEO */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">SEO</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input maxLength={L.seoTitle.max} value={form.seo.metaTitle} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, metaTitle: e.target.value } }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none" />
            <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'seoTitle')} /><CharCount current={form.seo.metaTitle.length} max={L.seoTitle.max} /></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea rows={2} maxLength={L.seoDesc.max} value={form.seo.metaDescription} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, metaDescription: e.target.value } }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none resize-none" />
            <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'seoDesc')} /><CharCount current={form.seo.metaDescription.length} max={L.seoDesc.max} /></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma separated)</label>
            <input maxLength={L.seoKeywords.max} value={form.seo.keywords} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, keywords: e.target.value } }))} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none" />
            <div className="flex justify-end"><CharCount current={form.seo.keywords.length} max={L.seoKeywords.max} /></div>
          </div>
        </section>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-[#F26419] hover:bg-[#FF8040] text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60"
          >
            {saving ? 'Saving...' : isEdit ? 'Update Country' : 'Create Country'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </AdminLayout>
  );
}
