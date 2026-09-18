import { IndiaPage, indiaPath } from '@/lib/india';
import { SEO_HOLD } from '@/lib/seoHold';
export function IndiaSeo({ page }: { page: IndiaPage }) {
  if (SEO_HOLD || page.seo.noindex) return null;
  const base = (process.env.NEXT_PUBLIC_SITE_URL || 'https://amwcareerpoint.com').replace(/\/$/, '');
  const crumbs = [{ '@type': 'ListItem', position: 1, name: 'Home', item: `${base}/` }, { '@type': 'ListItem', position: 2, name: 'MBBS India', item: `${base}/mbbs-india` }];
  if (page.kind === 'state') crumbs.push({ '@type': 'ListItem', position: 3, name: page.name, item: `${base}${indiaPath(page)}` });
  const schemas: object[] = [{ '@context': 'https://schema.org', '@type': 'BreadcrumbList', itemListElement: crumbs }];
  if (page.faqs.length) schemas.push({ '@context': 'https://schema.org', '@type': 'FAQPage', mainEntity: page.faqs.map(f => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })) });
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(schemas).replace(/</g, '\\u003c') }} />;
}
