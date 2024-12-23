import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const projects = await prisma.project.findMany();
  res.json(projects);
});

export default router;
