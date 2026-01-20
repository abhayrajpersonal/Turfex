
import { Sport } from './types';

export const SUPABASE_URL = process.env.SUPABASE_URL || 'https://xyz.supabase.co';
export const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'abc';

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
