import { useState } from 'react';
import { uploadImage, validateImage } from '../lib/imageOptimization';
import toast from 'react-hot-toast';

interface UseImageUploadResult {
  uploading: boolean;
  uploadImage: (file: File, folder: string) => Promise<string | null>;
}

export function useImageUpload(): UseImageUploadResult {
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (file: File, folder: string): Promise<string | null> => {
    try {
      setUploading(true);

      // Validate image
      const validation = await validateImage(file);
      if (!validation.valid) {
        toast.error(validation.error);
        return null;
      }

      // Generate unique filename
      const timestamp = Date.now();
      const randomString = Math.random().toString(36).substring(2, 8);
      const fileName = `${timestamp}-${randomString}.webp`;

      // Upload image
      const imageUrl = await uploadImage(file, folder, fileName);
      toast.success('Image uploaded successfully');
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    uploadImage: handleImageUpload,
  };
}