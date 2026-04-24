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
    feeRange: { max: 60 },
    duration: { max: 60 },
    medium: { max: 60 },
    livingCost: { max: 60 },
    features: { maxItems: 6, iconMax: 8, titleMax: 60, descriptionMax: 220 },
    studentLife: {
      eyebrowMax: 40,
      titleMax: 90,
      descriptionMax: 320,
      cardsMax: 6,
      cardIconMax: 8,
      cardTitleMax: 40,
      cardDescriptionMax: 180,
    },
    documentsChecklist: {
      eyebrowMax: 80,
      titleMax: 180,
      itemsMax: 12,
      itemLabelMax: 140,
    },
    supportExperience: {
      eyebrowMax: 40,
      titleMax: 90,
      descriptionMax: 320,
      progressItemsMax: 6,
      progressLabelMax: 70,
      progressStatusMax: 20,
      supportCardsMax: 6,
      supportCardTitleMax: 18,
      supportCardSubtitleMax: 55,
    },
    highlights: { maxItems: 12, maxLen: 120 },
    faqs: { maxItems: 12, questionMax: 200, answerMax: 1000 },
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
  feeRange: string;
  duration: string;
  medium: string;
  livingCost: string;
  features: { icon: string; title: string; description: string }[];
  studentLife: {
    eyebrow: string;
    title: string;
    description: string;
    cards: { icon: string; title: string; description: string }[];
  };
  documentsChecklist: {
    eyebrow: string;
    title: string;
    items: { label: string }[];
  };
  supportExperience: {
    eyebrow: string;
    title: string;
    description: string;
    progressItems: { label: string; value: number; status: string }[];
    supportCards: { title: string; subtitle: string }[];
  };
  highlights: string[];
  faqs: { question: string; answer: string }[];
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
  if (form.feeRange.length > L.feeRange.max) errors.push({ field: 'feeRange', message: `Tuition fee must not exceed ${L.feeRange.max} characters` });
  if (form.duration.length > L.duration.max) errors.push({ field: 'duration', message: `Duration must not exceed ${L.duration.max} characters` });
  if (form.medium.length > L.medium.max) errors.push({ field: 'medium', message: `Medium must not exceed ${L.medium.max} characters` });
  if (form.livingCost.length > L.livingCost.max) errors.push({ field: 'livingCost', message: `Living cost must not exceed ${L.livingCost.max} characters` });

  const activeFeatures = form.features.filter((item) => item.title.trim() || item.description.trim());
  if (activeFeatures.length > L.features.maxItems) {
    errors.push({ field: 'features', message: `Maximum ${L.features.maxItems} feature cards allowed` });
  }
  if (activeFeatures.some((item) => !item.title.trim())) {
    errors.push({ field: 'features', message: 'Each feature card needs a title' });
  }
  if (activeFeatures.some((item) => item.icon.length > L.features.iconMax)) {
    errors.push({ field: 'features', message: `Feature icons must not exceed ${L.features.iconMax} characters` });
  }
  if (activeFeatures.some((item) => item.title.length > L.features.titleMax)) {
    errors.push({ field: 'features', message: `Feature titles must not exceed ${L.features.titleMax} characters` });
  }
  if (activeFeatures.some((item) => item.description.length > L.features.descriptionMax)) {
    errors.push({ field: 'features', message: `Feature descriptions must not exceed ${L.features.descriptionMax} characters` });
  }

  if (form.studentLife.eyebrow.length > L.studentLife.eyebrowMax) {
    errors.push({ field: 'studentLife.eyebrow', message: `Student life eyebrow must not exceed ${L.studentLife.eyebrowMax} characters` });
  }
  if (form.studentLife.title.length > L.studentLife.titleMax) {
    errors.push({ field: 'studentLife.title', message: `Student life title must not exceed ${L.studentLife.titleMax} characters` });
  }
  if (form.studentLife.description.length > L.studentLife.descriptionMax) {
    errors.push({ field: 'studentLife.description', message: `Student life description must not exceed ${L.studentLife.descriptionMax} characters` });
  }

  const activeStudentLifeCards = form.studentLife.cards.filter(
    (item) => item.title.trim() || item.description.trim()
  );
  if (activeStudentLifeCards.length > L.studentLife.cardsMax) {
    errors.push({ field: 'studentLife.cards', message: `Maximum ${L.studentLife.cardsMax} student life cards allowed` });
  }
  if (activeStudentLifeCards.some((item) => !item.title.trim())) {
    errors.push({ field: 'studentLife.cards', message: 'Each student life card needs a title' });
  }
  if (activeStudentLifeCards.some((item) => item.icon.length > L.studentLife.cardIconMax)) {
    errors.push({ field: 'studentLife.cards', message: `Student life icons must not exceed ${L.studentLife.cardIconMax} characters` });
  }
  if (activeStudentLifeCards.some((item) => item.title.length > L.studentLife.cardTitleMax)) {
    errors.push({ field: 'studentLife.cards', message: `Student life titles must not exceed ${L.studentLife.cardTitleMax} characters` });
  }
  if (activeStudentLifeCards.some((item) => item.description.length > L.studentLife.cardDescriptionMax)) {
    errors.push({ field: 'studentLife.cards', message: `Student life descriptions must not exceed ${L.studentLife.cardDescriptionMax} characters` });
  }

  if (form.documentsChecklist.eyebrow.length > L.documentsChecklist.eyebrowMax) {
    errors.push({ field: 'documentsChecklist.eyebrow', message: `Documents checklist eyebrow must not exceed ${L.documentsChecklist.eyebrowMax} characters` });
  }
  if (form.documentsChecklist.title.length > L.documentsChecklist.titleMax) {
    errors.push({ field: 'documentsChecklist.title', message: `Documents checklist title must not exceed ${L.documentsChecklist.titleMax} characters` });
  }

  const activeDocumentsChecklistItems = form.documentsChecklist.items.filter((item) => item.label.trim());
  if (activeDocumentsChecklistItems.length > L.documentsChecklist.itemsMax) {
    errors.push({ field: 'documentsChecklist.items', message: `Maximum ${L.documentsChecklist.itemsMax} checklist items allowed` });
  }
  if (activeDocumentsChecklistItems.some((item) => item.label.length > L.documentsChecklist.itemLabelMax)) {
    errors.push({ field: 'documentsChecklist.items', message: `Checklist items must not exceed ${L.documentsChecklist.itemLabelMax} characters` });
  }

  if (form.supportExperience.eyebrow.length > L.supportExperience.eyebrowMax) {
    errors.push({ field: 'supportExperience.eyebrow', message: `Support eyebrow must not exceed ${L.supportExperience.eyebrowMax} characters` });
  }
  if (form.supportExperience.title.length > L.supportExperience.titleMax) {
    errors.push({ field: 'supportExperience.title', message: `Support title must not exceed ${L.supportExperience.titleMax} characters` });
  }
  if (form.supportExperience.description.length > L.supportExperience.descriptionMax) {
    errors.push({ field: 'supportExperience.description', message: `Support description must not exceed ${L.supportExperience.descriptionMax} characters` });
  }

  const activeProgressItems = form.supportExperience.progressItems.filter(
    (item) => item.label.trim()
  );
  if (activeProgressItems.length > L.supportExperience.progressItemsMax) {
    errors.push({ field: 'supportExperience.progressItems', message: `Maximum ${L.supportExperience.progressItemsMax} support progress items allowed` });
  }
  if (activeProgressItems.some((item) => !item.label.trim())) {
    errors.push({ field: 'supportExperience.progressItems', message: 'Each support progress item needs a label' });
  }
  if (activeProgressItems.some((item) => item.label.length > L.supportExperience.progressLabelMax)) {
    errors.push({ field: 'supportExperience.progressItems', message: `Support progress labels must not exceed ${L.supportExperience.progressLabelMax} characters` });
  }
  if (activeProgressItems.some((item) => item.status.length > L.supportExperience.progressStatusMax)) {
    errors.push({ field: 'supportExperience.progressItems', message: `Support progress status must not exceed ${L.supportExperience.progressStatusMax} characters` });
  }
  if (activeProgressItems.some((item) => item.value < 0 || item.value > 100 || Number.isNaN(item.value))) {
    errors.push({ field: 'supportExperience.progressItems', message: 'Support progress values must be between 0 and 100' });
  }

  const activeSupportCards = form.supportExperience.supportCards.filter(
    (item) => item.title.trim() || item.subtitle.trim()
  );
  if (activeSupportCards.length > L.supportExperience.supportCardsMax) {
    errors.push({ field: 'supportExperience.supportCards', message: `Maximum ${L.supportExperience.supportCardsMax} support cards allowed` });
  }
  if (activeSupportCards.some((item) => !item.title.trim())) {
    errors.push({ field: 'supportExperience.supportCards', message: 'Each support card needs a title' });
  }
  if (activeSupportCards.some((item) => item.title.length > L.supportExperience.supportCardTitleMax)) {
    errors.push({ field: 'supportExperience.supportCards', message: `Support card titles must not exceed ${L.supportExperience.supportCardTitleMax} characters` });
  }
  if (activeSupportCards.some((item) => item.subtitle.length > L.supportExperience.supportCardSubtitleMax)) {
    errors.push({ field: 'supportExperience.supportCards', message: `Support card subtitles must not exceed ${L.supportExperience.supportCardSubtitleMax} characters` });
  }

  const activeHighlights = form.highlights.filter(Boolean);
  if (activeHighlights.length > L.highlights.maxItems) errors.push({ field: 'highlights', message: `Maximum ${L.highlights.maxItems} highlights allowed` });
  if (activeHighlights.some((h) => h.length > L.highlights.maxLen)) errors.push({ field: 'highlights', message: `Each highlight must not exceed ${L.highlights.maxLen} characters` });

  const activeFaqs = form.faqs.filter((f) => f.question.trim());
  if (activeFaqs.length > L.faqs.maxItems) errors.push({ field: 'faqs', message: `Maximum ${L.faqs.maxItems} FAQs allowed` });
  if (activeFaqs.some((f) => f.question.length > L.faqs.questionMax)) errors.push({ field: 'faqs', message: `FAQ question must not exceed ${L.faqs.questionMax} characters` });
  if (activeFaqs.some((f) => f.answer.length > L.faqs.answerMax)) errors.push({ field: 'faqs', message: `FAQ answer must not exceed ${L.faqs.answerMax} characters` });

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
