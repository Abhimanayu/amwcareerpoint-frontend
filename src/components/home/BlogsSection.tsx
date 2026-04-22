'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Carousel } from '@/components/ui/Carousel';
import { getBlogs } from '@/lib/blogs';
import { SafeImage } from '@/components/ui/SafeImage';
import { extractCollectionData, formatDate, pickBlogImageSource } from '@/lib/utils';

/* eslint-disable @typescript-eslint/no-explicit-any */

const fallbackBlogs = [
  { title: 'MBBS in Georgia vs MBBS in India: Which is Better for You?', category: 'MBBS ABROAD', readTime: '8 min read', date: 'March 2025', slug: 'mbbs-in-georgia-vs-mbbs-in-india-which-is-better-for-you', image: '/blogs/mbbs-georgia-vs-india.jpg', excerpt: 'Choosing where to pursue your MBBS is one of the most important decisions of your life...' },
  { title: 'MBBS in France 2026: Complete Guide for Indian Students', category: 'MBBS ABROAD', readTime: '8 min read', date: 'February 2025', slug: 'mbbs-in-france-2026-complete-guide-for-indian-students', image: '/blogs/mbbs-france-2026.jpg', excerpt: 'Everything you need to know about studying MBBS in France...' },
  { title: 'NEET Cutoff for MBBS Abroad 2025 — Country-wise Complete List', category: 'NEET GUIDE', readTime: '5 min read', date: 'December 2024', slug: 'neet-cutoff-mbbs-abroad-2025', image: '/blogs/neet-cutoff-2025.jpg', excerpt: 'Complete country-wise NEET cutoff list for MBBS abroad admissions...' },
];

export function BlogsSection() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    getBlogs({ limit: 6 })
      .then((res) => {
        const items = extractCollectionData<any>(res, ['blogs']);
        if (items.length > 0) setBlogs(items);
      })
      .catch(() => {})
      .finally(() => setLoaded(true));
  }, []);

  const useFallback = loaded && blogs.length === 0;

  if (!loaded) return null;
  return (
    <section className="py-16 sm:py-20 bg-bg-light">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-10 sm:mb-12">
          <span className="inline-block text-xs font-bold tracking-[0.15em] uppercase text-orange bg-orange/10 px-3 py-1 rounded-full mb-4">
            Resources
          </span>
          <h2 className="text-3xl sm:text-4xl font-heading font-bold text-[#0D1B3E] mb-3">
            MBBS <span className="text-orange">Knowledge Hub</span>
          </h2>
          <p className="text-text-body max-w-xl leading-relaxed">
            Expert guides, country-specific MBBS tips, NEET strategies and success stories — updated every week.
          </p>
        </div>

        {/* Blog Carousel */}
        <div className="px-4 sm:px-5">
          <Carousel slideClass="basis-full sm:basis-1/2 lg:basis-1/3 pl-4 sm:pl-5">
            {(useFallback ? fallbackBlogs : blogs).map((blog: any) => {
              const imageSource = useFallback ? (blog.image || '/blogs/russia-universities-nmc.jpg') : (pickBlogImageSource(blog) || '/blogs/russia-universities-nmc.jpg');

              return (
              <Link
                key={blog.slug || blog._id}
                href={`/blogs/${blog.slug}`}
                className="block rounded-xl border border-border bg-white overflow-hidden hover:shadow-lg transition-shadow group h-full"
              >
                {/* Image */}
                <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
                  <SafeImage
                    src={imageSource}
                    alt={blog.title || 'Blog post'}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                    fallbackSrc="/blogs/russia-universities-nmc.jpg"
                    fallbackElement={<div className="absolute inset-0 flex items-center justify-center text-3xl bg-linear-to-br from-bg-light to-border">📝</div>}
                  />
                </div>

                {/* Content */}
                <div className="p-4 sm:p-5">
                  <span className="text-xs font-bold tracking-widest uppercase text-orange truncate">
                    {blog.category?.name || blog.category || 'Blog'}
                  </span>

                  <h3 className="mt-2 text-base sm:text-lg font-bold text-[#0D1B3E] leading-snug line-clamp-2 group-hover:text-orange transition-colors">
                    {blog.title || 'Untitled Post'}
                  </h3>

                  <p className="mt-2 text-sm text-text-body/70 line-clamp-2">
                    {blog.excerpt || 'Read more to learn about this topic.'}
                  </p>

                  <div className="mt-3 flex items-center gap-2 text-xs text-text-body/60">
                    {blog.readTime && <span>• {blog.readTime}</span>}
                    <span>· {blog.createdAt ? formatDate(blog.createdAt, 'en-US', { month: 'long', year: 'numeric' }) : blog.date || ''}</span>
                  </div>

                  <span className="mt-3 inline-flex items-center gap-1 text-sm font-semibold text-orange group-hover:gap-2 transition-all">
                    Read article <span aria-hidden="true">→</span>
                  </span>
                </div>
              </Link>
              );
            })}
          </Carousel>
        </div>

        {/* View All CTA */}
        <div className="text-center mt-10">
          <Link
            href="/blogs"
            className="inline-flex items-center gap-2 bg-orange text-white px-8 py-3.5 rounded-lg font-semibold hover:bg-orange/90 transition-colors shadow-md hover:shadow-lg"
          >
            View All Articles →
          </Link>
        </div>
      </div>
    </section>
  );
}