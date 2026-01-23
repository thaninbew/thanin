"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEntityUpdate = handleEntityUpdate;
exports.handleEntityCreate = handleEntityCreate;
exports.handleReorder = handleReorder;
const client_1 = require("@prisma/client");
const storage_1 = require("../utils/storage");
const prisma = new client_1.PrismaClient();
async function handleEntityUpdate(req, res, entityType) {
    const { id } = req.params;
    const files = req.files;
    // Check if this is a publish-only update
    const isPublishUpdate = Object.keys(req.body).length === 1 && 'published' in req.body;
    if (isPublishUpdate) {
        try {
            const entity = await prisma[entityType].update({
                where: { id },
                data: { published: Boolean(req.body.published) },
                include: {
                    learningOutcomes: {
                        orderBy: { position: 'asc' }
                    }
                }
            });
            return res.json(entity);
        }
        catch (error) {
            console.error(`Error updating ${entityType} publish state:`, error);
            return res.status(500).json({ error: `Failed to update ${entityType} publish state` });
        }
    }
    // Handle full updates
    const { name, role, description, shortDesc, technologies, learningOutcomes, dateRange, published, githubUrl, liveUrl, existingExtraImages } = req.body;
    if (!name) {
        return res.status(400).json({ error: 'Name is required' });
    }
    if (entityType === 'experience' && !role) {
        return res.status(400).json({ error: 'Role is required for experiences' });
    }
    // Prepare update data
    const updateData = {
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
        updateData.imageUrl = await (0, storage_1.uploadToStorage)(files.image[0], `${entityType}s/images`);
    }
    if (files?.gif) {
        updateData.gifUrl = await (0, storage_1.uploadToStorage)(files.gif[0], `${entityType}s/gifs`);
    }
    // Handle extra images
    if (files?.extraImages) {
        const uploadPromises = files.extraImages.map(file => (0, storage_1.uploadToStorage)(file, `${entityType}s/extra-images`));
        const uploadedUrls = await Promise.all(uploadPromises);
        const validUrls = uploadedUrls.filter((url) => url !== null);
        updateData.extraImages = validUrls;
    }
    else if (existingExtraImages) {
        // If no new extra images but existing ones are provided
        updateData.extraImages = JSON.parse(existingExtraImages);
    }
    // Parse learning outcomes
    const parsedOutcomes = JSON.parse(learningOutcomes || '[]')
        .filter((outcome) => outcome.header?.trim() && outcome.description?.trim())
        .map((outcome, index) => ({
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
        const entity = await prisma[entityType].update({
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
    }
    catch (error) {
        console.error(`Error updating ${entityType}:`, error);
        return res.status(500).json({ error: `Failed to update ${entityType}` });
    }
}
async function handleEntityCreate(req, res, entityType) {
    const files = req.files;
    const { name, role, description, shortDesc, technologies, learningOutcomes, dateRange, published, githubUrl, liveUrl } = req.body;
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
        let extraImages = [];
        if (files?.image) {
            imageUrl = await (0, storage_1.uploadToStorage)(files.image[0], `${entityType}s/images`);
        }
        if (files?.gif) {
            gifUrl = await (0, storage_1.uploadToStorage)(files.gif[0], `${entityType}s/gifs`);
        }
        // Handle extra images
        if (files?.extraImages) {
            const uploadPromises = files.extraImages.map(file => (0, storage_1.uploadToStorage)(file, `${entityType}s/extra-images`));
            const uploadedUrls = await Promise.all(uploadPromises);
            extraImages = uploadedUrls.filter((url) => url !== null);
        }
        const parsedOutcomes = JSON.parse(learningOutcomes || '[]')
            .filter((outcome) => outcome.header?.trim() && outcome.description?.trim())
            .map((outcome, index) => ({
            header: outcome.header,
            description: outcome.description,
            position: index
        }));
        const entity = await prisma[entityType].create({
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
    }
    catch (error) {
        console.error(`Error creating ${entityType}:`, error);
        return res.status(500).json({ error: `Failed to create ${entityType}` });
    }
}
async function handleReorder(req, res, entityType) {
    const { orderedIds } = req.body;
    if (!Array.isArray(orderedIds)) {
        return res.status(400).json({ error: 'orderedIds must be an array' });
    }
    try {
        // Update positions in transaction
        await prisma.$transaction(async (tx) => {
            for (let i = 0; i < orderedIds.length; i++) {
                await tx[entityType].update({
                    where: { id: orderedIds[i] },
                    data: { position: i }
                });
            }
        });
        const items = await prisma[entityType].findMany({
            orderBy: { position: 'asc' },
            include: {
                learningOutcomes: {
                    orderBy: { position: 'asc' }
                }
            }
        });
        res.json(items);
    }
    catch (error) {
        console.error(`Error reordering ${entityType}s:`, error);
        res.status(500).json({ error: `Failed to reorder ${entityType}s` });
    }
}
