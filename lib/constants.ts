
import { Sport } from './types';

// Safely access process.env to prevent "Uncaught ReferenceError: process is not defined"
const getEnv = (key: string, fallback: string) => {
  try {
    // @ts-ignore
    if (typeof process !== 'undefined' && process.env) {
      // @ts-ignore
      return process.env[key] || fallback;
    }
  } catch (e) {
    // Ignore error
  }
  return fallback;
};

export const SUPABASE_URL = getEnv('SUPABASE_URL', 'https://xyz.supabase.co');
export const SUPABASE_ANON_KEY = getEnv('SUPABASE_ANON_KEY', 'abc');

export const COLORS = {
  electric: '#007BFF',
  lime: '#32CD32',
  coral: '#FF7043',
  midnight: '#2E2E2E',
  offwhite: '#FDFDFD',
  gray: '#F3F4F6'
};

export const SPORTS_ICONS: Record<Sport, string> = {
  [Sport.FOOTBALL]: '⚽',
  [Sport.CRICKET]: '🏏',
  [Sport.BADMINTON]: '🏸',
  [Sport.PICKLEBALL]: '🏓',
  [Sport.TENNIS]: '🎾'
};
