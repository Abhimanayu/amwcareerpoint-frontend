'use client';

import { useEffect, useMemo, useState } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { ValidationBanner } from '@/components/admin/FormValidation';
import { adminGetAboutSettings, updateAboutSettings } from '@/lib/about';
import { defaultAboutSettings, mergeAboutSettings, type AboutSettings } from '@/lib/aboutSettings';
import { handleApiError } from '@/lib/handleApiError';
import { revalidateContentPages } from '@/lib/server/revalidate';

type ValidationError = { field: string; message: string };

function inputClass(hasError = false) {
  return [
    'w-full rounded-xl border px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-[#F26419]',
    hasError ? 'border-red-300 bg-red-50' : 'border-gray-200 bg-white',
  ].join(' ');
}

function toErrorMap(errors: ValidationError[]) {
  return new Map(errors.map((item) => [item.field, item.message]));
}

function validateSettings(settings: AboutSettings): ValidationError[] {
  const errors: ValidationError[] = [];

  if (settings.seo.metaTitle.length > 70) {
    errors.push({ field: 'seo.metaTitle', message: 'Meta title must be 70 characters or less.' });
  }

  if (settings.seo.metaDescription.length > 160) {
    errors.push({ field: 'seo.metaDescription', message: 'Meta description must be 160 characters or less.' });
  }

  if (!settings.hero.title.trim()) {
    errors.push({ field: 'hero.title', message: 'Hero title is required.' });
  }

  if (!settings.story.title.trim()) {
    errors.push({ field: 'story.title', message: 'Story title is required.' });
  }

  if (settings.story.paragraphs.filter(Boolean).length === 0) {
    errors.push({ field: 'story.paragraphs', message: 'Add at least one story paragraph.' });
  }

  return errors;
}

export default function AdminAboutPage() {
  const [settings, setSettings] = useState<AboutSettings>(defaultAboutSettings);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState<ValidationError[]>([]);

  const errorsByField = useMemo(() => toErrorMap(validationErrors), [validationErrors]);

  useEffect(() => {
    let active = true;
    (async () => {
      setLoading(true);
      setError('');
      try {
        const payload = await adminGetAboutSettings();
        if (!active) return;
        setSettings(mergeAboutSettings(payload));
      } catch {
        if (!active) return;
        setSettings(defaultAboutSettings);
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, []);

  const updateSectionToggle = (key: keyof AboutSettings['sections'], value: boolean) => {
    setSettings((prev) => ({
      ...prev,
      sections: {
        ...prev.sections,
        [key]: value,
      },
    }));
  };

  const updateSeo = (key: keyof AboutSettings['seo'], value: string) => {
    setSettings((prev) => ({
      ...prev,
      seo: {
        ...prev.seo,
        [key]: value,
      },
    }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    const errors = validateSettings(settings);
    setValidationErrors(errors);
    if (errors.length > 0) return;

    setSaving(true);
    setError('');
    try {
      await updateAboutSettings(settings);
      await revalidateContentPages({ type: 'about' }).catch(() => {});
    } catch (submitError) {
      setError(handleApiError(submitError));
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="rounded-xl border border-gray-200 bg-white p-6 text-sm text-gray-500">Loading About settings...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <form onSubmit={handleSubmit} className="space-y-6 max-w-6xl">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-2xl font-bold text-gray-900">About Page Settings</h1>
          <button
            type="submit"
            disabled={saving}
            className="rounded-xl bg-[#F26419] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#FF8040] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? 'Saving...' : 'Save About Page'}
          </button>
        </div>

        {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">{error}</div>}
        <ValidationBanner errors={validationErrors} />

        <section className="rounded-xl border border-gray-200 bg-white p-5">
          <h2 className="mb-4 text-lg font-semibold text-gray-900">Section Toggles</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {Object.entries(settings.sections).map(([key, value]) => (
              <label key={key} className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-2.5 text-sm text-gray-700">
                <input
                  type="checkbox"
                  checked={value}
                  onChange={(event) => updateSectionToggle(key as keyof AboutSettings['sections'], event.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-[#F26419] focus:ring-[#F26419]"
                />
                <span className="capitalize">{key}</span>
              </label>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Hero</h2>
          <input
            value={settings.hero.eyebrow}
            onChange={(event) => setSettings((prev) => ({ ...prev, hero: { ...prev.hero, eyebrow: event.target.value } }))}
            className={inputClass()}
            placeholder="Eyebrow"
          />
          <input
            value={settings.hero.title}
            onChange={(event) => setSettings((prev) => ({ ...prev, hero: { ...prev.hero, title: event.target.value } }))}
            className={inputClass(errorsByField.has('hero.title'))}
            placeholder="Hero title"
          />
          <textarea
            value={settings.hero.subtitle}
            onChange={(event) => setSettings((prev) => ({ ...prev, hero: { ...prev.hero, subtitle: event.target.value } }))}
            className={inputClass()}
            placeholder="Hero subtitle"
            rows={3}
          />
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Story</h2>
          <input
            value={settings.story.eyebrow}
            onChange={(event) => setSettings((prev) => ({ ...prev, story: { ...prev.story, eyebrow: event.target.value } }))}
            className={inputClass()}
            placeholder="Eyebrow"
          />
          <input
            value={settings.story.title}
            onChange={(event) => setSettings((prev) => ({ ...prev, story: { ...prev.story, title: event.target.value } }))}
            className={inputClass(errorsByField.has('story.title'))}
            placeholder="Story title"
          />
          <div className="space-y-2">
            {settings.story.paragraphs.map((paragraph, index) => (
              <div key={`story-${index}`} className="flex gap-2">
                <textarea
                  value={paragraph}
                  onChange={(event) =>
                    setSettings((prev) => {
                      const paragraphs = [...prev.story.paragraphs];
                      paragraphs[index] = event.target.value;
                      return { ...prev, story: { ...prev.story, paragraphs } };
                    })
                  }
                  rows={3}
                  className={inputClass(errorsByField.has('story.paragraphs'))}
                  placeholder={`Story paragraph ${index + 1}`}
                />
                {settings.story.paragraphs.length > 1 && (
                  <button
                    type="button"
                    onClick={() =>
                      setSettings((prev) => ({
                        ...prev,
                        story: {
                          ...prev.story,
                          paragraphs: prev.story.paragraphs.filter((_, itemIndex) => itemIndex !== index),
                        },
                      }))
                    }
                    className="h-10 w-10 shrink-0 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              onClick={() =>
                setSettings((prev) => ({
                  ...prev,
                  story: { ...prev.story, paragraphs: [...prev.story.paragraphs, ''] },
                }))
              }
              className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#F26419] hover:bg-orange-50"
            >
              + Add Paragraph
            </button>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Achievements</h2>
          <input
            value={settings.achievements.title}
            onChange={(event) =>
              setSettings((prev) => ({
                ...prev,
                achievements: { ...prev.achievements, title: event.target.value },
              }))
            }
            className={inputClass()}
            placeholder="Achievements heading"
          />
          <div className="grid gap-3 sm:grid-cols-2">
            {settings.achievements.items.map((item, index) => (
              <div key={`achievement-${index}`} className="rounded-lg border border-gray-200 p-3 space-y-2">
                <input
                  value={item.value}
                  onChange={(event) =>
                    setSettings((prev) => {
                      const items = [...prev.achievements.items];
                      items[index] = { ...items[index], value: event.target.value };
                      return { ...prev, achievements: { ...prev.achievements, items } };
                    })
                  }
                  className={inputClass()}
                  placeholder="Value"
                />
                <input
                  value={item.label}
                  onChange={(event) =>
                    setSettings((prev) => {
                      const items = [...prev.achievements.items];
                      items[index] = { ...items[index], label: event.target.value };
                      return { ...prev, achievements: { ...prev.achievements, items } };
                    })
                  }
                  className={inputClass()}
                  placeholder="Label"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Values</h2>
          <input value={settings.values.eyebrow} onChange={(event) => setSettings((prev) => ({ ...prev, values: { ...prev.values, eyebrow: event.target.value } }))} className={inputClass()} placeholder="Eyebrow" />
          <input value={settings.values.title} onChange={(event) => setSettings((prev) => ({ ...prev, values: { ...prev.values, title: event.target.value } }))} className={inputClass()} placeholder="Title" />
          <textarea value={settings.values.subtitle} onChange={(event) => setSettings((prev) => ({ ...prev, values: { ...prev.values, subtitle: event.target.value } }))} className={inputClass()} placeholder="Subtitle" rows={2} />
          <div className="space-y-3">
            {settings.values.items.map((item, index) => (
              <div key={`value-${index}`} className="rounded-lg border border-gray-200 p-3 space-y-2">
                <div className="grid gap-2 sm:grid-cols-3">
                  <input value={item.icon} onChange={(event) => setSettings((prev) => {
                    const items = [...prev.values.items];
                    items[index] = { ...items[index], icon: event.target.value };
                    return { ...prev, values: { ...prev.values, items } };
                  })} className={inputClass()} placeholder="Icon" />
                  <input value={item.title} onChange={(event) => setSettings((prev) => {
                    const items = [...prev.values.items];
                    items[index] = { ...items[index], title: event.target.value };
                    return { ...prev, values: { ...prev.values, items } };
                  })} className={inputClass()} placeholder="Title" />
                  <button type="button" onClick={() => setSettings((prev) => ({ ...prev, values: { ...prev.values, items: prev.values.items.filter((_, itemIndex) => itemIndex !== index) } }))} className="rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Remove</button>
                </div>
                <textarea value={item.desc} onChange={(event) => setSettings((prev) => {
                  const items = [...prev.values.items];
                  items[index] = { ...items[index], desc: event.target.value };
                  return { ...prev, values: { ...prev.values, items } };
                })} className={inputClass()} placeholder="Short description" rows={2} />
                <textarea value={item.detail} onChange={(event) => setSettings((prev) => {
                  const items = [...prev.values.items];
                  items[index] = { ...items[index], detail: event.target.value };
                  return { ...prev, values: { ...prev.values, items } };
                })} className={inputClass()} placeholder="Detail" rows={3} />
              </div>
            ))}
            <button type="button" onClick={() => setSettings((prev) => ({ ...prev, values: { ...prev.values, items: [...prev.values.items, { icon: '', title: '', desc: '', detail: '' }] } }))} className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#F26419] hover:bg-orange-50">+ Add Value</button>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Team</h2>
          <input value={settings.team.eyebrow} onChange={(event) => setSettings((prev) => ({ ...prev, team: { ...prev.team, eyebrow: event.target.value } }))} className={inputClass()} placeholder="Eyebrow" />
          <input value={settings.team.title} onChange={(event) => setSettings((prev) => ({ ...prev, team: { ...prev.team, title: event.target.value } }))} className={inputClass()} placeholder="Title" />
          <textarea value={settings.team.subtitle} onChange={(event) => setSettings((prev) => ({ ...prev, team: { ...prev.team, subtitle: event.target.value } }))} className={inputClass()} placeholder="Subtitle" rows={2} />
          <div className="space-y-3">
            {settings.team.members.map((member, index) => (
              <div key={`member-${index}`} className="rounded-lg border border-gray-200 p-3 space-y-2">
                <div className="grid gap-2 sm:grid-cols-4">
                  <input value={member.emoji} onChange={(event) => setSettings((prev) => {
                    const members = [...prev.team.members];
                    members[index] = { ...members[index], emoji: event.target.value };
                    return { ...prev, team: { ...prev.team, members } };
                  })} className={inputClass()} placeholder="Emoji" />
                  <input value={member.name} onChange={(event) => setSettings((prev) => {
                    const members = [...prev.team.members];
                    members[index] = { ...members[index], name: event.target.value };
                    return { ...prev, team: { ...prev.team, members } };
                  })} className={inputClass()} placeholder="Name" />
                  <input value={member.role} onChange={(event) => setSettings((prev) => {
                    const members = [...prev.team.members];
                    members[index] = { ...members[index], role: event.target.value };
                    return { ...prev, team: { ...prev.team, members } };
                  })} className={inputClass()} placeholder="Role" />
                  <button type="button" onClick={() => setSettings((prev) => ({ ...prev, team: { ...prev.team, members: prev.team.members.filter((_, memberIndex) => memberIndex !== index) } }))} className="rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Remove</button>
                </div>
                <textarea value={member.bio} onChange={(event) => setSettings((prev) => {
                  const members = [...prev.team.members];
                  members[index] = { ...members[index], bio: event.target.value };
                  return { ...prev, team: { ...prev.team, members } };
                })} className={inputClass()} placeholder="Bio" rows={3} />
              </div>
            ))}
            <button type="button" onClick={() => setSettings((prev) => ({ ...prev, team: { ...prev.team, members: [...prev.team.members, { emoji: '', name: '', role: '', bio: '' }] } }))} className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#F26419] hover:bg-orange-50">+ Add Team Member</button>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">Mission</h2>
          <input value={settings.mission.eyebrow} onChange={(event) => setSettings((prev) => ({ ...prev, mission: { ...prev.mission, eyebrow: event.target.value } }))} className={inputClass()} placeholder="Eyebrow" />
          <input value={settings.mission.title} onChange={(event) => setSettings((prev) => ({ ...prev, mission: { ...prev.mission, title: event.target.value } }))} className={inputClass()} placeholder="Title" />
          <textarea value={settings.mission.description} onChange={(event) => setSettings((prev) => ({ ...prev, mission: { ...prev.mission, description: event.target.value } }))} className={inputClass()} placeholder="Description" rows={3} />
          <div className="space-y-3">
            {settings.mission.items.map((item, index) => (
              <div key={`mission-${index}`} className="rounded-lg border border-gray-200 p-3 space-y-2">
                <div className="grid gap-2 sm:grid-cols-2">
                  <input value={item.title} onChange={(event) => setSettings((prev) => {
                    const items = [...prev.mission.items];
                    items[index] = { ...items[index], title: event.target.value };
                    return { ...prev, mission: { ...prev.mission, items } };
                  })} className={inputClass()} placeholder="Title" />
                  <button type="button" onClick={() => setSettings((prev) => ({ ...prev, mission: { ...prev.mission, items: prev.mission.items.filter((_, itemIndex) => itemIndex !== index) } }))} className="rounded-lg border border-red-200 text-red-600 hover:bg-red-50">Remove</button>
                </div>
                <textarea value={item.desc} onChange={(event) => setSettings((prev) => {
                  const items = [...prev.mission.items];
                  items[index] = { ...items[index], desc: event.target.value };
                  return { ...prev, mission: { ...prev.mission, items } };
                })} className={inputClass()} placeholder="Description" rows={2} />
              </div>
            ))}
            <button type="button" onClick={() => setSettings((prev) => ({ ...prev, mission: { ...prev.mission, items: [...prev.mission.items, { title: '', desc: '' }] } }))} className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-[#F26419] hover:bg-orange-50">+ Add Mission Item</button>
          </div>
        </section>

        <section className="rounded-xl border border-gray-200 bg-white p-5 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900">SEO</h2>
          <input value={settings.seo.metaTitle} onChange={(event) => updateSeo('metaTitle', event.target.value)} className={inputClass(errorsByField.has('seo.metaTitle'))} placeholder="Meta title" />
          <textarea value={settings.seo.metaDescription} onChange={(event) => updateSeo('metaDescription', event.target.value)} className={inputClass(errorsByField.has('seo.metaDescription'))} placeholder="Meta description" rows={3} />
          <input value={settings.seo.keywords} onChange={(event) => updateSeo('keywords', event.target.value)} className={inputClass()} placeholder="Keywords" />
          <input value={settings.seo.canonicalUrl} onChange={(event) => updateSeo('canonicalUrl', event.target.value)} className={inputClass()} placeholder="Canonical URL" />
          <textarea value={settings.seo.schemaMarkup} onChange={(event) => updateSeo('schemaMarkup', event.target.value)} className={inputClass()} placeholder="Schema markup JSON-LD" rows={6} />
        </section>
      </form>
    </AdminLayout>
  );
}
