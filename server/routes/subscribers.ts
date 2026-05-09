import { Router } from "express";
import { getSupabase } from "../config/supabase";
import { z } from "zod";

export const subscribersRouter = Router();

const subscribeSchema = z.object({
  email: z.string().email("Invalid email address"),
});

subscribersRouter.post("/", async (req, res, next) => {
  try {
    const { email } = subscribeSchema.parse(req.body);

    const supabase = getSupabase();
    
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
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ message: error.errors[0].message });
    }
    next(error);
  }
});
