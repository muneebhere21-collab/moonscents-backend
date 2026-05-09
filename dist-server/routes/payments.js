"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentsRouter = void 0;
const express_1 = require("express");
const zod_1 = require("zod");
const supabase_1 = require("../config/supabase");
exports.paymentsRouter = (0, express_1.Router)();
exports.paymentsRouter.post("/callbacks/jazzcash", async (req, res, next) => {
    try {
        const schema = zod_1.z.object({
            orderId: zod_1.z.string().min(1),
            status: zod_1.z.enum(["paid", "failed"]).default("failed"),
            reference: zod_1.z.string().optional(),
        });
        const payload = schema.parse(req.body);
        const supabase = (0, supabase_1.getSupabase)();
        await supabase
            .from("orders")
            .update({
            status: payload.status === "paid" ? "paid" : "pending",
            payment_reference: payload.reference ?? "",
        })
            .eq("id", payload.orderId);
        return res.json({ ok: true });
    }
    catch (error) {
        return next(error);
    }
});
exports.paymentsRouter.post("/callbacks/easypaisa", async (req, res, next) => {
    try {
        const schema = zod_1.z.object({
            orderId: zod_1.z.string().min(1),
            status: zod_1.z.enum(["paid", "failed"]).default("failed"),
            reference: zod_1.z.string().optional(),
        });
        const payload = schema.parse(req.body);
        const supabase = (0, supabase_1.getSupabase)();
        await supabase
            .from("orders")
            .update({
            status: payload.status === "paid" ? "paid" : "pending",
            payment_reference: payload.reference ?? "",
        })
            .eq("id", payload.orderId);
        return res.json({ ok: true });
    }
    catch (error) {
        return next(error);
    }
});
