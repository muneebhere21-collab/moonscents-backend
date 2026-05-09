import express from "express";
import { createClient } from "@supabase/supabase-js";

import { getEnv } from "../config/env";

export const adminAuthRouter = express.Router();

const env = getEnv();
const supabaseAdmin = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

adminAuthRouter.post("/force-reset", async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    if (!email || !newPassword) {
      return res.status(400).json({ message: "Email and new password are required." });
    }

    // List users to find the ID by email
    const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
    if (listError) throw listError;

    const user = usersData.users.find(u => u.email === email);
    if (!user) {
      return res.status(404).json({ message: "No account found with this email." });
    }

    // Force update password bypassing email
    const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
      password: newPassword,
      email_confirm: true, // Auto confirm if they were unconfirmed
    });

    if (updateError) throw updateError;

    res.json({ success: true, message: "Password instantly updated." });
  } catch (error: any) {
    console.error("Force reset error:", error);
    res.status(500).json({ message: error.message || "Failed to update password." });
  }
});
