import { Router } from 'express';
import { PrismaClient } from '@prisma/client';
import nodemailer from 'nodemailer';
import asyncHandler from 'express-async-handler';

const router = Router();
const prisma = new PrismaClient();

// Configure nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Contact form submission
router.post('/', asyncHandler(async (req, res) => {
  const { name, email, message } = req.body;

  // Validate input
  if (!name || !email || !message) {
    res.status(400).json({ error: 'All fields are required' })
    return;
  }

  try {
    // Save contact submission to database
    await prisma.contactSubmission.create({
      data: {
        name,
        email,
        message
      }
    });

    // Send email notification
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: 'bewxtt@gmail.com', // Your email
      subject: `New Contact Form Submission from ${name}`,
      text: `
        Name: ${name}
        Email: ${email}
        Message: ${message}
      `,
      html: `
        <h2>New Contact Form Submission</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <p>${message}</p>
      `
    });

    res.json({ message: 'Message sent successfully' });
  } catch (error) {
    console.error('Contact submission error:', error);
    res.status(500).json({ error: 'Failed to send message' });
  }
}));

export default router; 