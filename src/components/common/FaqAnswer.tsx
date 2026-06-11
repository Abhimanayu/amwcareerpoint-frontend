import Link from 'next/link';
import type { ReactNode } from 'react';
import { isAllowedFaqLinkHref } from '@/lib/faqLinks';

interface FaqAnswerProps {
  readonly answer: string;
  readonly className?: string;
}

const markdownLinkRegex = /\[([^\]]+)\]\(([^)\s]+)\)/g;

export function FaqAnswer({ answer, className }: FaqAnswerProps) {
  const parts: ReactNode[] = [];
  let lastIndex = 0;

  answer.replace(markdownLinkRegex, (match, label: string, href: string, index: number) => {
    if (index > lastIndex) {
      parts.push(answer.slice(lastIndex, index));
    }

    const cleanHref = href.trim();
    if (isAllowedFaqLinkHref(cleanHref)) {
      const linkClassName = 'font-semibold text-[#F26419] underline decoration-[#F26419]/35 underline-offset-4 transition-colors hover:text-[#0D1B3E]';
      if (cleanHref.startsWith('/')) {
        parts.push(
          <Link key={`${cleanHref}-${index}`} href={cleanHref} className={linkClassName}>
            {label}
          </Link>,
        );
      } else {
        parts.push(
          <a key={`${cleanHref}-${index}`} href={cleanHref} target="_blank" rel="noopener noreferrer" className={linkClassName}>
            {label}
          </a>,
        );
      }
    } else {
      parts.push(label);
    }

    lastIndex = index + match.length;
    return match;
  });

  if (lastIndex < answer.length) {
    parts.push(answer.slice(lastIndex));
  }

  return <p className={className}>{parts.length > 0 ? parts : answer}</p>;
}
