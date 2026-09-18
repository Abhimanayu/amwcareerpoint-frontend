import { IndiaPageView } from '@/components/india/IndiaPageView';
import { IndiaSeo } from '@/components/india/IndiaSeo';
import { emptyIndiaPage } from '@/lib/india';
import { readIndiaPage, readIndiaStates, indiaMetadata } from '@/lib/server/india';
export const dynamic = 'force-dynamic';
export async function generateMetadata() { return indiaMetadata(await readIndiaPage('india')); }
export default async function Page() {
  const [page, states] = await Promise.all([readIndiaPage('india'), readIndiaStates()]);
  const content = page || { ...emptyIndiaPage('overview'), title: 'MBBS in India', intro: 'Explore medical colleges and get personal guidance for your MBBS journey.' };
  return <>{page && <IndiaSeo page={page} />}<IndiaPageView page={content} states={states} /></>;
}
