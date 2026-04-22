import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { getBlogBySlug, getBlogs } from '@/lib/blogs';
import { extractCollectionData, formatDate, pickBlogImageSource, resolveMediaUrl, sanitizeHtml } from '@/lib/utils';
import { sanitizeAndOptimizeMobileContent } from '@/lib/contentValidation';
import { SafeImage } from '@/components/ui/SafeImage';

type Props = {
  params: Promise<{ slug: string }>;
};

/* eslint-disable @typescript-eslint/no-explicit-any */

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amwcareerpoint.com';
  try {
    const res = await getBlogBySlug(slug);
    const post = res.data || res;
    if (!post) return { title: 'Post Not Found' };
    const title = post.seo?.metaTitle || post.title;
    const description = post.seo?.metaDescription || post.excerpt;
    const ogImage = resolveMediaUrl(pickBlogImageSource(post));
    const canonical = post.seo?.canonicalUrl || `${siteUrl}/blogs/${slug}`;
    return {
      title,
      description,
      alternates: { canonical },
      openGraph: { title, description, type: 'article', images: ogImage ? [{ url: ogImage }] : undefined },
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
    const allPosts = extractCollectionData<any>(allRes, ['blogs']);
    const categoryName = post.category?.name || post.category;
    relatedPosts = allPosts
      .filter((p: any) => p._id !== post._id && (p.category?.name || p.category) === categoryName)
      .slice(0, 3);
  } catch { /* no related posts */ }

  const categoryName = post.category?.name || post.category || '';
  const postImage = pickBlogImageSource(post);
  const postTags: string[] = Array.isArray(post.tags)
    ? post.tags.filter((tag: unknown): tag is string => typeof tag === 'string' && tag.trim().length > 0)
    : [];
  const postDate = post.createdAt
    ? formatDate(post.createdAt, 'en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric',
      })
    : '';
  const readTime = post.content ? `${Math.max(1, Math.ceil(post.content.replace(/<[^>]*>/g, '').split(/\s+/).length / 200))} min read` : '';

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://amwcareerpoint.com';
  const postUrl = `${siteUrl}/blogs/${slug}`;
  const ogImage = resolveMediaUrl(postImage || '');

  // Schema markup: use admin-provided or generate Article schema
  let schemaJsonLd: object | null = null;
  if (post.seo?.schemaMarkup) {
    try { schemaJsonLd = JSON.parse(post.seo.schemaMarkup); } catch { /* invalid JSON, skip */ }
  }
  if (!schemaJsonLd) {
    schemaJsonLd = {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: post.title || '',
      description: post.excerpt || '',
      image: ogImage || undefined,
      author: { '@type': 'Person', name: post.author || 'AMW Career Point' },
      publisher: { '@type': 'Organization', name: 'AMW Career Point', url: siteUrl },
      datePublished: post.createdAt || undefined,
      dateModified: post.updatedAt || post.createdAt || undefined,
      mainEntityOfPage: { '@type': 'WebPage', '@id': postUrl },
    };
  }

  return (
    <div className="min-h-screen bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaJsonLd) }}
      />
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
        {postImage ? (
          <div className="w-full overflow-hidden rounded-xl border border-[#DDD9D2] shadow-sm bg-[#F9F8F6]">
            <SafeImage
              src={postImage}
              alt={post.title || 'Blog post'}
              width={896}
              height={504}
              className="w-full h-auto max-h-[500px] object-contain mx-auto"
              fallbackSrc="/blogs/russia-universities-nmc.jpg"
              fallbackElement={<div className="flex w-full aspect-[2/1] items-center justify-center bg-gradient-to-br from-[#F9F8F6] to-[#DDD9D2] text-6xl">📝</div>}
            />
          </div>
        ) : (
          <div className="w-full aspect-[2/1] bg-gradient-to-br from-[#F9F8F6] to-[#DDD9D2] rounded-xl flex items-center justify-center text-6xl">
            📝
          </div>
        )}
      </div>

      {/* ── Article Content ── */}
      <section className="py-10 sm:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div
            className="blog-content prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#4A4742] leading-relaxed
              prose-headings:font-heading prose-headings:text-[#0D1B3E] prose-headings:scroll-mt-8
              prose-a:text-[#F26419] prose-a:no-underline hover:prose-a:underline prose-a:break-words
              prose-strong:text-[#0D1B3E] prose-strong:font-semibold
              prose-img:rounded-xl prose-img:border prose-img:border-[#DDD9D2] prose-img:shadow-sm prose-img:mx-auto
              prose-table:table-auto prose-table:w-full prose-table:text-sm
              prose-th:bg-[#F9F8F6] prose-th:border prose-th:border-[#DDD9D2] prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-[#0D1B3E]
              prose-td:border prose-td:border-[#DDD9D2] prose-td:px-3 prose-td:py-2
              prose-blockquote:border-l-4 prose-blockquote:border-[#F26419] prose-blockquote:bg-[#F9F8F6] prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:italic
              prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-[#F26419]
              prose-code:bg-[#F9F8F6] prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:break-words
              prose-pre:bg-[#0D1B3E] prose-pre:text-white prose-pre:overflow-x-auto prose-pre:rounded-lg
              [&_.break-all]:break-all [&_.overflow-x-auto]:overflow-x-auto [&_.overflow-x-auto]:scrollbar-thin"
            dangerouslySetInnerHTML={{ 
              __html: sanitizeAndOptimizeMobileContent(sanitizeHtml((post.content || '').replace(/\n/g, '<br />')))
            }}
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
              {postTags.length > 0 ? (
                Array.from(new Set(postTags)).slice(0, 10).map((tag) => (
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
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              <span className="text-[13px] font-semibold text-[#0D1B3E]">Share:</span>
              {['Facebook', 'Twitter', 'LinkedIn'].map((platform) => (
                <button
                  key={platform}
                  className="h-10 sm:h-9 px-4 rounded-full border-2 border-[#0D1B3E] text-[#0D1B3E] text-[13px] font-bold hover:bg-[#0D1B3E] hover:text-white transition-colors"
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
                  ? formatDate(rp.createdAt, 'en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })
                  : '';
                return (
                  <Link
                    key={rp._id || rp.slug}
                    href={`/blogs/${rp.slug}`}
                    className="group rounded-xl border border-[#DDD9D2] bg-white overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                  >
                    {/* Image */}
                    {pickBlogImageSource(rp) ? (
                      <div className="relative h-44 w-full">
                        <SafeImage src={pickBlogImageSource(rp)} alt={rp.title || 'Article'} fill className="object-cover" fallbackSrc="/blogs/russia-universities-nmc.jpg" />
                      </div>
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
