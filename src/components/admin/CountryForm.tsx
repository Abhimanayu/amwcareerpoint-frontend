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

type LocalTextItem = { id: string; value: string };
type CountryFaqItem = { id: string; question: string; answer: string };
type CountryFeatureItem = { id: string; icon: string; title: string; description: string };
type CountryProcessItem = { id: string; step: number; title: string; description: string };
type SupportProgressItem = { id: string; label: string; value: number; status: string };
type SupportCardItem = { id: string; title: string; subtitle: string };
type StudentLifeCardItem = { id: string; icon: string; title: string; description: string };
type DocumentsChecklistItem = { id: string; label: string };

type StudentLifeForm = {
  eyebrow: string;
  title: string;
  description: string;
  cards: StudentLifeCardItem[];
};

type DocumentsChecklistForm = {
  eyebrow: string;
  title: string;
  items: DocumentsChecklistItem[];
};

type SupportExperienceForm = {
  eyebrow: string;
  title: string;
  description: string;
  progressItems: SupportProgressItem[];
  supportCards: SupportCardItem[];
};

function createLocalId(prefix: string) {
  const uuid = globalThis.crypto?.randomUUID?.();
  if (uuid) {
    return `${prefix}-${uuid}`;
  }

  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}

function createEmptySupportProgressItem(): SupportProgressItem {
  return {
    id: createLocalId('progress'),
    label: '',
    value: 85,
    status: 'Included',
  };
}

function createEmptySupportCardItem(): SupportCardItem {
  return {
    id: createLocalId('card'),
    title: '',
    subtitle: '',
  };
}

function createEmptyTextItem(prefix: string): LocalTextItem {
  return {
    id: createLocalId(prefix),
    value: '',
  };
}

function createEmptyFaqItem(): CountryFaqItem {
  return {
    id: createLocalId('faq'),
    question: '',
    answer: '',
  };
}

function createEmptyProcessItem(step = 1): CountryProcessItem {
  return {
    id: createLocalId('process'),
    step,
    title: '',
    description: '',
  };
}

function createEmptyStudentLifeCardItem(): StudentLifeCardItem {
  return {
    id: createLocalId('student-life'),
    icon: '🎓',
    title: '',
    description: '',
  };
}

function createEmptyDocumentsChecklistItem(): DocumentsChecklistItem {
  return {
    id: createLocalId('documents'),
    label: '',
  };
}

function createEmptyFeatureItem(): CountryFeatureItem {
  return {
    id: createLocalId('feature'),
    icon: '✦',
    title: '',
    description: '',
  };
}

const emptyStudentLife = (): StudentLifeForm => ({
  eyebrow: '',
  title: '',
  description: '',
  cards: [createEmptyStudentLifeCardItem()],
});

const emptyDocumentsChecklist = (): DocumentsChecklistForm => ({
  eyebrow: '',
  title: '',
  items: [createEmptyDocumentsChecklistItem()],
});

const emptySupportExperience = (): SupportExperienceForm => ({
  eyebrow: '',
  title: '',
  description: '',
  progressItems: [createEmptySupportProgressItem()],
  supportCards: [createEmptySupportCardItem()],
});

type CountryFormState = {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  flagImage: string;
  heroImage: string;
  feeRange: string;
  duration: string;
  medium: string;
  livingCost: string;
  status: string;
  sortOrder: number;
    countryCode: string;
    language: string;
    currency: string;
    climate: string;
    bannerImage: string;
    cardImage: string;
    feeRangeUSD: string;
    headerColor: string;
    visaInfo: string;
    isFeatured: boolean;
  highlights: LocalTextItem[];
  faqs: CountryFaqItem[];
  studentLife: StudentLifeForm;
  documentsChecklist: DocumentsChecklistForm;
  supportExperience: SupportExperienceForm;
  features: CountryFeatureItem[];
  eligibility: LocalTextItem[];
  admissionProcess: CountryProcessItem[];
  seo: { metaTitle: string; metaDescription: string; keywords: string; canonicalUrl: string; schemaMarkup: string };
};

function createEmptyForm(): CountryFormState {
  return {
    name: '',
    slug: '',
    tagline: '',
    description: '',
    flagImage: '',
    heroImage: '',
    feeRange: '',
    duration: '',
    medium: '',
    livingCost: '',
    status: 'active',
    sortOrder: 0,
      countryCode: '',
      language: '',
      currency: '',
      climate: '',
      bannerImage: '',
      cardImage: '',
      feeRangeUSD: '',
      headerColor: '#F26419',
      visaInfo: '',
      isFeatured: false,
    highlights: [createEmptyTextItem('highlight')],
    faqs: [createEmptyFaqItem()],
    features: [createEmptyFeatureItem()],
    studentLife: emptyStudentLife(),
    documentsChecklist: emptyDocumentsChecklist(),
    supportExperience: emptySupportExperience(),
    eligibility: [createEmptyTextItem('eligibility')],
    admissionProcess: [createEmptyProcessItem(1)],
    seo: { metaTitle: '', metaDescription: '', keywords: '', canonicalUrl: '', schemaMarkup: '' },
  };
}

// Normalize country data from backend to ensure all expected fields exist
function normalizeCountryData(data: Record<string, unknown>): Record<string, unknown> {
  if (!data || typeof data !== 'object') {
    return {};
  }

  return {
    ...data,
    // Ensure all string fields exist
    name: typeof data.name === 'string' ? data.name : '',
    slug: typeof data.slug === 'string' ? data.slug : '',
    tagline: typeof data.tagline === 'string' ? data.tagline : '',
    description: typeof data.description === 'string' ? data.description : '',
    flagImage: typeof data.flagImage === 'string' ? data.flagImage : '',
    heroImage: typeof data.heroImage === 'string' ? data.heroImage : '',
    feeRange: typeof data.feeRange === 'string' ? data.feeRange : '',
      bannerImage: typeof data.bannerImage === 'string' ? data.bannerImage : '',
      cardImage: typeof data.cardImage === 'string' ? data.cardImage : '',
      countryCode: typeof data.countryCode === 'string' ? data.countryCode : '',
      language: typeof data.language === 'string' ? data.language : '',
      currency: typeof data.currency === 'string' ? data.currency : '',
      climate: typeof data.climate === 'string' ? data.climate : '',
      feeRangeUSD: typeof data.feeRangeUSD === 'string' ? data.feeRangeUSD : '',
      headerColor: typeof data.headerColor === 'string' ? data.headerColor : '#F26419',
      visaInfo: typeof data.visaInfo === 'string' ? data.visaInfo : '',
      isFeatured: typeof data.isFeatured === 'boolean' ? data.isFeatured : false,
    duration: typeof data.duration === 'string' ? data.duration : '',
    medium: typeof data.medium === 'string' ? data.medium : '',
    livingCost: typeof data.livingCost === 'string' ? data.livingCost : '',
    // Ensure nested objects exist
    studentLife: data.studentLife && typeof data.studentLife === 'object'
      ? {
          eyebrow: typeof (data.studentLife as Record<string, unknown>).eyebrow === 'string' ? (data.studentLife as Record<string, unknown>).eyebrow : '',
          title: typeof (data.studentLife as Record<string, unknown>).title === 'string' ? (data.studentLife as Record<string, unknown>).title : '',
          description: typeof (data.studentLife as Record<string, unknown>).description === 'string' ? (data.studentLife as Record<string, unknown>).description : '',
          cards: Array.isArray((data.studentLife as Record<string, unknown>).cards) ? (data.studentLife as Record<string, unknown>).cards : [],
        }
      : { eyebrow: '', title: '', description: '', cards: [] },
    documentsChecklist: data.documentsChecklist && typeof data.documentsChecklist === 'object'
      ? {
          eyebrow: typeof (data.documentsChecklist as Record<string, unknown>).eyebrow === 'string' ? (data.documentsChecklist as Record<string, unknown>).eyebrow : '',
          title: typeof (data.documentsChecklist as Record<string, unknown>).title === 'string' ? (data.documentsChecklist as Record<string, unknown>).title : '',
          items: Array.isArray((data.documentsChecklist as Record<string, unknown>).items) ? (data.documentsChecklist as Record<string, unknown>).items : [],
        }
      : { eyebrow: '', title: '', items: [] },
    supportExperience: data.supportExperience && typeof data.supportExperience === 'object'
      ? {
          eyebrow: typeof (data.supportExperience as Record<string, unknown>).eyebrow === 'string' ? (data.supportExperience as Record<string, unknown>).eyebrow : '',
          title: typeof (data.supportExperience as Record<string, unknown>).title === 'string' ? (data.supportExperience as Record<string, unknown>).title : '',
          description: typeof (data.supportExperience as Record<string, unknown>).description === 'string' ? (data.supportExperience as Record<string, unknown>).description : '',
          progressItems: Array.isArray((data.supportExperience as Record<string, unknown>).progressItems) ? (data.supportExperience as Record<string, unknown>).progressItems : [],
          supportCards: Array.isArray((data.supportExperience as Record<string, unknown>).supportCards) ? (data.supportExperience as Record<string, unknown>).supportCards : [],
        }
      : { eyebrow: '', title: '', description: '', progressItems: [], supportCards: [] },
    // Ensure arrays exist
    highlights: Array.isArray(data.highlights) ? data.highlights : [],
    features: Array.isArray(data.features) ? data.features : [],
    eligibility: Array.isArray(data.eligibility) ? data.eligibility : [],
    faqs: Array.isArray(data.faqs) ? data.faqs : [],
    admissionProcess: Array.isArray(data.admissionProcess) ? data.admissionProcess : [],
    // Ensure SEO exists
    seo: data.seo && typeof data.seo === 'object'
      ? data.seo
      : { metaTitle: '', metaDescription: '', keywords: '', canonicalUrl: '', schemaMarkup: '' },
  };
}

function buildCountryValidationInput(form: CountryFormState) {
  return {
    name: form.name,
    slug: form.slug,
    tagline: form.tagline,
    description: form.description,
    feeRange: form.feeRange,
    duration: form.duration,
    medium: form.medium,
    livingCost: form.livingCost,
    features: form.features.map(({ icon, title, description }) => ({
      icon,
      title,
      description,
    })),
    studentLife: {
      eyebrow: form.studentLife.eyebrow,
      title: form.studentLife.title,
      description: form.studentLife.description,
      cards: form.studentLife.cards.map(({ icon, title, description }) => ({
        icon,
        title,
        description,
      })),
    },
    documentsChecklist: {
      eyebrow: form.documentsChecklist.eyebrow,
      title: form.documentsChecklist.title,
      items: form.documentsChecklist.items.map(({ label }) => ({ label })),
    },
    supportExperience: {
      eyebrow: form.supportExperience.eyebrow,
      title: form.supportExperience.title,
      description: form.supportExperience.description,
      progressItems: form.supportExperience.progressItems.map(({ label, value, status }) => ({
        label,
        value,
        status,
      })),
      supportCards: form.supportExperience.supportCards.map(({ title, subtitle }) => ({
        title,
        subtitle,
      })),
    },
    highlights: form.highlights.map((item) => item.value),
    faqs: form.faqs.map(({ question, answer }) => ({ question, answer })),
    eligibility: form.eligibility.map((item) => item.value),
    admissionProcess: form.admissionProcess.map(({ step, title, description }) => ({
      step,
      title,
      description,
    })),
    seo: form.seo,
  };
}

function getSubmitButtonLabel(saving: boolean, isEdit?: boolean) {
  if (saving) {
    return 'Saving...';
  }

  return isEdit ? 'Update Country' : 'Create Country';
}

function buildCountryForm(initialData?: Record<string, unknown>): CountryFormState {
  if (!initialData) {
    return createEmptyForm();
  }

  // Normalize data to ensure all fields exist with proper structure
  const normalized = normalizeCountryData(initialData);

  const supportExperienceData = normalized.supportExperience && typeof normalized.supportExperience === 'object'
    ? (normalized.supportExperience as Record<string, unknown>)
    : undefined;

  const progressItemsRaw = Array.isArray(supportExperienceData?.progressItems)
    ? (supportExperienceData.progressItems as Array<{ label?: string; value?: number; status?: string }>)
    : [];

  const supportCardsRaw = Array.isArray(supportExperienceData?.supportCards)
    ? (supportExperienceData.supportCards as Array<{ title?: string; subtitle?: string }>)
    : [];

  const studentLifeData =
    normalized.studentLife && typeof normalized.studentLife === 'object'
      ? (normalized.studentLife as Record<string, unknown>)
      : undefined;

  const studentLifeCardsRaw = Array.isArray(studentLifeData?.cards)
    ? (studentLifeData.cards as Array<{ icon?: string; title?: string; description?: string }>)
    : [];

  const documentsChecklistData =
    normalized.documentsChecklist && typeof normalized.documentsChecklist === 'object'
      ? (normalized.documentsChecklist as Record<string, unknown>)
      : undefined;

  const documentsChecklistItemsRaw = Array.isArray(documentsChecklistData?.items)
    ? (documentsChecklistData.items as Array<{ label?: string }>)
    : [];

  const featuresRaw = Array.isArray(normalized.features)
    ? (normalized.features as Array<{ icon?: string; title?: string; description?: string }>)
    : [];

  return {
    name: (normalized.name as string) || '',
    slug: (normalized.slug as string) || '',
    tagline: (normalized.tagline as string) || '',
    description: (normalized.description as string) || '',
    flagImage: (normalized.flagImage as string) || '',
    heroImage: (normalized.heroImage as string) || '',
    feeRange: (normalized.feeRange as string) || '',
    duration: (normalized.duration as string) || '',
    medium: (normalized.medium as string) || '',
    livingCost: (normalized.livingCost as string) || '',
      countryCode: (normalized.countryCode as string) || '',
      language: (normalized.language as string) || '',
      currency: (normalized.currency as string) || '',
      climate: (normalized.climate as string) || '',
      bannerImage: (normalized.bannerImage as string) || '',
      cardImage: (normalized.cardImage as string) || '',
      feeRangeUSD: (normalized.feeRangeUSD as string) || '',
      headerColor: (normalized.headerColor as string) || '#F26419',
      visaInfo: (normalized.visaInfo as string) || '',
      isFeatured: (normalized.isFeatured as boolean) || false,
    status: (normalized.status as string) || 'active',
    sortOrder: (normalized.sortOrder as number) || 0,
    highlights: (normalized.highlights as string[])?.length
      ? (normalized.highlights as string[]).map((value) => ({ id: createLocalId('highlight'), value }))
      : [createEmptyTextItem('highlight')],
    faqs: (normalized.faqs as CountryFaqItem[])?.length
      ? (normalized.faqs as Array<{ question?: string; answer?: string }>).map((item) => ({
          id: createLocalId('faq'),
          question: item.question || '',
          answer: item.answer || '',
        }))
      : [createEmptyFaqItem()],
    features: featuresRaw.length
      ? featuresRaw.map((item) => ({
          id: createLocalId('feature'),
          icon: item.icon || '✦',
          title: item.title || '',
          description: item.description || '',
        }))
      : [createEmptyFeatureItem()],
    studentLife: {
      eyebrow: (studentLifeData?.eyebrow as string) || '',
      title: (studentLifeData?.title as string) || '',
      description: (studentLifeData?.description as string) || '',
      cards: studentLifeCardsRaw.length
        ? studentLifeCardsRaw.map((item) => ({
            id: createLocalId('student-life'),
            icon: item.icon || '🎓',
            title: item.title || '',
            description: item.description || '',
          }))
        : [createEmptyStudentLifeCardItem()],
    },
    documentsChecklist: {
      eyebrow: (documentsChecklistData?.eyebrow as string) || '',
      title: (documentsChecklistData?.title as string) || '',
      items: documentsChecklistItemsRaw.length
        ? documentsChecklistItemsRaw.map((item) => ({
            id: createLocalId('documents'),
            label: item.label || '',
          }))
        : [createEmptyDocumentsChecklistItem()],
    },
    supportExperience: {
      eyebrow: (supportExperienceData?.eyebrow as string) || '',
      title: (supportExperienceData?.title as string) || '',
      description: (supportExperienceData?.description as string) || '',
      progressItems: progressItemsRaw.length
        ? progressItemsRaw.map((item) => ({
            id: createLocalId('progress'),
            label: item.label || '',
            value: typeof item.value === 'number' ? item.value : 85,
            status: item.status || 'Included',
          }))
        : [createEmptySupportProgressItem()],
      supportCards: supportCardsRaw.length
        ? supportCardsRaw.map((item) => ({
            id: createLocalId('card'),
            title: item.title || '',
            subtitle: item.subtitle || '',
          }))
        : [createEmptySupportCardItem()],
    },
    eligibility: (normalized.eligibility as string[])?.length
      ? (normalized.eligibility as string[]).map((value) => ({ id: createLocalId('eligibility'), value }))
      : [createEmptyTextItem('eligibility')],
    admissionProcess: (normalized.admissionProcess as CountryProcessItem[])?.length
      ? (normalized.admissionProcess as Array<{ step?: number; title?: string; description?: string }>).map((item, index) => ({
          id: createLocalId('process'),
          step: typeof item.step === 'number' ? item.step : index + 1,
          title: item.title || '',
          description: item.description || '',
        }))
      : [createEmptyProcessItem(1)],
    seo: {
      metaTitle: ((normalized.seo as Record<string, string>)?.metaTitle) || '',
      metaDescription: ((normalized.seo as Record<string, string>)?.metaDescription) || '',
      keywords: ((normalized.seo as Record<string, string>)?.keywords) || '',
      canonicalUrl: ((normalized.seo as Record<string, string>)?.canonicalUrl) || '',
      schemaMarkup: ((normalized.seo as Record<string, string>)?.schemaMarkup) || '',
    },
  };
}

export default function CountryForm({ initialData, isEdit }: Readonly<CountryFormProps>) {
  const router = useRouter();
  const [form, setForm] = useState(() => buildCountryForm(initialData));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);
  const L = LIMITS.country;
  const textInputClass = 'w-full px-3 py-2.5 rounded-xl border border-gray-200 text-sm focus:ring-2 focus:ring-orange outline-none';
  const textAreaClass = `${textInputClass} resize-none`;
  const compactInputClass = 'w-full px-3 py-2 rounded-lg border border-gray-200 text-sm';
  const addButtonClass = 'text-sm text-orange font-medium';
  const submitButtonLabel = getSubmitButtonLabel(saving, isEdit);

  useEffect(() => {
    if (initialData) {
      setForm(buildCountryForm(initialData));
    }
  }, [initialData]);

  const updateStudentLife = (value: StudentLifeForm) => {
    setForm((prev) => ({ ...prev, studentLife: value }));
  };

  const updateDocumentsChecklist = (value: DocumentsChecklistForm) => {
    setForm((prev) => ({ ...prev, documentsChecklist: value }));
  };

  const updateSupportExperience = (value: SupportExperienceForm) => {
    setForm((prev) => ({ ...prev, supportExperience: value }));
  };

  const handleSubmit = async (e: { preventDefault: () => void }) => {
    e.preventDefault();
    const errors = validateCountryForm(buildCountryValidationInput(form));
    setValidationErrors(errors);
    if (errors.length > 0) return;
    setSaving(true);
    setError('');
    try {
      const payload = {
        ...form,
        feeRange: form.feeRange.trim(),
        duration: form.duration.trim(),
        medium: form.medium.trim(),
        livingCost: form.livingCost.trim(),
        highlights: form.highlights.map((item) => item.value).filter(Boolean),
        faqs: form.faqs
          .map(({ question, answer }) => ({
            question: question.trim(),
            answer: answer.trim(),
          }))
          .filter((faq) => faq.question && faq.answer),
        studentLife: {
          eyebrow: form.studentLife.eyebrow.trim(),
          title: form.studentLife.title.trim(),
          description: form.studentLife.description.trim(),
          cards: form.studentLife.cards
            .filter((item) => item.title.trim())
            .map((item) => ({
              icon: item.icon.trim(),
              title: item.title.trim(),
              description: item.description.trim(),
            })),
        },
        documentsChecklist: {
          eyebrow: form.documentsChecklist.eyebrow.trim(),
          title: form.documentsChecklist.title.trim(),
          items: form.documentsChecklist.items
            .filter((item) => item.label.trim())
            .map((item) => ({ label: item.label.trim() })),
        },
        supportExperience: {
          eyebrow: form.supportExperience.eyebrow.trim(),
          title: form.supportExperience.title.trim(),
          description: form.supportExperience.description.trim(),
          progressItems: form.supportExperience.progressItems.filter((item) => item.label.trim()).map((item) => ({
            label: item.label.trim(),
            value: item.value,
            status: item.status.trim(),
          })),
          supportCards: form.supportExperience.supportCards.filter((item) => item.title.trim()).map((item) => ({
            title: item.title.trim(),
            subtitle: item.subtitle.trim(),
          })),
        },
        features: form.features
          .filter((f) => f.title.trim())
          .map(({ icon, title, description }) => ({
            icon: icon.trim(),
            title: title.trim(),
            description: description.trim(),
          })),
        eligibility: form.eligibility.map((item) => item.value).filter(Boolean),
        admissionProcess: form.admissionProcess.filter((a) => a.title).map(({ step, title, description }) => ({ step, title, description })),
        seo: {
          ...form.seo,
          keywords: form.seo.keywords,
        },
        countryCode: form.countryCode.trim(),
        language: form.language.trim(),
        currency: form.currency.trim(),
        climate: form.climate.trim(),
        bannerImage: form.bannerImage.trim(),
        cardImage: form.cardImage.trim(),
        feeRangeUSD: form.feeRangeUSD.trim(),
        headerColor: form.headerColor.trim(),
        visaInfo: form.visaInfo.trim(),
        isFeatured: form.isFeatured,
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
  const autoSlug = (name: string) => name.toLowerCase().replaceAll(/[^a-z0-9]+/g, '-').replaceAll(/(^-|-$)/g, '');

  return (
    <AdminLayout>
      <form onSubmit={(e) => { void handleSubmit(e); }} className="max-w-4xl space-y-6">
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
              <label htmlFor="country-name" className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
              <input
                id="country-name"
                required
                maxLength={L.name.max}
                value={form.name}
                onChange={(e) => { updateField('name', e.target.value); if (!isEdit) updateField('slug', autoSlug(e.target.value)); }}
                className={textInputClass}
              />
              <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'name')} /><CharCount current={form.name.length} max={L.name.max} /></div>
            </div>
            <div>
              <label htmlFor="country-slug" className="block text-sm font-medium text-gray-700 mb-1">Slug</label>
              <input
                id="country-slug"
                value={form.slug}
                onChange={(e) => updateField('slug', e.target.value)}
                className={textInputClass}
              />
            </div>
          </div>

          <div>
            <label htmlFor="country-tagline" className="block text-sm font-medium text-gray-700 mb-1">Tagline</label>
            <input
              id="country-tagline"
              maxLength={L.tagline.max}
              value={form.tagline}
              onChange={(e) => updateField('tagline', e.target.value)}
              className={textInputClass}
            />
            <div className="flex justify-end"><CharCount current={form.tagline.length} max={L.tagline.max} /></div>
          </div>

          <div>
            <label htmlFor="country-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="country-description"
              rows={4}
              maxLength={L.description.max}
              value={form.description}
              onChange={(e) => updateField('description', e.target.value)}
              className={textAreaClass}
            />
            <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'description')} /><CharCount current={form.description.length} max={L.description.max} /></div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="country-fee-range" className="block text-sm font-medium text-gray-700 mb-1">Tuition Fee</label>
              <input
                id="country-fee-range"
                maxLength={L.feeRange.max}
                value={form.feeRange}
                onChange={(e) => updateField('feeRange', e.target.value)}
                className={textInputClass}
                placeholder="e.g. ₹3.5-5 Lakhs / year"
              />
              <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'feeRange')} /><CharCount current={form.feeRange.length} max={L.feeRange.max} /></div>
            </div>
            <div>
              <label htmlFor="country-fee-usd" className="block text-sm font-medium text-gray-700 mb-1">Tuition Fee (USD)</label>
              <input
                id="country-fee-usd"
                maxLength={100}
                value={form.feeRangeUSD}
                onChange={(e) => updateField('feeRangeUSD', e.target.value)}
                className={textInputClass}
                placeholder="e.g. $5000-8000 / year"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="country-duration" className="block text-sm font-medium text-gray-700 mb-1">Course Duration</label>
              <input
                id="country-duration"
                maxLength={L.duration.max}
                value={form.duration}
                onChange={(e) => updateField('duration', e.target.value)}
                className={textInputClass}
                placeholder="e.g. 6 Years"
              />
              <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'duration')} /><CharCount current={form.duration.length} max={L.duration.max} /></div>
            </div>
            <div>
              <label htmlFor="country-living-cost" className="block text-sm font-medium text-gray-700 mb-1">Living Cost</label>
              <input
                id="country-living-cost"
                maxLength={L.livingCost.max}
                value={form.livingCost}
                onChange={(e) => updateField('livingCost', e.target.value)}
                className={textInputClass}
                placeholder="e.g. Budget friendly"
              />
              <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'livingCost')} /><CharCount current={form.livingCost.length} max={L.livingCost.max} /></div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="country-medium" className="block text-sm font-medium text-gray-700 mb-1">Medium of Study</label>
              <input
                id="country-medium"
                maxLength={L.medium.max}
                value={form.medium}
                onChange={(e) => updateField('medium', e.target.value)}
                className={textInputClass}
                placeholder="e.g. English medium"
              />
              <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'medium')} /><CharCount current={form.medium.length} max={L.medium.max} /></div>
            </div>
            <div>
              <label htmlFor="country-code" className="block text-sm font-medium text-gray-700 mb-1">Country Code</label>
              <input
                id="country-code"
                maxLength={10}
                value={form.countryCode}
                onChange={(e) => updateField('countryCode', e.target.value)}
                className={textInputClass}
                placeholder="e.g. RU, IN, US"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="country-language" className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <input
                id="country-language"
                maxLength={100}
                value={form.language}
                onChange={(e) => updateField('language', e.target.value)}
                className={textInputClass}
                placeholder="e.g. English, Russian"
              />
            </div>
            <div>
              <label htmlFor="country-currency" className="block text-sm font-medium text-gray-700 mb-1">Currency</label>
              <input
                id="country-currency"
                maxLength={100}
                value={form.currency}
                onChange={(e) => updateField('currency', e.target.value)}
                className={textInputClass}
                placeholder="e.g. RUB, INR, USD"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="country-climate" className="block text-sm font-medium text-gray-700 mb-1">Climate</label>
              <input
                id="country-climate"
                maxLength={100}
                value={form.climate}
                onChange={(e) => updateField('climate', e.target.value)}
                className={textInputClass}
                placeholder="e.g. Temperate, Tropical"
              />
            </div>
            <div>
              <label htmlFor="country-status" className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                id="country-status"
                value={form.status}
                onChange={(e) => updateField('status', e.target.value)}
                className={textInputClass}
              >
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="country-featured" className="block text-sm font-medium text-gray-700 mb-1">Featured</label>
              <select
                id="country-featured"
                value={form.isFeatured ? 'true' : 'false'}
                onChange={(e) => updateField('isFeatured', e.target.value === 'true')}
                className={textInputClass}
              >
                <option value="false">No</option>
                <option value="true">Yes</option>
              </select>
            </div>
            <div>
              <label htmlFor="country-header-color" className="block text-sm font-medium text-gray-700 mb-1">Header Color</label>
              <div className="flex gap-2">
                <input
                  id="country-header-color"
                  type="color"
                  value={form.headerColor}
                  onChange={(e) => updateField('headerColor', e.target.value)}
                  className="h-10 w-16 rounded border border-gray-200 cursor-pointer"
                />
                <input
                  type="text"
                  value={form.headerColor}
                  onChange={(e) => updateField('headerColor', e.target.value)}
                  className={`flex-1 ${textInputClass}`}
                  placeholder="#F26419"
                />
              </div>
            </div>
          </div>
        </section>

        {/* Images */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <h2 className="font-semibold text-gray-900">Images</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">Flag Image</div>
              <ImageUploader
                folder="countries"
                currentImage={form.flagImage}
                onUpload={(url) => updateField('flagImage', url)}
                hint="Recommended: 80×60 px (4:3). Small flag icon shown alongside country name."
              />
            </div>
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">Hero Image</div>
              <ImageUploader
                folder="countries"
                currentImage={form.heroImage}
                onUpload={(url) => updateField('heroImage', url)}
                hint="Recommended: 1200×600 px (2:1). Large cover image used on the country page hero and home section card."
              />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">Banner Image</div>
              <ImageUploader
                folder="countries"
                currentImage={form.bannerImage}
                onUpload={(url) => updateField('bannerImage', url)}
                hint="Recommended: 1600×400 px (4:1). Wide banner image for section headers."
              />
            </div>
            <div>
              <div className="block text-sm font-medium text-gray-700 mb-2">Card Image</div>
              <ImageUploader
                folder="countries"
                currentImage={form.cardImage}
                onUpload={(url) => updateField('cardImage', url)}
                hint="Recommended: 400×300 px (4:3). Thumbnail for country cards in listings."
              />
            </div>
          </div>
        </section>

        {/* Student Life */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div>
            <h2 className="font-semibold text-gray-900">Student Life Section</h2>
            <p className="mt-1 text-sm text-gray-500">Controls the student-life block on the country page.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="student-life-eyebrow" className="block text-sm font-medium text-gray-700 mb-1">Eyebrow</label>
              <input
                id="student-life-eyebrow"
                maxLength={L.studentLife.eyebrowMax}
                value={form.studentLife.eyebrow}
                onChange={(e) => updateStudentLife({ ...form.studentLife, eyebrow: e.target.value })}
                className={textInputClass}
              />
              <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'studentLife.eyebrow')} /><CharCount current={form.studentLife.eyebrow.length} max={L.studentLife.eyebrowMax} /></div>
            </div>
            <div>
              <label htmlFor="student-life-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                id="student-life-title"
                maxLength={L.studentLife.titleMax}
                value={form.studentLife.title}
                onChange={(e) => updateStudentLife({ ...form.studentLife, title: e.target.value })}
                className={textInputClass}
              />
              <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'studentLife.title')} /><CharCount current={form.studentLife.title.length} max={L.studentLife.titleMax} /></div>
            </div>
          </div>

          <div>
            <label htmlFor="student-life-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="student-life-description"
              rows={3}
              maxLength={L.studentLife.descriptionMax}
              value={form.studentLife.description}
              onChange={(e) => updateStudentLife({ ...form.studentLife, description: e.target.value })}
              className={textAreaClass}
            />
            <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'studentLife.description')} /><CharCount current={form.studentLife.description.length} max={L.studentLife.descriptionMax} /></div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Student Life Cards <span className="text-xs text-gray-400 font-normal">({form.studentLife.cards.filter((item) => item.title.trim()).length}/{L.studentLife.cardsMax})</span></h3>
              {form.studentLife.cards.length < L.studentLife.cardsMax && (
                <button type="button" onClick={() => updateStudentLife({ ...form.studentLife, cards: [...form.studentLife.cards, createEmptyStudentLifeCardItem()] })} className={addButtonClass}>+ Add</button>
              )}
            </div>
            <FieldError message={getFieldError(validationErrors, 'studentLife.cards')} />
            {form.studentLife.cards.map((item, i) => (
              <div key={item.id} className="rounded-xl bg-gray-50 p-3 space-y-2">
                <div className="grid gap-2 sm:grid-cols-[84px_1fr_auto]">
                  <input
                    maxLength={L.studentLife.cardIconMax}
                    value={item.icon}
                    onChange={(e) => {
                      const arr = [...form.studentLife.cards];
                      arr[i] = { ...arr[i], icon: e.target.value };
                      updateStudentLife({ ...form.studentLife, cards: arr });
                    }}
                    placeholder="Emoji"
                    className={`${compactInputClass} text-center`}
                  />
                  <input
                    maxLength={L.studentLife.cardTitleMax}
                    value={item.title}
                    onChange={(e) => {
                      const arr = [...form.studentLife.cards];
                      arr[i] = { ...arr[i], title: e.target.value };
                      updateStudentLife({ ...form.studentLife, cards: arr });
                    }}
                    placeholder="Card title"
                    className={compactInputClass}
                  />
                  {form.studentLife.cards.length > 1 && (
                    <button type="button" onClick={() => updateStudentLife({ ...form.studentLife, cards: form.studentLife.cards.filter((_, j) => j !== i) })} className="text-red-400 hover:text-red-600 px-2">×</button>
                  )}
                </div>
                <textarea
                  rows={2}
                  maxLength={L.studentLife.cardDescriptionMax}
                  value={item.description}
                  onChange={(e) => {
                    const arr = [...form.studentLife.cards];
                    arr[i] = { ...arr[i], description: e.target.value };
                    updateStudentLife({ ...form.studentLife, cards: arr });
                  }}
                  placeholder="Card description"
                  className={`${compactInputClass} resize-none`}
                />
                <div className="text-[11px] text-gray-400">
                  Keep each card focused on one aspect of student life such as accommodation, food, academics, safety, or culture.
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Documents Checklist */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div>
            <h2 className="font-semibold text-gray-900">Documents Checklist Section</h2>
            <p className="mt-1 text-sm text-gray-500">Controls the documents checklist block on the country page.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="documents-eyebrow" className="block text-sm font-medium text-gray-700 mb-1">Eyebrow</label>
              <input
                id="documents-eyebrow"
                maxLength={L.documentsChecklist.eyebrowMax}
                value={form.documentsChecklist.eyebrow}
                onChange={(e) => updateDocumentsChecklist({ ...form.documentsChecklist, eyebrow: e.target.value })}
                className={textInputClass}
              />
              <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'documentsChecklist.eyebrow')} /><CharCount current={form.documentsChecklist.eyebrow.length} max={L.documentsChecklist.eyebrowMax} /></div>
            </div>
            <div>
              <label htmlFor="documents-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                id="documents-title"
                maxLength={L.documentsChecklist.titleMax}
                value={form.documentsChecklist.title}
                onChange={(e) => updateDocumentsChecklist({ ...form.documentsChecklist, title: e.target.value })}
                className={textInputClass}
              />
              <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'documentsChecklist.title')} /><CharCount current={form.documentsChecklist.title.length} max={L.documentsChecklist.titleMax} /></div>
            </div>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-gray-900">Checklist Items <span className="text-xs text-gray-400 font-normal">({form.documentsChecklist.items.filter((item) => item.label.trim()).length}/{L.documentsChecklist.itemsMax})</span></h3>
              {form.documentsChecklist.items.length < L.documentsChecklist.itemsMax && (
                <button type="button" onClick={() => updateDocumentsChecklist({ ...form.documentsChecklist, items: [...form.documentsChecklist.items, createEmptyDocumentsChecklistItem()] })} className={addButtonClass}>+ Add</button>
              )}
            </div>
            <FieldError message={getFieldError(validationErrors, 'documentsChecklist.items')} />
            {form.documentsChecklist.items.map((item, i) => (
              <div key={item.id} className="flex gap-2">
                <input
                  maxLength={L.documentsChecklist.itemLabelMax}
                  value={item.label}
                  onChange={(e) => {
                    const arr = [...form.documentsChecklist.items];
                    arr[i] = { ...arr[i], label: e.target.value };
                    updateDocumentsChecklist({ ...form.documentsChecklist, items: arr });
                  }}
                  placeholder={`Document ${i + 1}`}
                  className={textInputClass}
                />
                {form.documentsChecklist.items.length > 1 && (
                  <button type="button" onClick={() => updateDocumentsChecklist({ ...form.documentsChecklist, items: form.documentsChecklist.items.filter((_, j) => j !== i) })} className="text-red-400 hover:text-red-600 px-2">×</button>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Support Experience */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div>
            <h2 className="font-semibold text-gray-900">Support Experience Section</h2>
            <p className="mt-1 text-sm text-gray-500">Controls the dark support block on the country page.</p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="support-eyebrow" className="block text-sm font-medium text-gray-700 mb-1">Eyebrow</label>
              <input
                id="support-eyebrow"
                maxLength={L.supportExperience.eyebrowMax}
                value={form.supportExperience.eyebrow}
                onChange={(e) => updateSupportExperience({ ...form.supportExperience, eyebrow: e.target.value })}
                className={textInputClass}
              />
              <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'supportExperience.eyebrow')} /><CharCount current={form.supportExperience.eyebrow.length} max={L.supportExperience.eyebrowMax} /></div>
            </div>
            <div>
              <label htmlFor="support-title" className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                id="support-title"
                maxLength={L.supportExperience.titleMax}
                value={form.supportExperience.title}
                onChange={(e) => updateSupportExperience({ ...form.supportExperience, title: e.target.value })}
                className={textInputClass}
              />
              <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'supportExperience.title')} /><CharCount current={form.supportExperience.title.length} max={L.supportExperience.titleMax} /></div>
            </div>
          </div>

          <div>
            <label htmlFor="support-description" className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              id="support-description"
              rows={3}
              maxLength={L.supportExperience.descriptionMax}
              value={form.supportExperience.description}
              onChange={(e) => updateSupportExperience({ ...form.supportExperience, description: e.target.value })}
              className={textAreaClass}
            />
            <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'supportExperience.description')} /><CharCount current={form.supportExperience.description.length} max={L.supportExperience.descriptionMax} /></div>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Progress Items <span className="text-xs text-gray-400 font-normal">({form.supportExperience.progressItems.filter((item) => item.label.trim()).length}/{L.supportExperience.progressItemsMax})</span></h3>
                {form.supportExperience.progressItems.length < L.supportExperience.progressItemsMax && (
                  <button type="button" onClick={() => updateSupportExperience({ ...form.supportExperience, progressItems: [...form.supportExperience.progressItems, { ...createEmptySupportProgressItem(), value: 80 }] })} className={addButtonClass}>+ Add</button>
                )}
              </div>
              <FieldError message={getFieldError(validationErrors, 'supportExperience.progressItems')} />
              {form.supportExperience.progressItems.map((item, i) => (
                <div key={item.id} className="rounded-xl bg-gray-50 p-3 space-y-2">
                  <div className="flex gap-2">
                    <input
                      maxLength={L.supportExperience.progressLabelMax}
                      value={item.label}
                      onChange={(e) => {
                        const arr = [...form.supportExperience.progressItems];
                        arr[i] = { ...arr[i], label: e.target.value };
                        updateSupportExperience({ ...form.supportExperience, progressItems: arr });
                      }}
                      placeholder="Label"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    />
                    {form.supportExperience.progressItems.length > 1 && (
                      <button type="button" onClick={() => updateSupportExperience({ ...form.supportExperience, progressItems: form.supportExperience.progressItems.filter((_, j) => j !== i) })} className="text-red-400 hover:text-red-600 px-2">×</button>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={item.value}
                      onChange={(e) => {
                        const arr = [...form.supportExperience.progressItems];
                        arr[i] = { ...arr[i], value: Math.min(100, Math.max(0, Number.parseInt(e.target.value) || 0)) };
                        updateSupportExperience({ ...form.supportExperience, progressItems: arr });
                      }}
                      placeholder="Progress %"
                      className={compactInputClass}
                    />
                    <input
                      maxLength={L.supportExperience.progressStatusMax}
                      value={item.status}
                      onChange={(e) => {
                        const arr = [...form.supportExperience.progressItems];
                        arr[i] = { ...arr[i], status: e.target.value };
                        updateSupportExperience({ ...form.supportExperience, progressItems: arr });
                      }}
                      placeholder="Status text"
                      className={compactInputClass}
                    />
                  </div>
                  <div className="text-[11px] text-gray-400">
                    Keep labels short for the country-page layout.
                  </div>
                </div>
              ))}
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-gray-900">Support Cards <span className="text-xs text-gray-400 font-normal">({form.supportExperience.supportCards.filter((item) => item.title.trim()).length}/{L.supportExperience.supportCardsMax})</span></h3>
                {form.supportExperience.supportCards.length < L.supportExperience.supportCardsMax && (
                  <button type="button" onClick={() => updateSupportExperience({ ...form.supportExperience, supportCards: [...form.supportExperience.supportCards, createEmptySupportCardItem()] })} className={addButtonClass}>+ Add</button>
                )}
              </div>
              <FieldError message={getFieldError(validationErrors, 'supportExperience.supportCards')} />
              {form.supportExperience.supportCards.map((item, i) => (
                <div key={item.id} className="rounded-xl bg-gray-50 p-3 space-y-2">
                  <div className="flex gap-2">
                    <input
                      maxLength={L.supportExperience.supportCardTitleMax}
                      value={item.title}
                      onChange={(e) => {
                        const arr = [...form.supportExperience.supportCards];
                        arr[i] = { ...arr[i], title: e.target.value };
                        updateSupportExperience({ ...form.supportExperience, supportCards: arr });
                      }}
                      placeholder="Card title"
                      className="flex-1 px-3 py-2 rounded-lg border border-gray-200 text-sm"
                    />
                    {form.supportExperience.supportCards.length > 1 && (
                      <button type="button" onClick={() => updateSupportExperience({ ...form.supportExperience, supportCards: form.supportExperience.supportCards.filter((_, j) => j !== i) })} className="text-red-400 hover:text-red-600 px-2">×</button>
                    )}
                  </div>
                  <input
                    maxLength={L.supportExperience.supportCardSubtitleMax}
                    value={item.subtitle}
                    onChange={(e) => {
                      const arr = [...form.supportExperience.supportCards];
                      arr[i] = { ...arr[i], subtitle: e.target.value };
                      updateSupportExperience({ ...form.supportExperience, supportCards: arr });
                    }}
                    placeholder="Card subtitle"
                    className="w-full px-3 py-2 rounded-lg border border-gray-200 text-sm"
                  />
                  <div className="text-[11px] text-gray-400">
                    Use 1-3 short words for title and a short subtitle.
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Highlights */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Highlights <span className="text-xs text-gray-400 font-normal">({form.highlights.filter(Boolean).length}/{L.highlights.maxItems})</span></h2>
            {form.highlights.length < L.highlights.maxItems && (
            <button type="button" onClick={() => updateField('highlights', [...form.highlights, createEmptyTextItem('highlight')])} className={addButtonClass}>+ Add</button>
            )}
          </div>
          <FieldError message={getFieldError(validationErrors, 'highlights')} />
          {form.highlights.map((h, i) => (
            <div key={h.id} className="flex gap-2">
              <input
                id={`highlight-${h.id}`}
                maxLength={L.highlights.maxLen}
                value={h.value}
                onChange={(e) => { const arr = [...form.highlights]; arr[i] = { ...arr[i], value: e.target.value }; updateField('highlights', arr); }}
                placeholder={`Highlight ${i + 1}`}
                className={textInputClass}
              />
              {form.highlights.length > 1 && (
                <button type="button" onClick={() => updateField('highlights', form.highlights.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 px-2">×</button>
              )}
            </div>
          ))}
        </section>

        {/* Features */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-gray-900">Why Choose Cards</h2>
              <p className="mt-1 text-sm text-gray-500">Controls the feature cards shown on the country page.</p>
            </div>
            {form.features.length < L.features.maxItems && (
              <button type="button" onClick={() => updateField('features', [...form.features, createEmptyFeatureItem()])} className={addButtonClass}>+ Add</button>
            )}
          </div>
          <FieldError message={getFieldError(validationErrors, 'features')} />
          {form.features.map((feature, i) => (
            <div key={feature.id} className="rounded-xl bg-gray-50 p-3 space-y-2">
              <div className="grid gap-2 sm:grid-cols-[84px_1fr_auto]">
                <input
                  maxLength={L.features.iconMax}
                  value={feature.icon}
                  onChange={(e) => {
                    const arr = [...form.features];
                    arr[i] = { ...arr[i], icon: e.target.value };
                    updateField('features', arr);
                  }}
                  placeholder="Icon"
                  className={`${compactInputClass} text-center`}
                />
                <input
                  maxLength={L.features.titleMax}
                  value={feature.title}
                  onChange={(e) => {
                    const arr = [...form.features];
                    arr[i] = { ...arr[i], title: e.target.value };
                    updateField('features', arr);
                  }}
                  placeholder="Feature title"
                  className={compactInputClass}
                />
                {form.features.length > 1 && (
                  <button type="button" onClick={() => updateField('features', form.features.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 px-2">×</button>
                )}
              </div>
              <textarea
                rows={2}
                maxLength={L.features.descriptionMax}
                value={feature.description}
                onChange={(e) => {
                  const arr = [...form.features];
                  arr[i] = { ...arr[i], description: e.target.value };
                  updateField('features', arr);
                }}
                placeholder="Feature description"
                className={`${compactInputClass} resize-none`}
              />
            </div>
          ))}
        </section>

        {/* FAQs */}
               <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
                 <div>
                   <h2 className="font-semibold text-gray-900">Visa Information</h2>
                   <p className="mt-1 text-sm text-gray-500">Important visa requirements and process for this country.</p>
                 </div>
                 <textarea
                   id="country-visa-info"
                   rows={4}
                   maxLength={2000}
                   value={form.visaInfo}
                   onChange={(e) => updateField('visaInfo', e.target.value)}
                   className={textAreaClass}
                   placeholder="Visa requirements, processing time, fees, documents needed..."
                 />
                 <CharCount current={form.visaInfo.length} max={2000} />
               </section>

               {/* FAQs */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div>
            <h2 className="font-semibold text-gray-900">Country FAQs <span className="text-xs text-gray-400 font-normal">({form.faqs.filter((f) => f.question).length}/{L.faqs.maxItems})</span></h2>
            <p className="mt-1 text-sm text-gray-500">Embedded FAQs shown directly on this country&apos;s public page. Manage country-specific questions here.</p>
          </div>
          <div className="flex items-center justify-between">
            {form.faqs.length < L.faqs.maxItems && (
            <button type="button" onClick={() => updateField('faqs', [...form.faqs, createEmptyFaqItem()])} className={addButtonClass}>+ Add</button>
            )}
          </div>
          <FieldError message={getFieldError(validationErrors, 'faqs')} />
          {form.faqs.map((faq, i) => (
            <div key={faq.id} className="p-3 bg-gray-50 rounded-xl space-y-2">
              <div className="flex gap-2">
                <input
                  id={`faq-question-${faq.id}`}
                  maxLength={L.faqs.questionMax}
                  value={faq.question}
                  onChange={(e) => {
                    const arr = [...form.faqs];
                    arr[i] = { ...arr[i], question: e.target.value };
                    updateField('faqs', arr);
                  }}
                  placeholder="Question"
                  className={compactInputClass}
                />
                {form.faqs.length > 1 && (
                  <button type="button" onClick={() => updateField('faqs', form.faqs.filter((_, j) => j !== i))} className="text-red-400 hover:text-red-600 px-2">×</button>
                )}
              </div>
              <textarea
                maxLength={L.faqs.answerMax}
                value={faq.answer}
                onChange={(e) => {
                  const arr = [...form.faqs];
                  arr[i] = { ...arr[i], answer: e.target.value };
                  updateField('faqs', arr);
                }}
                placeholder="Answer"
                rows={2}
                className={`${compactInputClass} resize-none`}
              />
            </div>
          ))}
        </section>

        {/* Eligibility */}
        <section className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Eligibility Criteria <span className="text-xs text-gray-400 font-normal">({form.eligibility.filter(Boolean).length}/{L.eligibility.maxItems})</span></h2>
            {form.eligibility.length < L.eligibility.maxItems && (
            <button type="button" onClick={() => updateField('eligibility', [...form.eligibility, createEmptyTextItem('eligibility')])} className={addButtonClass}>+ Add</button>
            )}
          </div>
          <FieldError message={getFieldError(validationErrors, 'eligibility')} />
          {form.eligibility.map((e, i) => (
            <div key={e.id} className="flex gap-2">
              <input
                id={`eligibility-${e.id}`}
                maxLength={L.eligibility.maxLen}
                value={e.value}
                onChange={(ev) => { const arr = [...form.eligibility]; arr[i] = { ...arr[i], value: ev.target.value }; updateField('eligibility', arr); }}
                placeholder={`Criterion ${i + 1}`}
                className={textInputClass}
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
            <button type="button" onClick={() => updateField('admissionProcess', [...form.admissionProcess, createEmptyProcessItem(form.admissionProcess.length + 1)])} className={addButtonClass}>+ Add Step</button>
            )}
          </div>
          <FieldError message={getFieldError(validationErrors, 'admissionProcess')} />
          {form.admissionProcess.map((s, i) => (
            <div key={s.id} className="grid grid-cols-1 sm:grid-cols-[60px_1fr_1fr_auto] gap-2 p-3 bg-gray-50 rounded-xl items-center">
              <input type="number" value={s.step} onChange={(e) => { const arr = [...form.admissionProcess]; arr[i] = { ...arr[i], step: Number.parseInt(e.target.value) || 0 }; updateField('admissionProcess', arr); }} placeholder="#" className={`${compactInputClass} text-center`} />
              <input maxLength={L.admissionProcess.titleMax} value={s.title} onChange={(e) => { const arr = [...form.admissionProcess]; arr[i] = { ...arr[i], title: e.target.value }; updateField('admissionProcess', arr); }} placeholder="Step title" className={compactInputClass} />
              <input maxLength={L.admissionProcess.descMax} value={s.description} onChange={(e) => { const arr = [...form.admissionProcess]; arr[i] = { ...arr[i], description: e.target.value }; updateField('admissionProcess', arr); }} placeholder="Step description" className={compactInputClass} />
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
            <label htmlFor="seo-meta-title" className="block text-sm font-medium text-gray-700 mb-1">Meta Title</label>
            <input id="seo-meta-title" maxLength={L.seoTitle.max} value={form.seo.metaTitle} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, metaTitle: e.target.value } }))} className={textInputClass} />
            <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'seoTitle')} /><CharCount current={form.seo.metaTitle.length} max={L.seoTitle.max} /></div>
          </div>
          <div>
            <label htmlFor="seo-meta-description" className="block text-sm font-medium text-gray-700 mb-1">Meta Description</label>
            <textarea id="seo-meta-description" rows={2} maxLength={L.seoDesc.max} value={form.seo.metaDescription} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, metaDescription: e.target.value } }))} className={textAreaClass} />
            <div className="flex justify-between"><FieldError message={getFieldError(validationErrors, 'seoDesc')} /><CharCount current={form.seo.metaDescription.length} max={L.seoDesc.max} /></div>
          </div>
          <div>
            <label htmlFor="seo-keywords" className="block text-sm font-medium text-gray-700 mb-1">Keywords (comma separated)</label>
            <input id="seo-keywords" maxLength={L.seoKeywords.max} value={form.seo.keywords} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, keywords: e.target.value } }))} className={textInputClass} />
            <div className="flex justify-end"><CharCount current={form.seo.keywords.length} max={L.seoKeywords.max} /></div>
          </div>
          <div>
            <label htmlFor="seo-canonical" className="block text-sm font-medium text-gray-700 mb-1">Canonical URL</label>
            <input id="seo-canonical" value={form.seo.canonicalUrl} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, canonicalUrl: e.target.value } }))} placeholder="https://amwcareerpoint.com/countries/your-slug (leave empty for auto)" className={textInputClass} />
            <p className="text-xs text-gray-400 mt-1">Leave empty to use the default page URL as canonical</p>
          </div>
          <div>
            <label htmlFor="seo-schema" className="block text-sm font-medium text-gray-700 mb-1">Schema Markup (JSON-LD)</label>
            <textarea id="seo-schema" rows={6} value={form.seo.schemaMarkup} onChange={(e) => setForm((p) => ({ ...p, seo: { ...p.seo, schemaMarkup: e.target.value } }))} placeholder='{"@context":"https://schema.org","@type":"Country",...}' className={`${textAreaClass} font-mono resize-y`} />
            <p className="text-xs text-gray-400 mt-1">Optional. Paste valid JSON-LD schema. Leave empty for auto-generated schema.</p>
          </div>
        </section>

        {/* Submit */}
        <div className="flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-orange hover:bg-orange-hover text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60"
          >
            {submitButtonLabel}
          </button>
          <button type="button" onClick={() => router.back()} className="px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50">Cancel</button>
        </div>
      </form>
    </AdminLayout>
  );
}
