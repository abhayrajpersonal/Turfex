
export * from '../types/index';

// Tournament specific types that don't cause cycles can stay or move to their own file.
// For safety, we keep them here as they are leaf nodes in the dependency graph.

export interface TournamentMatch {
  id: string;
  round: number; // 1 = QF, 2 = SF, 3 = Final
  team1: { name: string; score?: number; logo?: string };
  team2: { name: string; score?: number; logo?: string };
  date: string;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED';
  winner?: string; // Team Name
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
  specialization: string; // e.g., "Batting", "Goalkeeping"
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
