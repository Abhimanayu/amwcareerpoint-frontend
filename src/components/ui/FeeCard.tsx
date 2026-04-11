interface FeeCardProps {
  label: string;
  value: string;
  sub?: string;
  accent?: boolean;
  dark?: boolean;
}

/**
 * Protected fee card. Handles long values with truncation.
 */
export function FeeCard({ label, value, sub, accent, dark }: FeeCardProps) {
  return (
    <div
      className={`rounded-xl p-4 sm:p-5 ${
        dark
          ? 'bg-[#F26419] text-white'
          : 'border border-[#DDD9D2] bg-[#F9F8F6]'
      }`}
    >
      <p className={`mb-2 truncate text-xs ${dark ? 'text-white/70' : 'text-[#4A4742]'}`}>
        {label || 'Fee'}
      </p>
      <p
        className={`truncate text-lg font-bold leading-tight sm:text-xl ${
          accent
            ? 'text-[#F26419]'
            : dark
              ? 'text-white'
              : 'text-[#0D1B3E]'
        }`}
        title={value}
      >
        {value || '—'}
      </p>
      {sub && (
        <p className={`mt-1 truncate text-[11px] ${dark ? 'text-white/60' : 'text-[#4A4742]/60'}`}>
          {sub}
        </p>
      )}
    </div>
  );
}
