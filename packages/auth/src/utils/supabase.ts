import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_API_EXTERNAL_URL;
const supabaseKey = import.meta.env.VITE_ANON_KEY;

const supabaseServiceRoleKey = import.meta.env.VITE_API_SERVICE_ROLE_KEY;


export const supabase = createClient(supabaseUrl, supabaseKey);

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)
