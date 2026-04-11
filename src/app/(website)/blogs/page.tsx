import { Metadata } from 'next';
import Link from 'next/link';
import { getBlogs, getBlogCategories } from '@/lib/blogs';
import { EmptyState } from '@/components/ui/EmptyState';

export const metadata: Metadata = {
  title: 'Blog - MBBS Abroad Insights',
  description: 'Read the latest articles from AMW Career Point about MBBS abroad, university guides, admission tips, and student experiences.',
};

/* eslint-disable @typescript-eslint/no-explicit-any */
export default async function BlogPage() {
  let blogPosts: any[] = [];
  let categories: string[] = [];
  try {
    const res = await getBlogs({ limit: 50 });
    blogPosts = Array.isArray(res.data) ? res.data : [];
  } catch { /* API unavailable */ }
  try {
    const catRes = await getBlogCategories();
    const catData = Array.isArray(catRes.data) ? catRes.data : catRes || [];
    categories = Array.isArray(catData) ? catData.map((c: any) => c.name || c) : [];
  } catch { /* no categories */ }

  const featured = blogPosts[0] || null;
  const rest = blogPosts.slice(1);

  return (
    <div className="bg-white">
      {/* ── Hero ── */}
      <section className="bg-[#0D1B3E] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-3">
            Resources
          </span>
          <h1 className="font-heading text-[1.75rem] sm:text-[2.1rem] lg:text-[2.65rem] font-bold leading-[1.15] text-white mb-3">
            MBBS <span className="text-[#F26419]">Knowledge Hub</span>
          </h1>
          <p className="text-[14px] sm:text-[15px] text-blue-100 max-w-2xl mx-auto">
            Expert guides, country-specific MBBS tips, NEET strategies and success stories — updated every week.
          </p>
        </div>
      </section>

      {/* ── Category Pills ── */}
      {categories.length > 0 && (
        <section className="bg-[#F9F8F6] border-b border-[#DDD9D2] py-4">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap justify-center gap-2">
              <span className="inline-flex items-center rounded-full bg-[#0D1B3E] px-3 py-1.5 text-[12px] font-semibold text-white">
                All Posts ({blogPosts.length})
              </span>
              {categories.slice(0, 10).map((cat) => (
                <span key={cat} className="inline-flex items-center rounded-full border border-[#DDD9D2] bg-white px-3 py-1.5 text-[12px] font-medium text-[#4A4742] hover:border-[#F26419] hover:text-[#F26419] transition-colors cursor-pointer">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Featured Post ── */}
      {featured && (
        <section className="bg-white py-10 sm:py-14">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-6 sm:mb-8">
              <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">Featured</span>
              <h2 className="font-heading text-2xl sm:text-3xl font-bold text-[#0D1B3E]">Latest Article</h2>
            </div>

            <Link
              href={`/blogs/${featured.slug}`}
              className="group block rounded-xl border border-[#DDD9D2] bg-white overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="grid grid-cols-1 lg:grid-cols-2">
                {/* Image */}
                <div className="relative h-[240px] lg:h-auto overflow-hidden bg-gradient-to-br from-[#F9F8F6] to-[#DDD9D2]">
                  {featured.coverImage ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img src={featured.coverImage} alt={featured.title || 'Featured article'} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-5xl">📚</div>
                  )}
                </div>

                {/* Content */}
                <div className="p-5 sm:p-8 flex flex-col justify-center">
                  <div className="flex items-center gap-3 text-[12px] text-[#4A4742] mb-3">
                    <span className="rounded-full bg-[#F26419]/10 text-[#F26419] px-2.5 py-0.5 font-semibold uppercase tracking-wide">
                      {featured.category?.name || featured.category || 'Blog'}
                    </span>
                    {featured.createdAt && (
                      <span>{new Date(featured.createdAt).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}</span>
                    )}
                  </div>
                  <h3 className="font-heading text-xl sm:text-2xl font-bold text-[#0D1B3E] mb-2 line-clamp-2 group-hover:text-[#F26419] transition-colors">
                    {featured.title || 'Untitled Article'}
                  </h3>
                  <p className="text-[14px] text-[#4A4742] leading-relaxed line-clamp-3 mb-4">
                    {featured.excerpt || 'Read more to discover insights about studying MBBS abroad.'}
                  </p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#F9F8F6] flex items-center justify-center text-sm">👩‍⚕️</div>
                      <span className="text-[13px] font-medium text-[#0D1B3E] truncate max-w-[150px]">{featured.author || 'AMW Team'}</span>
                    </div>
                    <span className="inline-flex items-center gap-1 text-[13px] font-bold text-[#F26419] group-hover:gap-2 transition-all">
                      Read Article <span aria-hidden="true">→</span>
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ── All Posts Grid ── */}
      <section className="bg-[#F9F8F6] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <span className="inline-block text-xs font-semibold text-[#F26419] uppercase tracking-wider mb-2">All Articles</span>
            <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E]">
              Latest Articles
            </h2>
            <p className="mt-3 text-[15px] text-[#4A4742] max-w-2xl mx-auto">
              Stay updated with the latest news and insights about MBBS abroad.
            </p>
          </div>

          {rest.length === 0 ? (
            <EmptyState icon="📝" title="No articles yet" description="Check back soon for the latest insights about MBBS abroad." />
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {rest.map((post: any) => (
                <Link
                  key={post._id || post.slug}
                  href={`/blogs/${post.slug}`}
                  className="group block rounded-xl border border-[#DDD9D2] bg-white overflow-hidden hover:shadow-md transition-shadow h-full flex flex-col"
                >
                  {/* Image */}
                  <div className="relative h-44 sm:h-48 overflow-hidden bg-[#F9F8F6]">
                    {post.coverImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={post.coverImage} alt={post.title || 'Blog post'} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-3xl bg-gradient-to-br from-[#F9F8F6] to-[#DDD9D2]">📝</div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-4 flex flex-col flex-1">
                    <div className="flex items-center gap-2 text-[11px] text-[#4A4742] mb-2">
                      <span className="rounded-full bg-[#F26419]/10 text-[#F26419] px-2 py-0.5 font-semibold uppercase tracking-wide">
                        {post.category?.name || post.category || 'Blog'}
                      </span>
                      {post.createdAt && (
                        <span>{new Date(post.createdAt).toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</span>
                      )}
                    </div>

                    <h3 className="font-heading text-[15px] font-bold text-[#0D1B3E] leading-snug line-clamp-2 mb-1.5 group-hover:text-[#F26419] transition-colors">
                      {post.title || 'Untitled Post'}
                    </h3>

                    <p className="text-[13px] text-[#4A4742] leading-relaxed line-clamp-2 mb-3">
                      {post.excerpt || 'Read more to learn about this topic.'}
                    </p>

                    {/* Tags */}
                    {post.tags && post.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mb-3">
                        {post.tags.slice(0, 2).map((tag: string) => (
                          <span key={tag} className="text-[10px] bg-[#F9F8F6] text-[#4A4742] px-2 py-0.5 rounded-full truncate max-w-[100px]">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {/* Footer */}
                    <div className="mt-auto flex items-center justify-between">
                      <span className="text-[12px] font-medium text-[#4A4742] truncate max-w-[120px]">{post.author || 'AMW Team'}</span>
                      <span className="inline-flex items-center gap-1 text-[13px] font-bold text-[#F26419] group-hover:gap-2 transition-all">
                        Read <span aria-hidden="true">→</span>
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-[#0D1B3E] py-10 sm:py-14 text-center text-white">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-3">
          <h2 className="font-heading text-2xl sm:text-3xl font-bold">
            Stay Updated with MBBS Insights
          </h2>
          <p className="text-[14px] text-blue-100">
            Get the latest university guides, admission tips, and NEET strategies directly from our experts.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-10 sm:h-11 px-7 rounded-full bg-[#F26419] text-white text-[13px] sm:text-sm font-bold hover:bg-[#FF8040] transition-colors"
            >
              Get Free Consultation
            </Link>
            <Link
              href="/universities"
              className="inline-flex items-center justify-center h-10 sm:h-11 px-7 rounded-full border-2 border-white text-white text-[13px] sm:text-sm font-bold hover:bg-white hover:text-[#0D1B3E] transition-colors"
            >
              Explore Universities
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
