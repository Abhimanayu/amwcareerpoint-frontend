import type { ReactNode } from 'react';

export function DeferredSection({ children }: { children: ReactNode }) {
  return <div className="home-deferred-section">{children}</div>;
}
