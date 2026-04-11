'use client';

import { Component, ReactNode } from 'react';
import Link from 'next/link';

interface ErrorBoundaryProps {
  children: ReactNode;
  /** Optional custom fallback UI when an error is caught */
  fallback?: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

/**
 * Catches rendering errors in child components and displays
 * a friendly fallback instead of a blank screen.
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): ErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('[ErrorBoundary]', error, info.componentStack);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <div className="flex min-h-[320px] flex-col items-center justify-center gap-4 rounded-2xl border border-[#DDD9D2] bg-[#F9F8F6] p-8 text-center">
          <div className="text-4xl">⚠️</div>
          <h2 className="font-heading text-xl font-bold text-[#0D1B3E]">
            Something went wrong
          </h2>
          <p className="max-w-md text-sm text-[#4A4742]">
            We hit an unexpected error loading this section. Please try refreshing the page.
          </p>
          <div className="flex gap-3">
            <button
              onClick={() => this.setState({ hasError: false })}
              className="rounded-full border border-[#DDD9D2] bg-white px-5 py-2 text-sm font-semibold text-[#0D1B3E] transition-colors hover:bg-[#F9F8F6]"
            >
              Try Again
            </button>
            <Link
              href="/"
              className="rounded-full bg-[#F26419] px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-[#FF8040]"
            >
              Go Home
            </Link>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}
