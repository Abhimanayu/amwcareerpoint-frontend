'use client';

import { useEffect, useRef, useState } from 'react';
import { uploadImage } from '@/lib/media';
import { SafeImage } from '../ui/SafeImage';
import { resolveMediaUrl } from '@/lib/utils';

interface ImageUploaderProps {
  folder: 'countries' | 'universities' | 'blogs' | 'counsellors' | 'reviews';
  currentImage?: string;
  onUpload: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ folder, currentImage, onUpload, label }: Readonly<ImageUploaderProps>) {
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState('');
  const [preview, setPreview] = useState(resolveMediaUrl(currentImage));
  const [error, setError] = useState('');
  const [retryCount, setRetryCount] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const objectUrlRef = useRef<string | null>(null);

  useEffect(() => {
    const resolvedCurrentImage = resolveMediaUrl(currentImage);

    // Keep showing the freshly selected local file during the current edit session.
    // This avoids replacing a successful local preview with a broken server URL.
    if (objectUrlRef.current && resolvedCurrentImage) {
      return;
    }

    setPreview(resolvedCurrentImage);
  }, [currentImage]);

  useEffect(() => () => {
    if (objectUrlRef.current) {
      URL.revokeObjectURL(objectUrlRef.current);
    }
  }, []);

  // Validate image file before upload
  const validateImageFile = (file: File): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      const objectUrl = URL.createObjectURL(file);
      
      img.onload = () => {
        URL.revokeObjectURL(objectUrl);
        
        // Check minimum dimensions
        if (img.width < 50 || img.height < 50) {
          reject(new Error('Image must be at least 50x50 pixels'));
          return;
        }
        
        // Check maximum dimensions (prevent huge images)
        if (img.width > 4000 || img.height > 4000) {
          reject(new Error('Image too large. Maximum 4000x4000 pixels'));
          return;
        }
        
        resolve({ width: img.width, height: img.height });
      };
      
      img.onerror = () => {
        URL.revokeObjectURL(objectUrl);
        reject(new Error('Invalid or corrupted image file'));
      };
      
      img.src = objectUrl;
    });
  };

  // Validate uploaded URL actually works (with warning instead of blocking)
  const validateUploadedUrl = (url: string): Promise<{ isAccessible: boolean; warning?: string }> => {
    return new Promise((resolve) => {
      const img = new Image();
      let resolved = false;
      
      img.onload = () => {
        if (!resolved) {
          resolved = true;
          resolve({ isAccessible: true });
        }
      };
      
      img.onerror = () => {
        if (!resolved) {
          resolved = true;
          resolve({ 
            isAccessible: false, 
            warning: 'Image uploaded but may not display correctly. You can still save it.' 
          });
        }
      };
      
      img.src = url;
      
      // Longer timeout (15 seconds) and don't fail on timeout
      setTimeout(() => {
        if (!resolved) {
          resolved = true;
          resolve({ 
            isAccessible: false, 
            warning: 'Upload verification timed out. Image should work normally.' 
          });
        }
      }, 15000);
    });
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setError('');
    setLoading(true);
    setUploadProgress('Validating file...');

    try {
      // 1. Basic file validations
      if (file.size > 10 * 1024 * 1024) {
        throw new Error('File must be under 10MB');
      }
      
      if (!['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/svg+xml'].includes(file.type)) {
        throw new Error('Supported formats: JPG, PNG, WebP, GIF, BMP, SVG');
      }

      // 2. Validate image integrity and dimensions
      setUploadProgress('Checking image quality...');
      const dimensions = await validateImageFile(file);
      console.log(`Image validated: ${dimensions.width}x${dimensions.height}`);

      // 3. Show preview
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
      }
      objectUrlRef.current = URL.createObjectURL(file);
      setPreview(objectUrlRef.current);

      // 4. Upload to server with retry logic
      setUploadProgress('Uploading to server...');
      let result;
      let currentRetry = 0;
      const maxRetries = 3;
      
      while (currentRetry <= maxRetries) {
        try {
          if (currentRetry > 0) {
            setUploadProgress(`Retrying upload... (${currentRetry}/${maxRetries})`);
            await new Promise(resolve => setTimeout(resolve, 1000 * currentRetry)); // exponential backoff
          }
          
          result = await uploadImage(file, folder);
          break; // success, exit retry loop
          
        } catch (uploadErr) {
          currentRetry++;
          if (currentRetry > maxRetries) {
            throw new Error(`Upload failed after ${maxRetries} attempts. Please check your connection.`);
          }
        }
      }
      
      if (!result?.data?.url) {
        throw new Error('Server returned invalid response');
      }

      const normalizedUrl = resolveMediaUrl(result.data.url);

      // 5. Verify uploaded image (warn but don't fail)
      setUploadProgress('Verifying upload...');
      const validation = await validateUploadedUrl(normalizedUrl);
      
      if (!validation.isAccessible && validation.warning) {
        console.warn('Image upload warning:', validation.warning);
        // Set a warning but don't fail 
        setError('⚠️ ' + validation.warning);
      }

      // 6. Success - notify parent component
      setUploadProgress('Upload complete!');
      onUpload(normalizedUrl);
      setRetryCount(0);
      
      // Clear warning after 3 seconds
      if (!validation.isAccessible) {
        setTimeout(() => setError(''), 3000);
      }
      
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Upload failed. Please try again.';
      setError(message);
      
      // Reset preview on error
      if (objectUrlRef.current) {
        URL.revokeObjectURL(objectUrlRef.current);
        objectUrlRef.current = null;
      }
      setPreview(resolveMediaUrl(currentImage));
      
    } finally {
      setLoading(false);
      setUploadProgress('');
    }
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="relative w-full border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-orange transition-colors"
      >
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif,image/bmp,image/svg+xml,.jpg,.jpeg,.png,.webp,.gif,.bmp,.svg" onChange={handleFileChange} className="hidden" />
        {preview ? (
          <div className="relative mx-auto h-40 max-w-full overflow-hidden rounded-lg">
            <SafeImage
              src={preview}
              alt="Preview"
              width={200}
              height={160}
              className="h-full w-full object-contain"
              onError={() => {
                setError('Preview failed to load');
                setPreview('');
              }}
              fallbackElement={
                <div className="h-full w-full bg-gray-100 flex items-center justify-center text-gray-400">
                  <div className="text-center">
                    <div className="text-2xl mb-1">🖼️</div>
                    <div className="text-xs">Preview unavailable</div>
                  </div>
                </div>
              }
            />
          </div>
        ) : (
          <div className="py-6">
            <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p className="text-sm text-gray-500">Click to upload</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP, GIF, BMP, SVG • Max 10MB</p>
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
            <div className="text-center">
              <div className="w-6 h-6 border-2 border-orange border-t-transparent rounded-full animate-spin mx-auto mb-2" />
              {uploadProgress && (
                <p className="text-xs text-gray-600 font-medium">{uploadProgress}</p>
              )}
            </div>
          </div>
        )}
      </button>
      
      {error && (
        <div className={`mt-2 p-2 border rounded-lg ${error.startsWith('⚠️') ? 'bg-yellow-50 border-yellow-200' : 'bg-red-50 border-red-200'}`}>
          <p className={`text-xs ${error.startsWith('⚠️') ? 'text-yellow-700' : 'text-red-600'}`}>{error}</p>
          {!error.startsWith('⚠️') && (
            <button 
              type="button" 
              onClick={() => inputRef.current?.click()}
              className="text-xs text-red-700 underline mt-1 hover:no-underline"
            >
              Try again
            </button>
          )}
        </div>
      )}
      
      {preview && !loading && !error && (
        <p className="text-green-600 text-xs mt-1 flex items-center gap-1">
          <span>✓</span> Image ready
        </p>
      )}
      
      {preview && !loading && error && error.startsWith('⚠️') && (
        <p className="text-orange-600 text-xs mt-1 flex items-center gap-1">
          <span>✓</span> Image uploaded (with warning)
        </p>
      )}
    </div>
  );
}
