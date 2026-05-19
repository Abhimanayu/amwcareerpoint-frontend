import { api, adminApi } from './api';
import type { AboutSettings } from './aboutSettings';
import { defaultAboutSettings } from './aboutSettings';

type AboutSettingsPayload = AboutSettings;

type BackendAboutSettings = {
  seo?: {
    metaTitle?: string;
    metaDescription?: string;
    keywords?: string;
    canonicalUrl?: string;
    schemaMarkup?: string;
  };
  sections?: AboutSettings['sections'];
  hero?: {
    badge?: string;
    heading?: string;
    subheading?: string;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
  };
  story?: {
    heading?: string;
    description?: string;
    eyebrow?: string;
    title?: string;
    paragraphs?: string[];
  };
  achievements?: Array<{ value?: string; label?: string }> | { items?: Array<{ value?: string; label?: string }>; title?: string };
  values?:
    | Array<{ icon?: string; title?: string; description?: string; desc?: string; detail?: string }>
    | {
        items?: Array<{ icon?: string; title?: string; description?: string; desc?: string; detail?: string }>;
        eyebrow?: string;
        title?: string;
        subtitle?: string;
      };
  team?: {
    heading?: string;
    description?: string;
    members?: Array<{ emoji?: string; name?: string; role?: string; bio?: string }>;
    eyebrow?: string;
    title?: string;
    subtitle?: string;
  };
  mission?: {
    heading?: string;
    description?: string;
    eyebrow?: string;
    title?: string;
    items?: Array<{ title?: string; desc?: string }>;
  };
};

function readString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback;
}

function toFrontendSettings(payload: unknown): AboutSettings {
  const root = (unwrapAboutSettings(payload) ?? {}) as BackendAboutSettings;

  const achievementsRaw = Array.isArray(root.achievements)
    ? root.achievements
    : root.achievements?.items ?? [];

  const valuesRaw = Array.isArray(root.values)
    ? root.values
    : root.values?.items ?? [];

  const storyParagraphs = Array.isArray(root.story?.paragraphs)
    ? root.story?.paragraphs.filter(Boolean)
    : [];

  const storyDescription = readString(root.story?.description, '');
  let normalizedStoryParagraphs = storyParagraphs.length > 0
    ? storyParagraphs
    : [...defaultAboutSettings.story.paragraphs];

  if (storyParagraphs.length === 0 && storyDescription) {
    normalizedStoryParagraphs = [storyDescription];
  }

  const sections = root.sections ? { ...defaultAboutSettings.sections, ...root.sections } : defaultAboutSettings.sections;

  return {
    seo: {
      metaTitle: readString(root.seo?.metaTitle, defaultAboutSettings.seo.metaTitle),
      metaDescription: readString(root.seo?.metaDescription, defaultAboutSettings.seo.metaDescription),
      keywords: readString(root.seo?.keywords, defaultAboutSettings.seo.keywords),
      canonicalUrl: readString(root.seo?.canonicalUrl, defaultAboutSettings.seo.canonicalUrl),
      schemaMarkup: readString(root.seo?.schemaMarkup, defaultAboutSettings.seo.schemaMarkup),
    },
    sections,
    hero: {
      eyebrow: readString(root.hero?.badge ?? root.hero?.eyebrow, defaultAboutSettings.hero.eyebrow),
      title: readString(root.hero?.heading ?? root.hero?.title, defaultAboutSettings.hero.title),
      subtitle: readString(root.hero?.subheading ?? root.hero?.subtitle, defaultAboutSettings.hero.subtitle),
    },
    story: {
      eyebrow: readString(root.story?.eyebrow, defaultAboutSettings.story.eyebrow),
      title: readString(root.story?.heading ?? root.story?.title, defaultAboutSettings.story.title),
      paragraphs: normalizedStoryParagraphs,
    },
    achievements: {
      title: readString((root.achievements as { title?: string } | undefined)?.title, defaultAboutSettings.achievements.title),
      items: achievementsRaw.length > 0
        ? achievementsRaw.map((item) => ({
            value: readString(item?.value, ''),
            label: readString(item?.label, ''),
          })).filter((item) => item.value || item.label)
        : defaultAboutSettings.achievements.items,
    },
    values: {
      eyebrow: readString((root.values as { eyebrow?: string } | undefined)?.eyebrow, defaultAboutSettings.values.eyebrow),
      title: readString((root.values as { title?: string } | undefined)?.title, defaultAboutSettings.values.title),
      subtitle: readString((root.values as { subtitle?: string } | undefined)?.subtitle, defaultAboutSettings.values.subtitle),
      items: valuesRaw.length > 0
        ? valuesRaw.map((item) => ({
            icon: readString(item?.icon, ''),
            title: readString(item?.title, ''),
            desc: readString(item?.desc ?? item?.description, ''),
            detail: readString(item?.detail, ''),
          })).filter((item) => item.title || item.desc || item.detail)
        : defaultAboutSettings.values.items,
    },
    team: {
      eyebrow: readString(root.team?.eyebrow, defaultAboutSettings.team.eyebrow),
      title: readString(root.team?.heading ?? root.team?.title, defaultAboutSettings.team.title),
      subtitle: readString(root.team?.description ?? root.team?.subtitle, defaultAboutSettings.team.subtitle),
      members: Array.isArray(root.team?.members) && root.team.members.length > 0
        ? root.team.members.map((member) => ({
            emoji: readString(member?.emoji, ''),
            name: readString(member?.name, ''),
            role: readString(member?.role, ''),
            bio: readString(member?.bio, ''),
          })).filter((member) => member.name || member.role || member.bio)
        : defaultAboutSettings.team.members,
    },
    mission: {
      eyebrow: readString(root.mission?.eyebrow, defaultAboutSettings.mission.eyebrow),
      title: readString(root.mission?.heading ?? root.mission?.title, defaultAboutSettings.mission.title),
      description: readString(root.mission?.description, defaultAboutSettings.mission.description),
      items: Array.isArray(root.mission?.items) && root.mission.items.length > 0
        ? root.mission.items.map((item) => ({
            title: readString(item?.title, ''),
            desc: readString(item?.desc, ''),
          })).filter((item) => item.title || item.desc)
        : defaultAboutSettings.mission.items,
    },
  };
}

function toBackendPayload(data: AboutSettingsPayload) {
  return {
    seo: data.seo,
    sections: data.sections,
    hero: {
      badge: data.hero.eyebrow,
      heading: data.hero.title,
      subheading: data.hero.subtitle,
    },
    story: {
      heading: data.story.title,
      description: data.story.paragraphs.filter(Boolean).join('\n\n'),
    },
    achievements: data.achievements.items
      .map((item) => ({ value: item.value, label: item.label }))
      .filter((item) => item.value || item.label),
    values: data.values.items
      .map((item) => ({
        icon: item.icon,
        title: item.title,
        description: item.desc,
        detail: item.detail,
      }))
      .filter((item) => item.title || item.description || item.detail),
    team: {
      heading: data.team.title,
      description: data.team.subtitle,
      members: data.team.members
        .map((member) => ({
          emoji: member.emoji,
          name: member.name,
          role: member.role,
          bio: member.bio,
        }))
        .filter((member) => member.name || member.role || member.bio),
    },
    mission: {
      heading: data.mission.title,
      description: data.mission.description,
    },
  };
}

function unwrapAboutSettings(payload: unknown): unknown {
  if (!payload || typeof payload !== 'object') return payload;

  const root = payload as { data?: unknown };
  return root.data ?? payload;
}

export const getAboutSettings = async () => {
  const res = await api.get('/about-settings');
  return toFrontendSettings(res.data);
};

export const adminGetAboutSettings = async () => {
  const res = await adminApi.get('/about-settings/admin');
  return toFrontendSettings(res.data);
};

export const updateAboutSettings = async (data: AboutSettingsPayload) => {
  const res = await adminApi.put('/about-settings', toBackendPayload(data));
  return toFrontendSettings(res.data);
};
