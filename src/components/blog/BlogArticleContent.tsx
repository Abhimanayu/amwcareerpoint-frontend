'use client';

import { useEffect, useRef, useState } from 'react';

type TocItem = { id: string; label: string; level: 2 | 3 };

export function BlogArticleContent({ html }: Readonly<{ html: string }>) {
  const articleRef = useRef<HTMLDivElement>(null);
  const [items, setItems] = useState<TocItem[]>([]);

  useEffect(() => {
    const headings = Array.from(articleRef.current?.querySelectorAll<HTMLHeadingElement>('h2, h3') || []);
    const used = new Set<string>();
    const nextItems = headings.map((heading, index) => {
      const base = (heading.textContent || `section-${index + 1}`).toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '') || `section-${index + 1}`;
      let id = base;
      let suffix = 2;
      while (used.has(id)) id = `${base}-${suffix++}`;
      used.add(id);
      heading.id = id;
      return { id, label: heading.textContent?.trim() || `Section ${index + 1}`, level: heading.tagName === 'H3' ? 3 as const : 2 as const };
    });
    const timer = window.setTimeout(() => setItems(nextItems), 0);
    return () => window.clearTimeout(timer);
  }, [html]);

  useEffect(() => {
    const headings = Array.from(articleRef.current?.querySelectorAll<HTMLHeadingElement>('h2, h3') || []);
    headings.forEach((heading, index) => {
      if (items[index]) heading.id = items[index].id;
    });
  }, [items]);

  return (
    <>
      {items.length > 1 && (
        <nav aria-label="Table of contents" className="mb-8 border-l-4 border-[#F26419] bg-[#F9F8F6] px-5 py-4">
          <h2 className="font-heading text-lg font-bold text-[#0D1B3E]">Table of Contents</h2>
          <ol className="mt-3 space-y-2 text-sm">
            {items.map((item) => <li key={item.id} className={item.level === 3 ? 'pl-4' : ''}><a href={`#${item.id}`} className="text-[#0D1B3E] hover:text-[#F26419] hover:underline">{item.label}</a></li>)}
          </ol>
        </nav>
      )}
      <div ref={articleRef} className="blog-content prose prose-sm sm:prose-base lg:prose-lg max-w-none text-[#4A4742] leading-relaxed prose-headings:font-heading prose-headings:text-[#0D1B3E] prose-headings:scroll-mt-24 prose-a:text-[#F26419] prose-a:no-underline hover:prose-a:underline prose-a:break-words prose-strong:text-[#0D1B3E] prose-strong:font-semibold prose-img:rounded-xl prose-img:border prose-img:border-[#DDD9D2] prose-img:shadow-sm prose-img:mx-auto prose-table:table-auto prose-table:w-full prose-table:text-sm prose-th:bg-[#F9F8F6] prose-th:border prose-th:border-[#DDD9D2] prose-th:px-3 prose-th:py-2 prose-th:text-left prose-th:font-semibold prose-th:text-[#0D1B3E] prose-td:border prose-td:border-[#DDD9D2] prose-td:px-3 prose-td:py-2 prose-blockquote:border-l-4 prose-blockquote:border-[#F26419] prose-blockquote:bg-[#F9F8F6] prose-blockquote:px-4 prose-blockquote:py-2 prose-blockquote:italic prose-ul:list-disc prose-ol:list-decimal prose-li:marker:text-[#F26419] prose-code:bg-[#F9F8F6] prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:text-sm prose-code:break-words prose-pre:bg-[#0D1B3E] prose-pre:text-white prose-pre:overflow-x-auto prose-pre:rounded-lg [&_a]:text-[#F26419] [&_a]:underline [&_a_strong]:text-[#F26419] [&_a_span]:text-[#F26419] [&_.break-all]:break-all [&_.overflow-x-auto]:overflow-x-auto [&_.overflow-x-auto]:scrollbar-thin" dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
