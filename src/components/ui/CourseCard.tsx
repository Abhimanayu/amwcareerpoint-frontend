interface CourseCardProps {
  year: string;
  title: string;
  subjects: string;
  desc: string;
}

/**
 * Protected course / curriculum year card.
 * Clamps long subject lists and descriptions.
 */
export function CourseCard({ year, title, subjects, desc }: CourseCardProps) {
  return (
    <div className="rounded-2xl border border-[#DDD9D2] bg-[#F9F8F6] p-6 sm:p-8">
      <div className="mb-4 flex items-center gap-3">
        <span className="flex-shrink-0 rounded-full bg-[#F26419] px-3 py-1 text-xs font-bold text-white">
          {year || '—'}
        </span>
        <h3 className="line-clamp-1 text-lg font-bold text-[#0D1B3E]">
          {title || 'Course'}
        </h3>
      </div>
      <p className="mb-3 line-clamp-3 text-sm leading-relaxed text-[#4A4742]">
        {desc || 'Course description unavailable.'}
      </p>
      <p className="line-clamp-2 text-sm text-[#0D1B3E]">
        <span className="font-semibold">Key subjects:</span>{' '}
        {subjects || '—'}
      </p>
    </div>
  );
}
