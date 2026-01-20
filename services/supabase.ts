
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '../lib/constants';

// NOTE: In a production environment, ensure these variables are present.
// For this generated code to run immediately without crashing on missing keys,
// we will conditionally create the client or use a dummy one.

const isConfigured = SUPABASE_URL && SUPABASE_ANON_KEY && SUPABASE_URL !== 'https://xyz.supabase.co';

export const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
  : null;

export const isSupabaseConfigured = () => !!supabase;
