import { createClient } from '@supabase/supabase-js';
import { env } from 'src/conf/env';

const supabaseUrl = env.SUPABASE_URL;

const supabaseServiceRoleKey = env.SUPABASE_SERVICE_ROLE_KEY;

export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey)