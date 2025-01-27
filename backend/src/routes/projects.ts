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

// Helper function to upload file to Cloudinary
const uploadToCloudinary = async (file: Express.Multer.File, folder: string) => {
  const b64 = Buffer.from(file.buffer).toString('base64');
  const dataURI = `data:${file.mimetype};base64,${b64}`;
  
  const uploadResponse = await cloudinary.uploader.upload(dataURI, {
    folder: `portfolio/${folder}`,
  });
  return uploadResponse.secure_url;
};

// Get all projects
router.get('/', asyncHandler(async (req, res) => {
  const projects = await prisma.project.findMany({
    orderBy: { position: 'asc' },
  });
  res.json(projects);
}));

// Add update ordering endpoint (MUST be before :id routes)
router.put(
  '/reorder',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    const { orderedIds } = req.body;
    console.log('Received orderedIds:', orderedIds);
    
    // Validate input
    if (!Array.isArray(orderedIds)) {
      console.log('Invalid input: orderedIds is not an array');
      res.status(400).json({ error: 'orderedIds must be an array' });
      return;
    }

    try {
      // Get existing projects first
      const existingProjects = await prisma.project.findMany({
        where: { id: { in: orderedIds } },
        select: { id: true }
      });
      console.log('Found existing projects:', existingProjects);

      // Create a Set for faster lookup
      const existingIds = new Set(existingProjects.map(p => p.id));
      
      // Verify all IDs exist
      const missingIds = orderedIds.filter(id => !existingIds.has(id));
      if (missingIds.length > 0) {
        console.log('Missing project IDs:', missingIds);
        res.status(400).json({ 
          error: 'Some project IDs do not exist',
          missingIds
        });
        return;
      }

      // Update each position sequentially
      for (const [index, id] of orderedIds.entries()) {
        console.log(`Updating project ${id} to position ${index}`);
        await prisma.project.update({
          where: { id },
          data: { position: index }
        });
      }
      
      console.log('Successfully updated all positions');
      res.json({ success: true });
    } catch (error: unknown) {
      console.error('Detailed reorder error:', {
        error,
        message: error instanceof Error ? error.message : 'Unknown error',
        orderedIds
      });
      
      res.status(500).json({ 
        error: 'Failed to update positions',
        details: error instanceof Error ? error.message : 'Unknown error'
      });
    }
  })
);

// Get single project
router.get('/:id', asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: {
      learningOutcomes: {
        orderBy: {
          position: 'asc'
        }
      }
    }
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
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gif', maxCount: 1 }
  ]),
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

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    let imageUrl = null;
    let gifUrl = null;

    if (files.image) {
      imageUrl = await uploadToCloudinary(files.image[0], 'projects/images');
    }

    if (files.gif) {
      gifUrl = await uploadToCloudinary(files.gif[0], 'projects/gifs');
    }

    const parsedLearningOutcomes = JSON.parse(learningOutcomes || '[]');

    const project = await prisma.project.create({
      data: {
        name,
        role: role || null,
        description,
        shortDesc,
        imageUrl,
        gifUrl,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        technologies: technologies ? JSON.parse(technologies) : [],
        learningOutcomes: {
          create: parsedLearningOutcomes.map((outcome: any) => ({
            header: outcome.header,
            description: outcome.description,
            position: outcome.position
          }))
        },
        dateRange,
        published: published === 'true',
        position: 0, // Default position for new items
      },
      include: {
        learningOutcomes: true
      }
    });

    res.json(project);
  })
);

// Update project (protected)
router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gif', maxCount: 1 }
  ]),
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

    // Validate required fields
    if (!name) {
      res.status(400).json({ error: 'Name is a required field' });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    const updateData: any = {
      name,
      role: role || '',
      description: description || '',
      shortDesc: shortDesc || '',
      githubUrl: githubUrl || null,
      liveUrl: liveUrl || null,
      technologies: technologies ? JSON.parse(technologies) : [],
      dateRange: dateRange || '',
      published: published === 'true'
    };

    if (files?.image) {
      updateData.imageUrl = await uploadToCloudinary(files.image[0], 'projects/images');
    }

    if (files?.gif) {
      updateData.gifUrl = await uploadToCloudinary(files.gif[0], 'projects/gifs');
    }

    // First, delete existing learning outcomes
    await prisma.learningOutcome.deleteMany({
      where: {
        projectId: req.params.id
      }
    });

    // Then update the project with new learning outcomes
    const parsedLearningOutcomes = JSON.parse(learningOutcomes || '[]');
    const project = await prisma.project.update({
      where: { id: req.params.id },
      data: {
        ...updateData,
        learningOutcomes: {
          create: parsedLearningOutcomes.map((outcome: any) => ({
            header: outcome.header || '',
            description: outcome.description || '',
            position: outcome.position
          }))
        }
      },
      include: {
        learningOutcomes: {
          orderBy: {
            position: 'asc'
          }
        }
      }
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

export default router;
