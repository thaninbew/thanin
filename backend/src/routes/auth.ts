import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';

const router = Router();
const prisma = new PrismaClient();

// Register new admin (this should be protected or removed in production)
router.post('/register', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if admin already exists
  const existingAdmin = await prisma.admin.findUnique({
    where: { email },
  });

  if (existingAdmin) {
    res.status(400).json({ error: 'Admin already exists' });
    return;
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Create admin
  const admin = await prisma.admin.create({
    data: {
      email,
      password: hashedPassword,
    },
  });

  // Create token
  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );

  res.json({ token });
}));

// Login
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Check if admin exists
  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin) {
    res.status(400).json({ error: 'Invalid credentials' });
    return;
  }

  // Check password
  const validPassword = await bcrypt.compare(password, admin.password);
  if (!validPassword) {
    res.status(400).json({ error: 'Invalid credentials' });
    return;
  }

  // Create token
  const token = jwt.sign(
    { id: admin.id, email: admin.email },
    process.env.JWT_SECRET!,
    { expiresIn: '24h' }
  );

  res.json({ token, isAdmin: true });
}));

export default router;
