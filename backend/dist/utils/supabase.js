"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
exports.uploadToSupabase = uploadToSupabase;
const supabase_js_1 = require("@supabase/supabase-js");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    throw new Error('Missing Supabase credentials');
}
exports.supabase = (0, supabase_js_1.createClient)(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);
const BUCKET_NAME = process.env.SUPABASE_STORAGE_BUCKET || 'media';
/**
 * Upload file to Supabase Storage
 */
async function uploadToSupabase(file, folder) {
    try {
        const timestamp = Date.now();
        const randomStr = Math.random().toString(36).substring(2, 15);
        const fileExt = file.originalname.split('.').pop();
        const fileName = `${timestamp}_${randomStr}.${fileExt}`;
        const filePath = `${folder}/${fileName}`;
        const { data, error } = await exports.supabase.storage
            .from(BUCKET_NAME)
            .upload(filePath, file.buffer, {
            contentType: file.mimetype,
            upsert: false,
        });
        if (error) {
            console.error('Supabase upload error:', error);
            return null;
        }
        const { data: { publicUrl } } = exports.supabase.storage
            .from(BUCKET_NAME)
            .getPublicUrl(data.path);
        return publicUrl;
    }
    catch (error) {
        console.error('Upload error:', error);
        return null;
    }
}
