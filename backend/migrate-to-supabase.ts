import { PrismaClient } from '@prisma/client';
import { supabase } from '../src/utils/supabase';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();
const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'media';

/**
 * Download image from Cloudinary and upload to Supabase Storage
 */
async function migrateImage(
  cloudinaryUrl: string,
  folder: string
): Promise<string | null> {
  try {
    console.log(`Migrating: ${cloudinaryUrl}`);

    // Download image from Cloudinary
    const response = await axios.get(cloudinaryUrl, {
      responseType: 'arraybuffer',
    });

    const buffer = Buffer.from(response.data);
    
    // Extract filename from URL or generate new one
    const urlParts = cloudinaryUrl.split('/');
    const originalFileName = urlParts[urlParts.length - 1];
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const fileExt = originalFileName.split('.').pop();
    const fileName = `${timestamp}_${randomStr}.${fileExt}`;
    const filePath = `${folder}/${fileName}`;

    // Get content type from response headers
    const contentType = response.headers['content-type'] || 'image/jpeg';

    // Upload to Supabase Storage
    const { data, error } = await supabase.storage
      .from(BUCKET_NAME)
      .upload(filePath, buffer, {
        contentType,
        upsert: false,
      });

    if (error) {
      console.error(`Error uploading to Supabase:`, error);
      return null;
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(BUCKET_NAME)
      .getPublicUrl(data.path);

    console.log(`✓ Migrated to: ${publicUrl}`);
    return publicUrl;
  } catch (error) {
    console.error(`Error migrating image:`, error);
    return null;
  }
}

/**
 * Migrate all project images
 */
async function migrateProjects() {
  console.log('\n=== Migrating Projects ===\n');
  
  const projects = await prisma.project.findMany();

  for (const project of projects) {
    console.log(`\nMigrating project: ${project.name}`);
    const updates: any = {};

    // Migrate main image
    if (project.imageUrl && project.imageUrl.includes('cloudinary')) {
      const newUrl = await migrateImage(project.imageUrl, 'projects/images');
      if (newUrl) updates.imageUrl = newUrl;
    }

    // Migrate GIF
    if (project.gifUrl && project.gifUrl.includes('cloudinary')) {
      const newUrl = await migrateImage(project.gifUrl, 'projects/gifs');
      if (newUrl) updates.gifUrl = newUrl;
    }

    // Migrate extra images
    if (project.extraImages && project.extraImages.length > 0) {
      const newExtraImages: string[] = [];
      for (const imgUrl of project.extraImages) {
        if (imgUrl.includes('cloudinary')) {
          const newUrl = await migrateImage(imgUrl, 'projects/extra-images');
          if (newUrl) newExtraImages.push(newUrl);
        } else {
          newExtraImages.push(imgUrl);
        }
      }
      if (newExtraImages.length > 0) updates.extraImages = newExtraImages;
    }

    // Update database
    if (Object.keys(updates).length > 0) {
      await prisma.project.update({
        where: { id: project.id },
        data: updates,
      });
      console.log(`✓ Updated project in database`);
    }
  }
}

/**
 * Migrate all experience images
 */
async function migrateExperiences() {
  console.log('\n=== Migrating Experiences ===\n');
  
  const experiences = await prisma.experience.findMany();

  for (const experience of experiences) {
    console.log(`\nMigrating experience: ${experience.name}`);
    const updates: any = {};

    // Migrate main image
    if (experience.imageUrl && experience.imageUrl.includes('cloudinary')) {
      const newUrl = await migrateImage(experience.imageUrl, 'experiences/images');
      if (newUrl) updates.imageUrl = newUrl;
    }

    // Migrate GIF
    if (experience.gifUrl && experience.gifUrl.includes('cloudinary')) {
      const newUrl = await migrateImage(experience.gifUrl, 'experiences/gifs');
      if (newUrl) updates.gifUrl = newUrl;
    }

    // Migrate extra images
    if (experience.extraImages && experience.extraImages.length > 0) {
      const newExtraImages: string[] = [];
      for (const imgUrl of experience.extraImages) {
        if (imgUrl.includes('cloudinary')) {
          const newUrl = await migrateImage(imgUrl, 'experiences/extra-images');
          if (newUrl) newExtraImages.push(newUrl);
        } else {
          newExtraImages.push(imgUrl);
        }
      }
      if (newExtraImages.length > 0) updates.extraImages = newExtraImages;
    }

    // Update database
    if (Object.keys(updates).length > 0) {
      await prisma.experience.update({
        where: { id: experience.id },
        data: updates,
      });
      console.log(`✓ Updated experience in database`);
    }
  }
}

/**
 * Main migration function
 */
async function main() {
  try {
    console.log('Starting migration from Cloudinary to Supabase Storage...\n');
    
    await migrateProjects();
    await migrateExperiences();
    
    console.log('\n✅ Migration completed successfully!\n');
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
