import Link from 'next/link';

interface EmptyStateProps {
  icon?: string;
  title?: string;
  description?: string;
  actionLabel?: string;
  actionHref?: string;
}

/**
 * Friendly empty-state placeholder for when API returns no data.
 */
export function EmptyState({
  icon = '📭',
  title = 'Nothing here yet',
  description = 'Check back later or try refreshing the page.',
  actionLabel,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-[#DDD9D2] bg-[#F9F8F6] px-6 py-16 text-center">
      <span className="text-4xl">{icon}</span>
      <h3 className="font-heading text-lg font-bold text-[#0D1B3E]">{title}</h3>
      <p className="max-w-sm text-sm text-[#4A4742]">{description}</p>
      {actionLabel && actionHref && (
        <Link
          href={actionHref}
          className="mt-2 inline-flex items-center rounded-full bg-[#F26419] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#FF8040]"
        >
          {actionLabel}
        </Link>
      )}
    </div>
  );
}
