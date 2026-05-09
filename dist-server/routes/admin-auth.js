"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminAuthRouter = void 0;
const express_1 = __importDefault(require("express"));
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("../config/env");
exports.adminAuthRouter = express_1.default.Router();
const env = (0, env_1.getEnv)();
const supabaseAdmin = (0, supabase_js_1.createClient)(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
        autoRefreshToken: false,
        persistSession: false
    }
});
exports.adminAuthRouter.post("/force-reset", async (req, res) => {
    try {
        const { email, newPassword } = req.body;
        if (!email || !newPassword) {
            return res.status(400).json({ message: "Email and new password are required." });
        }
        // List users to find the ID by email
        const { data: usersData, error: listError } = await supabaseAdmin.auth.admin.listUsers();
        if (listError)
            throw listError;
        const user = usersData.users.find(u => u.email === email);
        if (!user) {
            return res.status(404).json({ message: "No account found with this email." });
        }
        // Force update password bypassing email
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(user.id, {
            password: newPassword,
            email_confirm: true, // Auto confirm if they were unconfirmed
        });
        if (updateError)
            throw updateError;
        res.json({ success: true, message: "Password instantly updated." });
    }
    catch (error) {
        console.error("Force reset error:", error);
        res.status(500).json({ message: error.message || "Failed to update password." });
    }
});
