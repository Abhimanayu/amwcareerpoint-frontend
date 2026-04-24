'use client';

import Image, { ImageProps } from 'next/image';
import { useState, useEffect } from 'react';
import { resolveMediaUrl } from '@/lib/utils';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  fallbackElement?: React.ReactNode;
}

function isStringSource(value: SafeImageProps['src']): value is string {
  return typeof value === 'string';
}

const FALLBACK_PLACEHOLDER =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjRjlGOEY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGRvbWluYW50LWJhc2VsaW5lPSJtaWRkbGUiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGZpbGw9IiM0QTQ3NDIiIGZvbnQtc2l6ZT0iMTQiIGZvbnQtZmFtaWx5PSJzYW5zLXNlcmlmIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

/**
 * Image component with built-in error handling.
 * Shows a fallback when the image fails to load or src is missing.
 */
export function SafeImage({
  src,
  alt,
  fallbackSrc,
  fallbackElement,
  className,
  unoptimized,
  ...props
}: Readonly<SafeImageProps>) {
  const [error, setError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const normalizedSrc = typeof src === 'string' ? resolveMediaUrl(src) : src;
  const normalizedFallbackSrc = typeof fallbackSrc === 'string' ? resolveMediaUrl(fallbackSrc) : fallbackSrc;
  const resolvedSrc = !normalizedSrc || error ? normalizedFallbackSrc || FALLBACK_PLACEHOLDER : normalizedSrc;
  const stringResolvedSrc = isStringSource(resolvedSrc) ? resolvedSrc : null;
  const isOptimizableBypassSource = stringResolvedSrc
    ? /^https?:\/\//i.test(stringResolvedSrc) || stringResolvedSrc.startsWith('data:')
    : false;
  const shouldDisableOptimization =
    typeof unoptimized === 'boolean'
      ? unoptimized
      : isOptimizableBypassSource;

  // Reset error state when src changes
  useEffect(() => {
    setError(false);
    setImageLoaded(false);
  }, [src]);

  if (!normalizedSrc || error) {
    if (!normalizedFallbackSrc && fallbackElement) return <>{fallbackElement}</>;
    return (
      <Image
        {...props}
        src={resolvedSrc}
        alt={alt || 'Image unavailable'}
        className={className}
        unoptimized={shouldDisableOptimization}
      />
    );
  }

  return (
    <Image
      {...props}
      src={normalizedSrc}
      alt={alt || ''}
      className={className}
      unoptimized={shouldDisableOptimization}
      onError={() => {
        if (process.env.NODE_ENV === 'development') {
          console.warn('SafeImage fallback for:', typeof normalizedSrc === 'string' ? normalizedSrc.slice(0, 80) : 'non-string src');
        }
        setError(true);
      }}
      onLoad={() => {
        setImageLoaded(true);
      }}
    />
  );
}
