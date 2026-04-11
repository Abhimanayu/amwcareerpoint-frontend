'use client';

import Image, { ImageProps } from 'next/image';
import { useState } from 'react';

interface SafeImageProps extends Omit<ImageProps, 'onError'> {
  fallbackSrc?: string;
  fallbackElement?: React.ReactNode;
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
  ...props
}: SafeImageProps) {
  const [error, setError] = useState(false);

  if (!src || error) {
    if (fallbackElement) return <>{fallbackElement}</>;
    return (
      <Image
        {...props}
        src={fallbackSrc || FALLBACK_PLACEHOLDER}
        alt={alt || 'Image unavailable'}
        className={className}
      />
    );
  }

  return (
    <Image
      {...props}
      src={src}
      alt={alt || ''}
      className={className}
      onError={() => setError(true)}
    />
  );
}
