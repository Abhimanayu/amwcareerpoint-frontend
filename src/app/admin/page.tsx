'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import AdminLayout from '@/components/admin/AdminLayout';
import { adminGetCountries } from '@/lib/countries';
import { adminGetUniversities } from '@/lib/universities';
import { getEnquiries } from '@/lib/enquiries';
import { adminGetBlogs } from '@/lib/blogs';
import { adminGetFaqs } from '@/lib/faqs';

interface StatCard {
  label: string;
  value: number;
  href: string;
  color: string;
  icon: string;
}

export default function AdminDashboard() {
  const [stats, setStats] = useState<StatCard[]>([]);
  const [recentEnquiries, setRecentEnquiries] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [countries, universities, enquiries, blogs, faqs] = await Promise.allSettled([
          adminGetCountries({ limit: 1 }),
          adminGetUniversities({ limit: 1 }),
          getEnquiries({ limit: 5, sort: '-createdAt' }),
          adminGetBlogs({ limit: 1 }),
          adminGetFaqs({ limit: 1 }),
        ]);

        const getTotal = (r: PromiseSettledResult<Record<string, unknown>>) => {
          if (r.status !== 'fulfilled') return 0;
          const v = r.value as Record<string, unknown>;
          // Support many backend response shapes:
          // { total }, { count }, { totalCount }
          // { data: { total } }, { data: { count } }
          // { pagination: { total } }, { data: { pagination: { total } } }
          // { data: { data: [...], pagination: { total } } }
          const pickTotal = (obj: Record<string, unknown> | undefined): number | null => {
            if (!obj) return null;
            if (typeof obj.total === 'number') return obj.total;
            if (typeof obj.totalCount === 'number') return obj.totalCount;
            if (typeof obj.count === 'number') return obj.count;
            const p = obj.pagination as Record<string, unknown> | undefined;
            if (typeof p?.total === 'number') return p.total;
            if (typeof p?.totalCount === 'number') return p.totalCount;
            return null;
          };
          // Try top-level
          const t1 = pickTotal(v);
          if (t1 !== null) return t1;
          // Try v.data
          const d = v?.data as Record<string, unknown> | unknown[] | undefined;
          if (Array.isArray(d)) return d.length;
          const t2 = pickTotal(d as Record<string, unknown>);
          if (t2 !== null) return t2;
          // Try v.data.data (double nested)
          const dd = (d as Record<string, unknown>)?.data;
          if (Array.isArray(dd)) return (pickTotal(d as Record<string, unknown>) ?? dd.length);
          return 0;
        };

        setStats([
          { label: 'Countries', value: getTotal(countries), href: '/admin/countries', color: 'bg-blue-500', icon: 'M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { label: 'Universities', value: getTotal(universities), href: '/admin/universities', color: 'bg-purple-500', icon: 'M12 14l9-5-9-5-9 5 9 5z M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z' },
          { label: 'Enquiries', value: getTotal(enquiries), href: '/admin/enquiries', color: 'bg-green-500', icon: 'M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z' },
          { label: 'Blogs', value: getTotal(blogs), href: '/admin/blogs', color: 'bg-pink-500', icon: 'M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z' },
          { label: 'FAQs', value: getTotal(faqs), href: '/admin/faqs', color: 'bg-amber-500', icon: 'M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
        ]);

        if (enquiries.status === 'fulfilled') {
          const v = enquiries.value as Record<string, unknown>;
          const d = v?.data as Record<string, unknown> | unknown[];
          const list = Array.isArray(d) ? d : (d as Record<string, unknown>)?.enquiries ?? (d as Record<string, unknown>)?.data ?? [];
          setRecentEnquiries((Array.isArray(list) ? list : []) as Record<string, unknown>[]);
        }
      } catch {
        // silent
      }
      setLoading(false);
    };
    load();
  }, []);

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
            <p className="text-sm text-gray-500 mt-0.5">Welcome back! Here&apos;s an overview of your data.</p>
          </div>
          <Link href="/" target="_blank" className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-[#F26419] border border-[#F26419]/30 rounded-xl hover:bg-[#F26419]/5 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 003 8.25v10.5A2.25 2.25 0 005.25 21h10.5A2.25 2.25 0 0018 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" /></svg>
            View Website
          </Link>
        </div>

        {/* Stat cards */}
        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-5 animate-pulse">
                <div className="h-4 w-16 bg-gray-200 rounded mb-3" />
                <div className="h-8 w-12 bg-gray-200 rounded" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            {stats.map((s) => (
              <Link key={s.label} href={s.href} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow group">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-sm text-gray-500 font-medium">{s.label}</span>
                  <div className={`w-9 h-9 rounded-lg ${s.color}/10 flex items-center justify-center`}>
                    <svg className={`w-5 h-5 ${s.color.replace('bg-', 'text-')}`} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d={s.icon} />
                    </svg>
                  </div>
                </div>
                <div className="text-3xl font-bold text-gray-900">{s.value}</div>
              </Link>
            ))}
          </div>
        )}

        {/* Recent enquiries */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-4 border-b border-gray-200 flex items-center justify-between">
            <h2 className="font-semibold text-gray-900">Recent Enquiries</h2>
            <Link href="/admin/enquiries" className="text-sm text-[#F26419] hover:underline">View all →</Link>
          </div>
          {recentEnquiries.length > 0 ? (
            <div className="divide-y divide-gray-100">
              {recentEnquiries.map((enq, i) => (
                <div key={i} className="px-4 py-3 flex items-center gap-4">
                  <div className="w-9 h-9 rounded-full bg-[#F26419]/10 flex items-center justify-center text-[#F26419] text-sm font-bold shrink-0">
                    {(enq.name as string)?.charAt(0) || '?'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-medium text-gray-900 truncate">{enq.name as string}</div>
                    <div className="text-xs text-gray-500 truncate">{enq.email as string} • {enq.phone as string}</div>
                  </div>
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                    enq.status === 'new' ? 'bg-blue-100 text-blue-700' :
                    enq.status === 'contacted' ? 'bg-yellow-100 text-yellow-700' :
                    enq.status === 'converted' ? 'bg-green-100 text-green-700' :
                    'bg-gray-100 text-gray-600'
                  }`}>{enq.status as string}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-8 text-center text-sm text-gray-400">No recent enquiries</div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="bg-white rounded-xl border border-gray-200 p-4">
          <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {[
              { label: 'Add Country', href: '/admin/countries/new', icon: '🌍' },
              { label: 'Add University', href: '/admin/universities/new', icon: '🏛️' },
              { label: 'Add Blog Post', href: '/admin/blogs/new', icon: '📝' },
              { label: 'Add FAQ', href: '/admin/faqs/new', icon: '❓' },
            ].map((action) => (
              <Link key={action.href} href={action.href} className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-gray-200 hover:border-[#F26419]/40 hover:bg-[#F26419]/5 transition-colors group">
                <span className="text-lg">{action.icon}</span>
                <span className="text-sm font-medium text-gray-700 group-hover:text-[#F26419]">{action.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
