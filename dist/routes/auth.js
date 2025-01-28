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
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
const prisma = new client_1.PrismaClient();
// // // Register new admin (this should be protected or removed in production)
// router.post('/register', asyncHandler(async (req, res) => {
//   const { email, password } = req.body;
//   // Check if admin already exists
//   const existingAdmin = await prisma.admin.findUnique({
//     where: { email },
//   });
//   if (existingAdmin) {
//     res.status(400).json({ error: 'Admin already exists' });
//     return;
//   }
//   // Hash password
//   const salt = await bcrypt.genSalt(10);
//   const hashedPassword = await bcrypt.hash(password, salt);
//   // Create admin
//   const admin = await prisma.admin.create({
//     data: {
//       email,
//       password: hashedPassword,
//     },
//   });
//   // Create token
//   const token = jwt.sign(
//     { id: admin.id, email: admin.email },
//     process.env.JWT_SECRET!,
//     { expiresIn: '24h' }
//   );
//   res.json({ token });
// }));
// Login
router.post('/login', (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    // Check if admin exists
    const admin = yield prisma.admin.findUnique({
        where: { email },
    });
    if (!admin) {
        res.status(400).json({ error: 'Invalid credentials' });
        return;
    }
    // Check password
    const validPassword = yield bcryptjs_1.default.compare(password, admin.password);
    if (!validPassword) {
        res.status(400).json({ error: 'Invalid credentials' });
        return;
    }
    // Create token
    const token = jsonwebtoken_1.default.sign({ id: admin.id, email: admin.email }, process.env.JWT_SECRET, { expiresIn: '24h' });
    res.json({ token, isAdmin: true });
})));
// Logout
router.post('/logout', auth_1.authenticateToken, (req, res) => {
    res.json({ message: 'Logged out successfully' });
});
exports.default = router;
