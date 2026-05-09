"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscribersRouter = void 0;
const express_1 = require("express");
const supabase_1 = require("../config/supabase");
const zod_1 = require("zod");
exports.subscribersRouter = (0, express_1.Router)();
const subscribeSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address"),
});
exports.subscribersRouter.post("/", async (req, res, next) => {
    try {
        const { email } = subscribeSchema.parse(req.body);
        const supabase = (0, supabase_1.getSupabase)();
        // Check if exists
        const { data: existing } = await supabase
            .from("subscribers")
            .select("id")
            .eq("email", email)
            .single();
        if (existing) {
            return res.status(400).json({ message: "Email is already subscribed" });
        }
        const { error } = await supabase
            .from("subscribers")
            .insert([{ email }]);
        if (error) {
            if (error.code === '23505') { // unique violation
                return res.status(400).json({ message: "Email is already subscribed" });
            }
            throw error;
        }
        res.json({ success: true, message: "Successfully subscribed" });
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            return res.status(400).json({ message: error.errors[0].message });
        }
        next(error);
    }
});
