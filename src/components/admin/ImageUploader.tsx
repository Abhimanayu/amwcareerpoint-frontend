'use client';

import { useState, useRef } from 'react';
import { uploadImage } from '@/lib/media';

interface ImageUploaderProps {
  folder: 'countries' | 'universities' | 'blogs' | 'counsellors' | 'reviews';
  currentImage?: string;
  onUpload: (url: string) => void;
  label?: string;
}

export default function ImageUploader({ folder, currentImage, onUpload, label }: ImageUploaderProps) {
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState(currentImage || '');
  const [error, setError] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setError('File must be under 5MB');
      return;
    }
    if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
      setError('Only JPG, PNG, WebP allowed');
      return;
    }

    setError('');
    setPreview(URL.createObjectURL(file));
    setLoading(true);

    try {
      const result = await uploadImage(file, folder);
      onUpload(result.data.url);
    } catch {
      setError('Upload failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      {label && <label className="block text-sm font-medium text-gray-700 mb-1.5">{label}</label>}
      <div
        onClick={() => inputRef.current?.click()}
        className="relative border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-[#F26419] transition-colors"
      >
        <input ref={inputRef} type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFileChange} className="hidden" />
        {preview ? (
          <img src={preview} alt="Preview" className="mx-auto max-h-40 rounded-lg object-cover" />
        ) : (
          <div className="py-6">
            <svg className="w-10 h-10 mx-auto text-gray-400 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p className="text-sm text-gray-500">Click to upload</p>
            <p className="text-xs text-gray-400 mt-1">JPG, PNG, WebP • Max 5MB</p>
          </div>
        )}
        {loading && (
          <div className="absolute inset-0 bg-white/80 rounded-xl flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-[#F26419] border-t-transparent rounded-full animate-spin" />
          </div>
        )}
      </div>
      {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
  );
}
