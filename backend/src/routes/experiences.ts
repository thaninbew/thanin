import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import asyncHandler from 'express-async-handler';
import { uploadToCloudinary } from '../utils/cloudinary';

interface LearningOutcome {
  id?: string;
  header: string;
  description: string;
  position: number;
  experienceId?: string;
}

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
    orderBy: { position: 'asc' },
    include: {
      learningOutcomes: {
        orderBy: {
          position: 'asc'
        }
      }
    }
  });
  res.json(experiences);
}));

// Get single experience
router.get('/:id', asyncHandler(async (req, res) => {
  console.log('=== Get Single Experience ===');
  console.log('Fetching experience:', req.params.id);
  
  const experience = await prisma.experience.findUnique({
    where: { id: req.params.id },
    include: {
      learningOutcomes: {
        orderBy: {
          position: 'asc'
        }
      }
    }
  });

  if (!experience) {
    console.log('Experience not found');
    res.status(404).json({ error: 'Experience not found' });
    return;
  }

  console.log('Found experience:', experience);
  res.json(experience);
}));

// Create experience (protected)
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
      name,  // Changed from company to name to match project
      role,
      description, 
      shortDesc, 
      technologies, 
      learningOutcomes,
      dateRange,
      published 
    } = req.body;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    
    let imageUrl = null;
    let gifUrl = null;

    if (files?.image) {
      imageUrl = await uploadToCloudinary(files.image[0], 'experiences/images');
    }

    if (files?.gif) {
      gifUrl = await uploadToCloudinary(files.gif[0], 'experiences/gifs');
    }

    const parsedLearningOutcomes = JSON.parse(learningOutcomes || '[]');

    const experience = await prisma.experience.create({
      data: {
        name,  // Use name directly now
        role: role || '',
        description: description || '',
        shortDesc: shortDesc || '',
        imageUrl,
        gifUrl,
        technologies: technologies ? JSON.parse(technologies) : [],
        learningOutcomes: {
          create: parsedLearningOutcomes.map((outcome: LearningOutcome) => ({
            header: outcome.header || '',
            description: outcome.description || '',
            position: outcome.position
          }))
        },
        dateRange: dateRange || '',
        published: published === 'true',
        position: 0, // Default position for new items
      },
      include: {
        learningOutcomes: {
          orderBy: {
            position: 'asc'
          }
        }
      }
    });

    res.json(experience);
  })
);

// Update experience (protected)
router.put(
  '/:id',
  authenticateToken,
  requireAdmin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gif', maxCount: 1 }
  ]),
  asyncHandler(async (req, res) => {
    console.log('=== Experience Update Route ===');
    console.log('Raw request body:', req.body);
    
    const { 
      name,
      role,
      description, 
      shortDesc, 
      technologies, 
      learningOutcomes,
      dateRange,
      published 
    } = req.body;

    console.log('Extracted fields:', {
      name,
      role,
      description,
      shortDesc,
      technologies,
      learningOutcomes,
      dateRange,
      published
    });

    // Check if this is a publish-only update
    const isPublishUpdate = Object.keys(req.body).length === 1 && published !== undefined;
    console.log('Is publish-only update:', isPublishUpdate);

    if (isPublishUpdate) {
      // For publish updates, just update the published field
      const experience = await prisma.experience.update({
        where: { id: req.params.id },
        data: { published: published === 'true' },
        include: {
          learningOutcomes: {
            orderBy: { position: 'asc' }
          }
        }
      });
      console.log('Publish update response:', experience);
      res.json(experience);
      return;
    }

    // For full updates, validate required fields
    if (!name) {
      res.status(400).json({ error: 'Name is a required field' });
      return;
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    console.log('Uploaded files:', files ? Object.keys(files) : 'none');
    
    const updateData: any = {
      name,
      role: role || '',
      description: description || '',
      shortDesc: shortDesc || '',
      technologies: technologies ? JSON.parse(technologies) : [],
      dateRange: dateRange || '',
      published: published === 'true'
    };

    console.log('Update data before files:', updateData);

    if (files?.image) {
      updateData.imageUrl = await uploadToCloudinary(files.image[0], 'experiences/images');
      console.log('Added image URL:', updateData.imageUrl);
    }

    if (files?.gif) {
      updateData.gifUrl = await uploadToCloudinary(files.gif[0], 'experiences/gifs');
      console.log('Added GIF URL:', updateData.gifUrl);
    }

    console.log('Final update data:', updateData);

    // First, delete existing learning outcomes
    await prisma.learningOutcome.deleteMany({
      where: {
        experienceId: req.params.id
      }
    });

    // Then update the experience with new learning outcomes
    const parsedLearningOutcomes = JSON.parse(learningOutcomes || '[]');
    const experience = await prisma.experience.update({
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

    console.log('Final response:', experience);
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
