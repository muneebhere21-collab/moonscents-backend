import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://eaqghrfwjunriasozpmg.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_LEGACY_KEY || 'sb_publishable_idHnIioxKlB0V1evaXiVVQ_bZuzP9pS';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
