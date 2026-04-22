'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';
import { createUniversity, updateUniversity } from '@/lib/universities';
import { adminGetCountries } from '@/lib/countries';
import { handleApiError } from '@/lib/handleApiError';
import { validateUniversityForm, getFieldError, LIMITS, type ValidationError } from '@/lib/validation';
import { FieldError, CharCount, ValidationBanner } from '@/components/admin/FormValidation';

interface UniversityFormProps {
  initialData?: Record<string, unknown>;
  isEdit?: boolean;
}

const emptyForm = {
  name: '',
  slug: '',
  country: '',
  description: '',
  logo: '',
  heroImage: '',
  gallery: [''],
  establishedYear: '',
  ranking: '',
  accreditation: '',
  courseDuration: '',
  annualFees: '',
  medium: '',
  hostelFees: '',
  eligibility: '',
  recognition: [''],
  status: 'active',
  featured: false,
  highlights: [{ label: '', value: '' }],
  faqs: [{ question: '', answer: '' }],
  seo: { metaTitle: '', metaDescription: '', keywords: '', canonicalUrl: '', schemaMarkup: '' },
};

export default function UniversityForm({ initialData, isEdit }: UniversityFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [countries, setCountries] = useState<{ _id: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const L = LIMITS.university;

  useEffect(() => {
    adminGetCountries({ limit: 100 }).then((res) => {
      const list = Array.isArray(res.data) ? res.data : res.data?.countries || res.countries || [];
      setCountries(list);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialData) {
      const countryId = typeof initialData.country === 'object'
        ? (initialData.country as Record<string, unknown>)?._id as string
        : initialData.country as string;
      setForm({
        name: (initialData.name as string) || '',
        slug: (initialData.slug as string) || '',
        country: countryId || '',
        description: (initialData.description as string) || '',
        logo: (initialData.logo as string) || '',
        heroImage: (initialData.heroImage as string) || '',
        gallery: (initialData.gallery as string[])?.length ? (initialData.gallery as string[]) : [''],
        establishedYear: String(initialData.establishedYear || ''),
        ranking: (initialData.ranking as string) || '',
        accreditation: (initialData.accreditation as string) || '',
        courseDuration: (initialData.courseDuration as string) || '',
        annualFees: (initialData.annualFees as string) || '',
        medium: (initialData.medium as string) || '',
        hostelFees: (initialData.hostelFees as string) || '',
        eligibility: (initialData.eligibility as string) || '',
        recognition: (initialData.recognition as string[])?.length ? (initialData.recognition as string[]) : [''],
        status: (initialData.status as string) || 'active',
        featured: !!initialData.featured,
        highlights: (initialData.highlights as { label: string; value: string }[])?.length
          ? (initialData.highlights as { label: string; value: string }[])
          : [{ label: '', value: '' }],
        faqs: (initialData.faqs as { question: string; answer: string }[])?.length
          ? (initialData.faqs as { question: string; answer: string }[])
          : [{ question: '', answer: '' }],
        seo: {
          metaTitle: ((initialData.seo as Record<string, string>)?.metaTitle) || '',
          metaDescription: ((initialData.seo as Record<string, string>)?.metaDescription) || '',
          keywords: ((initialData.seo as Record<string, string>)?.keywords) || '',
          canonicalUrl: ((initialData.seo as Record<string, string>)?.canonicalUrl) || '',
          schemaMarkup: ((initialData.seo as Record<string, string>)?.schemaMarkup) || '',
        },
      });
    }
  }, [initialData]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errors = validateUniversityForm(form);
    setValidationErrors(errors);
    if (errors.length > 0) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        establishedYear: parseInt(form.establishedYear) || undefined,
        gallery: form.gallery.filter(Boolean),
        recognition: form.recognition.filter(Boolean),
        highlights: form.highlights.filter((h) => h.label),
        faqs: form.faqs.filter((f) => f.question),
      };
      if (isEdit && initialData?._id) {
        await updateUniversity(initialData._id as string, payload);
      } else {
        await createUniversity(payload);
      }
      router.push('/admin/universities');
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
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit University' : 'Add University'}</h1>
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
              <input required maxLength={L.name.max} value={form.name} onChange={(e) => { updateField('name', e.target.value); if (!isEdit) updateField('slug', autoSlug(e.target.value)); }} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none" />
              <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'name')} /><CharCount current={form.name.length} max={L.name.max} /></div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input value={form.slug} onChange={(e) => updateField('slug', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Country *</label>
            <select required value={form.country} onChange={(e) => updateField('country', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none">
              <option value="">Select Country</option>
              {countries.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea rows={4} maxLength={L.description.max} value={form.description} onChange={(e) => updateField('description', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none resize-none" />
            <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'description')} /><CharCount current={form.description.length} max={L.description.max} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => updateField('status', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Established Year</label>
              <input type="number" value={form.establishedYear} onChange={(e) => updateField('establishedYear', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none" />
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => updateField('featured', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#F26419] focus:ring-[#F26419]" />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
            </div>
          </div>
        </section>

        {/* Academic Info */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Academic Details</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Ranking</label>
              <input maxLength={L.ranking.max} value={form.ranking} onChange={(e) => updateField('ranking', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Accreditation</label>
              <input maxLength={L.accreditation.max} value={form.accreditation} onChange={(e) => updateField('accreditation', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Course Duration</label>
              <input maxLength={L.courseDuration.max} value={form.courseDuration} onChange={(e) => updateField('courseDuration', e.target.value)} placeholder="e.g., 5 years + 1 year internship" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medium</label>
              <input maxLength={L.medium.max} value={form.medium} onChange={(e) => updateField('medium', e.target.value)} placeholder="e.g., English" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Annual Fees</label>
              <input maxLength={L.annualFees.max} value={form.annualFees} onChange={(e) => updateField('annualFees', e.target.value)} placeholder="e.g., ₹3,50,000" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Hostel Fees</label>
              <input maxLength={L.hostelFees.max} value={form.hostelFees} onChange={(e) => updateField('hostelFees', e.target.value)} placeholder="e.g., ₹50,000/year" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Eligibility</label>
            <textarea rows={2} maxLength={L.eligibility.max} value={form.eligibility} onChange={(e) => updateField('eligibility', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none resize-none" />
            <div className="flex justify-end"><CharCount current={form.eligibility.length} max={L.eligibility.max} /></div>
          </div>
        </section>

        {/* Images */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
              <ImageUploader folder="universities" currentImage={form.logo} onUpload={(url) => updateField('logo', url)} />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image</label>
              <ImageUploader folder="universities" currentImage={form.heroImage} onUpload={(url) => updateField('heroImage', url)} />
            </div>
          </div>
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Gallery URLs <span className="text-xs text-gray-400">({form.gallery.filter(Boolean).length}/{L.gallery.maxItems})</span></label>
              {form.gallery.length < L.gallery.maxItems && (
              <button type="button" onClick={() => updateField('gallery', [...form.gallery, ''])} className="text-sm text-[#F26419] font-medium">+ Add</button>
              )}
            </div>
            {form.gallery.map((url, i) => (
              <div key={i} className="flex gap-2 mb-2">
                <input value={url} onChange={(e) => { const arr = [...form.gallery]; arr[i] = e.target.value; updateField('gallery', arr); }} placeholder="Image URL" className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm" />
                {form.gallery.length > 1 && <button type="button" onClick={() => updateField('gallery', form.gallery.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 px-2">×</button>}
              </div>
            ))}
          </div>
        </section>

        {/* Recognition */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recognition <span className="text-xs text-gray-400 font-normal">({form.recognition.filter(Boolean).length}/{L.recognition.maxItems})</span></h2>
            {form.recognition.length < L.recognition.maxItems && (
            <button type="button" onClick={() => updateField('recognition', [...form.recognition, ''])} className="text-sm text-[#F26419] font-medium">+ Add</button>
            )}
          </div>
          <FieldError message={getFieldError(validationErrors, 'recognition')} />
          {form.recognition.map((r, i) => (
            <div key={i} className="flex gap-2">
              <input maxLength={L.recognition.maxLen} value={r} onChange={(e) => { const arr = [...form.recognition]; arr[i] = e.target.value; updateField('recognition', arr); }} placeholder="e.g., WHO, NMC" className="flex-1 px-3 py-2.5 rounded-xl border border-gray-200 text-sm" />
              {form.recognition.length > 1 && <button type="button" onClick={() => updateField('recognition', form.recognition.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 px-2">×</button>}
            </div>
          ))}
        </section>

        {/* Highlights */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Highlights <span className="text-xs text-gray-400 font-normal">({form.highlights.filter(h => h.label).length}/{L.highlights.maxItems})</span></h2>
            {form.highlights.length < L.highlights.maxItems && (
            <button type="button" onClick={() => updateField('highlights', [...form.highlights, { label: '', value: '' }])} className="text-sm text-[#F26419] font-medium">+ Add</button>
            )}
          </div>
          <FieldError message={getFieldError(validationErrors, 'highlights')} />
          {form.highlights.map((h, i) => (
            <div key={i} className="flex gap-2">
              <input maxLength={L.highlights.labelMax} value={h.label} onChange={(e) => { const arr = [...form.highlights]; arr[i] = { ...arr[i], label: e.target.value }; updateField('highlights', arr); }} placeholder="Label" className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm" />
              <input maxLength={L.highlights.valueMax} value={h.value} onChange={(e) => { const arr = [...form.highlights]; arr[i] = { ...arr[i], value: e.target.value }; updateField('highlights', arr); }} placeholder="Value" className="flex-1 px-3 py-2 rounded-xl border border-gray-200 text-sm" />
              {form.highlights.length > 1 && <button type="button" onClick={() => updateField('highlights', form.highlights.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 px-2">×</button>}
            </div>
          ))}
        </section>

        {/* FAQs */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">FAQs <span className="text-xs text-gray-400 font-normal">({form.faqs.filter(f => f.question).length}/{L.faqs.maxItems})</span></h2>
            {form.faqs.length < L.faqs.maxItems && (
            <button type="button" onClick={() => updateField('faqs', [...form.faqs, { question: '', answer: '' }])} className="text-sm text-[#F26419] font-medium">+ Add</button>
            )}
          </div>
          <FieldError message={getFieldError(validationErrors, 'faqs')} />
          {form.faqs.map((f, i) => (
            <div key={i} className="p-3 bg-gray-50 rounded-xl space-y-2">
              <div className="flex gap-2">
                <input maxLength={L.faqs.questionMax} value={f.question} onChange={(e) => { const arr = [...form.faqs]; arr[i] = { ...arr[i], question: e.target.value }; updateField('faqs', arr); }} placeholder="Question" className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm" />
                {form.faqs.length > 1 && <button type="button" onClick={() => updateField('faqs', form.faqs.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 px-2">×</button>}
              </div>
              <textarea maxLength={L.faqs.answerMax} value={f.answer} onChange={(e) => { const arr = [...form.faqs]; arr[i] = { ...arr[i], answer: e.target.value }; updateField('faqs', arr); }} placeholder="Answer" rows={2} className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm resize-none" />
            </div>
          ))}
        </section>

        {/* SEO */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">SEO</h2>
          <div>
            <input maxLength={L.seoTitle.max} value={form.seo.metaTitle} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, metaTitle: e.target.value } }))} placeholder="Meta Title" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none" />
            <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'seoTitle')} /><CharCount current={form.seo.metaTitle.length} max={L.seoTitle.max} /></div>
          </div>
          <div>
            <textarea rows={2} maxLength={L.seoDesc.max} value={form.seo.metaDescription} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, metaDescription: e.target.value } }))} placeholder="Meta Description" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none resize-none" />
            <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'seoDesc')} /><CharCount current={form.seo.metaDescription.length} max={L.seoDesc.max} /></div>
          </div>
          <div>
            <input maxLength={L.seoKeywords.max} value={form.seo.keywords} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, keywords: e.target.value } }))} placeholder="Keywords (comma separated)" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none" />
            <div className="flex justify-end"><CharCount current={form.seo.keywords.length} max={L.seoKeywords.max} /></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
            <input value={form.seo.canonicalUrl} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, canonicalUrl: e.target.value } }))} placeholder="https://amwcareerpoint.com/universities/your-slug (leave empty for auto)" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none" />
            <p className="text-xs text-gray-400 mt-1">Leave empty to use the default page URL as canonical</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Schema Markup (JSON-LD)</label>
            <textarea rows={6} value={form.seo.schemaMarkup} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, schemaMarkup: e.target.value } }))} placeholder='{"@context":"https://schema.org","@type":"EducationalOrganization",...}' className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm font-mono focus:ring-2 focus:ring-[#F26419] outline-none resize-y" />
            <p className="text-xs text-gray-400 mt-1">Optional. Paste valid JSON-LD schema. Leave empty for auto-generated schema.</p>
          </div>
        </section>
        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#F26419] hover:bg-[#FF8040] text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60">
            {saving ? 'Saving...' : isEdit ? 'Update University' : 'Create University'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </AdminLayout>
  );
}
