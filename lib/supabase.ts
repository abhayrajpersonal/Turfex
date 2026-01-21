
import { createClient } from '@supabase/supabase-js';
import { SUPABASE_URL, SUPABASE_ANON_KEY } from './constants';

const isValidUrl = (url: string) => {
  try {
    return new URL(url).protocol === 'https:';
  } catch (e) {
    return false;
  }
};

const isConfigured = 
  SUPABASE_URL && 
  SUPABASE_ANON_KEY && 
  isValidUrl(SUPABASE_URL) && 
  SUPABASE_URL !== 'https://xyz.supabase.co';

export const supabase = isConfigured 
  ? createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
      realtime: {
        params: {
          eventsPerSecond: 10,
        },
      },
    })
  : null;

export const isSupabaseConfigured = () => !!supabase;
