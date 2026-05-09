import { Router } from "express";
import { z } from "zod";
import { getEnv } from "../config/env";
import { getSupabase } from "../config/supabase";

export const paymentsRouter = Router();

paymentsRouter.post("/callbacks/jazzcash", async (req, res, next) => {
  try {
    const schema = z.object({
      orderId: z.string().min(1),
      status: z.enum(["paid", "failed"]).default("failed"),
      reference: z.string().optional(),
    });
    const payload = schema.parse(req.body);
    const supabase = getSupabase();
    
    await supabase
      .from("orders")
      .update({
        status: payload.status === "paid" ? "paid" : "pending",
        payment_reference: payload.reference ?? "",
      })
      .eq("id", payload.orderId);

    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});

paymentsRouter.post("/callbacks/easypaisa", async (req, res, next) => {
  try {
    const schema = z.object({
      orderId: z.string().min(1),
      status: z.enum(["paid", "failed"]).default("failed"),
      reference: z.string().optional(),
    });
    const payload = schema.parse(req.body);
    const supabase = getSupabase();

    await supabase
      .from("orders")
      .update({
        status: payload.status === "paid" ? "paid" : "pending",
        payment_reference: payload.reference ?? "",
      })
      .eq("id", payload.orderId);

    return res.json({ ok: true });
  } catch (error) {
    return next(error);
  }
});


