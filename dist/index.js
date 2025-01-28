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
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const client_1 = require("@prisma/client");
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_1 = __importDefault(require("./routes/auth"));
const projects_1 = __importDefault(require("./routes/projects"));
const experiences_1 = __importDefault(require("./routes/experiences"));
const contact_1 = __importDefault(require("./routes/contact"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const prisma = new client_1.PrismaClient();
const PORT = process.env.PORT || 3001;
// Security middleware
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100 // limit each IP to 100 requests per windowMs
});
// Apply rate limiting to all routes
app.use(limiter);
// Use helmet for security headers
app.use((0, helmet_1.default)());
// CORS configuration
app.use((0, cors_1.default)({
    origin: process.env.NODE_ENV === 'production'
        ? ['https://thaninbew.dev']
        : 'http://localhost:3000',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true
}));
app.use(express_1.default.json());
// Health check route with basic system info
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memoryUsage: process.memoryUsage()
    });
});
// Routes
app.use('/api/auth', auth_1.default);
app.use('/api/projects', projects_1.default);
app.use('/api/experiences', experiences_1.default);
app.use('/api/contact', contact_1.default);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});
// Connect to database and start server
function startServer() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            yield prisma.$connect();
            console.log('Connected to database');
            const server = app.listen(PORT, () => {
                console.log(`Server is running on http://localhost:${PORT}`);
            });
            // Handle graceful shutdown
            process.on('SIGTERM', () => {
                console.log('SIGTERM signal received: closing HTTP server');
                server.close(() => {
                    prisma.$disconnect();
                    console.log('HTTP server closed');
                    process.exit(0);
                });
            });
            process.on('SIGINT', () => {
                console.log('SIGINT signal received: closing HTTP server');
                server.close(() => {
                    prisma.$disconnect();
                    console.log('HTTP server closed');
                    process.exit(0);
                });
            });
        }
        catch (error) {
            console.error('Error starting server:', error);
            yield prisma.$disconnect();
            process.exit(1);
        }
    });
}
startServer();
