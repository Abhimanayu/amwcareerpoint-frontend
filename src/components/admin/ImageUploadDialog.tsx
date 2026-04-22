'use client';

import { useCallback, useState } from 'react';

interface ImageUploadDialogProps {
  onInsert: (url: string) => void;
  onClose: () => void;
}

export function ImageUploadDialog({ onInsert, onClose }: ImageUploadDialogProps) {
  const [imageUrl, setImageUrl] = useState('');
  const [altText, setAltText] = useState('');
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const handleFileUpload = useCallback(async (file: File) => {
    setUploading(true);
    setSuccessMessage('');

    const convertToDataUrl = (selectedFile: File) =>
      new Promise<string>((resolve, reject) => {
        const reader = new FileReader();

        reader.onload = (event) => {
          const dataUrl = typeof event.target?.result === 'string' ? event.target.result : '';
          if (dataUrl) {
            resolve(dataUrl);
            return;
          }
          reject(new Error('Failed to convert file'));
        };

        reader.onerror = () => reject(new Error('Failed to read file'));
        reader.readAsDataURL(selectedFile);
      });

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'blogs');

      const token = localStorage.getItem('amw_token');
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

      const response = await fetch(`${baseUrl}/media/upload`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Backend upload failed, using fallback');
      }

      const data = await response.json();
      const uploadedUrl =
        typeof data?.data?.url === 'string'
          ? data.data.url
          : typeof data?.url === 'string'
            ? data.url
            : '';

      if (!uploadedUrl) {
        throw new Error('Response missing URL field');
      }

      const imageStatus = await new Promise<boolean>((resolve) => {
        const testImage = new Image();
        testImage.onload = () => resolve(true);
        testImage.onerror = () => resolve(false);
        testImage.src = uploadedUrl;
      });

      if (imageStatus) {
        setImageUrl(uploadedUrl);
        setSuccessMessage('Image uploaded to server successfully.');
        return;
      }

      const dataUrl = await convertToDataUrl(file);
      setImageUrl(dataUrl);
      setSuccessMessage('Image ready. Backend URL failed, so local preview is being used.');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.log('Backend upload failed, using data URL fallback:', errorMessage);

      try {
        const dataUrl = await convertToDataUrl(file);
        setImageUrl(dataUrl);
        setSuccessMessage('Image ready. Using local preview for testing.');
      } catch (fallbackError) {
        console.error('Complete fallback failure:', fallbackError);
        alert('Could not process image. Please try pasting an image URL instead.');
      }
    } finally {
      setUploading(false);
    }
  }, []);

  const handleInsert = useCallback(() => {
    if (!imageUrl) {
      return;
    }

    onInsert(imageUrl);
    onClose();
  }, [imageUrl, onInsert, onClose]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="mx-4 w-full max-w-md rounded-xl bg-white p-6">
        <h3 className="mb-4 text-lg font-semibold text-gray-900">Insert Image</h3>

        <div className="space-y-4">
          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => {
                const file = event.target.files?.[0];
                if (file) {
                  handleFileUpload(file);
                }
              }}
              disabled={uploading}
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#F26419]"
            />
            {uploading && <p className="mt-2 text-sm text-gray-500">Uploading...</p>}
            {successMessage && <p className="mt-2 text-sm text-green-600">{successMessage}</p>}
          </div>

          <div className="text-center text-sm text-gray-500">OR</div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">Image URL</label>
            <input
              type="url"
              value={imageUrl}
              onChange={(event) => setImageUrl(event.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#F26419]"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Alt Text (for accessibility)
            </label>
            <input
              type="text"
              value={altText}
              onChange={(event) => setAltText(event.target.value)}
              placeholder="Describe the image..."
              className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:border-transparent focus:ring-2 focus:ring-[#F26419]"
            />
          </div>

          {imageUrl && (
            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Preview</label>
              <img
                src={imageUrl}
                alt={altText || 'Preview'}
                className="h-32 max-w-full rounded border border-gray-300 object-contain"
                onError={() => setImageUrl('')}
              />
            </div>
          )}
        </div>

        <div className="mt-6 flex gap-3">
          <button
            onClick={handleInsert}
            disabled={!imageUrl || uploading}
            className="flex-1 rounded-xl bg-[#F26419] px-6 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-[#FF8040] disabled:cursor-not-allowed disabled:opacity-60"
          >
            Insert Image
          </button>
          <button
            onClick={onClose}
            className="flex-1 rounded-xl border border-gray-200 px-6 py-2.5 text-sm text-gray-600 transition-colors hover:bg-gray-50"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
