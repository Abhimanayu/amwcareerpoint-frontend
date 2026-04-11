import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogBySlug, getBlogs } from '@/lib/blogs';
import { sanitizeHtml } from '@/lib/utils';

type Props = {
  params: Promise<{ slug: string }>;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await getBlogBySlug(slug);
    const post = res.data || res;
    if (!post) return { title: 'Post Not Found' };
    const title = post.seo?.metaTitle || post.title;
    const description = post.seo?.metaDescription || post.excerpt;
    return {
      title,
      description,
      openGraph: { title, description, type: 'article', images: post.coverImage ? [{ url: post.coverImage }] : undefined },
    };
  } catch {
    return { title: 'Post Not Found' };
  }
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  let post: any = null;
  let relatedPosts: any[] = [];

  try {
    const res = await getBlogBySlug(slug);
    post = res.data || res;
  } catch { /* not found */ }

  if (!post) {
    notFound();
  }

  try {
    const allRes = await getBlogs({ limit: 10 });
    const allPosts = Array.isArray(allRes.data) ? allRes.data : [];
    const categoryName = post.category?.name || post.category;
    relatedPosts = allPosts
      .filter((p: any) => p._id !== post._id && (p.category?.name || p.category) === categoryName)
      .slice(0, 3);
  } catch { /* no related posts */ }

  const categoryName = post.category?.name || post.category || '';
  const postDate = post.createdAt
    ? new Date(post.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
    : '';
  const readTime = post.content ? `${Math.max(1, Math.ceil(post.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200))} min read` : '';

  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="bg-[#0D1B3E] py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Breadcrumb */}
          <nav className="flex flex-wrap items-center justify-center gap-2 text-[13px] text-white/60 mb-5">
            <Link href="/" className="hover:text-white transition-colors">Home</Link>
            <span>/</span>
            <Link href="/blogs" className="hover:text-white transition-colors">Blog</Link>
            <span>/</span>
            <span className="text-white/80 line-clamp-1 max-w-[200px]">{post.title || 'Article'}</span>
          </nav>

          {/* Category & Date */}
          <div className="flex flex-wrap items-center justify-center gap-3 mb-5">
            {categoryName && (
              <span className="inline-block bg-[#F26419] text-white text-xs font-semibold tracking-wider uppercase px-3 py-1 rounded-full">
                {categoryName}
              </span>
            )}
            {postDate && <span className="text-white/60 text-[13px]">{postDate}</span>}
            {readTime && (
              <>
                <span className="text-white/40">·</span>
                <span className="text-white/60 text-[13px]">{readTime}</span>
              </>
            )}
          </div>

          {/* Title */}
          <h1 className="font-heading text-[1.75rem] sm:text-[2.1rem] lg:text-[2.65rem] font-bold text-white leading-tight mb-5 break-words">
            {post.title || 'Untitled Article'}
          </h1>

          {/* Excerpt */}
          {post.excerpt && (
            <p className="text-[15px] text-white/70 max-w-2xl mx-auto mb-6 line-clamp-3">
              {post.excerpt}
            </p>
          )}

          {/* Author */}
          <div className="inline-flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#F26419]/20 flex items-center justify-center text-lg">
              👩‍⚕️
            </div>
            <div className="text-left">
              <div className="text-white text-[13px] font-semibold truncate max-w-[180px]">{post.author || 'AMW Team'}</div>
              <div className="text-white/50 text-xs">Medical Education Expert</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Cover Image ── */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        {post.coverImage ? (
          /* eslint-disable-next-line @next/next/no-img-element */
          <img
            src={post.coverImage}
            alt={post.title || 'Blog post'}
            className="w-full h-56 sm:h-72 md:h-96 object-cover rounded-xl border border-[#DDD9D2] shadow-sm"
          />
        ) : (
          <div className="w-full h-56 sm:h-72 md:h-96 bg-gradient-to-br from-[#F9F8F6] to-[#DDD9D2] rounded-xl flex items-center justify-center text-6xl">
            📝
          </div>
        )}
      </div>

      {/* ── Article Content ── */}
      <section className="py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="prose prose-lg max-w-none text-[#4A4742] leading-relaxed
              prose-headings:font-heading prose-headings:text-[#0D1B3E]
              prose-a:text-[#F26419] prose-a:no-underline hover:prose-a:underline
              prose-strong:text-[#0D1B3E]
              prose-img:rounded-xl prose-img:border prose-img:border-[#DDD9D2]"
            dangerouslySetInnerHTML={{ __html: sanitizeHtml((post.content || '').replace(/\n/g, '<br />')) }}
          />
        </div>
      </section>

      {/* ── Tags & Share ── */}
      <section className="border-t border-[#DDD9D2]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            {/* Tags */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[13px] font-semibold text-[#0D1B3E] mr-1">Tags:</span>
              {post.tags && Array.isArray(post.tags) && post.tags.length > 0 ? (
                post.tags.slice(0, 10).map((tag: string) => (
                  <span
                    key={tag}
                    className="bg-[#F9F8F6] text-[#4A4742] text-[13px] px-3 py-1 rounded-full border border-[#DDD9D2] truncate max-w-[150px]"
                  >
                    {tag}
                  </span>
                ))
              ) : (
                <span className="text-[13px] text-[#4A4742]/60">No tags</span>
              )}
            </div>

            {/* Share */}
            <div className="flex items-center gap-3">
              <span className="text-[13px] font-semibold text-[#0D1B3E]">Share:</span>
              {['Facebook', 'Twitter', 'LinkedIn'].map((platform) => (
                <button
                  key={platform}
                  className="h-9 px-4 rounded-full border-2 border-[#0D1B3E] text-[#0D1B3E] text-[13px] font-bold hover:bg-[#0D1B3E] hover:text-white transition-colors"
                >
                  {platform}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Related Posts ── */}
      {relatedPosts.length > 0 && (
        <section className="py-10 sm:py-14 bg-[#F9F8F6]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Section Header */}
            <div className="text-center mb-8">
              <span className="inline-block text-[#F26419] text-xs font-semibold tracking-wider uppercase mb-2">
                Keep Reading
              </span>
              <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-[#0D1B3E] mb-2">
                Related Articles
              </h2>
              <p className="text-[15px] text-[#4A4742] max-w-xl mx-auto">
                {categoryName ? `More insights about ${categoryName.toLowerCase()}` : 'More insights for you'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((rp: any) => {
                const rpCategory = rp.category?.name || rp.category || '';
                const rpDate = rp.createdAt
                  ? new Date(rp.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
                  : '';
                return (
                  <Link
                    key={rp._id || rp.slug}
                    href={`/blogs/${rp.slug}`}
                    className="group rounded-xl border border-[#DDD9D2] bg-white overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                  >
                    {/* Image */}
                    {rp.coverImage ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={rp.coverImage} alt={rp.title || 'Article'} className="w-full h-44 object-cover" />
                    ) : (
                      <div className="w-full h-44 bg-gradient-to-br from-[#F9F8F6] to-[#DDD9D2] flex items-center justify-center text-3xl">
                        📝
                      </div>
                    )}

                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        {rpCategory && (
                          <span className="text-[#F26419] text-xs font-semibold uppercase">{rpCategory}</span>
                        )}
                        {rpDate && <span className="text-[#4A4742]/50 text-xs">{rpDate}</span>}
                      </div>
                      <h3 className="font-heading text-base font-bold text-[#0D1B3E] line-clamp-2 group-hover:text-[#F26419] transition-colors mb-2">
                        {rp.title || 'Untitled Post'}
                      </h3>
                      <p className="text-[13px] text-[#4A4742] line-clamp-2 flex-1">
                        {rp.excerpt || ''}
                      </p>
                      <span className="mt-3 inline-flex items-center text-[13px] font-bold text-[#F26419]">
                        Read Article
                        <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                        </svg>
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ── CTA Section ── */}
      <section className="bg-[#0D1B3E] py-10 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <span className="inline-block text-[#F26419] text-xs font-semibold tracking-wider uppercase mb-2">
            Get Started
          </span>
          <h2 className="font-heading text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-3">
            Ready to Start Your MBBS Journey?
          </h2>
          <p className="text-[15px] text-white/70 max-w-2xl mx-auto mb-8">
            Get personalized guidance from our expert counsellors
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/contact"
              className="inline-flex items-center justify-center h-10 sm:h-11 px-7 rounded-full bg-[#F26419] text-white text-[13px] sm:text-sm font-bold hover:bg-[#FF8040] transition-colors"
            >
              Get Free Consultation
            </Link>
            <Link
              href="/blogs"
              className="inline-flex items-center justify-center h-10 sm:h-11 px-7 rounded-full border-2 border-white text-white text-[13px] sm:text-sm font-bold hover:bg-white hover:text-[#0D1B3E] transition-colors"
            >
              Read More Articles
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}