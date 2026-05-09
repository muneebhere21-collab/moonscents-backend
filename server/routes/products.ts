import { Router } from "express";
import { z } from "zod";
import { getSupabase } from "../config/supabase";
import { requireAuth, requireRole } from "../middleware/auth";
import { getEnv } from "../config/env";

export const productsRouter = Router();

productsRouter.use((req, res, next) => {
  console.log(`Products Router Entry: ${req.method} ${req.url}`);
  next();
});

interface Product {
  id: string;
  slug: string;
  name: string;
  family: string;
  tagline: string;
  description: string;
  notes: any;
  perfume_type: string;
  ml: number;
  image: string;
  price: number;
  stock: number;
  variants: any[];
  active: boolean;
  created_at: string;
}

const productSchema = z.object({
  slug: z.string().min(2),
  name: z.string().min(2),
  family: z.string().min(2),
  tagline: z.string().min(2),
  image: z.string().min(1),
  price: z.number().min(0),
  stock: z.number().int().min(0),
  description: z.string().optional(),
  notes: z.object({
    top: z.string().optional(),
    heart: z.string().optional(),
    base: z.string().optional(),
  }).optional(),
  ml: z.number().optional(),
  perfumeType: z.string().optional(),
  variants: z.array(z.object({
    ml: z.number(),
    price: z.number(),
    stock: z.number().default(0),
  })).optional(),
});

// GET all products
productsRouter.get("/", async (req, res, next) => {
  console.log("-> Entering Products GET Handler");
  try {
    const includeInactive = req.query.includeInactive === "true";
    const env = getEnv();
    const supabase = getSupabase();
    
    console.log(`-> Boutique Scan: Connecting to ${env.SUPABASE_URL}`);
    
    let query = supabase.from("products").select("*");
    
    if (!includeInactive) {
      query = query.eq("active", true);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) {
      console.error("!! Supabase error fetching products:", error);
      throw error;
    }

    const rawData = (data as unknown as Product[]) || [];
    console.log(`-> Success: Fetched ${rawData.length} fragrances. (Include Inactive: ${includeInactive})`);

    // Map snake_case to camelCase and provide legacy _id for frontend compatibility
    const products = rawData.map(p => ({
      ...p,
      _id: p.id,
      perfumeType: p.perfume_type,
    }));

    return res.json(products);
  } catch (error: any) {
    console.error("!! Error in Products GET Handler:", error);
    const fs = require("fs");
    fs.appendFileSync("server_errors.log", `${new Date().toISOString()} - Products Fetch Error: ${error.message}\n${error.stack}\n`);
    next(error);
  }
});

// GET search products
productsRouter.get("/search", async (req, res, next) => {
  try {
    const q = (req.query.q as string) || "";
    const supabase = getSupabase();
    
    let query = supabase.from("products").select("*").eq("active", true);
    
    if (q) {
      query = query.or(`name.ilike.%${q}%,family.ilike.%${q}%,tagline.ilike.%${q}%,description.ilike.%${q}%`);
    }
    
    const { data, error } = await query.order("created_at", { ascending: false });

    if (error) throw error;

    const rawData = (data as any[]) || [];
    
    const products = rawData.map(p => ({
      ...p,
      _id: p.id,
      perfumeType: p.perfume_type,
    }));

    return res.json(products);
  } catch (error) {
    next(error);
  }
});

// GET single product by slug
productsRouter.get("/:slug", async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("slug", req.params.slug)
      .maybeSingle();

    if (error) throw error;
    if (!data) return res.status(404).json({ message: "Product not found" });

    const p = data as unknown as Product;

    return res.json({
      ...p,
      _id: p.id,
      perfumeType: p.perfume_type,
    });
  } catch (error) {
    next(error);
  }
});

// CREATE new product (Admin)
productsRouter.post("/", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const input = productSchema.parse(req.body);
    const supabase = getSupabase();
    
    const { data, error } = await supabase
      .from("products")
      .insert([{
        name: input.name,
        slug: input.slug,
        family: input.family,
        tagline: input.tagline,
        description: input.description || "",
        notes: input.notes || {},
        perfume_type: input.perfumeType || "Eau de Parfum",
        ml: input.ml || 50,
        image: input.image,
        price: input.price,
        stock: input.stock || 0,
        variants: input.variants || [],
        active: true
      } as any])
      .select()
      .single();

    if (error) {
      if (error.code === '23505') return res.status(409).json({ message: "Slug already exists" });
      throw error;
    }

    return res.status(201).json(data);
  } catch (error) {
    next(error);
  }
});

// UPDATE product (Admin)
productsRouter.patch("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const input = productSchema.partial().parse(req.body);
    const supabase = getSupabase();
    
    const updateData: any = {};
    if (input.name) updateData.name = input.name;
    if (input.slug) updateData.slug = input.slug;
    if (input.family) updateData.family = input.family;
    if (input.tagline) updateData.tagline = input.tagline;
    if (input.description !== undefined) updateData.description = input.description;
    if (input.notes) updateData.notes = input.notes;
    if (input.perfumeType) updateData.perfume_type = input.perfumeType;
    if (input.ml) updateData.ml = input.ml;
    if (input.image) updateData.image = input.image;
    if (input.price !== undefined) updateData.price = input.price;
    if (input.stock !== undefined) updateData.stock = input.stock;
    if (input.variants) updateData.variants = input.variants;

    const { data, error } = await supabase
      .from("products")
      .update(updateData)
      .eq("id", req.params.id)
      .select()
      .maybeSingle();

    if (error) {
      if (error.code === '23505') return res.status(409).json({ message: "Slug already exists" });
      throw error;
    }
    
    if (!data) return res.status(404).json({ message: "Product not found" });

    return res.json({
      ...data,
      _id: data.id,
      perfumeType: data.perfume_type
    });
  } catch (error) {
    next(error);
  }
});

// DELETE product (Admin)
productsRouter.delete("/:id", requireAuth, requireRole("admin"), async (req, res, next) => {
  try {
    const supabase = getSupabase();
    const { error } = await supabase
      .from("products")
      .delete()
      .eq("id", req.params.id);

    if (error) throw error;
    res.json({ message: "Product deleted" });
  } catch (error) {
    next(error);
  }
});
