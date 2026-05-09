"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAuth = requireAuth;
exports.requireRole = requireRole;
const supabase_1 = require("../config/supabase");
async function requireAuth(req, res, next) {
    const authHeader = req.header("authorization");
    if (!authHeader?.startsWith("Bearer ")) {
        console.warn("!! Auth Gate: Missing Bearer token");
        return res.status(401).json({ message: "Missing auth token" });
    }
    const token = authHeader.slice("Bearer ".length);
    try {
        const supabase = (0, supabase_1.getSupabase)();
        const { data: { user }, error } = await supabase.auth.getUser(token);
        if (error || !user) {
            const reason = error?.message || "User not found";
            console.warn(`!! Auth Gate: Rejection - ${reason}`);
            // I'll also write it to a file so I can see it
            require("fs").appendFileSync("auth_rejections.log", `${new Date().toISOString()} - ${reason}\n`);
            return res.status(401).json({ message: "Invalid or expired auth token" });
        }
        req.authUser = {
            id: user.id,
            email: user.email || "",
            role: user.app_metadata?.role || "customer",
        };
        next();
    }
    catch (error) {
        console.error("!! Auth Gate: Exception during verification:", error);
        return res.status(401).json({ message: "Authentication failed" });
    }
}
function requireRole(role) {
    return (req, res, next) => {
        if (!req.authUser) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (req.authUser.role !== role) {
            return res.status(403).json({ message: "Forbidden" });
        }
        next();
    };
}
