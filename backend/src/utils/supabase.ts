import { createClient } from '@supabase/supabase-js';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
  throw new Error('Missing Supabase credentials');
}

export const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_ANON_KEY
);

const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'media';

/**
 * Upload file to Supabase Storage
 */
export async function uploadToSupabase(
  file: Express.Multer.File,
  folder: string
): Promise<string | null> {
  try {
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const fileExt = file.originalname.split('.').pop();
    const fileName = `${timestamp}_${randomStr}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error('Supabase upload error:', error);
      return null;
    }

    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    return publicUrl;
  } catch (error) {
    console.error('Upload error:', error);
    return null;
  }
} 