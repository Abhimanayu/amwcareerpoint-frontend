import { Metadata } from 'next';
import Link from 'next/link';
import { Button } from '@/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { universities } from '@/lib/data';

export const metadata: Metadata = {
  title: 'Top Medical Universities Abroad',
  description: 'Explore top medical universities for MBBS abroad with AMW Career Point. Find WHO and MCI approved universities in Russia, Ukraine, Georgia, and more countries.',
};

export default function UniversitiesPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Top Medical Universities
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Discover WHO & MCI approved medical universities offering world-class education
          </p>
        </div>
      </section>

      {/* Filter Section */}
      <section className="py-8 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {universities.length} Universities Available
            </h2>
            <p className="text-gray-600">
              All universities are WHO approved and MCI recognized
            </p>
          </div>
        </div>
      </section>

      {/* Universities Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {universities.map((university) => (
              <Card key={university.id} className="group hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-sm text-blue-600 font-medium">{university.country}</div>
                    <div className="text-sm text-gray-500">Est. {university.established}</div>
                  </div>
                  <CardTitle className="text-xl group-hover:text-blue-600 transition-colors">
                    {university.name}
                  </CardTitle>
                  <CardDescription>
                    <span className="flex items-center text-gray-600">
                      📍 {university.location}
                    </span>
                  </CardDescription>
                </CardHeader>
                
                <CardContent>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                    {university.description}
                  </p>
                  
                  {/* Key Info Grid */}
                  <div className="grid grid-cols-2 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Ranking</div>
                      <div className="font-semibold text-sm">{university.ranking}</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Duration</div>
                      <div className="font-semibold text-sm">{university.duration}</div>
                    </div>
                    <div className="col-span-2">
                      <div className="text-xs text-gray-500 uppercase tracking-wide">Annual Fees</div>
                      <div className="font-bold text-lg text-blue-600">{university.fees}</div>
                    </div>
                  </div>
                  
                  {/* Facilities Preview */}
                  <div className="mb-4">
                    <div className="text-sm font-medium text-gray-900 mb-2">Key Facilities:</div>
                    <div className="text-xs text-gray-600">
                      {university.facilities.slice(0, 2).join(' • ')}
                      {university.facilities.length > 2 && ' & more...'}
                    </div>
                  </div>
                  
                  {/* CTA */}
                  <Link href={`/universities/${university.slug}`}>
                    <Button className="w-full group-hover:bg-blue-700">
                      View Details & Apply
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose These Universities */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Why Our Partner Universities?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We partner only with top-ranked, internationally accredited medical universities
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                🏆
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">WHO Approved</h3>
              <p className="text-gray-600 text-sm">
                All universities are approved by World Health Organization
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                ✅
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">MCI Recognition</h3>
              <p className="text-gray-600 text-sm">
                Degrees recognized by Medical Council of India (NMC)
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                🔬
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Modern Facilities</h3>
              <p className="text-gray-600 text-sm">
                State-of-the-art laboratories and research facilities
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                👨‍🏫
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Expert Faculty</h3>
              <p className="text-gray-600 text-sm">
                Experienced professors and international teaching staff
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* University Comparison */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Compare Universities
            </h2>
            <p className="text-lg text-gray-600">
              Quick comparison of our top universities
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full bg-white rounded-lg shadow-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    University
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Country
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Fees (Annual)
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {universities.slice(0, 5).map((university) => (
                  <tr key={university.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{university.name}</div>
                        <div className="text-sm text-gray-500">{university.location}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{university.country}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-blue-600">{university.fees}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{university.duration}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <Link href={`/universities/${university.slug}`}>
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Help Choosing the Right University?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Our expert consultants will help you find the perfect university based on your preferences and budget
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Get University Recommendations
              </Button>
            </Link>
            <Link href="/countries">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Explore by Country
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}