import { createClient } from "@supabase/supabase-js";
import { getEnv } from "./env";

let cachedClient: ReturnType<typeof createClient> | null = null;

export function getSupabase() {
  if (cachedClient) return cachedClient;
  
  const env = getEnv();
  console.log("Cloud Connector: Initializing Supabase client...");
  cachedClient = createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
  return cachedClient;
}
