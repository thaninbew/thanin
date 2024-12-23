import { Router, Request, Response } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';

const router = Router();
const prisma = new PrismaClient();

router.post(
  '/login',
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { username, password } = req.body;

      const user = await prisma.user.findUnique({ where: { username } });
      if (!user) {
        res.status(404).send('User not found');
        return;
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        res.status(401).send('Invalid credentials');
        return;
      }

      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
        expiresIn: '1h',
      });

      res.json({ token });
    } catch (error) {
      res.status(500).send('Internal server error');
    }
  }
);

export default router;
