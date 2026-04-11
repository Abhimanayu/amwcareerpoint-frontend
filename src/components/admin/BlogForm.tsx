'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AdminLayout from '@/components/admin/AdminLayout';
import ImageUploader from '@/components/admin/ImageUploader';
import { createBlog, updateBlog, getBlogCategories } from '@/lib/blogs';
import { handleApiError } from '@/lib/handleApiError';
import { validateBlogForm, getFieldError, LIMITS, type ValidationError } from '@/lib/validation';
import { FieldError, CharCount, ValidationBanner } from '@/components/admin/FormValidation';

interface BlogFormProps {
  initialData?: Record<string, unknown>;
  isEdit?: boolean;
}

const emptyForm = {
  title: '',
  slug: '',
  content: '',
  excerpt: '',
  coverImage: '',
  category: '',
  author: '',
  tags: '',
  status: 'published',
  featured: false,
  seo: { metaTitle: '', metaDescription: '', keywords: '' },
};

export default function BlogForm({ initialData, isEdit }: BlogFormProps) {
  const router = useRouter();
  const [form, setForm] = useState(emptyForm);
  const [categories, setCategories] = useState<{ _id: string; name: string }[]>([]);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const L = LIMITS.blog;

  useEffect(() => {
    getBlogCategories().then((res) => {
      setCategories(Array.isArray(res.data) ? res.data : res.data?.categories || res.categories || []);
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (initialData) {
      const catId = typeof initialData.category === 'object'
        ? (initialData.category as Record<string, unknown>)?._id as string
        : initialData.category as string;
      setForm({
        title: (initialData.title as string) || '',
        slug: (initialData.slug as string) || '',
        content: (initialData.content as string) || '',
        excerpt: (initialData.excerpt as string) || '',
        coverImage: (initialData.coverImage as string) || '',
        category: catId || '',
        author: (initialData.author as string) || '',
        tags: Array.isArray(initialData.tags) ? (initialData.tags as string[]).join(', ') : (initialData.tags as string) || '',
        status: (initialData.status as string) || 'published',
        featured: !!initialData.featured,
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
    const errors = validateBlogForm(form);
    setValidationErrors(errors);
    if (errors.length > 0) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      };
      if (isEdit && initialData?._id) {
        await updateBlog(initialData._id as string, payload);
      } else {
        await createBlog(payload);
      }
      router.push('/admin/blogs');
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
          <h1 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Blog' : 'Add Blog'}</h1>
          <button type="button" onClick={() => router.back()} className="text-sm text-gray-500 hover:text-gray-700">← Back</button>
        </div>

        {error && <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl border border-red-200">{error}</div>}
        <ValidationBanner errors={validationErrors} />

        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Blog Details</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input required maxLength={L.title.max} value={form.title} onChange={(e) => { updateField('title', e.target.value); if (!isEdit) updateField('slug', autoSlug(e.target.value)); }} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none" />
            <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'title')} /><CharCount current={form.title.length} max={L.title.max} /></div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input value={form.slug} onChange={(e) => updateField('slug', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author</label>
              <input maxLength={L.author.max} value={form.author} onChange={(e) => updateField('author', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select value={form.category} onChange={(e) => updateField('category', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none">
                <option value="">Select Category</option>
                {categories.map((c) => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags (comma separated)</label>
              <input maxLength={L.tags.max} value={form.tags} onChange={(e) => updateField('tags', e.target.value)} placeholder="e.g., mbbs, russia, abroad" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Excerpt</label>
            <textarea rows={2} maxLength={L.excerpt.max} value={form.excerpt} onChange={(e) => updateField('excerpt', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none resize-none" />
            <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'excerpt')} /><CharCount current={form.excerpt.length} max={L.excerpt.max} /></div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Content *</label>
            <textarea required rows={12} value={form.content} onChange={(e) => updateField('content', e.target.value)} placeholder="Write your blog content here... (supports HTML)" className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none resize-none font-mono" />
            <FieldError message={getFieldError(validationErrors, 'content')} />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.status} onChange={(e) => updateField('status', e.target.value)} className="w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-[#F26419] outline-none">
                <option value="published">Published</option>
                <option value="draft">Draft</option>
              </select>
            </div>
            <div className="flex items-end pb-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.featured} onChange={(e) => updateField('featured', e.target.checked)} className="w-4 h-4 rounded border-gray-300 text-[#F26419] focus:ring-[#F26419]" />
                <span className="text-sm text-gray-700">Featured</span>
              </label>
            </div>
          </div>
        </section>

        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Cover Image</h2>
          <ImageUploader folder="blogs" currentImage={form.coverImage} onUpload={(url) => updateField('coverImage', url)} />
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
        </section>

        <div className="flex gap-3">
          <button type="submit" disabled={saving} className="px-6 py-2.5 bg-[#F26419] hover:bg-[#FF8040] text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60">
            {saving ? 'Saving...' : isEdit ? 'Update Blog' : 'Create Blog'}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </AdminLayout>
  );
}
