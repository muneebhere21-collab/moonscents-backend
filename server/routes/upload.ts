import { Router } from "express";
import multer from "multer";
import path from "path";
import { getSupabase } from "../config/supabase";
import { requireAuth, requireRole } from "../middleware/auth";

export const uploadRouter = Router();

// Use memory storage for cloud-native uploads
const storage = multer.memoryStorage();

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
      return cb(null, true);
    }
    cb(new Error("Only images (jpeg, jpg, png, webp) are allowed"));
  },
});

uploadRouter.post("/", requireAuth, requireRole("admin"), upload.single("image"), async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    
    const supabase = getSupabase();
    const fileExt = path.extname(req.file.originalname);
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
  } catch (err) {
    next(err);
  }
});

