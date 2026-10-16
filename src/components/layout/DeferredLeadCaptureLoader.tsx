'use client';

import dynamic from 'next/dynamic';
import { useEffect, useState } from 'react';

const DeferredLeadCapture = dynamic(
  () => import('./DeferredLeadCapture').then((module) => module.DeferredLeadCapture),
  { ssr: false }
);

const LOAD_DELAY_MS = 8000;

export function DeferredLeadCaptureLoader() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const timer = window.setTimeout(() => setReady(true), LOAD_DELAY_MS);
    return () => window.clearTimeout(timer);
  }, []);

  return ready ? <DeferredLeadCapture openDelayMs={0} /> : null;
}
