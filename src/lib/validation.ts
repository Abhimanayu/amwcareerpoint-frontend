// Admin form validation rules to prevent UI breakage from too much/little content

export interface ValidationError {
  field: string;
  message: string;
}

// --- Field limits (used for both validation and UI hints) ---

export const LIMITS = {
  // Country
  country: {
    name: { min: 2, max: 60 },
    slug: { min: 2, max: 80 },
    tagline: { max: 150 },
    description: { min: 20, max: 2000 },
    highlights: { maxItems: 12, maxLen: 120 },
    eligibility: { maxItems: 15, maxLen: 200 },
    admissionProcess: { maxItems: 10, titleMax: 80, descMax: 250 },
    seoTitle: { max: 70 },
    seoDesc: { max: 160 },
    seoKeywords: { max: 250 },
  },
  // University
  university: {
    name: { min: 3, max: 120 },
    slug: { min: 2, max: 140 },
    description: { min: 20, max: 3000 },
    ranking: { max: 80 },
    accreditation: { max: 120 },
    courseDuration: { max: 60 },
    annualFees: { max: 60 },
    medium: { max: 40 },
    hostelFees: { max: 60 },
    eligibility: { max: 1000 },
    gallery: { maxItems: 10 },
    recognition: { maxItems: 10, maxLen: 60 },
    highlights: { maxItems: 15, labelMax: 50, valueMax: 80 },
    faqs: { maxItems: 15, questionMax: 200, answerMax: 1000 },
    seoTitle: { max: 70 },
    seoDesc: { max: 160 },
    seoKeywords: { max: 250 },
  },
  // Blog
  blog: {
    title: { min: 5, max: 150 },
    slug: { min: 2, max: 180 },
    excerpt: { max: 300 },
    content: { min: 50 },
    author: { max: 60 },
    tags: { max: 250 },
    seoTitle: { max: 70 },
    seoDesc: { max: 160 },
    seoKeywords: { max: 250 },
  },
} as const;

// --- Validators ---

export function validateCountryForm(form: {
  name: string;
  slug: string;
  tagline: string;
  description: string;
  highlights: string[];
  eligibility: string[];
  admissionProcess: { step: number; title: string; description: string }[];
  seo: { metaTitle: string; metaDescription: string; keywords: string };
}): ValidationError[] {
  const errors: ValidationError[] = [];
  const L = LIMITS.country;

  if (!form.name.trim()) errors.push({ field: 'name', message: 'Country name is required' });
  else if (form.name.length < L.name.min) errors.push({ field: 'name', message: `Name must be at least ${L.name.min} characters` });
  else if (form.name.length > L.name.max) errors.push({ field: 'name', message: `Name must not exceed ${L.name.max} characters` });

  if (form.slug && form.slug.length > L.slug.max) errors.push({ field: 'slug', message: `Slug must not exceed ${L.slug.max} characters` });
  if (form.slug && !/^[a-z0-9-]+$/.test(form.slug)) errors.push({ field: 'slug', message: 'Slug can only contain lowercase letters, numbers, and hyphens' });

  if (form.tagline.length > L.tagline.max) errors.push({ field: 'tagline', message: `Tagline must not exceed ${L.tagline.max} characters` });

  if (form.description && form.description.length < L.description.min) errors.push({ field: 'description', message: `Description must be at least ${L.description.min} characters` });
  if (form.description.length > L.description.max) errors.push({ field: 'description', message: `Description must not exceed ${L.description.max} characters` });

  const activeHighlights = form.highlights.filter(Boolean);
  if (activeHighlights.length > L.highlights.maxItems) errors.push({ field: 'highlights', message: `Maximum ${L.highlights.maxItems} highlights allowed` });
  if (activeHighlights.some((h) => h.length > L.highlights.maxLen)) errors.push({ field: 'highlights', message: `Each highlight must not exceed ${L.highlights.maxLen} characters` });

  const activeEligibility = form.eligibility.filter(Boolean);
  if (activeEligibility.length > L.eligibility.maxItems) errors.push({ field: 'eligibility', message: `Maximum ${L.eligibility.maxItems} eligibility criteria allowed` });
  if (activeEligibility.some((e) => e.length > L.eligibility.maxLen)) errors.push({ field: 'eligibility', message: `Each criterion must not exceed ${L.eligibility.maxLen} characters` });

  const activeSteps = form.admissionProcess.filter((a) => a.title);
  if (activeSteps.length > L.admissionProcess.maxItems) errors.push({ field: 'admissionProcess', message: `Maximum ${L.admissionProcess.maxItems} steps allowed` });
  if (activeSteps.some((s) => s.title.length > L.admissionProcess.titleMax)) errors.push({ field: 'admissionProcess', message: `Step title must not exceed ${L.admissionProcess.titleMax} characters` });
  if (activeSteps.some((s) => s.description.length > L.admissionProcess.descMax)) errors.push({ field: 'admissionProcess', message: `Step description must not exceed ${L.admissionProcess.descMax} characters` });

  if (form.seo.metaTitle.length > L.seoTitle.max) errors.push({ field: 'seoTitle', message: `Meta title must not exceed ${L.seoTitle.max} characters` });
  if (form.seo.metaDescription.length > L.seoDesc.max) errors.push({ field: 'seoDesc', message: `Meta description must not exceed ${L.seoDesc.max} characters` });
  if (form.seo.keywords.length > L.seoKeywords.max) errors.push({ field: 'seoKeywords', message: `Keywords must not exceed ${L.seoKeywords.max} characters` });

  return errors;
}

export function validateUniversityForm(form: {
  name: string;
  slug: string;
  country: string;
  description: string;
  ranking: string;
  accreditation: string;
  courseDuration: string;
  annualFees: string;
  medium: string;
  hostelFees: string;
  eligibility: string;
  gallery: string[];
  recognition: string[];
  highlights: { label: string; value: string }[];
  faqs: { question: string; answer: string }[];
  seo: { metaTitle: string; metaDescription: string; keywords: string };
}): ValidationError[] {
  const errors: ValidationError[] = [];
  const L = LIMITS.university;

  if (!form.name.trim()) errors.push({ field: 'name', message: 'University name is required' });
  else if (form.name.length < L.name.min) errors.push({ field: 'name', message: `Name must be at least ${L.name.min} characters` });
  else if (form.name.length > L.name.max) errors.push({ field: 'name', message: `Name must not exceed ${L.name.max} characters` });

  if (!form.country) errors.push({ field: 'country', message: 'Country is required' });

  if (form.slug && form.slug.length > L.slug.max) errors.push({ field: 'slug', message: `Slug must not exceed ${L.slug.max} characters` });
  if (form.slug && !/^[a-z0-9-]+$/.test(form.slug)) errors.push({ field: 'slug', message: 'Slug can only contain lowercase letters, numbers, and hyphens' });

  if (form.description && form.description.length < L.description.min) errors.push({ field: 'description', message: `Description must be at least ${L.description.min} characters` });
  if (form.description.length > L.description.max) errors.push({ field: 'description', message: `Description must not exceed ${L.description.max} characters` });

  if (form.ranking.length > L.ranking.max) errors.push({ field: 'ranking', message: `Ranking must not exceed ${L.ranking.max} characters` });
  if (form.accreditation.length > L.accreditation.max) errors.push({ field: 'accreditation', message: `Accreditation must not exceed ${L.accreditation.max} characters` });
  if (form.courseDuration.length > L.courseDuration.max) errors.push({ field: 'courseDuration', message: `Course duration must not exceed ${L.courseDuration.max} characters` });
  if (form.annualFees.length > L.annualFees.max) errors.push({ field: 'annualFees', message: `Annual fees must not exceed ${L.annualFees.max} characters` });
  if (form.medium.length > L.medium.max) errors.push({ field: 'medium', message: `Medium must not exceed ${L.medium.max} characters` });
  if (form.hostelFees.length > L.hostelFees.max) errors.push({ field: 'hostelFees', message: `Hostel fees must not exceed ${L.hostelFees.max} characters` });
  if (form.eligibility.length > L.eligibility.max) errors.push({ field: 'eligibility', message: `Eligibility must not exceed ${L.eligibility.max} characters` });

  const activeGallery = form.gallery.filter(Boolean);
  if (activeGallery.length > L.gallery.maxItems) errors.push({ field: 'gallery', message: `Maximum ${L.gallery.maxItems} gallery images allowed` });

  const activeRecognition = form.recognition.filter(Boolean);
  if (activeRecognition.length > L.recognition.maxItems) errors.push({ field: 'recognition', message: `Maximum ${L.recognition.maxItems} recognition items allowed` });
  if (activeRecognition.some((r) => r.length > L.recognition.maxLen)) errors.push({ field: 'recognition', message: `Each recognition must not exceed ${L.recognition.maxLen} characters` });

  const activeHighlights = form.highlights.filter((h) => h.label);
  if (activeHighlights.length > L.highlights.maxItems) errors.push({ field: 'highlights', message: `Maximum ${L.highlights.maxItems} highlights allowed` });
  if (activeHighlights.some((h) => h.label.length > L.highlights.labelMax)) errors.push({ field: 'highlights', message: `Highlight label must not exceed ${L.highlights.labelMax} characters` });
  if (activeHighlights.some((h) => h.value.length > L.highlights.valueMax)) errors.push({ field: 'highlights', message: `Highlight value must not exceed ${L.highlights.valueMax} characters` });

  const activeFaqs = form.faqs.filter((f) => f.question);
  if (activeFaqs.length > L.faqs.maxItems) errors.push({ field: 'faqs', message: `Maximum ${L.faqs.maxItems} FAQs allowed` });
  if (activeFaqs.some((f) => f.question.length > L.faqs.questionMax)) errors.push({ field: 'faqs', message: `FAQ question must not exceed ${L.faqs.questionMax} characters` });
  if (activeFaqs.some((f) => f.answer.length > L.faqs.answerMax)) errors.push({ field: 'faqs', message: `FAQ answer must not exceed ${L.faqs.answerMax} characters` });

  if (form.seo.metaTitle.length > L.seoTitle.max) errors.push({ field: 'seoTitle', message: `Meta title must not exceed ${L.seoTitle.max} characters` });
  if (form.seo.metaDescription.length > L.seoDesc.max) errors.push({ field: 'seoDesc', message: `Meta description must not exceed ${L.seoDesc.max} characters` });
  if (form.seo.keywords.length > L.seoKeywords.max) errors.push({ field: 'seoKeywords', message: `Keywords must not exceed ${L.seoKeywords.max} characters` });

  return errors;
}

export function validateBlogForm(form: {
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  author: string;
  tags: string;
  seo: { metaTitle: string; metaDescription: string; keywords: string };
}): ValidationError[] {
  const errors: ValidationError[] = [];
  const L = LIMITS.blog;

  if (!form.title.trim()) errors.push({ field: 'title', message: 'Blog title is required' });
  else if (form.title.length < L.title.min) errors.push({ field: 'title', message: `Title must be at least ${L.title.min} characters` });
  else if (form.title.length > L.title.max) errors.push({ field: 'title', message: `Title must not exceed ${L.title.max} characters` });

  if (form.slug && form.slug.length > L.slug.max) errors.push({ field: 'slug', message: `Slug must not exceed ${L.slug.max} characters` });
  if (form.slug && !/^[a-z0-9-]+$/.test(form.slug)) errors.push({ field: 'slug', message: 'Slug can only contain lowercase letters, numbers, and hyphens' });

  if (!form.content.trim()) errors.push({ field: 'content', message: 'Blog content is required' });
  else if (form.content.length < L.content.min) errors.push({ field: 'content', message: `Content must be at least ${L.content.min} characters` });

  if (form.excerpt.length > L.excerpt.max) errors.push({ field: 'excerpt', message: `Excerpt must not exceed ${L.excerpt.max} characters` });
  if (form.author.length > L.author.max) errors.push({ field: 'author', message: `Author name must not exceed ${L.author.max} characters` });
  if (form.tags.length > L.tags.max) errors.push({ field: 'tags', message: `Tags must not exceed ${L.tags.max} characters` });

  if (form.seo.metaTitle.length > L.seoTitle.max) errors.push({ field: 'seoTitle', message: `Meta title must not exceed ${L.seoTitle.max} characters` });
  if (form.seo.metaDescription.length > L.seoDesc.max) errors.push({ field: 'seoDesc', message: `Meta description must not exceed ${L.seoDesc.max} characters` });
  if (form.seo.keywords.length > L.seoKeywords.max) errors.push({ field: 'seoKeywords', message: `Keywords must not exceed ${L.seoKeywords.max} characters` });

  return errors;
}

// Helper to get error for a specific field
export function getFieldError(errors: ValidationError[], field: string): string | undefined {
  return errors.find((e) => e.field === field)?.message;
}
