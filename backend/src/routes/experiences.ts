import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import cloudinary from '../utils/cloudinary';
import asyncHandler from 'express-async-handler';

const router = Router();
const prisma = new PrismaClient();

// Multer configuration for handling file uploads
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
});

// Get all experiences
router.get('/', asyncHandler(async (req, res) => {
  const experiences = await prisma.experience.findMany({
    orderBy: { createdAt: 'desc' },
  });
  res.json(experiences);
}));

// Get single experience
router.get('/:id', asyncHandler(async (req, res) => {
  const experience = await prisma.experience.findUnique({
    where: { id: req.params.id },
  });
  if (!experience) {
    res.status(404).json({ error: 'Experience not found' });
    return;
  }
  res.json(experience);
}));

// Create experience (protected)
router.post(
  '/',
  authenticateToken,
  requireAdmin,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    const { 
      name, 
      role, 
      description, 
      shortDesc, 
      githubUrl,
      liveUrl,
      technologies,
      learningOutcomes,
      dateRange,
      published 
    } = req.body;

    let imageUrl = null;
    if (req.file) {
      // Convert buffer to base64
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      // Upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: 'portfolio/experiences',
      });
      imageUrl = uploadResponse.secure_url;
    }

    const experience = await prisma.experience.create({
      data: {
        name,
        role,
        description,
        shortDesc,
        imageUrl,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        technologies: technologies ? JSON.parse(technologies) : [],
        learningOutcomes: learningOutcomes ? JSON.parse(learningOutcomes) : [],
        dateRange,
        published: published === 'true',
        position: 0, // Default position for new items
      },
    });

    res.json(experience);
  })
);

// Update experience (protected)
router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  upload.single('image'),
  asyncHandler(async (req, res) => {
    const { 
      name, 
      role, 
      description, 
      shortDesc, 
      githubUrl,
      liveUrl,
      technologies,
      learningOutcomes,
      dateRange,
      published 
    } = req.body;

    let imageUrl = undefined;
    if (req.file) {
      // Convert buffer to base64
      const b64 = Buffer.from(req.file.buffer).toString('base64');
      const dataURI = `data:${req.file.mimetype};base64,${b64}`;
      
      // Upload to Cloudinary
      const uploadResponse = await cloudinary.uploader.upload(dataURI, {
        folder: 'portfolio/experiences',
      });
      imageUrl = uploadResponse.secure_url;
    }

    const experience = await prisma.experience.update({
      where: { id: req.params.id },
      data: {
        name,
        role,
        description,
        shortDesc,
        ...(imageUrl && { imageUrl }),
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        ...(technologies && { technologies: JSON.parse(technologies) }),
        ...(learningOutcomes && { learningOutcomes: JSON.parse(learningOutcomes) }),
        dateRange,
        ...(published !== undefined && { published: published === 'true' }),
      },
    });

    res.json(experience);
  })
);

// Add update ordering endpoint
router.put(
  '/reorder',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { orderedIds } = req.body;
    
    // Validate input
    if (!Array.isArray(orderedIds)) {
      res.status(400).json({ error: 'orderedIds must be an array' });
      return;
    }

    // Verify all IDs exist before updating
    const existingExperiences = await prisma.experience.findMany({
      where: {
        id: {
          in: orderedIds
        }
      },
      select: {
        id: true
      }
    });

    if (existingExperiences.length !== orderedIds.length) {
      res.status(400).json({ error: 'Some experience IDs do not exist' });
      return;
    }

    const updatePromises = orderedIds.map((id: string, index: number) => 
      prisma.experience.update({
        where: { id },
        data: { position: index }
      })
    );

    await Promise.all(updatePromises);
    res.json({ success: true });
  })
);

// Delete experience (protected)
router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    await prisma.experience.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Experience deleted successfully' });
  })
);

export default router;
