import express from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { uploadToStorage } from '../utils/storage';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();
const prisma = new PrismaClient();
const upload = multer({ storage: multer.memoryStorage() });

// Get all settings
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

// Update settings (protected route)
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
