'use client';

// Inline field error message
export function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <p className="text-xs text-red-500 mt-1">{message}</p>;
}

// Character counter for inputs
export function CharCount({ current, max, className }: { current: number; max: number; className?: string }) {
  const isOver = current > max;
  const isNear = current > max * 0.85;
  return (
    <span className={`text-[11px] ${isOver ? 'text-red-500 font-medium' : isNear ? 'text-amber-500' : 'text-gray-400'} ${className || ''}`}>
      {current}/{max}
    </span>
  );
}

// Validation summary banner
export function ValidationBanner({ errors }: { errors: { field: string; message: string }[] }) {
  if (errors.length === 0) return null;
  return (
    <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 space-y-1">
      <p className="text-sm font-medium text-red-700">Please fix the following errors:</p>
      <ul className="list-disc list-inside text-xs text-red-600 space-y-0.5">
        {errors.map((e, i) => (
          <li key={i}>{e.message}</li>
        ))}
      </ul>
    </div>
  );
}
