import { permanentRedirect } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

function getApiBaseUrl() {
  return (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1').replace(/\/+$/, '');
}

function hasDetailPayload(payload: unknown) {
  if (!payload || typeof payload !== 'object') {
    return false;
  }

  const root = payload as { data?: unknown; slug?: unknown; _id?: unknown };
  if (typeof root.slug === 'string' || typeof root._id === 'string') {
    return true;
  }

  if (root.data && typeof root.data === 'object') {
    const data = root.data as { slug?: unknown; _id?: unknown };
    return typeof data.slug === 'string' || typeof data._id === 'string';
  }

  return false;
}

async function detailExists(type: 'universities' | 'blogs', slug: string) {
  const baseUrl = getApiBaseUrl();

  try {
    const response = await fetch(`${baseUrl}/${type}/${encodeURIComponent(slug)}`, {
      cache: 'no-store',
      next: { revalidate: 0 },
      headers: { accept: 'application/json' },
    });

    if (!response.ok) {
      return false;
    }

    return hasDetailPayload(await response.json());
  } catch {
    return false;
  }
}

export async function generateMetadata() {
  return {
    title: 'Page moved',
    robots: { index: false, follow: true },
  };
}

export default async function LegacyRootSlugPage({ params }: Props) {
  const { slug } = await params;

  if (await detailExists('blogs', slug)) {
    permanentRedirect(`/blogs/${slug}`);
  }

  permanentRedirect(`/college/${slug}`);
}
