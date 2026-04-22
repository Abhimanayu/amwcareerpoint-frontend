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
    
    // 🔄 Helper function to convert file to data URL
    const convertToDataUrl = (file: File) => {
      return new Promise<string>((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          if (dataUrl) {
            resolve(dataUrl);
          } else {
            reject(new Error('Failed to convert file'));
          }
        };
        reader.onerror = reject;
        reader.readAsDataURL(file);
      });
    };
    
    try {
      // 📎 First try backend upload (for production)
      const formData = new FormData();
      formData.append('file', file);
      formData.append('folder', 'blogs');

      const token = localStorage.getItem('amw_token');
      const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';
      
      const response = await fetch(`${baseURL}/media/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        console.log('📤 Backend response:', data);
        
        if (data.data && data.data.url) {
          const uploadedUrl = data.data.url;
          console.log('🔗 Testing backend URL:', uploadedUrl);
          
          // 🧪 Test if the URL actually works by trying to load it
          const testImg = new Image();
          testImg.onload = () => {
            console.log('✅ Backend URL works!');
            setImageUrl(uploadedUrl);
            setSuccessMessage('✅ Image uploaded to server successfully!');
          };
          testImg.onerror = async () => {
            console.log('❌ Backend URL failed to load, using fallback');
            try {
              const dataUrl = await convertToDataUrl(file);
              setImageUrl(dataUrl);
              setSuccessMessage('✅ Image ready! (Backend URL failed, using local copy)');
            } catch (err) {
              console.error('Fallback failed:', err);
              setSuccessMessage('❌ Image processing failed');
            }
          };
          testImg.src = uploadedUrl;
          return;
        } else if (data.url) {
          // Alternative response format - same test
          const uploadedUrl = data.url;
          const testImg = new Image();
          testImg.onload = () => {
            setImageUrl(uploadedUrl);
            setSuccessMessage('✅ Image uploaded to server successfully!');
          };
          testImg.onerror = async () => {
            try {
              const dataUrl = await convertToDataUrl(file);
              setImageUrl(dataUrl);
              setSuccessMessage('✅ Image ready! (Backend URL failed, using local copy)');
            } catch (err) {
              console.error('Fallback failed:', err);
              setSuccessMessage('❌ Image processing failed');
            }
          };
          testImg.src = uploadedUrl;
          return;
        } else {
          console.log('⚠️ Response missing URL, trying fallback');
          throw new Error('Response missing URL field');
        }
      }
      
      // 🔄 Backup: Convert to data URL for immediate use
      throw new Error('Backend upload failed, using fallback');
      
    } catch (error) {
      console.log('⚠️ Backend upload failed, using data URL fallback:', error.message);
      
      // 💡 Fallback: Convert file to data URL (base64)
      try {
        const dataUrl = await convertToDataUrl(file);
        setImageUrl(dataUrl);
        setSuccessMessage('✅ Image ready! (Using local preview - works for testing)');
        console.log('✅ Image converted to data URL for immediate use');
      } catch (fallbackError) {
        console.error('Complete fallback failure:', fallbackError);
        alert('Could not process image. Please try pasting an image URL instead.');
      }
    } finally {
      setUploading(false);
    }
  }, []);

  const handleInsert = useCallback(() => {
    if (imageUrl) {
      onInsert(imageUrl);
      onClose();
    }
  }, [imageUrl, altText, onInsert, onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Insert Image</h3>
        
        <div className="space-y-4">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Image
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) {
                  console.log('📁 File selected:', file.name, file.size);
                  handleFileUpload(file);
                }
              }}
              disabled={uploading}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F26419] focus:border-transparent"
            />
            {uploading && <p className="text-sm text-gray-500 mt-2">Uploading...</p>}
            {successMessage && <p className="text-sm text-green-600 mt-2">{successMessage}</p>}
          </div>

          {/* OR URL */}
          <div className="text-center text-gray-500 text-sm">OR</div>

          {/* Manual URL */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL
            </label>
            <input
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://example.com/image.jpg"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F26419] focus:border-transparent"
            />
          </div>

          {/* Alt Text */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Alt Text (for accessibility)
            </label>
            <input
              type="text"
              value={altText}
              onChange={(e) => setAltText(e.target.value)}
              placeholder="Describe the image..."
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#F26419] focus:border-transparent"
            />
          </div>

          {/* Preview */}
          {imageUrl && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preview
              </label>
              <img
                src={imageUrl}
                alt={altText || 'Preview'}
                className="max-w-full h-32 object-contain border border-gray-300 rounded"
                onError={() => setImageUrl('')}
              />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3 mt-6">
          <button
            onClick={handleInsert}
            disabled={!imageUrl || uploading}
            className="flex-1 px-6 py-2.5 bg-[#F26419] hover:bg-[#FF8040] text-white font-semibold rounded-xl text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
          >
            Insert Image
          </button>
          <button
            onClick={onClose}
            className="flex-1 px-6 py-2.5 border border-gray-200 text-gray-600 rounded-xl text-sm hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          {/* Debug info */}
          {process.env.NODE_ENV === 'development' && (
            <div className="text-xs text-gray-500 mt-2">
              Debug: imageUrl={imageUrl ? 'SET' : 'EMPTY'}, uploading={uploading.toString()}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}