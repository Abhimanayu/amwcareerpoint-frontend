import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { countries, universities } from '@/lib/data';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const country = countries.find((c) => c.slug === params.slug);
  
  if (!country) {
    return {
      title: 'Country Not Found',
    };
  }

  return {
    title: `MBBS in ${country.name}`,
    description: `Study MBBS in ${country.name}. ${country.description} Get complete information about medical universities, fees, and admission process.`,
  };
}

export async function generateStaticParams() {
  return countries.map((country) => ({
    slug: country.slug,
  }));
}

export default function CountryDetailPage({ params }: Props) {
  const country = countries.find((c) => c.slug === params.slug);
  
  if (!country) {
    notFound();
  }

  const countryUniversities = universities.filter((u) => u.countrySlug === country.slug);

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="text-8xl mb-6">{country.flag}</div>
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              MBBS in {country.name}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
              {country.description}
            </p>
          </div>
        </div>
      </section>

      {/* Quick Info */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-blue-600">Universities</CardTitle>
                <div className="text-3xl font-bold text-center">{country.universities}+</div>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-green-600">Average Fees</CardTitle>
                <div className="text-xl font-bold text-center">{country.averageFees}</div>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-purple-600">Duration</CardTitle>
                <div className="text-2xl font-bold text-center">{country.duration}</div>
              </CardHeader>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-orange-600">Recognition</CardTitle>
                <div className="text-sm font-bold text-center">WHO & MCI Approved</div>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Features & Benefits */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-8">
                Why Choose {country.name}?
              </h2>
              <div className="space-y-4">
                {country.features.map((feature, index) => (
                  <div key={index} className="flex items-start">
                    <div className="flex-shrink-0 w-6 h-6 bg-green-100 rounded-full flex items-center justify-center mr-3 mt-1">
                      <span className="text-green-600 text-sm">✓</span>
                    </div>
                    <p className="text-gray-700">{feature}</p>
                  </div>
                ))}
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Eligibility Criteria</CardTitle>
                <CardDescription>
                  Basic requirements for studying MBBS in {country.name}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {country.eligibility.map((criteria, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-600 mr-2">•</span>
                      <span className="text-gray-700">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Universities in this Country */}
      {countryUniversities.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                Top Universities in {country.name}
              </h2>
              <p className="text-lg text-gray-600">
                Explore leading medical universities offering quality education
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {countryUniversities.map((university) => (
                <Card key={university.id} className="group hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <CardTitle className="text-lg">{university.name}</CardTitle>
                    <CardDescription>
                      {university.location} • Established {university.established}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2 text-sm">
                      <p><strong>Ranking:</strong> {university.ranking}</p>
                      <p><strong>Fees:</strong> {university.fees}</p>
                      <p><strong>Duration:</strong> {university.duration}</p>
                    </div>
                    <div className="mt-4">
                      <Link href={`/universities/${university.slug}`}>
                        <Button variant="outline" className="w-full">
                          View Details
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="text-center mt-12">
              <Link href="/universities">
                <Button size="lg">
                  View All Universities
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* Admission Process */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Admission Process
            </h2>
            <p className="text-lg text-gray-600">
              Simple steps to start your medical journey in {country.name}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {[
              { step: '1', title: 'NEET Qualification', desc: 'Clear NEET with minimum required marks' },
              { step: '2', title: 'Choose University', desc: 'Select university based on preferences' },
              { step: '3', title: 'Submit Documents', desc: 'Prepare and submit required documents' },
              { step: '4', title: 'Get Admission', desc: 'Receive admission confirmation letter' },
              { step: '5', title: 'Visa & Travel', desc: 'Process visa and travel to university' },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                  {item.step}
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Study MBBS in {country.name}?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Get expert guidance and support for your admission process
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Free Consultation
              </Button>
            </Link>
            <Link href={`/universities?country=${country.slug}`}>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                View Universities
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}