
import { UserTier } from './user';

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

export interface Notification {
  id: string;
  user_id: string;
  type: 'BOOKING_CONFIRMED' | 'BOOKING_CANCELLED' | 'MATCH_JOINED' | 'FRIEND_REQUEST' | 'SYSTEM' | 'WALLET' | 'LIVE_MATCH' | 'PAYMENT_REQUEST';
  message: string;
  is_read: boolean;
  created_at: string;
  action_link?: string;
}

export interface FriendActivity {
  id: string;
  user_id: string;
  username: string;
  avatar_url: string;
  turf_id: string;
  turf_name: string;
  sport: string;
  start_time: string;
  status: 'LIVE' | 'UPCOMING';
  lat: number;
  lng: number;
}
