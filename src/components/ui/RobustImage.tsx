'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import { resolveMediaUrl } from '@/lib/utils';

interface RobustImageProps {
  src?: string | null;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  type?: 'flag' | 'logo' | 'hero' | 'avatar' | 'cover' | 'gallery' | 'generic';
  fill?: boolean;
  priority?: boolean;
  quality?: number;
  fallbackSrcs?: string[]; // Multiple fallback images
  retryAttempts?: number; // Number of retry attempts
  showErrorDetails?: boolean; // Show error info in dev mode
  onError?: (error: Error) => void; // Error callback
  onLoad?: () => void; // Success callback
}

type LoadingState = 'loading' | 'loaded' | 'error' | 'retry';

/**
 * 🛡️ ULTRA-ROBUST IMAGE COMPONENT
 * 
 * The most comprehensive image fallback solution with:
 * - Multiple fallback sources
 * - Automatic retry mechanism  
 * - Loading states with skeletons
 * - Type-specific intelligent fallbacks
 * - Error reporting and diagnostics
 * - Network failure recovery
 * - Progressive enhancement
 */
export function RobustImage({
  src,
  alt = '',
  width,
  height,
  className = '',
  type = 'generic',
  fill = false,
  priority = false,
  quality = 75,
  fallbackSrcs = [],
  retryAttempts = 2,
  showErrorDetails = process.env.NODE_ENV === 'development',
  onError,
  onLoad,
}: RobustImageProps) {
  
  const [loadingState, setLoadingState] = useState<LoadingState>('loading');
  const [currentSrcIndex, setCurrentSrcIndex] = useState(0);
  const [retryCount, setRetryCount] = useState(0);
  const [errorDetails, setErrorDetails] = useState<string>('');

  // All possible sources (main + fallbacks)
  const allSources = [src, ...fallbackSrcs].filter(Boolean) as string[];
  const currentSrc = allSources[currentSrcIndex];
  const resolvedSrc = currentSrc ? resolveMediaUrl(currentSrc) : '';

  // Intelligent fallback based on image type
  const getIntelligentFallback = useCallback((imageType: string) => {
    const fallbacks = {
      flag: {
        emoji: '🏳️',
        text: alt.split(' ')[0] || 'Flag',
        bg: 'from-blue-100 to-blue-200',
        textColor: 'text-blue-600'
      },
      logo: {
        emoji: '🏫',
        text: alt.split(' ')[0]?.charAt(0).toUpperCase() || 'L',
        bg: 'from-indigo-100 to-indigo-200',
        textColor: 'text-indigo-600'
      },
      hero: {
        emoji: '🖼️',
        text: 'Hero Image',
        bg: 'from-slate-100 to-slate-300',
        textColor: 'text-slate-500'
      },
      avatar: {
        emoji: '👤',
        text: alt.charAt(0).toUpperCase() || 'U',
        bg: 'from-green-100 to-green-200',
        textColor: 'text-green-600'
      },
      cover: {
        emoji: '📄',
        text: 'Cover',
        bg: 'from-orange-100 to-orange-200',  
        textColor: 'text-orange-600'
      },
      gallery: {
        emoji: '🖼️',
        text: 'Gallery',
        bg: 'from-purple-100 to-purple-200',
        textColor: 'text-purple-600'
      },
      generic: {
        emoji: '📷',
        text: 'Image',
        bg: 'from-gray-100 to-gray-200',
        textColor: 'text-gray-500'
      },
    };
    
    return fallbacks[imageType as keyof typeof fallbacks] || fallbacks.generic;
  }, [alt]);

  // Retry mechanism
  const attemptRetry = useCallback(() => {
    if (retryCount < retryAttempts) {
      setRetryCount(prev => prev + 1);
      setLoadingState('retry');
      // Exponential backoff
      const delay = Math.min(1000 * Math.pow(2, retryCount), 5000);
      setTimeout(() => {
        setLoadingState('loading');
      }, delay);
    } else if (currentSrcIndex < allSources.length - 1) {
      // Try next fallback source
      setCurrentSrcIndex(prev => prev + 1);
      setRetryCount(0);
      setLoadingState('loading');
    } else {
      setLoadingState('error');
    }
  }, [retryCount, retryAttempts, currentSrcIndex, allSources.length]);

  // Handle image load error
  const handleError = useCallback((error?: any) => {
    const errorMsg = `Image failed: ${currentSrc} (attempt ${retryCount + 1}/${retryAttempts})`;
    setErrorDetails(errorMsg);
    console.warn(errorMsg, error);
    
    if (onError) {
      onError(new Error(errorMsg));
    }
    
    attemptRetry();
  }, [currentSrc, retryCount, retryAttempts, onError, attemptRetry]);

  // Handle successful load
  const handleLoad = useCallback(() => {
    setLoadingState('loaded');
    if (onLoad) onLoad();
  }, [onLoad]);

  // Reset when src changes
  useEffect(() => {
    if (src) {
      setLoadingState('loading');
      setCurrentSrcIndex(0);
      setRetryCount(0);
      setErrorDetails('');
    }
  }, [src]);

  // If no source provided
  if (!src || src.trim() === '' || allSources.length === 0) {
    const fallback = getIntelligentFallback(type);
    return (
      <div 
        className={`flex items-center justify-center bg-gradient-to-br ${fallback.bg} ${className} rounded`}
        style={{ width, height }}
        title="No image source provided"
      >
        <div className="text-center">
          <div className="text-lg mb-1">{fallback.emoji}</div>
          <div className={`text-xs font-medium ${fallback.textColor}`}>{fallback.text}</div>
        </div>
      </div>
    );
  }

  // Loading state with skeleton
  if (loadingState === 'loading' || loadingState === 'retry') {
    return (
      <div 
        className={`animate-pulse bg-gradient-to-br from-gray-100 to-gray-200 ${className} rounded relative overflow-hidden`}
        style={{ width, height }}
      >
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
        {loadingState === 'retry' && (
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-xs text-gray-500">Retrying...</div>
          </div>
        )}
      </div>
    );
  }

  // Error state with intelligent fallback
  if (loadingState === 'error') {
    const fallback = getIntelligentFallback(type);
    return (
      <div 
        className={`flex flex-col items-center justify-center bg-gradient-to-br ${fallback.bg} ${className} rounded relative group`}
        style={{ width, height }}
        title={showErrorDetails ? errorDetails : 'Image not available'}
      >
        <div className="text-lg mb-1">{fallback.emoji}</div>
        <div className={`text-xs font-medium ${fallback.textColor} mb-1`}>{fallback.text}</div>
        
        {showErrorDetails && (
          <div className="absolute inset-0 bg-black/80 text-white text-[10px] p-2 opacity-0 group-hover:opacity-100 transition-opacity rounded overflow-hidden">
            <div className="font-bold mb-1">Error Details:</div>
            <div className="break-words">{errorDetails}</div>
          </div>
        )}
        
        {/* Retry button for manual retry */}
        <button
          onClick={attemptRetry}
          className="absolute bottom-1 right-1 opacity-0 group-hover:opacity-100 transition-opacity bg-white/80 hover:bg-white rounded px-1 py-0.5 text-[10px] font-medium"
          title="Retry loading image"
        >
          ↻
        </button>
      </div>
    );
  }

  // Successful load - render image
  return (
    <>
      <Image
        src={resolvedSrc}
        alt={alt}
        width={fill ? undefined : width}
        height={fill ? undefined : height}
        fill={fill}
        priority={priority}
        quality={quality}
        className={className}
        unoptimized={resolvedSrc.startsWith('data:') || resolvedSrc.includes('.svg')}
        onError={handleError}
        onLoad={handleLoad}
        style={loadingState === 'loaded' ? {} : { display: 'none' }}
      />
      
      {/* Show loading state until image loads */}
      {loadingState !== 'loaded' && (
        <div 
          className={`animate-pulse bg-gradient-to-br from-gray-100 to-gray-200 ${className} rounded`}
          style={{ width, height }}
        />
      )}
    </>
  );
}

// Export convenience components with enhanced fallbacks
export const UltraFlagImage = (props: Omit<RobustImageProps, 'type'>) => (
  <RobustImage {...props} type="flag" fallbackSrcs={[
    '/images/flags/default.svg',
    '/images/fallbacks/flag.png',
    'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMjQiIHZpZXdCb3g9IjAgMCAzMiAyNCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMjQiIGZpbGw9IiNGM0Y0RjYiLz48dGV4dCB4PSIxNiIgeT0iMTIiIGZpbGw9IiM2Mzc0OEYiIGZvbnQtc2l6ZT0iMTAiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGRvbWluYW50LWJhc2VsaW5lPSJjZW50cmFsIj7wn4+z77iPPC90ZXh0Pjwvc3ZnPg=='
  ]} />
);

export const UltraLogoImage = (props: Omit<RobustImageProps, 'type'>) => (
  <RobustImage {...props} type="logo" fallbackSrcs={[
    '/images/logos/default.svg',
    '/images/fallbacks/logo.png',
  ]} />
);

export const UltraHeroImage = (props: Omit<RobustImageProps, 'type'>) => (
  <RobustImage {...props} type="hero" fallbackSrcs={[
    '/images/heroes/default.jpg',
    '/images/fallbacks/hero.jpg',
  ]} />
);

export const UltraCoverImage = (props: Omit<RobustImageProps, 'type'>) => (
  <RobustImage {...props} type="cover" fallbackSrcs={[
    '/images/covers/default.jpg',
    '/images/fallbacks/cover.jpg',
  ]} />
);