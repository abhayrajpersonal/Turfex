
import { Sport } from './sport';

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
  turf_id: string; // Can be 'coach_session' or 'offline'
  user_id: string;
  sport: Sport;
  start_time: string;
  end_time: string;
  price: number;
  status: 'CONFIRMED' | 'CANCELLED' | 'COMPLETED' | 'PENDING_PAYMENT' | 'MAINTENANCE';
  turf?: Turf | { name: string, location: string }; // Allow partial object for Coach/Offline
  payment_mode: 'FULL' | 'SPLIT' | 'WALLET' | 'OFFLINE' | 'LOSER_PAYS' | 'CORPORATE';
  split_with?: string[];
  is_recurring: boolean;
  rental_items?: string[];
  add_ons?: ('COACH' | 'REFEREE')[];
  qr_code?: string;
  corporate_details?: {
    company_name: string;
    gst_number: string;
  };
  coach_id?: string; // For specific coach bookings
  has_insurance?: boolean; // New: Booking Insurance
}
