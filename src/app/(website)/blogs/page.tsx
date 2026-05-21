import { Metadata } from 'next';
import Link from 'next/link';
import { getBlogs, getBlogCategories } from '@/lib/blogs';
import { EmptyState } from '@/components/ui/EmptyState';
import { clampText, extractCollectionData, formatDate, pickBlogImageSource } from '@/lib/utils';
import { SafeImage } from '@/components/ui/SafeImage';
import { SubscribeForm } from '@/components/blog/BlogInteractive';
import { SEO_HOLD } from '@/lib/seoHold';

export const metadata: Metadata = {
  ...(SEO_HOLD
    ? {
        title: 'AMW Career Point',
        description: 'AMW Career Point official website.',
        robots: {
          index: false,
          follow: false,
        },
      }
    : {
        title: 'Blog - MBBS Abroad Insights',
        description: 'Read the latest articles from AMW Career Point about MBBS abroad, university guides, admission tips, and student experiences.',
        alternates: { canonical: '/blogs' },
      }),
};

export const revalidate = 60;
const LATEST_PAGE_SIZE = 8;

// Initial page skeleton for better loading UX
const initialSkeleton = (
  <div className="min-h-screen bg-white">
    <div className="mx-auto max-w-[1200px] px-4 py-12 space-y-6">
      <div className="h-8 w-48 bg-gray-200 rounded animate-pulse" />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="rounded-xl overflow-hidden bg-gray-100 animate-pulse">
            <div className="h-40 bg-gray-200" />
            <div className="p-4 space-y-2">
              <div className="h-4 bg-gray-200 rounded" />
              <div className="h-4 bg-gray-200 rounded w-5/6" />
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);
const BLOG_FETCH_LIMITS = [120, 60, 24] as const;

type BlogPost = {
  _id?: string;
  slug?: string;
  title?: string;
  excerpt?: string;
  content?: string;
  author?: string;
  createdAt?: string;
  category?: { name?: string } | string;
  [key: string]: unknown;
};

type BlogCategory = {
  name?: string;
  [key: string]: unknown;
};

/* helpers */
function estimateReadTime(post: Record<string, unknown>): string {
  const content = typeof post.content === 'string' ? post.content : '';
  if (!content) return '5 min';
  const words = content.replaceAll(/<[^>]*>/g, '').split(/\s+/).length;
  return `${Math.max(1, Math.ceil(words / 200))} min`;
}

function slugifyCategory(value: string): string {
  return value
    .toLowerCase()
    .trim()
    .replaceAll(/[^a-z0-9\s-]/g, '')
    .replaceAll(/\s+/g, '-')
    .replaceAll(/-+/g, '-');
}

function getCategoryName(post: Record<string, unknown>): string {
  const category = post.category as Record<string, unknown> | string | undefined;
  if (category && typeof category === 'object' && typeof category.name === 'string') {
    return category.name;
  }
  if (typeof category === 'string') {
    return category;
  }
  return 'General';
}

const BLOG_BANNER_FRAME_CLASS = 'relative overflow-hidden bg-[#F9F8F6]';
const BLOG_BANNER_IMAGE_CLASS = 'object-contain object-top';

function buildBlogsHref(options: { q?: string; category?: string; page?: number }): string {
  const params = new URLSearchParams();
  if (options.q) params.set('q', options.q);
  if (options.category) params.set('category', options.category);
  if (options.page && options.page > 1) params.set('page', String(options.page));
  const query = params.toString();
  return query ? `/blogs?${query}` : '/blogs';
}

function matchesSearch(post: Record<string, unknown>, query: string): boolean {
  if (!query) return true;
  const haystack = [
    typeof post.title === 'string' ? post.title : '',
    typeof post.excerpt === 'string' ? post.excerpt : '',
    typeof post.content === 'string' ? post.content : '',
    getCategoryName(post),
  ]
    .join(' ')
    .toLowerCase();
  return haystack.includes(query.toLowerCase());
}

type BlogPageDataInput = {
  blogPosts: BlogPost[];
  categorySeed: string[];
  categoryQuery: string;
  searchQuery: string;
  currentPage: number;
};

function deriveBlogPageData(input: BlogPageDataInput) {
  const postCategories = Array.from(new Set(input.blogPosts.map((post) => getCategoryName(post)).filter(Boolean)));
  const mergedCategories = Array.from(new Set([...input.categorySeed, ...postCategories]));
  const categorySlugToName = new Map(mergedCategories.map((name) => [slugifyCategory(name), name]));
  const selectedCategory = input.categoryQuery ? categorySlugToName.get(input.categoryQuery) || '' : '';

  const filteredPosts = input.blogPosts.filter((post) => {
    const categoryOk = !selectedCategory || getCategoryName(post).toLowerCase() === selectedCategory.toLowerCase();
    return categoryOk && matchesSearch(post, input.searchQuery);
  });

  const featured = filteredPosts[0] || null;
  const trending = filteredPosts.slice(1, 3);
  const latestAll = filteredPosts.slice(3);
  const latestVisibleCount = input.currentPage * LATEST_PAGE_SIZE;
  const latest = latestAll.slice(0, latestVisibleCount);

  return {
    mergedCategories,
    selectedCategory,
    filteredPosts,
    featured,
    trending,
    latest,
    hasMoreLatest: latestVisibleCount < latestAll.length,
    popularPosts: filteredPosts.slice(0, 4),
    hasFilters: Boolean(input.searchQuery || selectedCategory),
  };
}

export default async function BlogPage({
  searchParams,
}: Readonly<{
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}>) {
  const resolvedParams = await searchParams;
  const searchQuery = typeof resolvedParams.q === 'string' ? resolvedParams.q.trim() : '';
  const categoryQuery = typeof resolvedParams.category === 'string' ? resolvedParams.category.trim() : '';
  const pageQuery = typeof resolvedParams.page === 'string' ? Number.parseInt(resolvedParams.page, 10) : 1;
  const currentPage = Number.isFinite(pageQuery) && pageQuery > 0 ? pageQuery : 1;

  let blogPosts: BlogPost[] = [];
  let categorySeed: string[] = [];

  const [catResult] = await Promise.all([
    getBlogCategories().catch(() => null),
  ]);

  for (const limit of BLOG_FETCH_LIMITS) {
    const blogsResult = await getBlogs({ limit }).catch(() => null);
    if (!blogsResult) continue;

    const extracted = extractCollectionData<BlogPost>(blogsResult, ['blogs']);
    if (extracted.length > 0) {
      blogPosts = extracted;
      break;
    }
  }

  if (blogPosts.length === 0) {
    const fallbackBlogsResult = await getBlogs().catch(() => null);
    if (fallbackBlogsResult) {
      blogPosts = extractCollectionData<BlogPost>(fallbackBlogsResult, ['blogs']);
    }
  }

  if (catResult) {
    const catData = extractCollectionData<BlogCategory | string>(catResult, ['categories']);
    categorySeed = Array.isArray(catData)
      ? catData
          .map((c) => (typeof c === 'string' ? c : String(c.name || '')))
          .filter(Boolean)
      : [];
  }

  const {
    mergedCategories,
    selectedCategory,
    filteredPosts,
    featured,
    trending,
    latest,
    hasMoreLatest,
    popularPosts,
    hasFilters,
  } = deriveBlogPageData({
    blogPosts,
    categorySeed,
    categoryQuery,
    searchQuery,
    currentPage,
  });

  const featuredImage = featured ? pickBlogImageSource(featured) : '';

  return (
    <div className="bg-white">
      {/* HERO */}
      <section className="relative bg-[#0D1B3E] overflow-hidden">
        {/* oversized background decoration */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 flex items-center justify-center select-none"
        >
          <span className="text-[10rem] sm:text-[16rem] lg:text-[22rem] font-heading font-black text-white/[0.03] leading-none tracking-tight">
            BLOG
          </span>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14 lg:py-20">
          <div className="max-w-3xl">
            <span className="inline-flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-[#F26419] uppercase tracking-[0.15em] mb-3 sm:mb-4">
              <span className="w-5 sm:w-6 h-[2px] bg-[#F26419] inline-block" />{' '}
              Knowledge Centre
            </span>
            <h1 className="font-heading text-[1.55rem] sm:text-[2.1rem] lg:text-[2.8rem] font-bold leading-[1.12] text-white mb-3 sm:mb-4">
              Honest guides for students{' '}
              <br className="hidden sm:block" />
              navigating <em className="text-[#F26419] font-bold italic">MBBS abroad</em>
            </h1>
            <p className="text-[12px] sm:text-[14px] text-blue-100/80 leading-relaxed max-w-xl mb-5 sm:mb-6">
              Research-backed answers on FMGE prep, NMC rules, university comparisons, fees, and student life
              - written for students and parents making the most important decision of their lives.
            </p>

            {/* search bar */}
            <form action="/blogs" method="get" className="flex max-w-md mb-6 sm:mb-8">
              {categoryQuery ? <input type="hidden" name="category" value={categoryQuery} /> : null}
              <div className="relative flex-1 min-w-0">
                <input
                  type="text"
                  name="q"
                  defaultValue={searchQuery}
                  placeholder="Search: FMGE pass rate, Georgia fees, NMC rules..."
                  className="w-full h-10 sm:h-11 rounded-l-lg bg-white/10 border border-white/20 px-3 sm:px-4 pr-8 text-[12px] sm:text-[13px] text-white placeholder:text-white/50 focus:outline-none focus:border-white/40"
                />
                {searchQuery ? (
                  <Link
                    href={buildBlogsHref({ category: categoryQuery || undefined })}
                    className="absolute right-2 top-1/2 -translate-y-1/2 text-white/50 hover:text-white text-sm"
                  >
                    ✕
                  </Link>
                ) : null}
              </div>
              <button
                type="submit"
                className="inline-flex items-center h-10 sm:h-11 px-4 sm:px-5 rounded-r-lg bg-[#F26419] text-white text-[12px] sm:text-[13px] font-bold hover:bg-[#FF8040] transition-colors shrink-0"
              >
                Search
              </button>
            </form>

            {/* stats */}
            <div className="flex flex-wrap items-center gap-x-6 gap-y-3 sm:gap-x-10 text-white">
              <div>
                <div className="text-lg sm:text-2xl font-bold">{blogPosts.length > 0 ? `${blogPosts.length}+` : '80+'}</div>
                <div className="text-[9px] sm:text-[11px] uppercase tracking-wider text-blue-200/70">Articles Published</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold">500+</div>
                <div className="text-[9px] sm:text-[11px] uppercase tracking-wider text-blue-200/70">Students Helped</div>
              </div>
              <div>
                <div className="text-lg sm:text-2xl font-bold">Since 2012</div>
                <div className="text-[9px] sm:text-[11px] uppercase tracking-wider text-blue-200/70">Counselling Experience</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORY PILLS */}
      <section className="bg-white border-b border-[#DDD9D2]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-1.5 py-3 overflow-x-auto scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#4A4742] mr-1.5 shrink-0">
              Browse
            </span>
            <Link
              href={buildBlogsHref({ q: searchQuery || undefined })}
              className={`inline-flex items-center shrink-0 rounded-full px-3 py-1.5 text-[11px] sm:text-[12px] font-semibold whitespace-nowrap transition-colors ${selectedCategory ? 'border border-[#DDD9D2] bg-white text-[#4A4742] hover:border-[#F26419] hover:text-[#F26419]' : 'bg-[#0D1B3E] text-white'}`}
            >
              All Articles
            </Link>
            {mergedCategories.slice(0, 12).map((cat) => {
              const slug = slugifyCategory(cat);
              const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
              return (
              <Link
                key={cat}
                title={typeof cat === 'string' ? cat : undefined}
                href={buildBlogsHref({ q: searchQuery || undefined, category: slug })}
                className={`inline-flex items-center shrink-0 rounded-full px-3 py-1.5 text-[11px] sm:text-[12px] font-medium whitespace-nowrap transition-colors ${isActive ? 'bg-[#0D1B3E] text-white' : 'border border-[#DDD9D2] bg-white text-[#4A4742] hover:border-[#F26419] hover:text-[#F26419]'}`}
              >
                {clampText(cat, 28)}
              </Link>
            )})}
          </div>
        </div>
      </section>

      {/* MAIN TWO-COLUMN LAYOUT */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10">
        <div className="flex flex-col lg:flex-row gap-8 lg:gap-10">

          {/* LEFT: Main Content */}
          <div className="flex-1 min-w-0">

            {hasFilters && (
              <div className="mb-5 rounded-xl border border-[#DDD9D2] bg-[#F9F8F6] px-4 py-3 text-[12px] sm:text-[13px] text-[#4A4742]">
                Showing {filteredPosts.length} article{filteredPosts.length === 1 ? '' : 's'}
                {selectedCategory ? ` in ${selectedCategory}` : ''}
                {searchQuery ? ` for "${searchQuery}"` : ''}.
                <Link href="/blogs" className="ml-2 font-semibold text-[#F26419] hover:underline">
                  Reset filters
                </Link>
              </div>
            )}

            {/* FEATURED */}
            {featured && (
              <section className="mb-8 sm:mb-10">
                <SectionLabel right={<span className="text-[10px] sm:text-[11px] text-[#4A4742]">Editor&apos;s pick</span>}>
                  Featured
                </SectionLabel>
                <Link
                  href={`/blogs/${featured.slug}`}
                  className="group block rounded-xl overflow-hidden border border-[#DDD9D2] bg-white hover:shadow-lg transition-shadow"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2">
                    {/* image */}
                    <div className={`${BLOG_BANNER_FRAME_CLASS} aspect-[1.91/1] md:aspect-auto md:min-h-[300px]`}>
                      {featuredImage ? (
                        <SafeImage
                          src={featuredImage}
                          alt={featured.title || 'Featured article'}
                          fill
                          className={BLOG_BANNER_IMAGE_CLASS}
                          fallbackSrc="/blogs/russia-universities-nmc.jpg"
                          fallbackElement={<div className="absolute inset-0 flex items-center justify-center text-5xl bg-[#F9F8F6]">📚</div>}
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center text-5xl bg-[#F9F8F6]">📚</div>
                      )}
                      <span className="absolute top-3 left-3 rounded bg-[#F26419] px-2.5 py-1 text-[10px] font-bold uppercase text-white tracking-wide">
                        Must Read
                      </span>
                      {featured.content && (
                        <span className="absolute bottom-3 left-3 rounded bg-black/60 px-2 py-0.5 text-[10px] text-white">
                          {estimateReadTime(featured)} read
                        </span>
                      )}
                    </div>
                    {/* content */}
                    <div className="p-4 sm:p-6 flex flex-col justify-center">
                      <span className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#F26419] mb-2">
                        {clampText(getCategoryName(featured) || 'FMGE & NExT', 30)}
                      </span>
                      <h3 className="font-heading text-base sm:text-lg lg:text-xl font-bold text-[#0D1B3E] leading-snug mb-2 sm:mb-3 line-clamp-3 group-hover:text-[#F26419] transition-colors">
                        {featured.title || 'Untitled Article'}
                      </h3>
                      <p className="text-[12px] sm:text-[13px] text-[#4A4742] leading-relaxed line-clamp-3 mb-4 sm:mb-5">
                        {featured.excerpt || 'Read more to discover insights about studying MBBS abroad.'}
                      </p>
                      <div className="flex items-center justify-between mt-auto">
                        <div className="flex items-center gap-2">
                          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-[#F9F8F6] flex items-center justify-center text-xs sm:text-sm">
                            👩‍⚕️
                          </div>
                          <div className="min-w-0">
                            <div className="text-[11px] sm:text-[12px] font-semibold text-[#0D1B3E] truncate max-w-[100px] sm:max-w-[140px]">
                              {clampText(featured.author || 'AMW Team', 20)}
                            </div>
                            <div className="text-[10px] sm:text-[11px] text-[#4A4742]">
                              {featured.createdAt ? formatDate(featured.createdAt, 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                            </div>
                          </div>
                        </div>
                        <span className="inline-flex items-center gap-1 text-[12px] sm:text-[13px] font-bold text-[#F26419] group-hover:gap-2 transition-all whitespace-nowrap">
                          Read now <span aria-hidden="true">-&gt;</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              </section>
            )}

            {/* TRENDING NOW */}
            {trending.length > 0 && (
              <section className="mb-8 sm:mb-10">
                <SectionLabel right={<span className="text-[10px] sm:text-[11px] text-[#4A4742]">Most read this week</span>}>
                  Trending Now
                </SectionLabel>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {trending.map((post) => {
                    const img = pickBlogImageSource(post);
                    const catLabel = clampText(getCategoryName(post) || 'Blog', 24);
                    return (
                      <Link
                        key={post._id || post.slug}
                        href={`/blogs/${post.slug}`}
                        className="group rounded-xl border border-[#DDD9D2] bg-white overflow-hidden hover:shadow-md transition-shadow flex flex-col"
                      >
                        <div className={`${BLOG_BANNER_FRAME_CLASS} aspect-[1.91/1]`}>
                          {img ? (
                            <SafeImage
                              src={img}
                              alt={post.title || 'Blog post'}
                              fill
                              className={BLOG_BANNER_IMAGE_CLASS}
                              fallbackElement={<div className="absolute inset-0 flex items-center justify-center text-3xl bg-[#F9F8F6]">📝</div>}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-3xl bg-[#F9F8F6]">📝</div>
                          )}
                          <span className="absolute top-2.5 left-2.5 rounded bg-[#0D1B3E]/80 px-2 py-0.5 text-[10px] font-bold uppercase text-white tracking-wide">
                            {catLabel}
                          </span>
                        </div>
                        <div className="p-3.5 sm:p-4 flex flex-col flex-1">
                          <span className="text-[10px] font-bold uppercase tracking-wider text-[#F26419] mb-1">
                            {clampText(getCategoryName(post), 24)}
                          </span>
                          <h3 className="font-heading text-[14px] sm:text-[15px] font-bold text-[#0D1B3E] leading-snug line-clamp-2 mb-2 group-hover:text-[#F26419] transition-colors">
                            {clampText(post.title || 'Untitled', 72)}
                          </h3>
                          <div className="mt-auto flex items-center justify-between text-[10px] sm:text-[11px] text-[#4A4742]">
                            <span>
                              {post.createdAt ? formatDate(post.createdAt, 'en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : ''}
                              {post.content && <> - {estimateReadTime(post)}</>}
                            </span>
                            <span className="font-bold text-[#F26419] group-hover:underline">Read -&gt;</span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </section>
            )}

            {/* LATEST ARTICLES */}
            <section>
              <SectionLabel right={<span className="text-[10px] sm:text-[11px] text-[#4A4742]">Updated daily</span>}>
                Latest Articles
              </SectionLabel>

              {latest.length === 0 ? (
                <EmptyState icon="📝" title="More coming soon" description="Check back for the latest insights about MBBS abroad." />
              ) : (
                <div className="divide-y divide-[#DDD9D2] border border-[#DDD9D2] rounded-xl bg-white overflow-hidden">
                  {latest.map((post) => {
                    const img = pickBlogImageSource(post);
                    const catLabel = clampText(getCategoryName(post) || 'Blog', 22);
                    return (
                      <Link
                        key={post._id || post.slug}
                        href={`/blogs/${post.slug}`}
                        className="group flex gap-3 sm:gap-4 p-3.5 sm:p-5 hover:bg-[#F9F8F6]/60 transition-colors"
                      >
                        {/* thumbnail */}
                        <div className="relative w-24 sm:w-28 aspect-[1.91/1] shrink-0 rounded-lg overflow-hidden bg-[#F9F8F6]">
                          {img ? (
                            <SafeImage
                              src={img}
                              alt={post.title || 'Blog'}
                              fill
                              className={BLOG_BANNER_IMAGE_CLASS}
                              fallbackElement={<div className="absolute inset-0 flex items-center justify-center text-base sm:text-lg bg-[#F9F8F6]">📝</div>}
                            />
                          ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-base sm:text-lg bg-[#F9F8F6]">📝</div>
                          )}
                        </div>

                        {/* text */}
                        <div className="flex-1 min-w-0">
                          <span className="text-[9px] sm:text-[10px] font-bold uppercase tracking-wider text-[#F26419] block mb-0.5">
                            {catLabel}
                          </span>
                          <h3 className="font-heading text-[13px] sm:text-[15px] font-bold text-[#0D1B3E] leading-snug line-clamp-2 group-hover:text-[#F26419] transition-colors mb-0.5 sm:mb-1">
                            {clampText(post.title || 'Untitled', 80)}
                          </h3>
                          <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-3 gap-y-0.5 text-[10px] sm:text-[11px] text-[#4A4742]">
                            <span className="truncate max-w-[100px] sm:max-w-[120px]">{clampText(post.author || 'AMW Team', 18)}</span>
                            {post.createdAt && (
                              <span>{formatDate(post.createdAt, 'en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                            )}
                          </div>
                        </div>

                        {/* read time + CTA (desktop) */}
                        <div className="hidden sm:flex flex-col items-end justify-center shrink-0">
                          {post.content && (
                            <span className="text-[11px] text-[#4A4742] mb-1">{estimateReadTime(post)} read</span>
                          )}
                          <span className="text-[12px] font-bold text-[#F26419] opacity-0 group-hover:opacity-100 transition-opacity">
                            Read -&gt;
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              )}

              {/* load more */}
              {hasMoreLatest && (
                <div className="mt-5 sm:mt-6 text-center">
                  <Link
                    href={buildBlogsHref({
                      q: searchQuery || undefined,
                      category: selectedCategory ? slugifyCategory(selectedCategory) : undefined,
                      page: currentPage + 1,
                    })}
                    className="inline-flex items-center justify-center h-10 px-6 sm:px-8 rounded-full border-2 border-[#DDD9D2] text-[12px] sm:text-[13px] font-semibold text-[#0D1B3E] hover:border-[#F26419] hover:text-[#F26419] transition-colors"
                  >
                    Load More Articles
                  </Link>
                </div>
              )}
            </section>
          </div>

          {/* RIGHT: Sidebar */}
          <aside className="w-full lg:w-[300px] xl:w-[330px] shrink-0 space-y-5 sm:space-y-6">

            {/* Free Consultation */}
            <div className="rounded-xl bg-gradient-to-br from-[#0D1B3E] to-[#162550] p-4 sm:p-5 text-white">
              <div className="text-[10px] font-bold uppercase tracking-wider text-[#F26419] mb-2">
                Free Consultation
              </div>
              <h4 className="font-heading text-base sm:text-lg font-bold leading-snug mb-1">
                Not sure which university is{' '}
                <em className="text-[#F26419] italic">right for you?</em>
              </h4>
              <p className="text-[11px] sm:text-[12px] text-blue-100/70 leading-relaxed mb-3 sm:mb-4">
                Our counsellors have helped 500+ Indian students. 15 minutes, no pressure, no hidden fees.
              </p>
              <Link
                href="/contact"
                className="block w-full text-center py-2.5 rounded-lg bg-[#F26419] text-white text-[12px] sm:text-[13px] font-bold hover:bg-[#FF8040] transition-colors"
              >
                Book Free Call
              </Link>
              <p className="text-[10px] text-blue-100/50 text-center mt-2">
                or call +91 9929299268
              </p>
            </div>

            {/* Popular This Week */}
            {popularPosts.length > 0 && (
              <div className="rounded-xl border border-[#DDD9D2] bg-white p-4 sm:p-5">
                <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#4A4742] mb-3 sm:mb-4">
                  Popular This Week
                </h4>
                <div className="space-y-3 sm:space-y-4">
                  {popularPosts.map((post, i) => (
                    <Link
                      key={post._id || post.slug}
                      href={`/blogs/${post.slug}`}
                      className="group flex gap-2.5 sm:gap-3 items-start"
                    >
                      <span className="shrink-0 text-base sm:text-[18px] font-heading font-bold text-[#DDD9D2]">
                        0{i + 1}
                      </span>
                      <div className="min-w-0">
                        <h5 className="text-[12px] sm:text-[13px] font-semibold text-[#0D1B3E] leading-snug line-clamp-2 group-hover:text-[#F26419] transition-colors">
                          {clampText(post.title || 'Untitled', 60)}
                        </h5>
                        <div className="flex items-center gap-2 text-[9px] sm:text-[10px] text-[#4A4742] mt-0.5 sm:mt-1">
                          {post.content && <span>{estimateReadTime(post)} read</span>}
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Browse by Topic */}
            {mergedCategories.length > 0 && (
              <div className="rounded-xl border border-[#DDD9D2] bg-white p-4 sm:p-5">
                <h4 className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-[#4A4742] mb-2 sm:mb-3">
                  Browse by Topic
                </h4>
                <div className="flex flex-wrap gap-1.5 sm:gap-2">
                  <Link
                    href={buildBlogsHref({ q: searchQuery || undefined })}
                    className={`inline-flex items-center rounded-full px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-medium transition-colors ${selectedCategory ? 'border border-[#DDD9D2] text-[#4A4742] hover:border-[#F26419] hover:text-[#F26419]' : 'bg-[#0D1B3E] text-white'}`}
                  >
                    All
                  </Link>
                  {mergedCategories.slice(0, 14).map((cat) => {
                    const slug = slugifyCategory(cat);
                    const isActive = selectedCategory.toLowerCase() === cat.toLowerCase();
                    return (
                    <Link
                      key={cat}
                      href={buildBlogsHref({ q: searchQuery || undefined, category: slug })}
                      className={`inline-flex items-center rounded-full px-2.5 sm:px-3 py-1 text-[10px] sm:text-[11px] font-medium transition-colors ${isActive ? 'bg-[#0D1B3E] text-white' : 'border border-[#DDD9D2] text-[#4A4742] hover:border-[#F26419] hover:text-[#F26419]'}`}
                    >
                      {clampText(cat, 22)}
                    </Link>
                  )})}
                </div>
              </div>
            )}

            {/* Weekly Digest */}
            <SubscribeForm variant="sidebar" />
          </aside>
        </div>
      </div>

      {/* BOTTOM NEWSLETTER CTA */}
      <section className="bg-[#0D1B3E]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 lg:py-12">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-5 sm:gap-6">
            <div className="max-w-lg">
              <h2 className="font-heading text-lg sm:text-xl lg:text-2xl font-bold text-white mb-1">
                Get the best MBBS guides
              </h2>
              <p className="font-heading text-base sm:text-lg font-bold text-[#F26419] italic mb-1.5 sm:mb-2">
                straight to your inbox
              </p>
              <p className="text-[11px] sm:text-[13px] text-blue-100/70">
                NMC updates, university news, honest FMGE analysis. Every Tuesday. 3,200+ subscribers already reading.
              </p>
            </div>
            <SubscribeForm variant="hero" />
          </div>
        </div>
      </section>
    </div>
  );
}

/* section label helper */
function SectionLabel({ children, right }: Readonly<{ children: React.ReactNode; right?: React.ReactNode }>) {
  return (
    <div className="flex items-center justify-between mb-4 sm:mb-5">
      <div className="flex items-center gap-2 sm:gap-3">
        <h2 className="text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.12em] text-[#4A4742]">
          {children}
        </h2>
        <span className="hidden sm:block h-px flex-1 min-w-8 bg-[#DDD9D2]" />
      </div>
      {right}
    </div>
  );
}
