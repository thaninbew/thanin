import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { uploadToStorage } from '../utils/storage';

const prisma = new PrismaClient();

export async function handleEntityUpdate(
  req: Request,
  res: Response,
  entityType: 'project' | 'experience'
) {
  const { id } = req.params;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  
  // Check if this is a publish-only update
  const isPublishUpdate = Object.keys(req.body).length === 1 && 'published' in req.body;
  
  if (isPublishUpdate) {
    try {
      const entity = await (prisma[entityType] as any).update({
        where: { id },
        data: { published: Boolean(req.body.published) },
        include: {
          learningOutcomes: {
            orderBy: { position: 'asc' }
          }
        }
      });
      return res.json(entity);
    } catch (error) {
      console.error(`Error updating ${entityType} publish state:`, error);
      return res.status(500).json({ error: `Failed to update ${entityType} publish state` });
    }
  }

  // Handle full updates
  const { 
    name,
    role,
    description,
    shortDesc,
    technologies,
    learningOutcomes,
    dateRange,
    published,
    githubUrl,
    liveUrl,
    existingExtraImages
  } = req.body;

  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (entityType === 'experience' && !role) {
    return res.status(400).json({ error: 'Role is required for experiences' });
  }

  // Prepare update data
  const updateData: any = {
    name,
    role: role || '',
    description: description || '',
    shortDesc: shortDesc || '',
    githubUrl: githubUrl || null,
    liveUrl: liveUrl || null,
    technologies: technologies ? JSON.parse(technologies) : [],
    dateRange: dateRange || '',
    published: Boolean(published)
  };

  // Handle file uploads
  if (files?.image) {
    updateData.imageUrl = await uploadToStorage(
      files.image[0],
      `${entityType}s/images`
    );
  }

  if (files?.gif) {
    updateData.gifUrl = await uploadToStorage(
      files.gif[0],
      `${entityType}s/gifs`
    );
  }

  // Handle extra images
  if (files?.extraImages) {
    const uploadPromises = files.extraImages.map(file => 
      uploadToStorage(file, `${entityType}s/extra-images`)
    );
    const uploadedUrls = await Promise.all(uploadPromises);
    const validUrls = uploadedUrls.filter((url: string | null) => url !== null) as string[];
    
    updateData.extraImages = validUrls;
  } else if (existingExtraImages) {
    // If no new extra images but existing ones are provided
    updateData.extraImages = JSON.parse(existingExtraImages);
  }

  // Parse learning outcomes
  const parsedOutcomes = JSON.parse(learningOutcomes || '[]')
    .filter((outcome: any) => outcome.header?.trim() && outcome.description?.trim())
    .map((outcome: any, index: number) => ({
      header: outcome.header,
      description: outcome.description,
      position: index
    }));

  try {
    // Delete existing outcomes
    await prisma.learningOutcome.deleteMany({
      where: {
        [entityType === 'project' ? 'projectId' : 'experienceId']: id
      }
    });

    // Update entity with new outcomes
    const entity = await (prisma[entityType] as any).update({
      where: { id },
      data: {
        ...updateData,
        learningOutcomes: {
          create: parsedOutcomes
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

    return res.json(entity);
  } catch (error) {
    console.error(`Error updating ${entityType}:`, error);
    return res.status(500).json({ error: `Failed to update ${entityType}` });
  }
}

export async function handleEntityCreate(
  req: Request,
  res: Response,
  entityType: 'project' | 'experience'
) {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  
  const { 
    name,
    role,
    description,
    shortDesc,
    technologies,
    learningOutcomes,
    dateRange,
    published,
    githubUrl,
    liveUrl
  } = req.body;

  // Validate required fields
  if (!name) {
    return res.status(400).json({ error: 'Name is required' });
  }

  if (entityType === 'experience' && !role) {
    return res.status(400).json({ error: 'Role is required for experiences' });
  }

  try {
    let imageUrl = null;
    let gifUrl = null;
    let extraImages: string[] = [];

    if (files?.image) {
      imageUrl = await uploadToStorage(
        files.image[0],
        `${entityType}s/images`
      );
    }

    if (files?.gif) {
      gifUrl = await uploadToStorage(
        files.gif[0],
        `${entityType}s/gifs`
      );
    }

    // Handle extra images
    if (files?.extraImages) {
      const uploadPromises = files.extraImages.map(file => 
        uploadToStorage(file, `${entityType}s/extra-images`)
      );
      const uploadedUrls = await Promise.all(uploadPromises);
      extraImages = uploadedUrls.filter((url: string | null) => url !== null) as string[];
    }

    const parsedOutcomes = JSON.parse(learningOutcomes || '[]')
      .filter((outcome: any) => outcome.header?.trim() && outcome.description?.trim())
      .map((outcome: any, index: number) => ({
        header: outcome.header,
        description: outcome.description,
        position: index
      }));

    const entity = await (prisma[entityType] as any).create({
      data: {
        name,
        role: role || '',
        description: description || '',
        shortDesc: shortDesc || '',
        imageUrl,
        gifUrl,
        extraImages,
        githubUrl: githubUrl || null,
        liveUrl: liveUrl || null,
        technologies: technologies ? JSON.parse(technologies) : [],
        learningOutcomes: {
          create: parsedOutcomes
        },
        dateRange: dateRange || '',
        published: published === 'true',
        position: 0
      },
      include: {
        learningOutcomes: {
          orderBy: {
            position: 'asc'
          }
        }
      }
    });

    return res.json(entity);
  } catch (error) {
    console.error(`Error creating ${entityType}:`, error);
    return res.status(500).json({ error: `Failed to create ${entityType}` });
  }
}

export async function handleReorder(
  req: Request,
  res: Response,
  entityType: 'project' | 'experience'
) {
  const { orderedIds } = req.body;

  if (!Array.isArray(orderedIds)) {
    return res.status(400).json({ error: 'orderedIds must be an array' });
  }

  try {
    // Update positions in transaction
    await prisma.$transaction(async (tx) => {
      for (let i = 0; i < orderedIds.length; i++) {
        await (tx[entityType] as any).update({
          where: { id: orderedIds[i] },
          data: { position: i }
        });
      }
    });

    const items = await (prisma[entityType] as any).findMany({
      orderBy: { position: 'asc' },
      include: {
        learningOutcomes: {
          orderBy: { position: 'asc' }
        }
      }
    });

    res.json(items);
  } catch (error) {
    console.error(`Error reordering ${entityType}s:`, error);
    res.status(500).json({ error: `Failed to reorder ${entityType}s` });
  }
} 