import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Button } from '@/components/ui';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';
import { universities } from '@/lib/data';

type Props = {
  params: { slug: string };
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const university = universities.find((u) => u.slug === params.slug);
  
  if (!university) {
    return {
      title: 'University Not Found',
    };
  }

  return {
    title: `${university.name} - MBBS Admission`,
    description: `Study MBBS at ${university.name} in ${university.country}. ${university.description} Get complete admission details, fees, and eligibility.`,
  };
}

export async function generateStaticParams() {
  return universities.map((university) => ({
    slug: university.slug,
  }));
}

export default function UniversityDetailPage({ params }: Props) {
  const university = universities.find((u) => u.slug === params.slug);
  
  if (!university) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="text-blue-200 mb-2">{university.country}</div>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                {university.name}
              </h1>
              <p className="text-xl text-blue-100 mb-6">
                {university.description}
              </p>
              <div className="flex flex-wrap gap-4">
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  📍 {university.location}
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  🏛️ Est. {university.established}
                </div>
                <div className="bg-white/20 px-4 py-2 rounded-lg">
                  🏆 {university.ranking}
                </div>
              </div>
            </div>
            <Card className="bg-white/10 border-white/20 text-white">
              <CardHeader>
                <CardTitle className="text-white">Quick Facts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <div className="text-blue-200 text-sm">Annual Fees</div>
                    <div className="text-2xl font-bold">{university.fees}</div>
                  </div>
                  <div>
                    <div className="text-blue-200 text-sm">Duration</div>
                    <div className="text-2xl font-bold">{university.duration}</div>
                  </div>
                  <div className="col-span-2">
                    <Link href="/contact">
                      <Button className="w-full bg-white text-blue-600 hover:bg-gray-100">
                        Apply Now
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Key Information */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Eligibility */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  📋 Eligibility Criteria
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {university.eligibility.map((criteria, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-green-500 mr-2 mt-1">✓</span>
                      <span className="text-gray-700 text-sm">{criteria}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Facilities */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  🏢 Facilities
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-3">
                  {university.facilities.map((facility, index) => (
                    <li key={index} className="flex items-start">
                      <span className="text-blue-500 mr-2 mt-1">•</span>
                      <span className="text-gray-700 text-sm">{facility}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Admission Process */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  📝 Admission Process
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ol className="space-y-3">
                  {university.admissionProcess.map((step, index) => (
                    <li key={index} className="flex items-start">
                      <span className="bg-blue-100 text-blue-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5 flex-shrink-0">
                        {index + 1}
                      </span>
                      <span className="text-gray-700 text-sm">{step}</span>
                    </li>
                  ))}
                </ol>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Detailed Information */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            
            {/* About University */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                About {university.name}
              </h2>
              <div className="prose text-gray-600 space-y-4">
                <p>
                  {university.name} is one of the premier medical institutions in {university.country}, 
                  established in {university.established}. The university has built a strong reputation 
                  for excellence in medical education and research.
                </p>
                <p>
                  Located in {university.location}, the university offers world-class medical education 
                  with modern facilities and experienced faculty. The curriculum is designed to meet 
                  international standards while maintaining affordability.
                </p>
                <p>
                  With a ranking of {university.ranking}, the university attracts students from around 
                  the world who seek quality medical education at an affordable cost.
                </p>
              </div>
            </div>

            {/* Why Choose This University */}
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-6">
                Why Choose This University?
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    🎓
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Quality Education</h3>
                    <p className="text-gray-600 text-sm">
                      WHO approved curriculum with experienced international faculty
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    💰
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Affordable Fees</h3>
                    <p className="text-gray-600 text-sm">
                      Competitive tuition fees with no hidden costs or donations
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    🌍
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Global Recognition</h3>
                    <p className="text-gray-600 text-sm">
                      Degrees recognized worldwide for practice and higher studies
                    </p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mr-4 flex-shrink-0">
                    🏥
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-1">Practical Training</h3>
                    <p className="text-gray-600 text-sm">
                      Extensive clinical training in affiliated hospitals
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Fee Structure */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Fee Structure & Expenses
            </h2>
            <p className="text-lg text-gray-600">
              Transparent fee structure without any hidden charges
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-blue-600">Tuition Fee</CardTitle>
                <div className="text-3xl font-bold text-center">{university.fees}</div>
                <CardDescription className="text-center">Per Year</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Complete academic year</li>
                  <li>✓ Library access</li>
                  <li>✓ Laboratory usage</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-green-600">Accommodation</CardTitle>
                <div className="text-3xl font-bold text-center">$1,200</div>
                <CardDescription className="text-center">Per Year</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ University hostel</li>
                  <li>✓ Shared rooms</li>
                  <li>✓ Basic amenities</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-center text-purple-600">Living Expenses</CardTitle>
                <div className="text-3xl font-bold text-center">$150</div>
                <CardDescription className="text-center">Per Month</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>✓ Food & meals</li>
                  <li>✓ Transportation</li>
                  <li>✓ Personal expenses</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ready to Apply to {university.name}?
          </h2>
          <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
            Start your application process today with our expert guidance and support
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                Start Application Process
              </Button>
            </Link>
            <Link href="/universities">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                Compare Universities
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}