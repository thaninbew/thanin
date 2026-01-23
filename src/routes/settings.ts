import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { uploadToStorage } from '../utils/storage';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

/**
 * GET /api/settings
 * Get all settings as a key-value object
 */
router.get('/', async (req, res) => {
  try {
    const settings = await prisma.settings.findMany();
    const settingsObject = settings.reduce((acc: Record<string, string>, setting: { key: string; value: string }) => {
      acc[setting.key] = setting.value;
      return acc;
    }, {} as Record<string, string>);
    
    res.json(settingsObject);
  } catch (error) {
    console.error('Error fetching settings:', error);
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

/**
 * POST /api/settings/upload/:key
 * Upload a file for a specific setting key
 */
router.post('/upload/:key', authenticateToken, upload.single('file'), async (req: any, res) => {
  try {
    const { key } = req.params;
    const file = req.file;

    if (!file) {
      res.status(400).json({ error: 'No file provided' });
      return;
    }

    // Validate key is in allowed settings
    const allowedKeys = [
      'site_favicon',
      'og_image',
      'profile_image',
      'background_video',
      'experience_placeholder',
      'projects_placeholder'
    ];

    if (!allowedKeys.includes(key)) {
      res.status(400).json({ error: 'Invalid setting key' });
      return;
    }

    // Upload to Supabase
    const fileUrl = await uploadToStorage(file, 'settings');

    if (!fileUrl) {
      res.status(500).json({ error: 'Failed to upload file' });
      return;
    }

    // Save or update setting in database
    const setting = await prisma.settings.upsert({
      where: { key },
      update: { value: fileUrl },
      create: { key, value: fileUrl }
    });

    res.json(setting);
  } catch (error) {
    console.error('Error uploading setting:', error);
    res.status(500).json({ error: 'Failed to upload setting' });
  }
});

/**
 * POST /api/settings
 * Update multiple settings (legacy endpoint)
 */
router.post('/', authenticateToken, upload.fields([
  { name: 'favicon', maxCount: 1 },
  { name: 'profileImage', maxCount: 1 },
  { name: 'backgroundVideo', maxCount: 1 },
  { name: 'phoneBackgroundVideo', maxCount: 1 }
]), async (req, res) => {
  try {
    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const updates: { key: string; value: string }[] = [];

    // Handle file uploads
    if (files) {
      for (const [fieldName, fileArray] of Object.entries(files)) {
        if (fileArray && fileArray.length > 0) {
          const file = fileArray[0];
          const folder = fieldName === 'favicon' ? 'settings/favicon' : 
                        fieldName === 'profileImage' ? 'settings/profile' :
                        'settings/videos';
          
          const url = await uploadToStorage(file, folder);
          if (url) {
            updates.push({ key: fieldName, value: url });
          }
        }
      }
    }

    // Handle text field updates from request body
    if (req.body) {
      const textFields = ['resumeUrl', 'githubUrl', 'linkedinUrl', 'emailAddress'];
      for (const field of textFields) {
        if (req.body[field] !== undefined) {
          updates.push({ key: field, value: req.body[field] });
        }
      }
    }

    // Update settings in database
    const updatedSettings = await Promise.all(
      updates.map(({ key, value }) =>
        prisma.settings.upsert({
          where: { key },
          update: { value },
          create: { key, value }
        })
      )
    );

    res.json({ 
      message: 'Settings updated successfully',
      settings: updatedSettings 
    });
  } catch (error) {
    console.error('Error updating settings:', error);
    res.status(500).json({ error: 'Failed to update settings' });
  }
});

export default router;
