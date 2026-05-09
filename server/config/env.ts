import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.union([z.coerce.number(), z.string()]).default(4000),


  CORS_ORIGIN: z.string().default("http://localhost:8080"),
  SAFEPAY_SECRET_KEY: z.string().optional(),
  SAFEPAY_ENV: z.enum(["sandbox", "production"]).default("sandbox"),
  GOOGLE_CLIENT_ID: z.string().optional(),
  GOOGLE_CLIENT_SECRET: z.string().optional(),
  SUPABASE_URL: z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
});

let cachedEnv: z.infer<typeof envSchema> | null = null;

export function getEnv() {
  if (cachedEnv) return cachedEnv;

  const freshParse = envSchema.safeParse(process.env);
  if (!freshParse.success) {
    throw new Error(`Invalid server environment: ${freshParse.error.message}`);
  }

  console.log(`Boutique Sync: Connecting to Supabase at ${freshParse.data.SUPABASE_URL}`);
  cachedEnv = freshParse.data;
  return cachedEnv;
}
