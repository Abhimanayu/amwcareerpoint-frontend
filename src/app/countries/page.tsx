import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { countries } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Countries for MBBS Abroad',
  description: 'Explore top countries for MBBS abroad with AMW Career Point including Russia, Ukraine, Georgia, Kazakhstan and more. Find the best destination for your medical education.',
};

export default function CountriesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Study MBBS Abroad
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Explore top destinations for medical education with affordable fees and quality education
          </p>
        </div>
      </section>

      {/* Countries Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Popular Study Destinations
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Choose from our carefully selected countries that offer world-class medical education
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {countries.map((country) => (
              <Card key={country.id} className="group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center mb-4">
                    <span className="text-5xl mr-4">{country.flag}</span>
                    <div>
                      <CardTitle className="text-2xl">{country.name}</CardTitle>
                      <div className="text-sm text-gray-500">{country.universities}+ Universities</div>
                    </div>
                  </div>
                  <CardDescription className="text-base">
                    {country.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {/* Key Features */}
                    <div>
                      <h4 className="font-semibold text-gray-900 mb-2">Key Features:</h4>
                      <div className="grid grid-cols-1 gap-1">
                        {country.features.slice(0, 3).map((feature, index) => (
                          <div key={index} className="flex items-center text-sm text-gray-600">
                            <span className="text-green-500 mr-2">✓</span>
                            {feature}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {/* Quick Info */}
                    <div className="grid grid-cols-2 gap-4 pt-4 border-t border-gray-100">
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Average Fees</div>
                        <div className="font-semibold text-blue-600">{country.averageFees}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-500 uppercase tracking-wide">Duration</div>
                        <div className="font-semibold">{country.duration}</div>
                      </div>
                    </div>
                    
                    {/* CTA */}
                    <div className="pt-4">
                      <Link href={`/countries/${country.slug}`}>
                        <Button className="w-full group-hover:bg-blue-700">
                          Learn More About {country.name}
                        </Button>
                      </Link>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Study Abroad Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Study MBBS Abroad?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Discover the advantages of pursuing medical education internationally
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                💰
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Affordable Fees</h3>
              <p className="text-gray-600 text-sm">
                Much lower tuition fees compared to private medical colleges in India
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                🏆
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Quality Education</h3>
              <p className="text-gray-600 text-sm">
                WHO and MCI approved universities with modern facilities
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                🌍
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Global Recognition</h3>
              <p className="text-gray-600 text-sm">
                Degrees recognized worldwide for practice and higher studies
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                📚
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">English Medium</h3>
              <p className="text-gray-600 text-sm">
                Courses taught in English with experienced international faculty
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Choose Your Destination?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Get personalized guidance on selecting the best country for your medical education
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Get Free Consultation
              </Button>
            </Link>
            <Link href="/universities">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Explore Universities
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}