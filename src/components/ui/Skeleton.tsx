import { cn } from '@/lib/utils';

/* ─── Pulse skeleton block ─── */
export function Skeleton({ className, style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <div
      className={cn('animate-pulse rounded-lg bg-[#DDD9D2]/50', className)}
      style={style}
      aria-hidden="true"
    />
  );
}

/* ─── Card skeleton (used in university / country listing grids) ─── */
export function CardSkeleton() {
  return (
    <div className="rounded-2xl border border-[#DDD9D2] bg-white overflow-hidden">
      <Skeleton className="h-44 w-full rounded-none" />
      <div className="p-5 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
        <div className="flex gap-3 pt-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-20 rounded-full" />
        </div>
      </div>
    </div>
  );
}

/* ─── Full page skeleton (hero + content blocks) ─── */
export function PageSkeleton() {
  return (
    <div className="min-h-screen bg-white" aria-label="Loading…">
      {/* Hero */}
      <Skeleton className="h-[340px] w-full rounded-none" />
      {/* Nav bar */}
      <div className="sticky top-0 z-30 border-b border-[#DDD9D2] bg-white px-5 py-3 flex gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-5 w-16 rounded-full" />
        ))}
      </div>
      {/* Content blocks */}
      <div className="mx-auto max-w-[1200px] px-5 py-12 space-y-6">
        <Skeleton className="h-8 w-2/5" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <Skeleton className="h-4 w-3/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Inline content skeleton (for sections that load data) ─── */
export function SectionSkeleton({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-3 py-4" aria-label="Loading…">
      {Array.from({ length: rows }).map((_, i) => (
        <Skeleton key={i} className="h-4 w-full" style={{ maxWidth: `${90 - i * 10}%` }} />
      ))}
    </div>
  );
}
