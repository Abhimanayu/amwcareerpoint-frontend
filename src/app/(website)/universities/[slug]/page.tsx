import { permanentRedirect } from 'next/navigation';

type Props = {
  params: Promise<{ slug: string }>;
};

export default async function UniversityDetailPage({ params }: Readonly<Props>) {
  const { slug } = await params;
  permanentRedirect(`/college/${slug}`);
}
