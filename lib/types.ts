
export enum UserType {
  PLAYER = 'PLAYER',
  OWNER = 'OWNER'
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

export enum Sport {
  FOOTBALL = 'Football',
  CRICKET = 'Cricket',
  BADMINTON = 'Badminton',
  PICKLEBALL = 'Pickleball',
  TENNIS = 'Tennis'
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
}

export interface Team {
  id: string;
  name: string;
  logo_url: string;
  captain_id: string;
  members: string[];
  matches_played: number;
  wins: number;
  city: string;
}

export interface Equipment {
  id: string;
  name: string;
  price: number;
  icon: string;
}

export interface Turf {
  id: string;
  owner_id: string;
  name: string;
  location: string;
  city: string;
  sports_supported: Sport[];
  price_per_hour: number;
  rating: number;
  images: string[];
  facilities: string[];
  lat: number;
  lng: number;
  is_verified: boolean;
  rental_equipment: Equipment[];
  has_coach: boolean;
  has_referee: boolean;
  weather_condition?: 'Sunny' | 'Cloudy' | 'Rain' | 'Clear';
}

export interface Booking {
  id: string;
  turf_id: string;
  user_id: string;
  sport: Sport;
  start_time: string; // ISO string
  end_time: string; // ISO string
  price: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'PENDING_PAYMENT' | 'MAINTENANCE';
  turf?: Turf; 
  payment_mode: 'FULL' | 'SPLIT' | 'WALLET' | 'OFFLINE';
  split_with?: string[]; // phone numbers
  is_recurring: boolean;
  rental_items?: string[]; // equipment IDs
  add_ons?: ('COACH' | 'REFEREE')[];
  qr_code?: string;
}

export interface OpenMatch {
  id: string;
  host_id: string;
  turf_id: string;
  sport: Sport;
  required_players: number;
  joined_players: string[]; // user_ids
  start_time: string;
  status: 'OPEN' | 'FULL' | 'COMPLETED';
  turf?: Turf;
  host?: UserProfile;
}

export interface LeaderboardEntry {
  user_id: string;
  username: string;
  avatar_url: string;
  matches_played: number;
  points: number;
  rank: number;
  tier?: UserTier;
}

export interface ChatMessage {
  id: string;
  sender_id: string;
  text: string;
  timestamp: string;
}

export interface ChatRoom {
  id: string;
  name: string;
  participants: string[];
  messages: ChatMessage[];
  last_message?: string;
  avatar_url?: string;
}

export interface WalletTransaction {
  id: string;
  type: 'CREDIT' | 'DEBIT';
  amount: number;
  description: string;
  date: string;
}

export interface Notification {
  id: string;
  user_id: string;
  type: 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'MATCH_JOINED' | 'FRIEND_REQUEST' | 'SYSTEM' | 'WALLET';
  message: string;
  is_read: boolean;
  created_at: string;
}

export interface ActivityLog {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string;
  action: string; // e.g., "played a match at"
  target: string; // e.g., "Kickoff Arena"
  timestamp: string;
}

export interface Tournament {
  id: string;
  name: string;
  sport: Sport;
  start_date: string;
  end_date: string;
  entry_fee: number;
  prize_pool: number;
  location: string;
  registered_teams: number;
  max_teams: number;
  image_url: string;
}
