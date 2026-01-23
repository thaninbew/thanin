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

// Get all projects
router.get('/', asyncHandler(async (req, res) => {
  const projects = await prisma.project.findMany({
    orderBy: { position: 'asc' },
    include: {
      learningOutcomes: {
        orderBy: { position: 'asc' }
      }
    }
  });
  res.json(projects);
}));

// Create project
router.post('/',
  authenticateToken,
  requireAdmin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gif', maxCount: 1 },
    { name: 'extraImages', maxCount: 10 }
  ]),
  asyncHandler(async (req, res) => {
    await handleEntityCreate(req, res, 'project')
  })
);

// Reorder projects - must come before /:id routes
router.put('/reorder',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    await handleReorder(req, res, 'project')
  })
);

// Get single project
router.get('/:id', asyncHandler(async (req, res) => {
  const project = await prisma.project.findUnique({
    where: { id: req.params.id },
    include: {
      learningOutcomes: {
        orderBy: { position: 'asc' }
      }
    }
  });
  
  if (!project) {
    res.status(404).json({ error: 'Project not found' })
    return;
  }
  
  res.json(project);
}));

// Update project
router.put('/:id',
  authenticateToken,
  requireAdmin,
  upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gif', maxCount: 1 },
    { name: 'extraImages', maxCount: 10 }
  ]),
  asyncHandler(async (req, res) => {
    await handleEntityUpdate(req, res, 'project')
  })
);

// Delete project
router.delete('/:id',
  authenticateToken,
  requireAdmin,
  asyncHandler(async (req, res) => {
    await prisma.project.delete({
      where: { id: req.params.id }
    });
    res.json({ message: 'Project deleted successfully' });
  })
);

export default router;
