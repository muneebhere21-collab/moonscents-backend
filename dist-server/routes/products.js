"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.productsRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const supabase_1 = require("../config/supabase");
const auth_1 = require("../middleware/auth");
const env_1 = require("../config/env");
exports.productsRouter = (0, express_1.Router)();
exports.productsRouter.use((req, res, next) => {
    console.log(`Products Router Entry: ${req.method} ${req.url}`);
    next();
});
const productSchema = zod_1.z.object({
    slug: zod_1.z.string().min(2),
    name: zod_1.z.string().min(2),
    family: zod_1.z.string().min(2),
    tagline: zod_1.z.string().min(2),
    image: zod_1.z.string().min(1),
    price: zod_1.z.number().min(0),
    stock: zod_1.z.number().int().min(0),
    description: zod_1.z.string().optional(),
    notes: zod_1.z.object({
        top: zod_1.z.string().optional(),
        heart: zod_1.z.string().optional(),
        base: zod_1.z.string().optional(),
    }).optional(),
    ml: zod_1.z.number().optional(),
    perfumeType: zod_1.z.string().optional(),
    variants: zod_1.z.array(zod_1.z.object({
        ml: zod_1.z.number(),
        price: zod_1.z.number(),
        stock: zod_1.z.number().default(0),
    })).optional(),
});
// GET all products
exports.productsRouter.get("/", async (req, res, next) => {
    console.log("-> Entering Products GET Handler");
    try {
        const includeInactive = req.query.includeInactive === "true";
        const env = (0, env_1.getEnv)();
        const supabase = (0, supabase_1.getSupabase)();
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
        const rawData = data || [];
        console.log(`-> Success: Fetched ${rawData.length} fragrances. (Include Inactive: ${includeInactive})`);
        // Map snake_case to camelCase and provide legacy _id for frontend compatibility
        const products = rawData.map(p => ({
            ...p,
            _id: p.id,
            perfumeType: p.perfume_type,
        }));
        return res.json(products);
    }
    catch (error) {
        console.error("!! Error in Products GET Handler:", error);
        const fs = require("fs");
        fs.appendFileSync("server_errors.log", `${new Date().toISOString()} - Products Fetch Error: ${error.message}\n${error.stack}\n`);
        next(error);
    }
});
// GET search products
exports.productsRouter.get("/search", async (req, res, next) => {
    try {
        const q = req.query.q || "";
        const supabase = (0, supabase_1.getSupabase)();
        let query = supabase.from("products").select("*").eq("active", true);
        if (q) {
            query = query.or(`name.ilike.%${q}%,family.ilike.%${q}%,tagline.ilike.%${q}%,description.ilike.%${q}%`);
        }
        const { data, error } = await query.order("created_at", { ascending: false });
        if (error)
            throw error;
        const rawData = data || [];
        const products = rawData.map(p => ({
            ...p,
            _id: p.id,
            perfumeType: p.perfume_type,
        }));
        return res.json(products);
    }
    catch (error) {
        next(error);
    }
});
// GET single product by slug
exports.productsRouter.get("/:slug", async (req, res, next) => {
    try {
        const supabase = (0, supabase_1.getSupabase)();
        const { data, error } = await supabase
            .from("products")
            .select("*")
            .eq("slug", req.params.slug)
            .maybeSingle();
        if (error)
            throw error;
        if (!data)
            return res.status(404).json({ message: "Product not found" });
        const p = data;
        return res.json({
            ...p,
            _id: p.id,
            perfumeType: p.perfume_type,
        });
    }
    catch (error) {
        next(error);
    }
});
// CREATE new product (Admin)
exports.productsRouter.post("/", auth_1.requireAuth, (0, auth_1.requireRole)("admin"), async (req, res, next) => {
    try {
        const input = productSchema.parse(req.body);
        const supabase = (0, supabase_1.getSupabase)();
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
            }])
            .select()
            .single();
        if (error) {
            if (error.code === '23505')
                return res.status(409).json({ message: "Slug already exists" });
            throw error;
        }
        return res.status(201).json(data);
    }
    catch (error) {
        next(error);
    }
});
// UPDATE product (Admin)
exports.productsRouter.patch("/:id", auth_1.requireAuth, (0, auth_1.requireRole)("admin"), async (req, res, next) => {
    try {
        const input = productSchema.partial().parse(req.body);
        const supabase = (0, supabase_1.getSupabase)();
        const updateData = {};
        if (input.name)
            updateData.name = input.name;
        if (input.slug)
            updateData.slug = input.slug;
        if (input.family)
            updateData.family = input.family;
        if (input.tagline)
            updateData.tagline = input.tagline;
        if (input.description !== undefined)
            updateData.description = input.description;
        if (input.notes)
            updateData.notes = input.notes;
        if (input.perfumeType)
            updateData.perfume_type = input.perfumeType;
        if (input.ml)
            updateData.ml = input.ml;
        if (input.image)
            updateData.image = input.image;
        if (input.price !== undefined)
            updateData.price = input.price;
        if (input.stock !== undefined)
            updateData.stock = input.stock;
        if (input.variants)
            updateData.variants = input.variants;
        const { data, error } = await supabase
            .from("products")
            .update(updateData)
            .eq("id", req.params.id)
            .select()
            .maybeSingle();
        if (error) {
            if (error.code === '23505')
                return res.status(409).json({ message: "Slug already exists" });
            throw error;
        }
        if (!data)
            return res.status(404).json({ message: "Product not found" });
        return res.json({
            ...data,
            _id: data.id,
            perfumeType: data.perfume_type
        });
    }
    catch (error) {
        next(error);
    }
});
// DELETE product (Admin)
exports.productsRouter.delete("/:id", auth_1.requireAuth, (0, auth_1.requireRole)("admin"), async (req, res, next) => {
    try {
        const supabase = (0, supabase_1.getSupabase)();
        const { error } = await supabase
            .from("products")
            .delete()
            .eq("id", req.params.id);
        if (error)
            throw error;
        res.json({ message: "Product deleted" });
    }
    catch (error) {
        next(error);
    }
});
