import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import multer from 'multer';
import { authenticateToken, requireAdmin } from '../middleware/auth';
import { handleEntityCreate, handleEntityUpdate, handleReorder } from './shared';
import asyncHandler from 'express-async-handler';

const router = Router();
const prisma = new PrismaClient();

// Multer configuration
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }
});

// Get all experiences
router.get('/', asyncHandler(async (req, res) => {
  const experiences = await prisma.experience.findMany({
    orderBy: { position: 'asc' },
    include: {
      learningOutcomes: {
        orderBy: { position: 'asc' }
      }
    }
  });
  res.json(experiences);
}));

// Create experience
router.post('/',
  authenticateToken,
  requireAdmin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gif', maxCount: 1 },
    { name: 'extraImages', maxCount: 10 }
  ]),
  asyncHandler(async (req, res) => {
    await handleEntityCreate(req, res, 'experience');
  })
);

// Reorder experiences - must come before /:id routes
router.put('/reorder',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    await handleReorder(req, res, 'experience');
  })
);

// Get single experience
router.get('/:id', asyncHandler(async (req, res) => {
  const experience = await prisma.experience.findUnique({
    where: { id: req.params.id },
    include: {
      learningOutcomes: {
        orderBy: { position: 'asc' }
      }
    }
  });
  
  if (!experience) {
    res.status(404).json({ error: 'Experience not found' });
    return;
  }
  
  res.json(experience);
}));

// Update experience
router.put('/:id',
  authenticateToken,
  requireAdmin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gif', maxCount: 1 },
    { name: 'extraImages', maxCount: 10 }
  ]),
  asyncHandler(async (req, res) => {
    await handleEntityUpdate(req, res, 'experience');
  })
);

// Delete experience
router.delete('/:id',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    await prisma.experience.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Experience deleted successfully' });
  })
);

export default router;
