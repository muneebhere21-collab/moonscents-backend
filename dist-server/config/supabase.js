"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSupabase = getSupabase;
const supabase_js_1 = require("@supabase/supabase-js");
const env_1 = require("./env");
let cachedClient = null;
function getSupabase() {
    if (cachedClient)
        return cachedClient;
    const env = (0, env_1.getEnv)();
    console.log("Cloud Connector: Initializing Supabase client...");
    cachedClient = (0, supabase_js_1.createClient)(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);
    return cachedClient;
}
