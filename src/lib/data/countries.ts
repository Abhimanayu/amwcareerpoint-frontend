import { Country } from '../types';

export const countries: Country[] = [
  {
    id: '1',
    slug: 'russia',
    name: 'Russia',
    description: 'Russia offers world-class medical education with globally recognized degrees at affordable costs. Russian medical universities are WHO and MCI approved.',
    image: '/images/countries/russia.jpg',
    flag: '🇷🇺',
    features: [
      'WHO & MCI Approved Universities',
      'No Entrance Exam Required',
      'Affordable Tuition Fees',
      'English Medium Courses',
      'Global Recognition'
    ],
    universities: 45,
    averageFees: '$4,000 - $6,000/year',
    duration: '6 years',
    eligibility: [
      'Minimum 50% in Physics, Chemistry, Biology',
      'NEET Qualification Required',
      'Age: 17-25 years'
    ]
  },
  {
    id: '2',
    slug: 'ukraine',
    name: 'Ukraine',
    description: 'Ukraine provides excellent medical education with modern facilities and experienced faculty. Ukrainian medical degrees are recognized worldwide.',
    image: '/images/countries/ukraine.jpg',
    flag: '🇺🇦',
    features: [
      'European Standard Education',
      'Modern Infrastructure',
      'Reasonable Living Costs',
      'Cultural Diversity',
      'Easy Admission Process'
    ],
    universities: 25,
    averageFees: '$3,500 - $5,500/year',
    duration: '6 years',
    eligibility: [
      'Minimum 50% in PCB',
      'NEET Qualification',
      'Valid Passport'
    ]
  },
  {
    id: '3',
    slug: 'georgia',
    name: 'Georgia',
    description: 'Georgia offers high-quality medical education in a safe and student-friendly environment with beautiful landscapes and rich culture.',
    image: '/images/countries/georgia.jpg',
    flag: '🇬🇪',
    features: [
      'Safe & Peaceful Environment',
      'Beautiful Climate',
      'Quality Education',
      'Affordable Living',
      'Cultural Heritage'
    ],
    universities: 12,
    averageFees: '$5,000 - $8,000/year',
    duration: '6 years',
    eligibility: [
      'Minimum 50% in Science Stream',
      'NEET Qualified',
      'Age Limit: 17-25 years'
    ]
  },
  {
    id: '4',
    slug: 'kazakhstan',
    name: 'Kazakhstan',
    description: 'Kazakhstan provides excellent medical education with state-of-the-art facilities and is becoming increasingly popular among international students.',
    image: '/images/countries/kazakhstan.jpg',
    flag: '🇰🇿',
    features: [
      'Modern Medical Universities',
      'Affordable Education',
      'Safe Environment',
      'Quality Healthcare System',
      'Growing International Recognition'
    ],
    universities: 15,
    averageFees: '$4,500 - $6,500/year',
    duration: '5-6 years',
    eligibility: [
      'Minimum 50% in Physics, Chemistry, Biology',
      'NEET Qualification Mandatory',
      'Age: 17-25 years'
    ]
  }
];