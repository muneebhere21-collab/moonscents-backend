"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadRouter = void 0;
const express_1 = require("express");
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const supabase_1 = require("../config/supabase");
const auth_1 = require("../middleware/auth");
exports.uploadRouter = (0, express_1.Router)();
// Use memory storage for cloud-native uploads
const storage = multer_1.default.memoryStorage();
const upload = (0, multer_1.default)({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|webp/;
        const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
        const mimetype = allowedTypes.test(file.mimetype);
        if (extname && mimetype) {
            return cb(null, true);
        }
        cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
    },
});
exports.uploadRouter.post("/", auth_1.requireAuth, (0, auth_1.requireRole)("admin"), upload.single("image"), async (req, res, next) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: "No file uploaded" });
        }
        const supabase = (0, supabase_1.getSupabase)();
        const fileExt = path_1.default.extname(req.file.originalname);
        const fileName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${fileExt}`;
        const filePath = `products/${fileName}`;
        // Upload to Supabase Storage 'products' bucket
        const { data, error } = await supabase.storage
            .from("products")
            .upload(filePath, req.file.buffer, {
            contentType: req.file.mimetype,
            upsert: false
        });
        if (error) {
            console.error("!! Supabase Storage Upload Error:", error);
            return res.status(500).json({ message: "Cloud upload failed", error: error.message });
        }
        // Get the public URL for the uploaded file
        const { data: { publicUrl } } = supabase.storage
            .from("products")
            .getPublicUrl(filePath);
        console.log(`-> Cloud Upload Success: ${publicUrl}`);
        res.json({ url: publicUrl });
    }
    catch (err) {
        next(err);
    }
});
