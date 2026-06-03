export type AboutAchievement = {
  value: string;
  label: string;
};

export type AboutValue = {
  icon: string;
  title: string;
  desc: string;
  detail: string;
};

export type AboutTeamMember = {
  emoji: string;
  image?: string;
  name: string;
  role: string;
  bio: string;
};

export type AboutMissionItem = {
  title: string;
  desc: string;
};

export type AboutSectionVisibility = {
  hero: boolean;
  story: boolean;
  achievements: boolean;
  values: boolean;
  team: boolean;
  mission: boolean;
};

export type AboutSettings = {
  seo: {
    metaTitle: string;
    metaDescription: string;
    keywords: string;
    canonicalUrl: string;
    schemaMarkup: string;
  };
  sections: AboutSectionVisibility;
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
  };
  story: {
    eyebrow: string;
    title: string;
    paragraphs: string[];
  };
  achievements: {
    title: string;
    items: AboutAchievement[];
  };
  values: {
    eyebrow: string;
    title: string;
    subtitle: string;
    items: AboutValue[];
  };
  team: {
    eyebrow: string;
    title: string;
    subtitle: string;
    members: AboutTeamMember[];
  };
  mission: {
    eyebrow: string;
    title: string;
    description: string;
    items: AboutMissionItem[];
  };
};

export const defaultAboutSettings: AboutSettings = {
  seo: {
    metaTitle: 'About Us',
    metaDescription:
      'Learn about AMW Career Point - Your trusted partner for MBBS abroad consultancy with 10+ years of experience in medical education.',
    keywords: 'about amw career point, mbbs consultancy, study abroad guidance',
    canonicalUrl: '/about',
    schemaMarkup: '',
  },
  sections: {
    hero: true,
    story: true,
    achievements: true,
    values: true,
    team: true,
    mission: true,
  },
  hero: {
    eyebrow: 'Who We Are',
    title: 'About AMW Career Point',
    subtitle:
      'Your trusted partner in achieving your dream of becoming a doctor through quality medical education abroad',
  },
  story: {
    eyebrow: 'Our Journey',
    title: 'Our Story',
    paragraphs: [
      'Founded in 2009, AMW Career Point has been a pioneer in providing comprehensive consultancy services for students aspiring to pursue MBBS abroad. With over 15 years of experience, we have successfully guided thousands of students to achieve their dreams of becoming doctors.',
      'Our journey began with a simple vision: to make quality medical education accessible and affordable for Indian students. Today, we are proud to be one of the most trusted names in medical education consultancy.',
      "We understand that choosing the right university and country for your medical education is one of the most important decisions of your life. That's why we provide personalized guidance and support throughout your journey.",
    ],
  },
  achievements: {
    title: 'Our Achievements',
    items: [
      { value: '20,000+', label: 'Students Placed' },
      { value: '50+', label: 'Universities' },
      { value: '15+', label: 'Countries' },
      { value: '98%', label: 'Success Rate' },
    ],
  },
  values: {
    eyebrow: 'What Drives Us',
    title: 'Our Values',
    subtitle: 'The principles that guide us in helping students achieve their medical education goals',
    items: [
      {
        icon: '🎯',
        title: 'Excellence',
        desc: 'We strive for excellence in every aspect of our service delivery',
        detail:
          'From university selection to visa processing, we maintain the highest standards to ensure your success.',
      },
      {
        icon: '🤝',
        title: 'Integrity',
        desc: 'Transparency and honesty in all our interactions and processes',
        detail: 'We believe in building trust through transparent communication and ethical practices.',
      },
      {
        icon: '💡',
        title: 'Innovation',
        desc: 'Continuously improving our services with innovative solutions',
        detail:
          'We leverage technology and innovative approaches to make your journey smoother and more efficient.',
      },
    ],
  },
  team: {
    eyebrow: 'Meet The Experts',
    title: 'Our Expert Team',
    subtitle:
      'Meet the experienced professionals who will guide you through your medical education journey',
    members: [
      {
        emoji: '👨‍⚕️',
        name: 'Dr. Rajesh Kumar',
        role: 'Founder & CEO',
        bio: 'MBBS, MD - 15 years experience in medical education consultancy',
      },
      {
        emoji: '👩‍💼',
        name: 'Ms. Priya Sharma',
        role: 'Head of Admissions',
        bio: 'MBA - 12 years experience in international admissions',
      },
      {
        emoji: '👨‍💻',
        name: 'Mr. Amit Patel',
        role: 'Visa Consultant',
        bio: 'LLB - 10 years experience in visa processing and documentation',
      },
    ],
  },
  mission: {
    eyebrow: 'Our Purpose',
    title: 'Our Mission',
    description:
      'To bridge the gap between aspiring medical students and world-class medical education by providing expert guidance, comprehensive support, and personalized solutions that ensure success in their medical career journey.',
    items: [
      {
        title: 'Student-Centric Approach',
        desc: "Every decision we make is focused on what's best for our students' future",
      },
      {
        title: 'Quality Partnerships',
        desc: 'We partner only with accredited, WHO-approved medical universities',
      },
      {
        title: 'Long-term Support',
        desc: 'Our relationship continues throughout your academic journey and beyond',
      },
    ],
  },
};

function readString(value: unknown, fallback: string) {
  return typeof value === 'string' ? value : fallback;
}

function readBool(value: unknown, fallback: boolean) {
  return typeof value === 'boolean' ? value : fallback;
}

function readArray<T>(value: unknown, fallback: T[], mapper: (item: unknown, index: number) => T) {
  if (!Array.isArray(value)) return fallback;
  const mapped = value
    .map((item, index) => mapper(item, index))
    .filter((item): item is T => Boolean(item));
  return mapped.length > 0 ? mapped : fallback;
}

export function mergeAboutSettings(payload: unknown): AboutSettings {
  if (!payload || typeof payload !== 'object') return defaultAboutSettings;
  const root = payload as Record<string, unknown>;

  const seo = (root.seo ?? {}) as Record<string, unknown>;
  const sections = (root.sections ?? {}) as Record<string, unknown>;
  const hero = (root.hero ?? {}) as Record<string, unknown>;
  const story = (root.story ?? {}) as Record<string, unknown>;
  const achievements = (root.achievements ?? {}) as Record<string, unknown>;
  const values = (root.values ?? {}) as Record<string, unknown>;
  const team = (root.team ?? {}) as Record<string, unknown>;
  const mission = (root.mission ?? {}) as Record<string, unknown>;

  return {
    seo: {
      metaTitle: readString(seo.metaTitle, defaultAboutSettings.seo.metaTitle),
      metaDescription: readString(seo.metaDescription, defaultAboutSettings.seo.metaDescription),
      keywords: readString(seo.keywords, defaultAboutSettings.seo.keywords),
      canonicalUrl: readString(seo.canonicalUrl, defaultAboutSettings.seo.canonicalUrl),
      schemaMarkup: readString(seo.schemaMarkup, defaultAboutSettings.seo.schemaMarkup),
    },
    sections: {
      hero: readBool(sections.hero, defaultAboutSettings.sections.hero),
      story: readBool(sections.story, defaultAboutSettings.sections.story),
      achievements: readBool(sections.achievements, defaultAboutSettings.sections.achievements),
      values: readBool(sections.values, defaultAboutSettings.sections.values),
      team: readBool(sections.team, defaultAboutSettings.sections.team),
      mission: readBool(sections.mission, defaultAboutSettings.sections.mission),
    },
    hero: {
      eyebrow: readString(hero.eyebrow, defaultAboutSettings.hero.eyebrow),
      title: readString(hero.title, defaultAboutSettings.hero.title),
      subtitle: readString(hero.subtitle, defaultAboutSettings.hero.subtitle),
    },
    story: {
      eyebrow: readString(story.eyebrow, defaultAboutSettings.story.eyebrow),
      title: readString(story.title, defaultAboutSettings.story.title),
      paragraphs: readArray(story.paragraphs, defaultAboutSettings.story.paragraphs, (item) =>
        readString(item, '')
      ).filter(Boolean),
    },
    achievements: {
      title: readString(achievements.title, defaultAboutSettings.achievements.title),
      items: readArray(achievements.items, defaultAboutSettings.achievements.items, (item) => {
        const entry = (item ?? {}) as Record<string, unknown>;
        return {
          value: readString(entry.value, ''),
          label: readString(entry.label, ''),
        };
      }).filter((item) => item.value || item.label),
    },
    values: {
      eyebrow: readString(values.eyebrow, defaultAboutSettings.values.eyebrow),
      title: readString(values.title, defaultAboutSettings.values.title),
      subtitle: readString(values.subtitle, defaultAboutSettings.values.subtitle),
      items: readArray(values.items, defaultAboutSettings.values.items, (item) => {
        const entry = (item ?? {}) as Record<string, unknown>;
        return {
          icon: readString(entry.icon, ''),
          title: readString(entry.title, ''),
          desc: readString(entry.desc, ''),
          detail: readString(entry.detail, ''),
        };
      }).filter((item) => item.title || item.desc || item.detail),
    },
    team: {
      eyebrow: readString(team.eyebrow, defaultAboutSettings.team.eyebrow),
      title: readString(team.title, defaultAboutSettings.team.title),
      subtitle: readString(team.subtitle, defaultAboutSettings.team.subtitle),
      members: readArray(team.members, defaultAboutSettings.team.members, (item) => {
        const entry = (item ?? {}) as Record<string, unknown>;
        return {
          emoji: readString(entry.emoji, ''),
          image: readString(entry.image, readString(entry.imageUrl, readString(entry.photo, readString(entry.photoUrl, '')))) || undefined,
          name: readString(entry.name, ''),
          role: readString(entry.role, ''),
          bio: readString(entry.bio, ''),
        };
      }).filter((item) => item.name || item.role || item.bio),
    },
    mission: {
      eyebrow: readString(mission.eyebrow, defaultAboutSettings.mission.eyebrow),
      title: readString(mission.title, defaultAboutSettings.mission.title),
      description: readString(mission.description, defaultAboutSettings.mission.description),
      items: readArray(mission.items, defaultAboutSettings.mission.items, (item) => {
        const entry = (item ?? {}) as Record<string, unknown>;
        return {
          title: readString(entry.title, ''),
          desc: readString(entry.desc, ''),
        };
      }).filter((item) => item.title || item.desc),
    },
  };
}
