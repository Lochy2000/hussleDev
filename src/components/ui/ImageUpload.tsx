import React, { useState } from 'react';
import { Upload, X, Loader } from 'lucide-react';
import { useImageUpload } from '../../hooks/useImageUpload';
import toast from 'react-hot-toast';

interface ImageUploadProps {
  currentImageUrl?: string | null;
  onUpload: (url: string) => void;
  folder: string;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ currentImageUrl, onUpload, folder }) => {
  const [preview, setPreview] = useState<string | null>(null);
  const { uploading, uploadImage } = useImageUpload();

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Show preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    try {
      const imageUrl = await uploadImage(file, folder);
      if (imageUrl) {
        onUpload(imageUrl);
        toast.success('Image uploaded successfully');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setPreview(null);
    }
  };

  const handleRemoveImage = () => {
    setPreview(null);
    onUpload('');
  };

  return (
    <div className="relative">
      <div className="w-32 h-32 rounded-full overflow-hidden border-2 border-dark-600 relative group">
        {(preview || currentImageUrl) ? (
          <>
            <img
              src={preview || currentImageUrl || ''}
              alt="Preview"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-dark-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button
                onClick={handleRemoveImage}
                className="p-2 bg-red-500 rounded-full text-white hover:bg-red-600 transition-colors"
              >
                <X size={16} />
              </button>
            </div>
          </>
        ) : (
          <div className="w-full h-full bg-dark-700 flex items-center justify-center">
            <Upload size={24} className="text-dark-400" />
          </div>
        )}
      </div>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
        id="image-upload"
        disabled={uploading}
      />

      <label
        htmlFor="image-upload"
        className={`absolute bottom-0 right-0 p-2 rounded-full cursor-pointer transition-colors ${
          uploading 
            ? 'bg-dark-600 cursor-not-allowed' 
            : 'bg-hustle-500 hover:bg-hustle-400'
        }`}
      >
        {uploading ? (
          <Loader size={16} className="text-white animate-spin" />
        ) : (
          <Upload size={16} className="text-white" />
        )}
      </label>
    </div>
  );
};

export default ImageUpload;