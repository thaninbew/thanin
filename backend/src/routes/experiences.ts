import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.get('/', async (req, res) => {
  const experiences = await prisma.experience.findMany();
  res.json(experiences);
});

export default router;
