import { Metadata } from 'next';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about AMW Career Point - Your trusted partner for MBBS abroad consultancy with 10+ years of experience in medical education.',
};

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            About AMW Career Point
          </h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl mx-auto">
            Your trusted partner in achieving your dream of becoming a doctor through quality medical education abroad
          </p>
        </div>
      </section>

      {/* About Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Our Story
              </h2>
              <div className="space-y-4 text-lg text-gray-600">
                <p>
                  Founded in 2014, AMW Career Point has been a pioneer in providing comprehensive consultancy services for students aspiring to pursue MBBS abroad. With over 10 years of experience, we have successfully guided thousands of students to achieve their dreams of becoming doctors.
                </p>
                <p>
                  Our journey began with a simple vision: to make quality medical education accessible and affordable for Indian students. Today, we are proud to be one of the most trusted names in medical education consultancy.
                </p>
                <p>
                  We understand that choosing the right university and country for your medical education is one of the most important decisions of your life. That's why we provide personalized guidance and support throughout your journey.
                </p>
              </div>
            </div>
            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Our Achievements</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">5000+</div>
                  <div className="text-gray-600">Students Placed</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-gray-600">Universities</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">15+</div>
                  <div className="text-gray-600">Countries</div>
                </div>
                <div className="text-center">
                  <div className="text-4xl font-bold text-blue-600 mb-2">98%</div>
                  <div className="text-gray-600">Success Rate</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Values
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              The principles that guide us in helping students achieve their medical education goals
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card>
              <CardHeader>
                <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">🎯</span>
                </div>
                <CardTitle className="text-center">Excellence</CardTitle>
                <CardDescription className="text-center">
                  We strive for excellence in every aspect of our service delivery
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">
                  From university selection to visa processing, we maintain the highest standards to ensure your success.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">🤝</span>
                </div>
                <CardTitle className="text-center">Integrity</CardTitle>
                <CardDescription className="text-center">
                  Transparency and honesty in all our interactions and processes
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">
                  We believe in building trust through transparent communication and ethical practices.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4 mx-auto">
                  <span className="text-2xl">💡</span>
                </div>
                <CardTitle className="text-center">Innovation</CardTitle>
                <CardDescription className="text-center">
                  Continuously improving our services with innovative solutions
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 text-center">
                  We leverage technology and innovative approaches to make your journey smoother and more efficient.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Our Expert Team
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Meet the experienced professionals who will guide you through your medical education journey
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">👨‍⚕️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Dr. Rajesh Kumar</h3>
              <p className="text-gray-600 mb-2">Founder & CEO</p>
              <p className="text-sm text-gray-500">
                MBBS, MD - 15 years experience in medical education consultancy
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">👩‍💼</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Ms. Priya Sharma</h3>
              <p className="text-gray-600 mb-2">Head of Admissions</p>
              <p className="text-sm text-gray-500">
                MBA - 12 years experience in international admissions
              </p>
            </div>

            <div className="text-center">
              <div className="w-32 h-32 bg-gray-200 rounded-full mx-auto mb-4 flex items-center justify-center">
                <span className="text-4xl">👨‍💻</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Mr. Amit Patel</h3>
              <p className="text-gray-600 mb-2">Visa Consultant</p>
              <p className="text-sm text-gray-500">
                LLB - 10 years experience in visa processing and documentation
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Our Mission
          </h2>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
            To bridge the gap between aspiring medical students and world-class medical education by providing expert guidance, comprehensive support, and personalized solutions that ensure success in their medical career journey.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <div>
              <h3 className="text-xl font-semibold mb-2">Student-Centric Approach</h3>
              <p className="text-blue-100">
                Every decision we make is focused on what's best for our students' future
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Quality Partnerships</h3>
              <p className="text-blue-100">
                We partner only with accredited, WHO-approved medical universities
              </p>
            </div>
            <div>
              <h3 className="text-xl font-semibold mb-2">Long-term Support</h3>
              <p className="text-blue-100">
                Our relationship continues throughout your academic journey and beyond
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}