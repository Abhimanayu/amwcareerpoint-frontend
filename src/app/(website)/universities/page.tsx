import { permanentRedirect } from 'next/navigation';

type Props = {
  searchParams: Promise<{ country?: string }>;
};

export default async function UniversitiesPage({ searchParams }: Readonly<Props>) {
  const { country } = await searchParams;
  const query = country ? `?country=${encodeURIComponent(country)}` : '';
  permanentRedirect(`/college${query}`);
}
