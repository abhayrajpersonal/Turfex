
import { Sport } from './sport';

export enum UserType {
  PLAYER = 'PLAYER',
  OWNER = 'OWNER',
  MANAGER = 'MANAGER' // Added Manager Role
}

export enum UserTier {
  FREE = 'FREE',
  GOLD = 'GOLD',
  PLATINUM = 'PLATINUM'
}

export enum KycStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
  NONE = 'NONE'
}

export interface PlayerStats {
  matches_played: number;
  matches_won: number;
  man_of_the_match: number;
  total_score: number;
  mvp_badges: number;
}

export interface SkillEndorsement {
  skill: string;
  count: number;
}

export interface CredibilityScore {
  total: number;
  breakdown: {
    reliability: number;
    skill: number;
    fair_play: number;
  };
  endorsements: SkillEndorsement[];
}

export interface UserProfile {
  id: string;
  phone: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  city: string;
  sports_preferences: Sport[];
  user_type: UserType;
  kyc_status: KycStatus;
  turfex_points: number;
  tier: UserTier;
  badges: string[];
  wallet_balance: number;
  streak_days: number;
  referral_code: string;
  stats: PlayerStats;
  credibility?: CredibilityScore;
  last_spin_date?: string; // For Daily Spin
  karma_score?: number; // New: Karma System (0-100)
}

export interface WalletTransaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  date: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string;
  action: string; 
  target: string;
  timestamp: string;
}
