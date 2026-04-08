import { University } from '../types';

export const universities: University[] = [
  {
    id: '1',
    slug: 'first-moscow-state-medical-university',
    name: 'First Moscow State Medical University',
    country: 'Russia',
    countrySlug: 'russia',
    description: 'One of the oldest and most prestigious medical universities in Russia, offering world-class medical education since 1758.',
    image: '/images/universities/first-moscow.jpg',
    location: 'Moscow, Russia',
    established: 1758,
    ranking: 'Top 5 in Russia',
    fees: '$6,000/year',
    duration: '6 years',
    eligibility: [
      'Minimum 50% in Physics, Chemistry, Biology',
      'NEET Qualification Required',
      'Valid Passport',
      'Medical Certificate'
    ],
    facilities: [
      'Modern Laboratories',
      'Well-equipped Hospital',
      'Library with 1M+ books',
      'Student Hostels',
      'Sports Complex'
    ],
    admissionProcess: [
      'Submit Application Online',
      'Document Verification',
      'Admission Letter',
      'Visa Processing',
      'Travel to Russia'
    ]
  },
  {
    id: '2',
    slug: 'kazan-federal-university',
    name: 'Kazan Federal University',
    country: 'Russia',
    countrySlug: 'russia',
    description: 'A leading federal university with excellent medical programs and modern research facilities.',
    image: '/images/universities/kazan-federal.jpg',
    location: 'Kazan, Russia',
    established: 1804,
    ranking: 'Top 10 in Russia',
    fees: '$4,500/year',
    duration: '6 years',
    eligibility: [
      'Minimum 50% in Science Stream',
      'NEET Qualified',
      'Age: 17-25 years'
    ],
    facilities: [
      'Research Centers',
      'Digital Libraries',
      'Medical Simulation Labs',
      'International Student Support',
      'Cultural Centers'
    ],
    admissionProcess: [
      'Online Application',
      'Document Submission',
      'Admission Confirmation',
      'Visa Application',
      'Arrival in Russia'
    ]
  },
  {
    id: '3',
    slug: 'kharkiv-national-medical-university',
    name: 'Kharkiv National Medical University',
    country: 'Ukraine',
    countrySlug: 'ukraine',
    description: 'One of the oldest medical universities in Ukraine, known for its excellent medical education and research.',
    image: '/images/universities/kharkiv-medical.jpg',
    location: 'Kharkiv, Ukraine',
    established: 1805,
    ranking: 'Top 3 in Ukraine',
    fees: '$4,000/year',
    duration: '6 years',
    eligibility: [
      'Minimum 50% in PCB',
      'NEET Qualification',
      'Valid Documents'
    ],
    facilities: [
      'Advanced Medical Equipment',
      'Research Laboratories',
      'Clinical Practice Centers',
      'Student Accommodation',
      'Sports Facilities'
    ],
    admissionProcess: [
      'Application Submission',
      'Document Verification',
      'Invitation Letter',
      'Visa Processing',
      'Travel & Registration'
    ]
  },
  {
    id: '4',
    slug: 'tbilisi-state-medical-university',
    name: 'Tbilisi State Medical University',
    country: 'Georgia',
    countrySlug: 'georgia',
    description: 'The leading medical university in Georgia, offering comprehensive medical education with international standards.',
    image: '/images/universities/tbilisi-medical.jpg',
    location: 'Tbilisi, Georgia',
    established: 1918,
    ranking: 'Top Medical University in Georgia',
    fees: '$6,000/year',
    duration: '6 years',
    eligibility: [
      'Minimum 50% in Science Stream',
      'NEET Qualified',
      'Medical Fitness Certificate'
    ],
    facilities: [
      'State-of-the-art Campus',
      'Modern Simulation Labs',
      'Research Centers',
      'International Library',
      'Student Services'
    ],
    admissionProcess: [
      'Online Registration',
      'Document Evaluation',
      'Admission Letter',
      'Visa Application',
      'Arrival & Orientation'
    ]
  },
  {
    id: '5',
    slug: 'kazakh-national-medical-university',
    name: 'Kazakh National Medical University',
    country: 'Kazakhstan',
    countrySlug: 'kazakhstan',
    description: 'Premier medical university in Kazakhstan offering world-class medical education with modern facilities.',
    image: '/images/universities/kazakh-medical.jpg',
    location: 'Almaty, Kazakhstan',
    established: 1931,
    ranking: 'Top Medical University in Kazakhstan',
    fees: '$5,000/year',
    duration: '6 years',
    eligibility: [
      'Minimum 50% in Physics, Chemistry, Biology',
      'NEET Qualification Mandatory',
      'Age: 17-25 years'
    ],
    facilities: [
      'Modern Medical Equipment',
      'Research Laboratories',
      'Clinical Training Centers',
      'Digital Library',
      'Student Housing'
    ],
    admissionProcess: [
      'Application Form Submission',
      'Document Verification',
      'Admission Confirmation',
      'Student Visa',
      'Travel & Enrollment'
    ]
  }
];