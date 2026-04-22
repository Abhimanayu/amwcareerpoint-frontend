'use client';

import { SafeImage } from './SafeImage';

interface UniversalImageProps {
  src?: string | null;
  alt?: string;
  width?: number;
  height?: number;
  className?: string;
  type?: 'flag' | 'logo' | 'hero' | 'avatar' | 'cover' | 'gallery' | 'generic';
  fill?: boolean;
  priority?: boolean;
  quality?: number;
}

/**
 * 🎯 UNIVERSAL IMAGE COMPONENT
 * 
 * This component handles ALL images across the entire application.
 * It provides consistent fallbacks, error handling, and loading states.
 * 
 * Usage:
 * <UniversalImage src={imageUrl} type="flag" alt="Country flag" />
 * <UniversalImage src={logoUrl} type="logo" alt="University logo" />
 * <UniversalImage src={heroUrl} type="hero" alt="Hero image" fill />
 */
export function UniversalImage({
  src,
  alt = '',
  width,
  height,
  className = '',
  type = 'generic',
  fill = false,
  priority = false,
  quality = 75,
}: UniversalImageProps) {
  
  // Define fallbacks based on image type
  const getFallbackByType = (imageType: string) => {
    const fallbacks = {
      flag: <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-sm flex items-center justify-center text-gray-400 text-xs">🏳️</div>,
      logo: <div className="w-full h-full bg-gradient-to-br from-blue-50 to-blue-100 rounded flex items-center justify-center text-blue-400 font-bold text-xs">🏫</div>,
      hero: <div className="w-full h-full bg-gradient-to-br from-slate-100 to-slate-300 flex items-center justify-center text-slate-400">🖼️</div>,
      avatar: <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 rounded-full flex items-center justify-center text-green-600 font-bold">👤</div>,
      cover: <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 rounded flex items-center justify-center text-orange-500">📄</div>,
      gallery: <div className="w-full h-full bg-gradient-to-br from-purple-100 to-purple-200 rounded flex items-center justify-center text-purple-500">🖼️</div>,
      generic: <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded flex items-center justify-center text-gray-400">📷</div>,
    };
    
    return fallbacks[imageType as keyof typeof fallbacks] || fallbacks.generic;
  };

  // Handle empty or null src
  if (!src || src.trim() === '') {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        {getFallbackByType(type)}
      </div>
    );
  }

  return (
    <SafeImage
      src={src}
      alt={alt}
      width={fill ? undefined : width}
      height={fill ? undefined : height}
      fill={fill}
      priority={priority}
      quality={quality}
      className={className}
      fallbackElement={
        <div className={`flex items-center justify-center ${className}`} style={fill ? undefined : { width, height }}>
          {getFallbackByType(type)}
        </div>
      }
      unoptimized={src.startsWith('data:') || src.includes('.svg')}
    />
  );
}

// Export convenience components for common use cases
export const FlagImage = (props: Omit<UniversalImageProps, 'type'>) => <UniversalImage {...props} type="flag" />;
export const LogoImage = (props: Omit<UniversalImageProps, 'type'>) => <UniversalImage {...props} type="logo" />;
export const HeroImage = (props: Omit<UniversalImageProps, 'type'>) => <UniversalImage {...props} type="hero" />;
export const AvatarImage = (props: Omit<UniversalImageProps, 'type'>) => <UniversalImage {...props} type="avatar" />;
export const CoverImage = (props: Omit<UniversalImageProps, 'type'>) => <UniversalImage {...props} type="cover" />;
export const GalleryImage = (props: Omit<UniversalImageProps, 'type'>) => <UniversalImage {...props} type="gallery" />;