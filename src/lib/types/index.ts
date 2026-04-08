export interface Country {
  id: string;
  slug: string;
  name: string;
  description: string;
  image: string;
  flag: string;
  features: string[];
  universities: number;
  averageFees: string;
  duration: string;
  eligibility: string[];
}

export interface University {
  id: string;
  slug: string;
  name: string;
  country: string;
  countrySlug: string;
  description: string;
  image: string;
  location: string;
  established: number;
  ranking: string;
  fees: string;
  duration: string;
  eligibility: string[];
  facilities: string[];
  admissionProcess: string[];
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  image: string;
  author: string;
  date: string;
  category: string;
  readTime: string;
  tags: string[];
}

export interface MenuItem {
  href: string;
  label: string;
  children?: MenuItem[];
}