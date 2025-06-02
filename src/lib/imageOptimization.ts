import { supabase } from './supabase';

// Maximum dimensions for different image sizes
const IMAGE_SIZES = {
  thumbnail: { width: 200, height: 200 },
  medium: { width: 600, height: 600 },
  large: { width: 1200, height: 1200 }
} as const;

// Supported image types
const ALLOWED_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB

interface ImageValidationResult {
  valid: boolean;
  error?: string;
}

export const validateImage = async (file: File): Promise<ImageValidationResult> => {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: 'Invalid file type. Please upload a JPEG, PNG, or WebP image.'
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: 'File size too large. Maximum size is 5MB.'
    };
  }

  return { valid: true };
};

export const optimizeImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = () => {
      // Calculate new dimensions while maintaining aspect ratio
      let { width, height } = img;
      const maxDimension = Math.max(width, height);
      
      if (maxDimension > IMAGE_SIZES.large.width) {
        const ratio = IMAGE_SIZES.large.width / maxDimension;
        width *= ratio;
        height *= ratio;
      }

      canvas.width = width;
      canvas.height = height;
      
      // Draw and optimize
      ctx?.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to optimize image'));
          }
        },
        'image/webp',
        0.85 // Quality setting
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

export const uploadImage = async (
  file: File,
  folder: string,
  fileName: string
): Promise<string> => {
  try {
    // Validate image
    const validation = await validateImage(file);
    if (!validation.valid) {
      throw new Error(validation.error);
    }

    // Optimize image
    const optimizedBlob = await optimizeImage(file);
    const optimizedFile = new File([optimizedBlob], fileName, {
      type: 'image/webp'
    });

    // Upload to Supabase Storage
    const filePath = `${folder}/${fileName}`;
    const { error: uploadError } = await supabase.storage
      .from('images')
      .upload(filePath, optimizedFile, {
        cacheControl: '3600',
        upsert: true
      });

    if (uploadError) throw uploadError;

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath);

    return publicUrl;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

export const deleteImage = async (path: string): Promise<void> => {
  try {
    const { error } = await supabase.storage
      .from('images')
      .remove([path]);

    if (error) throw error;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};