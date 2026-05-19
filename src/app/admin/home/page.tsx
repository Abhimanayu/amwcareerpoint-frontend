'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { CharCount, FieldError, ValidationBanner } from '@/components/admin/FormValidation';
import { SafeImage } from '@/components/ui/SafeImage';
import { adminGetBlogs } from '@/lib/blogs';
import { adminGetCountries } from '@/lib/countries';
import { adminGetHomeSettings, updateHomeItems, updateHomeSettings } from '@/lib/home';
import {
  defaultHomeSettings,
  mergeHomeSettings,
  type HomeCuratedBlog,
  type HomeCuratedCountry,
  type HomeCuratedUniversity,
  type HomeSectionVisibility,
  type HomeSettings,
  type HomeStatItem,
} from '@/lib/homeSettings';
import { handleApiError } from '@/lib/handleApiError';
import { adminGetUniversities } from '@/lib/universities';
import { extractCollectionData, pickBlogImageSource, pickUniversityImageSource } from '@/lib/utils';

const LIMITS = {
  metaTitle: 70,
  metaDescription: 160,
  keywords: 250,
  canonicalUrl: 300,
  badge: 80,
  heading: 100,
  highlightedText: 80,
  trailingText: 120,
  heroDescription: 700,
  ctaText: 40,
  ctaHref: 200,
  statNumber: 30,
  statLabel: 60,
  statDesc: 120,
};

const sectionLabels: { key: keyof HomeSectionVisibility; label: string }[] = [
  { key: 'hero', label: 'Hero' },
  { key: 'stats', label: 'Stats' },
  { key: 'whyChoose', label: 'Why Choose' },
  { key: 'experts', label: 'Experts' },
  { key: 'universities', label: 'Universities' },
  { key: 'countries', label: 'Countries' },
  { key: 'comparison', label: 'Comparison' },
  { key: 'process', label: 'Process' },
  { key: 'predictor', label: 'Predictor' },
  { key: 'reviews', label: 'Reviews' },
  { key: 'videos', label: 'Videos' },
  { key: 'blogs', label: 'Blogs' },
  { key: 'cta', label: 'CTA' },
  { key: 'faq', label: 'FAQ' },
];

type HomeContentSettings = Pick<HomeSettings, 'seo' | 'hero' | 'stats' | 'sections'>;

type HomeItemsState = {
  homeCountries: HomeCuratedCountry[];
  homeUniversities: HomeCuratedUniversity[];
  homeBlogs: HomeCuratedBlog[];
};

type HomeItemKey = keyof HomeItemsState;
type SearchLoadingState = Record<HomeItemKey, boolean>;
type SearchQueryState = Record<HomeItemKey, string>;

const EMPTY_HOME_ITEMS: HomeItemsState = {
  homeCountries: [],
  homeUniversities: [],
  homeBlogs: [],
};

const EMPTY_SEARCH_QUERY: SearchQueryState = {
  homeCountries: '',
  homeUniversities: '',
  homeBlogs: '',
};

const EMPTY_SEARCH_LOADING: SearchLoadingState = {
  homeCountries: false,
  homeUniversities: false,
  homeBlogs: false,
};

const HOME_ITEM_LIMITS: Record<HomeItemKey, number> = {
  homeCountries: 8,
  homeUniversities: 8,
  homeBlogs: 6,
};

type CuratedItemsEditorProps<T extends { _id: string }> = {
  readonly label: string;
  readonly limit: number;
  readonly placeholder: string;
  readonly searchQuery: string;
  readonly searchLoading: boolean;
  readonly searchResults: readonly T[];
  readonly selectedItems: readonly T[];
  readonly emptyStateLabel: string;
  readonly onSearchQueryChange: (value: string) => void;
  readonly onAdd: (item: T) => void;
  readonly onMoveUp: (id: string) => void;
  readonly onMoveDown: (id: string) => void;
  readonly onRemove: (id: string) => void;
  readonly getItemTitle: (item: T) => string;
  readonly getItemSubtitle: (item: T) => string | null;
  readonly getItemThumbnail: (item: T) => string;
};

function CuratedItemsEditor<T extends { _id: string }>({
  label,
  limit,
  placeholder,
  searchQuery,
  searchLoading,
  searchResults,
  selectedItems,
  emptyStateLabel,
  onSearchQueryChange,
  onAdd,
  onMoveUp,
  onMoveDown,
  onRemove,
  getItemTitle,
  getItemSubtitle,
  getItemThumbnail,
}: CuratedItemsEditorProps<T>) {
  const selectedIds = new Set(selectedItems.map((item) => item._id));
  const availableResults = searchResults.filter((item) => !selectedIds.has(item._id));
  const isLimitReached = selectedItems.length >= limit;

  return (
    <details open className="rounded-xl border border-gray-200 bg-gray-50/70">
      <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-4 py-3 text-sm font-semibold text-gray-900">
        <span>{label}</span>
        <span className="rounded-full bg-white px-2.5 py-1 text-xs font-medium text-gray-600">
          {selectedItems.length}/{limit}
        </span>
      </summary>
      <div className="border-t border-gray-200 px-4 py-4">
        <div>
          <label className="mb-1 block text-sm font-medium text-gray-700">Search and Add</label>
          <input
            value={searchQuery}
            onChange={(event) => onSearchQueryChange(event.target.value)}
            placeholder={isLimitReached ? 'Limit reached. Remove an item to add another.' : placeholder}
            disabled={isLimitReached}
            className="w-full rounded-xl border border-gray-200 px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-orange/30 disabled:cursor-not-allowed disabled:bg-gray-100 disabled:text-gray-500"
          />
          <div className="mt-2 min-h-10 rounded-xl border border-dashed border-gray-200 bg-white/80 p-2">
            {isLimitReached && (
              <p className="text-xs font-medium text-amber-700">Limit reached. Remove an item to add another.</p>
            )}
            {!isLimitReached && searchLoading && <p className="text-xs text-gray-500">Searching...</p>}
            {!isLimitReached && !searchLoading && !searchQuery.trim() && (
              <p className="text-xs text-gray-500">Type at least one keyword to search.</p>
            )}
            {!isLimitReached && !searchLoading && searchQuery.trim() && availableResults.length === 0 && (
              <p className="text-xs text-gray-500">No matching items found.</p>
            )}
            {!isLimitReached && !searchLoading && availableResults.length > 0 && (
              <div className="space-y-2">
                {availableResults.map((item) => {
                  const thumbnail = getItemThumbnail(item);
                  const subtitle = getItemSubtitle(item);

                  return (
                    <div
                      key={item._id}
                      className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2"
                    >
                      <div className="relative h-11 w-11 overflow-hidden rounded-lg bg-gray-100">
                        <SafeImage
                          src={thumbnail}
                          alt={getItemTitle(item)}
                          fill
                          className="object-cover"
                          fallbackElement={<div className="absolute inset-0 bg-gray-200" />}
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{getItemTitle(item)}</p>
                        {subtitle && <p className="truncate text-xs text-gray-500">{subtitle}</p>}
                      </div>
                      <button
                        type="button"
                        onClick={() => onAdd(item)}
                        disabled={isLimitReached}
                        className="rounded-lg bg-orange px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-orange-hover disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        Add
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>

        <div className="mt-4">
          <div className="mb-2 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-700">Selected Items</h3>
            <span className="text-xs text-gray-500">Display order follows this list</span>
          </div>
          {selectedItems.length === 0 ? (
            <div className="rounded-xl border border-dashed border-gray-200 bg-white px-3 py-4 text-sm text-gray-500">
              {emptyStateLabel}
            </div>
          ) : (
            <div className="space-y-2">
              {selectedItems.map((item, index) => {
                const thumbnail = getItemThumbnail(item);
                const subtitle = getItemSubtitle(item);

                return (
                  <div
                    key={item._id}
                    className="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-3 py-2"
                  >
                    <div className="relative h-11 w-11 overflow-hidden rounded-lg bg-gray-100">
                      <SafeImage
                        src={thumbnail}
                        alt={getItemTitle(item)}
                        fill
                        className="object-cover"
                        fallbackElement={<div className="absolute inset-0 bg-gray-200" />}
                      />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-gray-900">{getItemTitle(item)}</p>
                      {subtitle && <p className="truncate text-xs text-gray-500">{subtitle}</p>}
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => onMoveUp(item._id)}
                        disabled={index === 0}
                        className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Up
                      </button>
                      <button
                        type="button"
                        onClick={() => onMoveDown(item._id)}
                        disabled={index === selectedItems.length - 1}
                        className="rounded-lg border border-gray-200 px-2.5 py-1.5 text-xs font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Down
                      </button>
                      <button
                        type="button"
                        onClick={() => onRemove(item._id)}
                        className="rounded-lg border border-red-200 px-2.5 py-1.5 text-xs font-semibold text-red-600 transition-colors hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </details>
  );
}

function getCountryItemTitle(item: HomeCuratedCountry) {
  return item.name || 'Country';
}

function getCountryItemSubtitle(item: HomeCuratedCountry) {
  const feeRange = item.feeRange || item.fees || item.annualFeeRange;
  const duration = item.duration || item.dur;
  return [feeRange, duration].filter(Boolean).join(' • ') || item.slug;
}

function getCountryItemThumbnail(item: HomeCuratedCountry) {
  return item.flagImage || item.cardImage || item.heroImage || '';
}

function getUniversityItemTitle(item: HomeCuratedUniversity) {
  return item.name || 'University';
}

function getUniversityItemSubtitle(item: HomeCuratedUniversity) {
  return item.country?.name || item.annualFees || item.slug;
}

function getUniversityItemThumbnail(item: HomeCuratedUniversity) {
  return pickUniversityImageSource(item as unknown as Record<string, unknown>);
}

function getBlogItemTitle(item: HomeCuratedBlog) {
  return item.title || 'Blog Post';
}

function getBlogItemSubtitle(item: HomeCuratedBlog) {
  if (typeof item.category === 'string' && item.category.trim()) {
    return item.category;
  }
  if (typeof item.category === 'object' && item.category?.name) {
    return item.category.name;
  }
  return item.author || item.slug;
}

function getBlogItemThumbnail(item: HomeCuratedBlog) {
  return pickBlogImageSource(item as unknown as Record<string, unknown>) || item.coverImage || '';
}

type ErrorItem = { field: string; message: string };

function validate(settings: HomeSettings) {
  const errors: ErrorItem[] = [];

  if (settings.seo.metaTitle.length > LIMITS.metaTitle) {
    errors.push({ field: 'seo.metaTitle', message: 'Meta title must be 70 characters or less.' });
  }
  if (settings.seo.metaDescription.length > LIMITS.metaDescription) {
    errors.push({ field: 'seo.metaDescription', message: 'Meta description must be 160 characters or less.' });
  }
  if (settings.seo.keywords.length > LIMITS.keywords) {
    errors.push({ field: 'seo.keywords', message: 'SEO keywords must be 250 characters or less.' });
  }
  if (settings.seo.canonicalUrl.length > LIMITS.canonicalUrl) {
    errors.push({ field: 'seo.canonicalUrl', message: 'Canonical URL must be 300 characters or less.' });
  }
  if (settings.seo.schemaMarkup.trim()) {
    try {
      JSON.parse(settings.seo.schemaMarkup);
    } catch {
      errors.push({ field: 'seo.schemaMarkup', message: 'Schema markup must be valid JSON.' });
    }
  }

  if (!settings.hero.heading.trim()) {
    errors.push({ field: 'hero.heading', message: 'Hero heading is required.' });
  }
  if (settings.hero.description.length > LIMITS.heroDescription) {
    errors.push({ field: 'hero.description', message: 'Hero description must be 700 characters or less.' });
  }

  settings.stats.forEach((stat, index) => {
    if (!stat.number.trim()) {
      errors.push({ field: `stats.${index}.number`, message: `Stat ${index + 1} number is required.` });
    }
    if (!stat.label.trim()) {
      errors.push({ field: `stats.${index}.label`, message: `Stat ${index + 1} label is required.` });
    }
  });

  return errors;
}

function inputClass(hasError = false) {
  return `w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#F26419]/30 ${
    hasError ? 'border-red-300' : 'border-gray-200'
  }`;
}

function textareaClass(hasError = false) {
  return `w-full rounded-xl border px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-[#F26419]/30 ${
    hasError ? 'border-red-300' : 'border-gray-200'
  }`;
}

export default function AdminHomePage() {
  const [settings, setSettings] = useState<HomeSettings>(defaultHomeSettings);
  const [homeItems, setHomeItems] = useState<HomeItemsState>(EMPTY_HOME_ITEMS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [itemsSaving, setItemsSaving] = useState(false);
  const [saveMessage, setSaveMessage] = useState('');
  const [itemsSaveMessage, setItemsSaveMessage] = useState('');
  const [itemsError, setItemsError] = useState('');
  const [errors, setErrors] = useState<ErrorItem[]>([]);
  const [searchQuery, setSearchQuery] = useState<SearchQueryState>(EMPTY_SEARCH_QUERY);
  const [searchResults, setSearchResults] = useState<HomeItemsState>(EMPTY_HOME_ITEMS);
  const [searchLoading, setSearchLoading] = useState<SearchLoadingState>(EMPTY_SEARCH_LOADING);

  const errorsByField = useMemo(() => {
    const map = new Map<string, string>();
    errors.forEach((error) => map.set(error.field, error.message));
    return map;
  }, [errors]);

  useEffect(() => {
    let isMounted = true;

    async function loadSettings() {
      setLoading(true);
      try {
        const payload = await adminGetHomeSettings();
        if (isMounted) {
          const merged = mergeHomeSettings(payload);
          setSettings(merged);
          setHomeItems({
            homeCountries: merged.homeCountries,
            homeUniversities: merged.homeUniversities,
            homeBlogs: merged.homeBlogs,
          });
        }
      } catch {
        if (isMounted) {
          setSettings(defaultHomeSettings);
          setHomeItems(EMPTY_HOME_ITEMS);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    void loadSettings();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;
    const query = searchQuery.homeCountries.trim();

    if (!query) {
      setSearchResults((prev) => ({ ...prev, homeCountries: [] }));
      setSearchLoading((prev) => ({ ...prev, homeCountries: false }));
      return;
    }

    setSearchLoading((prev) => ({ ...prev, homeCountries: true }));

    const timeoutId = window.setTimeout(async () => {
      try {
        const payload = await adminGetCountries({ search: query, limit: 10, status: 'all' });
        if (cancelled) return;
        setSearchResults((prev) => ({
          ...prev,
          homeCountries: extractCollectionData<HomeCuratedCountry>(payload, ['countries']).slice(0, 10),
        }));
      } catch {
        if (!cancelled) {
          setSearchResults((prev) => ({ ...prev, homeCountries: [] }));
        }
      } finally {
        if (!cancelled) {
          setSearchLoading((prev) => ({ ...prev, homeCountries: false }));
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery.homeCountries]);

  useEffect(() => {
    let cancelled = false;
    const query = searchQuery.homeUniversities.trim();

    if (!query) {
      setSearchResults((prev) => ({ ...prev, homeUniversities: [] }));
      setSearchLoading((prev) => ({ ...prev, homeUniversities: false }));
      return;
    }

    setSearchLoading((prev) => ({ ...prev, homeUniversities: true }));

    const timeoutId = window.setTimeout(async () => {
      try {
        const payload = await adminGetUniversities({ search: query, limit: 10, status: 'all' });
        if (cancelled) return;
        setSearchResults((prev) => ({
          ...prev,
          homeUniversities: extractCollectionData<HomeCuratedUniversity>(payload, ['universities']).slice(0, 10),
        }));
      } catch {
        if (!cancelled) {
          setSearchResults((prev) => ({ ...prev, homeUniversities: [] }));
        }
      } finally {
        if (!cancelled) {
          setSearchLoading((prev) => ({ ...prev, homeUniversities: false }));
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery.homeUniversities]);

  useEffect(() => {
    let cancelled = false;
    const query = searchQuery.homeBlogs.trim();

    if (!query) {
      setSearchResults((prev) => ({ ...prev, homeBlogs: [] }));
      setSearchLoading((prev) => ({ ...prev, homeBlogs: false }));
      return;
    }

    setSearchLoading((prev) => ({ ...prev, homeBlogs: true }));

    const timeoutId = window.setTimeout(async () => {
      try {
        const payload = await adminGetBlogs({ search: query, limit: 10, status: 'all' });
        if (cancelled) return;
        setSearchResults((prev) => ({
          ...prev,
          homeBlogs: extractCollectionData<HomeCuratedBlog>(payload, ['blogs']).slice(0, 10),
        }));
      } catch {
        if (!cancelled) {
          setSearchResults((prev) => ({ ...prev, homeBlogs: [] }));
        }
      } finally {
        if (!cancelled) {
          setSearchLoading((prev) => ({ ...prev, homeBlogs: false }));
        }
      }
    }, 250);

    return () => {
      cancelled = true;
      window.clearTimeout(timeoutId);
    };
  }, [searchQuery.homeBlogs]);

  const updateSeoField = (field: keyof HomeSettings['seo'], value: string) => {
    setSettings((prev) => ({ ...prev, seo: { ...prev.seo, [field]: value } }));
  };

  const updateHeroField = (field: keyof HomeSettings['hero'], value: string) => {
    setSettings((prev) => ({ ...prev, hero: { ...prev.hero, [field]: value } }));
  };

  const updateStat = (index: number, field: keyof HomeStatItem, value: string) => {
    setSettings((prev) => ({
      ...prev,
      stats: prev.stats.map((stat, statIndex) =>
        statIndex === index ? { ...stat, [field]: value } : stat
      ),
    }));
  };

  const updateSection = (field: keyof HomeSectionVisibility, value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      sections: { ...prev.sections, [field]: value },
    }));
  };

  const handleSave = async () => {
    setSaveMessage('');
    setItemsSaveMessage('');
    const nextErrors = validate(settings);
    setErrors(nextErrors);
    if (nextErrors.length > 0) return;

    setSaving(true);
    try {
      const payload: HomeContentSettings = {
        seo: settings.seo,
        hero: settings.hero,
        stats: settings.stats,
        sections: settings.sections,
      };
      const saved = await updateHomeSettings(payload);
      const merged = mergeHomeSettings(saved);
      setSettings({ ...merged, ...homeItems });
      setSaveMessage('Home page settings saved successfully.');
    } catch (err) {
      setErrors([{ field: 'api', message: handleApiError(err) }]);
    } finally {
      setSaving(false);
    }
  };

  const updateSearchField = (key: HomeItemKey, value: string) => {
    setSearchQuery((prev) => ({ ...prev, [key]: value }));
  };

  const addHomeItem = <K extends HomeItemKey>(key: K, item: HomeItemsState[K][number]) => {
    setItemsError('');
    setItemsSaveMessage('');
    setHomeItems((prev) => {
      if (prev[key].some((existing) => existing._id === item._id)) {
        return prev;
      }
      if (prev[key].length >= HOME_ITEM_LIMITS[key]) {
        return prev;
      }
      return {
        ...prev,
        [key]: [...prev[key], item],
      } as HomeItemsState;
    });
    setSearchQuery((prev) => ({ ...prev, [key]: '' }));
    setSearchResults((prev) => ({ ...prev, [key]: [] as HomeItemsState[K] }));
  };

  const moveHomeItem = (key: HomeItemKey, direction: -1 | 1, id: string) => {
    setItemsError('');
    setItemsSaveMessage('');
    setHomeItems((prev) => {
      const currentIndex = prev[key].findIndex((item) => item._id === id);
      const nextIndex = currentIndex + direction;

      if (currentIndex === -1 || nextIndex < 0 || nextIndex >= prev[key].length) {
        return prev;
      }

      const nextItems = [...prev[key]];
      const [movedItem] = nextItems.splice(currentIndex, 1);
      nextItems.splice(nextIndex, 0, movedItem);

      return {
        ...prev,
        [key]: nextItems,
      } as HomeItemsState;
    });
  };

  const removeHomeItem = (key: HomeItemKey, id: string) => {
    setItemsError('');
    setItemsSaveMessage('');
    setHomeItems((prev) => ({
      ...prev,
      [key]: prev[key].filter((item) => item._id !== id),
    } as HomeItemsState));
  };

  const handleSaveHomeItems = async () => {
    setItemsError('');
    setItemsSaveMessage('');
    setSaving(false);

    setItemsSaving(true);
    try {
      await updateHomeItems({
        homeCountries: homeItems.homeCountries.map((item) => item._id),
        homeUniversities: homeItems.homeUniversities.map((item) => item._id),
        homeBlogs: homeItems.homeBlogs.map((item) => item._id),
      });
      setSettings((prev) => ({ ...prev, ...homeItems }));
      setItemsSaveMessage('Home items saved successfully.');
    } catch (err) {
      setItemsError(handleApiError(err));
    } finally {
      setItemsSaving(false);
    }
  };

  return (
    <AdminLayout>
      <div className="space-y-6">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Home Page</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage safe homepage SEO, hero, stats, section visibility, and curated home items.
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={handleSaveHomeItems}
              disabled={itemsSaving || loading}
              className="rounded-xl border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {itemsSaving ? 'Saving Home Items...' : 'Save Home Items'}
            </button>
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || loading}
              className="rounded-xl bg-orange px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>

        {loading && (
          <div className="rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-gray-500">
            Loading home settings...
          </div>
        )}

        <ValidationBanner errors={errors} />

        {saveMessage && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {saveMessage}
          </div>
        )}

        {itemsSaveMessage && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
            {itemsSaveMessage}
          </div>
        )}

        {itemsError && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
            {itemsError}
          </div>
        )}

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">SEO</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Meta Title</label>
                <CharCount current={settings.seo.metaTitle.length} max={LIMITS.metaTitle} />
              </div>
              <input
                value={settings.seo.metaTitle}
                onChange={(event) => updateSeoField('metaTitle', event.target.value)}
                className={inputClass(errorsByField.has('seo.metaTitle'))}
              />
              <FieldError message={errorsByField.get('seo.metaTitle')} />
            </div>
            <div>
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Canonical URL</label>
                <CharCount current={settings.seo.canonicalUrl.length} max={LIMITS.canonicalUrl} />
              </div>
              <input
                value={settings.seo.canonicalUrl}
                onChange={(event) => updateSeoField('canonicalUrl', event.target.value)}
                className={inputClass(errorsByField.has('seo.canonicalUrl'))}
              />
              <FieldError message={errorsByField.get('seo.canonicalUrl')} />
            </div>
            <div className="lg:col-span-2">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Meta Description</label>
                <CharCount current={settings.seo.metaDescription.length} max={LIMITS.metaDescription} />
              </div>
              <textarea
                value={settings.seo.metaDescription}
                onChange={(event) => updateSeoField('metaDescription', event.target.value)}
                rows={3}
                className={textareaClass(errorsByField.has('seo.metaDescription'))}
              />
              <FieldError message={errorsByField.get('seo.metaDescription')} />
            </div>
            <div className="lg:col-span-2">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Keywords</label>
                <CharCount current={settings.seo.keywords.length} max={LIMITS.keywords} />
              </div>
              <input
                value={settings.seo.keywords}
                onChange={(event) => updateSeoField('keywords', event.target.value)}
                className={inputClass(errorsByField.has('seo.keywords'))}
              />
              <FieldError message={errorsByField.get('seo.keywords')} />
            </div>
            <div className="lg:col-span-2">
              <label className="mb-1 block text-sm font-medium text-gray-700">Schema Markup JSON</label>
              <textarea
                value={settings.seo.schemaMarkup}
                onChange={(event) => updateSeoField('schemaMarkup', event.target.value)}
                rows={7}
                placeholder='{"@context":"https://schema.org","@type":"WebSite"}'
                className={`${textareaClass(errorsByField.has('seo.schemaMarkup'))} font-mono`}
              />
              <FieldError message={errorsByField.get('seo.schemaMarkup')} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Hero Section</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {[
              ['badge', 'Badge', LIMITS.badge],
              ['heading', 'Heading', LIMITS.heading],
              ['highlightedText', 'Highlighted Text', LIMITS.highlightedText],
              ['trailingText', 'Trailing Text', LIMITS.trailingText],
              ['primaryCtaText', 'Primary CTA Text', LIMITS.ctaText],
              ['primaryCtaHref', 'Primary CTA Link', LIMITS.ctaHref],
              ['secondaryCtaText', 'Secondary CTA Text', LIMITS.ctaText],
              ['secondaryCtaHref', 'Secondary CTA Link', LIMITS.ctaHref],
            ].map(([field, label, max]) => {
              const key = field as keyof HomeSettings['hero'];
              return (
                <div key={field}>
                  <div className="mb-1 flex items-center justify-between">
                    <label className="text-sm font-medium text-gray-700">{label}</label>
                    <CharCount current={settings.hero[key].length} max={max as number} />
                  </div>
                  <input
                    value={settings.hero[key]}
                    onChange={(event) => updateHeroField(key, event.target.value)}
                    className={inputClass(errorsByField.has(`hero.${field}`))}
                  />
                  <FieldError message={errorsByField.get(`hero.${field}`)} />
                </div>
              );
            })}
            <div className="lg:col-span-2">
              <div className="mb-1 flex items-center justify-between">
                <label className="text-sm font-medium text-gray-700">Hero Description</label>
                <CharCount current={settings.hero.description.length} max={LIMITS.heroDescription} />
              </div>
              <textarea
                value={settings.hero.description}
                onChange={(event) => updateHeroField('description', event.target.value)}
                rows={5}
                className={textareaClass(errorsByField.has('hero.description'))}
              />
              <FieldError message={errorsByField.get('hero.description')} />
            </div>
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Stats</h2>
          <div className="mt-4 grid gap-4 lg:grid-cols-2">
            {settings.stats.map((stat, index) => (
              <div key={index} className="rounded-xl border border-gray-200 p-4">
                <h3 className="mb-3 text-sm font-semibold text-gray-800">Stat {index + 1}</h3>
                <div className="space-y-3">
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Number</label>
                      <CharCount current={stat.number.length} max={LIMITS.statNumber} />
                    </div>
                    <input
                      value={stat.number}
                      onChange={(event) => updateStat(index, 'number', event.target.value)}
                      className={inputClass(errorsByField.has(`stats.${index}.number`))}
                    />
                    <FieldError message={errorsByField.get(`stats.${index}.number`)} />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Label</label>
                      <CharCount current={stat.label.length} max={LIMITS.statLabel} />
                    </div>
                    <input
                      value={stat.label}
                      onChange={(event) => updateStat(index, 'label', event.target.value)}
                      className={inputClass(errorsByField.has(`stats.${index}.label`))}
                    />
                    <FieldError message={errorsByField.get(`stats.${index}.label`)} />
                  </div>
                  <div>
                    <div className="mb-1 flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700">Description</label>
                      <CharCount current={stat.desc.length} max={LIMITS.statDesc} />
                    </div>
                    <input
                      value={stat.desc}
                      onChange={(event) => updateStat(index, 'desc', event.target.value)}
                      className={inputClass(errorsByField.has(`stats.${index}.desc`))}
                    />
                    <FieldError message={errorsByField.get(`stats.${index}.desc`)} />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Curated Home Items</h2>
              <p className="mt-1 text-sm text-gray-500">
                Search, select, and reorder homepage countries, universities, and blogs.
              </p>
            </div>
            <button
              type="button"
              onClick={handleSaveHomeItems}
              disabled={itemsSaving || loading}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {itemsSaving ? 'Saving...' : 'Save Home Items'}
            </button>
          </div>

          <div className="mt-4 space-y-4">
            <CuratedItemsEditor
              label="Home Countries"
              limit={HOME_ITEM_LIMITS.homeCountries}
              placeholder="Search countries"
              searchQuery={searchQuery.homeCountries}
              searchLoading={searchLoading.homeCountries}
              searchResults={searchResults.homeCountries}
              selectedItems={homeItems.homeCountries}
              emptyStateLabel="No curated home countries selected yet."
              onSearchQueryChange={(value) => updateSearchField('homeCountries', value)}
              onAdd={(item) => addHomeItem('homeCountries', item)}
              onMoveUp={(id) => moveHomeItem('homeCountries', -1, id)}
              onMoveDown={(id) => moveHomeItem('homeCountries', 1, id)}
              onRemove={(id) => removeHomeItem('homeCountries', id)}
              getItemTitle={getCountryItemTitle}
              getItemSubtitle={getCountryItemSubtitle}
              getItemThumbnail={getCountryItemThumbnail}
            />

            <CuratedItemsEditor
              label="Home Universities"
              limit={HOME_ITEM_LIMITS.homeUniversities}
              placeholder="Search universities"
              searchQuery={searchQuery.homeUniversities}
              searchLoading={searchLoading.homeUniversities}
              searchResults={searchResults.homeUniversities}
              selectedItems={homeItems.homeUniversities}
              emptyStateLabel="No curated home universities selected yet."
              onSearchQueryChange={(value) => updateSearchField('homeUniversities', value)}
              onAdd={(item) => addHomeItem('homeUniversities', item)}
              onMoveUp={(id) => moveHomeItem('homeUniversities', -1, id)}
              onMoveDown={(id) => moveHomeItem('homeUniversities', 1, id)}
              onRemove={(id) => removeHomeItem('homeUniversities', id)}
              getItemTitle={getUniversityItemTitle}
              getItemSubtitle={getUniversityItemSubtitle}
              getItemThumbnail={getUniversityItemThumbnail}
            />

            <CuratedItemsEditor
              label="Home Blogs"
              limit={HOME_ITEM_LIMITS.homeBlogs}
              placeholder="Search blogs"
              searchQuery={searchQuery.homeBlogs}
              searchLoading={searchLoading.homeBlogs}
              searchResults={searchResults.homeBlogs}
              selectedItems={homeItems.homeBlogs}
              emptyStateLabel="No curated home blogs selected yet."
              onSearchQueryChange={(value) => updateSearchField('homeBlogs', value)}
              onAdd={(item) => addHomeItem('homeBlogs', item)}
              onMoveUp={(id) => moveHomeItem('homeBlogs', -1, id)}
              onMoveDown={(id) => moveHomeItem('homeBlogs', 1, id)}
              onRemove={(id) => removeHomeItem('homeBlogs', id)}
              getItemTitle={getBlogItemTitle}
              getItemSubtitle={getBlogItemSubtitle}
              getItemThumbnail={getBlogItemThumbnail}
            />
          </div>
        </section>

        <section className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900">Section Visibility</h2>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {sectionLabels.map((section) => (
              <label
                key={section.key}
                className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 text-sm font-medium text-gray-700"
              >
                {section.label}
                <input
                  type="checkbox"
                  checked={settings.sections[section.key]}
                  onChange={(event) => updateSection(section.key, event.target.checked)}
                  className="h-4 w-4 accent-orange"
                />
              </label>
            ))}
          </div>
        </section>
      </div>
    </AdminLayout>
  );
}
