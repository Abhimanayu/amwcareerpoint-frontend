'use client';

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState, type ComponentType, type CSSProperties } from 'react';
import type { HomeCuratedBlog, HomeCuratedCountry, HomeCuratedUniversity } from '@/lib/homeSettings';

const LazyExperts = dynamic(() => import('./ExpertCounsellorsSection').then((module) => module.ExpertCounsellorsSection), { ssr: false });
const LazyUniversities = dynamic(() => import('./UniversitiesSection').then((module) => module.UniversitiesSection), { ssr: false });
const LazyCountries = dynamic(() => import('./CountriesSection').then((module) => module.CountriesSection), { ssr: false });
const LazyReviews = dynamic(() => import('./ReviewsSection').then((module) => module.ReviewsSection), { ssr: false });
const LazyVideos = dynamic(() => import('./VideosSection').then((module) => module.VideosSection), { ssr: false });
const LazyBlogs = dynamic(() => import('./BlogsSection').then((module) => module.BlogsSection), { ssr: false });

function ViewportSection<P extends object>({ component: Component, props, minHeight }: {
  component: ComponentType<P>;
  props: P;
  minHeight: CSSProperties['minHeight'];
}) {
  const markerRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const marker = markerRef.current;
    if (!marker || visible) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return;
      setVisible(true);
      observer.disconnect();
    }, { rootMargin: '700px 0px' });
    observer.observe(marker);
    return () => observer.disconnect();
  }, [visible]);

  return (
    <div ref={markerRef} className="home-deferred-section" style={visible ? undefined : { minHeight }}>
      {visible ? <Component {...props} /> : null}
    </div>
  );
}

export function LazyExpertsSection() {
  return <ViewportSection component={LazyExperts} props={{}} minHeight="620px" />;
}

export function LazyUniversitiesSection({ items }: { items: HomeCuratedUniversity[] }) {
  return <ViewportSection component={LazyUniversities} props={{ items }} minHeight="680px" />;
}

export function LazyCountriesSection({ items }: { items: HomeCuratedCountry[] }) {
  return <ViewportSection component={LazyCountries} props={{ items }} minHeight="650px" />;
}

export function LazyReviewsSection() {
  return <ViewportSection component={LazyReviews} props={{}} minHeight="700px" />;
}

export function LazyVideosSection() {
  return <ViewportSection component={LazyVideos} props={{}} minHeight="620px" />;
}

export function LazyBlogsSection({ items }: { items: HomeCuratedBlog[] }) {
  return <ViewportSection component={LazyBlogs} props={{ items }} minHeight="650px" />;
}
