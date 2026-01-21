
export * from './user';
export * from './sport';
export * from './booking';
export * from './social';
export * from './merch';

// Add missing types that were previously in lib/types.ts to avoid resolution errors
export interface TournamentMatch {
  id: string;
  round: number;
  team1: { name: string; score?: number; logo?: string };
  team2: { name: string; score?: number; logo?: string };
  date: string;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED';
  winner?: string;
}

export interface TournamentBracketData {
  id: string;
  tournament_id: string;
  matches: TournamentMatch[];
}

export interface Coach {
  id: string;
  name: string;
  sport: string;
  experience: string;
  rate_per_session: number;
  rating: number;
  reviews_count: number;
  avatar_url: string;
  specialization: string;
  is_verified: boolean;
}

export interface RentalItem {
  id: string;
  name: string;
  category: string;
  daily_rate: number;
  owner_id: string;
  owner_name: string;
  owner_avatar: string;
  image_url: string;
  distance_km: number;
  description: string;
  available: boolean;
}

export interface InventoryItem {
  id: string;
  name: string;
  stock: number;
  price: number;
  category: 'Equipment' | 'Refreshment' | 'Merch';
  last_updated: string;
}

export interface Bid {
  id: string;
  booking_id: string;
  user_id: string;
  amount: number;
  timestamp: string;
  status: 'PENDING' | 'ACCEPTED' | 'REJECTED';
}

export interface CorporateDetails {
  company_name: string;
  gst_number: string;
}

export type Language = 'en' | 'hi' | 'mr' | 'kn';
