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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const client_1 = require("@prisma/client");
const multer_1 = __importDefault(require("multer"));
const auth_1 = require("../middleware/auth");
const shared_1 = require("./shared");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// Multer configuration
const upload = (0, multer_1.default)({
    storage: multer_1.default.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024 }
});
// Get all projects
router.get('/', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const projects = yield prisma.project.findMany({
        orderBy: { position: 'asc' },
        include: {
            learningOutcomes: {
                orderBy: { position: 'asc' }
            }
        }
    });
    res.json(projects);
})));
// Create project
router.post('/', auth_1.authenticateToken, auth_1.requireAdmin, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gif', maxCount: 1 }
]), (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, shared_1.handleEntityCreate)(req, res, 'project');
})));
// Reorder projects - must come before /:id routes
router.put('/reorder', auth_1.authenticateToken, auth_1.requireAdmin, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, shared_1.handleReorder)(req, res, 'project');
})));
// Get single project
router.get('/:id', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const project = yield prisma.project.findUnique({
        where: { id: req.params.id },
        include: {
            learningOutcomes: {
                orderBy: { position: 'asc' }
            }
        }
    });
    if (!project) {
        res.status(404).json({ error: 'Project not found' });
        return;
    }
    res.json(project);
})));
// Update project
router.put('/:id', auth_1.authenticateToken, auth_1.requireAdmin, upload.fields([
    { name: 'image', maxCount: 1 },
    { name: 'gif', maxCount: 1 }
]), (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield (0, shared_1.handleEntityUpdate)(req, res, 'project');
})));
// Delete project
router.delete('/:id', auth_1.authenticateToken, auth_1.requireAdmin, (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield prisma.project.delete({
        where: { id: req.params.id }
    });
    res.json({ message: 'Project deleted successfully' });
})));
exports.default = router;
