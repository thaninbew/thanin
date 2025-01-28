"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleEntityUpdate = handleEntityUpdate;
exports.handleEntityCreate = handleEntityCreate;
exports.handleReorder = handleReorder;
const client_1 = require("@prisma/client");
const cloudinary_1 = require("../utils/cloudinary");
const prisma = new client_1.PrismaClient();
function handleEntityUpdate(req, res, entityType) {
    return __awaiter(this, void 0, void 0, function* () {
        const { id } = req.params;
        const files = req.files;
        // Check if this is a publish-only update
        const isPublishUpdate = Object.keys(req.body).length === 1 && 'published' in req.body;
        if (isPublishUpdate) {
            try {
                const entity = yield prisma[entityType].update({
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
        const { name, role, description, shortDesc, technologies, learningOutcomes, dateRange, published, githubUrl, liveUrl } = req.body;
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
        if (files === null || files === void 0 ? void 0 : files.image) {
            updateData.imageUrl = yield (0, cloudinary_1.uploadToCloudinary)(files.image[0], `${entityType}s/images`);
        }
        if (files === null || files === void 0 ? void 0 : files.gif) {
            updateData.gifUrl = yield (0, cloudinary_1.uploadToCloudinary)(files.gif[0], `${entityType}s/gifs`);
        }
        // Parse learning outcomes
        const parsedOutcomes = JSON.parse(learningOutcomes || '[]')
            .filter((outcome) => { var _a, _b; return ((_a = outcome.header) === null || _a === void 0 ? void 0 : _a.trim()) && ((_b = outcome.description) === null || _b === void 0 ? void 0 : _b.trim()); })
            .map((outcome, index) => ({
            header: outcome.header,
            description: outcome.description,
            position: index
        }));
        try {
            // Delete existing outcomes
            yield prisma.learningOutcome.deleteMany({
                where: {
                    [entityType === 'project' ? 'projectId' : 'experienceId']: id
                }
            });
            // Update entity with new outcomes
            const entity = yield prisma[entityType].update({
                where: { id },
                data: Object.assign(Object.assign({}, updateData), { learningOutcomes: {
                        create: parsedOutcomes
                    } }),
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
    });
}
function handleEntityCreate(req, res, entityType) {
    return __awaiter(this, void 0, void 0, function* () {
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
            if (files === null || files === void 0 ? void 0 : files.image) {
                imageUrl = yield (0, cloudinary_1.uploadToCloudinary)(files.image[0], `${entityType}s/images`);
            }
            if (files === null || files === void 0 ? void 0 : files.gif) {
                gifUrl = yield (0, cloudinary_1.uploadToCloudinary)(files.gif[0], `${entityType}s/gifs`);
            }
            const parsedOutcomes = JSON.parse(learningOutcomes || '[]')
                .filter((outcome) => { var _a, _b; return ((_a = outcome.header) === null || _a === void 0 ? void 0 : _a.trim()) && ((_b = outcome.description) === null || _b === void 0 ? void 0 : _b.trim()); })
                .map((outcome, index) => ({
                header: outcome.header,
                description: outcome.description,
                position: index
            }));
            const entity = yield prisma[entityType].create({
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
        }
        catch (error) {
            console.error(`Error creating ${entityType}:`, error);
            return res.status(500).json({ error: `Failed to create ${entityType}` });
        }
    });
}
function handleReorder(req, res, entityType) {
    return __awaiter(this, void 0, void 0, function* () {
        const { orderedIds } = req.body;
        if (!Array.isArray(orderedIds)) {
            return res.status(400).json({
                error: 'Invalid request format',
                details: 'orderedIds must be an array'
            });
        }
        try {
            // Perform all operations in a transaction
            const result = yield prisma.$transaction((tx) => __awaiter(this, void 0, void 0, function* () {
                // First verify all IDs exist
                const existingEntities = yield tx[entityType].findMany({
                    where: { id: { in: orderedIds } },
                    select: { id: true }
                });
                const existingIds = new Set(existingEntities.map((e) => e.id));
                const missingIds = orderedIds.filter(id => !existingIds.has(id));
                if (missingIds.length > 0) {
                    throw new Error(`Invalid ${entityType} IDs: ${missingIds.join(', ')}`);
                }
                // Update positions
                yield Promise.all(orderedIds.map((id, index) => tx[entityType].update({
                    where: { id },
                    data: { position: index }
                })));
                // Return the updated list
                return yield tx[entityType].findMany({
                    orderBy: { position: 'asc' },
                    include: {
                        learningOutcomes: {
                            orderBy: { position: 'asc' }
                        }
                    }
                });
            }));
            return res.json(result);
        }
        catch (error) {
            console.error(`Error reordering ${entityType}s:`, error);
            if (error instanceof Error) {
                return res.status(400).json({
                    error: `Failed to reorder ${entityType}s`,
                    details: error.message
                });
            }
            return res.status(500).json({
                error: `Internal server error while reordering ${entityType}s`
            });
        }
    });
}
