import { supabase } from './supabase';
import dotenv from 'dotenv';

dotenv.config();

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'media';

/**
 * Upload file to Supabase Storage
 * @param file - Multer file object
 * @param folder - Folder path within the bucket (e.g., 'projects/images')
 * @returns Public URL of uploaded file or null on error
 */
export async function uploadToStorage(
  file: Express.Multer.File,
  folder: string
): Promise<string | null> {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${timestamp}_${randomStr}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Supabase storage upload error:', error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Storage upload error:', error);
    return null;
  }
}

/**
 * Delete file from Supabase Storage
 * @param fileUrl - Full public URL of the file
 * @returns true if successful, false otherwise
 */
export async function deleteFromStorage(fileUrl: string): Promise<boolean> {
  try {
    // Extract file path from URL
    const url = new URL(fileUrl);
    const pathParts = url.pathname.split(`/storage/v1/object/public/${BUCKET_NAME}/`);
    
    if (pathParts.length < 2) {
      console.error('Invalid file URL format');
      return false;
    }

    const filePath = pathParts[1];

    const { error } = await supabase.storage
      .from(BUCKET_NAME)
      .remove([filePath]);

    if (error) {
      console.error('Supabase storage delete error:', error);
      return false;
    }

    return true;
  } catch (error) {
    console.error('Storage delete error:', error);
    return false;
  }
}

/**
 * Get optimized image URL with transformations
 * @param publicUrl - Base public URL from Supabase
 * @param options - Image transformation options
 * @returns Transformed image URL
 */
export function getOptimizedImageUrl(
  publicUrl: string,
  options?: {
    width?: number;
    height?: number;
    quality?: number;
    format?: 'webp' | 'jpeg' | 'png';
  }
): string {
  if (!options) return publicUrl;

  const url = new URL(publicUrl);
  const params = new URLSearchParams();

  if (options.width) params.append('width', options.width.toString());
  if (options.height) params.append('height', options.height.toString());
  if (options.quality) params.append('quality', options.quality.toString());
  if (options.format) params.append('format', options.format);

  // Supabase storage supports image transformations via URL parameters
  if (params.toString()) {
    url.search = params.toString();
  }

  return url.toString();
}
