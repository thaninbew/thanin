import { PrismaClient } from '@prisma/client';
import { Request, Response } from 'express';
import { uploadToCloudinary } from '../utils/cloudinary';

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
    liveUrl
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
    updateData.imageUrl = await uploadToCloudinary(
      files.image[0],
      `${entityType}s/images`
    );
  }

  if (files?.gif) {
    updateData.gifUrl = await uploadToCloudinary(
      files.gif[0],
      `${entityType}s/gifs`
    );
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

    if (files?.image) {
      imageUrl = await uploadToCloudinary(
        files.image[0],
        `${entityType}s/images`
      );
    }

    if (files?.gif) {
      gifUrl = await uploadToCloudinary(
        files.gif[0],
        `${entityType}s/gifs`
      );
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
    const existingEntities = await (prisma[entityType] as any).findMany({
      where: { id: { in: orderedIds } },
      select: { id: true }
    });

    if (existingEntities.length !== orderedIds.length) {
      return res.status(400).json({ 
        error: `Some ${entityType} IDs do not exist` 
      });
    }

    await Promise.all(
      orderedIds.map((id: string, index: number) =>
        (prisma[entityType] as any).update({
          where: { id },
          data: { position: index }
        })
      )
    );

    return res.json({ success: true });
  } catch (error) {
    console.error(`Error reordering ${entityType}s:`, error);
    return res.status(500).json({ 
      error: `Failed to update ${entityType} positions` 
    });
  }
} 