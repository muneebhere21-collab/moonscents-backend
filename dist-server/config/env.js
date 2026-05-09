"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getEnv = getEnv;
const zod_1 = require("zod");
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(["development", "test", "production"]).default("development"),
    PORT: zod_1.z.coerce.number().default(4000),
    CORS_ORIGIN: zod_1.z.string().default("http://localhost:8080"),
    SAFEPAY_SECRET_KEY: zod_1.z.string().optional(),
    SAFEPAY_ENV: zod_1.z.enum(["sandbox", "production"]).default("sandbox"),
    GOOGLE_CLIENT_ID: zod_1.z.string().optional(),
    GOOGLE_CLIENT_SECRET: zod_1.z.string().optional(),
    SUPABASE_URL: zod_1.z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: zod_1.z.string().min(1),
});
let cachedEnv = null;
function getEnv() {
    if (cachedEnv)
        return cachedEnv;
    const freshParse = envSchema.safeParse(process.env);
    if (!freshParse.success) {
        throw new Error(`Invalid server environment: ${freshParse.error.message}`);
    }
    console.log(`Boutique Sync: Connecting to Supabase at ${freshParse.data.SUPABASE_URL}`);
    cachedEnv = freshParse.data;
    return cachedEnv;
}
