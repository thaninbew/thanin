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

// Get all projects
router.get('/', asyncHandler(async (req, res) => {
  const projects = await prisma.project.findMany({
    orderBy: { position: 'asc' },
  });
  res.json(projects);
}));

// Get single project
router.get('/:id', asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
  });
  if (!project) {
    res.status(404).json({ error: 'Project not found' });
    return;
  }
  res.json(project);
}));

// Create project (protected)
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
        folder: 'portfolio/projects',
      });
      imageUrl = uploadResponse.secure_url;
    }

    const project = await prisma.project.create({
      data: {
        name,
        role: role || null,
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

    res.json(project);
  })
);

// Update project (protected)
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
        folder: 'portfolio/projects',
      });
      imageUrl = uploadResponse.secure_url;
    }

    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        name,
        role: role || null,
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

    res.json(project);
  })
);

// Delete project (protected)
router.delete(
  '/:id',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    await prisma.project.delete({
      where: { id: req.params.id },
    });
    res.json({ message: 'Project deleted successfully' });
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
    const existingProjects = await prisma.project.findMany({
      where: {
        id: {
          in: orderedIds
        }
      },
      select: {
        id: true
      }
    });

    if (existingProjects.length !== orderedIds.length) {
      res.status(400).json({ error: 'Some project IDs do not exist' });
      return;
    }

    // Update positions in a transaction to ensure consistency
    await prisma.$transaction(
      orderedIds.map((id, index) => 
        prisma.project.update({
          where: { id },
          data: { position: index }
        })
      )
    );

    res.json({ success: true });
  })
);

export default router;
