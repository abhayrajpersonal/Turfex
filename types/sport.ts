
import { UserProfile } from './user';
import { Turf } from './booking';

export enum Sport {
  FOOTBALL = 'Football',
  CRICKET = 'Cricket',
  BADMINTON = 'Badminton',
  PICKLEBALL = 'Pickleball',
  TENNIS = 'Tennis'
}

export interface CricketScore {
  runs: number;
  wickets: number;
  overs: number;
  balls: number;
  target?: number;
  is_batting_first: boolean;
}

export interface FootballScore {
  team_a: number;
  team_b: number;
  time_elapsed: number;
}

export interface RacquetScore {
  sets: { a: number; b: number }[];
  current_set: number;
  server: 'A' | 'B';
}

export interface MatchSummary {
  winner: string;
  mvp: string;
  duration: string;
  highlights: string[];
}

export interface OpenMatch {
  id: string;
  host_id: string;
  turf_id: string;
  sport: Sport;
  required_players: number;
  joined_players: string[];
  start_time: string;
  status: 'OPEN' | 'FULL' | 'LIVE' | 'COMPLETED';
  turf?: Turf;
  host?: UserProfile;
  share_token?: string;
  
  scoreboard?: {
    team_a_name: string;
    team_b_name: string;
    cricket?: { team_a: CricketScore; team_b: CricketScore };
    football?: FootballScore;
    racquet?: RacquetScore;
    last_update?: string;
  };
  summary?: MatchSummary;
}

export interface Team {
  id: string;
  name: string;
  description?: string;
  logo_url: string;
  captain_id: string;
  members: string[];
  matches_played: number;
  wins: number;
  city: string;
  primary_sport: Sport;
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
