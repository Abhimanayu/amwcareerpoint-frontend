import { Header, Footer } from "@/components/layout";
import { AnnouncementBar } from "@/components/home";
import { ErrorBoundary } from "@/components/ui/ErrorBoundary";

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'EducationalOrganization',
  name: 'AMW Career Point',
  description: 'India\'s most trusted MBBS abroad consultancy since 2009.',
  url: 'https://amwcareerpoint.com',
  telephone: '+91-9929299268',
  email: 'support@amwcareerpoint.com',
  address: {
    '@type': 'PostalAddress',
    streetAddress: 'D 100 A, Supreme Complex, Meera Marg, Bani Park',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    postalCode: '302006',
    addressCountry: 'IN',
  },
  aggregateRating: {
    '@type': 'AggregateRating',
    ratingValue: '4.9',
    reviewCount: '3240',
    bestRating: '5',
  },
};

export default function WebsiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <AnnouncementBar />
      <Header />
      <main className="flex-1">
        <ErrorBoundary>{children}</ErrorBoundary>
      </main>
      <Footer />
    </>
  );
}
