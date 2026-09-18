import { notFound, permanentRedirect } from 'next/navigation';
import { IndiaPageView } from '@/components/india/IndiaPageView';
import { IndiaSeo } from '@/components/india/IndiaSeo';
import { readIndiaPage, readIndiaColleges, indiaMetadata } from '@/lib/server/india';
export const dynamic = 'force-dynamic';
type Props = { params: Promise<{ slug: string }> };
export async function generateMetadata({ params }: Props) { return indiaMetadata(await readIndiaPage((await params).slug)); }
export default async function Page({ params }: Props) {
  const { slug } = await params;
  const page = await readIndiaPage(slug);
  if (!page || page.kind !== 'state') notFound();
  if (page.slug !== slug) permanentRedirect(`/mbbs-india/${page.slug}`);
  const colleges = await readIndiaColleges(page.slug);
  return <><IndiaSeo page={page} /><IndiaPageView page={page} colleges={colleges} /></>;
}
