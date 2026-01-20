
import { UserProfile, UserType, KycStatus, Sport, OpenMatch, LeaderboardEntry, UserTier, Team, ChatRoom, WalletTransaction, Notification, ActivityLog, Tournament, Turf } from './types';

export const MOCK_USER: UserProfile = {
  id: 'u1',
  phone: '+1234567890',
  username: 'ace_striker',
  full_name: 'Alex Johnson',
  avatar_url: 'https://picsum.photos/200/200',
  city: 'Mumbai',
  sports_preferences: [Sport.FOOTBALL, Sport.BADMINTON],
  user_type: UserType.PLAYER,
  kyc_status: KycStatus.VERIFIED,
  turfex_points: 1250,
  tier: UserTier.FREE, 
  badges: ['Night Owl', 'Striker', 'Playmaker'],
  wallet_balance: 1500,
  streak_days: 12,
  referral_code: 'ALEX123',
  stats: {
    matches_played: 45,
    matches_won: 28,
    man_of_the_match: 5,
    total_score: 122, // Goals/Runs mixed context for demo
    mvp_badges: 3
  }
};

export const MOCK_SEARCHABLE_USERS = [
    { id: 'u1', username: 'ace_striker', avatar: 'https://picsum.photos/200/200' },
    { id: 'u2', username: 'pickle_rick', avatar: 'https://picsum.photos/50/50?r=2' },
    { id: 'u3', username: 'net_master', avatar: 'https://picsum.photos/50/50?r=3' },
    { id: 'u4', username: 'speedy', avatar: 'https://picsum.photos/50/50?r=4' },
    { id: 'o1', username: 'turf_king', avatar: 'https://picsum.photos/50?r=99' }
];

export const MOCK_OWNER_USER: UserProfile = {
  id: 'o1',
  phone: '+1987654321',
  username: 'turf_king',
  full_name: 'Rajesh Owner',
  city: 'Mumbai',
  sports_preferences: [],
  user_type: UserType.OWNER,
  kyc_status: KycStatus.VERIFIED,
  turfex_points: 0,
  tier: UserTier.FREE,
  badges: [],
  wallet_balance: 25000,
  streak_days: 0,
  referral_code: 'OWNER99',
  stats: {
      matches_played: 0,
      matches_won: 0,
      man_of_the_match: 0,
      total_score: 0,
      mvp_badges: 0
  }
};

export const MOCK_TURFS: Turf[] = [
  {
    id: 't1',
    owner_id: 'o1',
    name: 'Kickoff Arena',
    location: 'Andheri West, Mumbai',
    city: 'Mumbai',
    sports_supported: [Sport.FOOTBALL, Sport.CRICKET],
    price_per_hour: 1200,
    rating: 4.5,
    images: ['https://picsum.photos/500/300?random=1', 'https://picsum.photos/500/300?random=2'],
    facilities: ['Parking', 'Showers', 'Floodlights'],
    lat: 19.1136,
    lng: 72.8697,
    is_verified: true,
    has_coach: true,
    has_referee: true,
    weather_condition: 'Sunny',
    rental_equipment: [
      { id: 'eq1', name: 'Football (Pro)', price: 100, icon: '⚽' },
      { id: 'eq2', name: 'Bibs (Set of 10)', price: 200, icon: '🎽' }
    ]
  },
  {
    id: 't2',
    owner_id: 'o2',
    name: 'Smash Zone',
    location: 'Bandra, Mumbai',
    city: 'Mumbai',
    sports_supported: [Sport.BADMINTON, Sport.PICKLEBALL],
    price_per_hour: 800,
    rating: 4.8,
    images: ['https://picsum.photos/500/300?random=3'],
    facilities: ['AC', 'Changing Rooms', 'Equipment Rental'],
    lat: 19.0596,
    lng: 72.8295,
    is_verified: true,
    has_coach: false,
    has_referee: false,
    weather_condition: 'Cloudy',
    rental_equipment: [
      { id: 'eq3', name: 'Racket (Yonex)', price: 150, icon: '🏸' },
      { id: 'eq4', name: 'Shuttlecock (Tube)', price: 300, icon: '🏸' }
    ]
  },
  {
    id: 't3',
    owner_id: 'o3',
    name: 'Green Field Box',
    location: 'Powai, Mumbai',
    city: 'Mumbai',
    sports_supported: [Sport.CRICKET, Sport.FOOTBALL],
    price_per_hour: 1500,
    rating: 4.2,
    images: ['https://picsum.photos/500/300?random=4'],
    facilities: ['Parking', 'Water'],
    lat: 19.1187,
    lng: 72.9073,
    is_verified: false,
    has_coach: false,
    has_referee: true,
    rental_equipment: []
  }
];

export const MOCK_OPEN_MATCHES: OpenMatch[] = [
  {
    id: 'm_live_1',
    host_id: 'u1',
    turf_id: 't3',
    sport: Sport.CRICKET,
    required_players: 12,
    joined_players: ['u1', 'u2', 'u3', 'u4'],
    start_time: new Date().toISOString(),
    status: 'LIVE',
    turf: MOCK_TURFS[2],
    host: MOCK_USER,
    share_token: 'cricket-live-123',
    scoreboard: {
        team_a_name: 'Super Strikers',
        team_b_name: 'Powai Kings',
        cricket: {
            team_a: { runs: 45, wickets: 2, overs: 4, balls: 2, is_batting_first: true },
            team_b: { runs: 0, wickets: 0, overs: 0, balls: 0, is_batting_first: false }
        },
        last_update: 'Just now'
    }
  },
  {
    id: 'm1',
    host_id: 'u2',
    turf_id: 't2',
    sport: Sport.PICKLEBALL,
    required_players: 4,
    joined_players: ['u2', 'u3'],
    start_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    status: 'OPEN',
    turf: MOCK_TURFS[1],
    host: { ...MOCK_USER, id: 'u2', username: 'pickle_rick', full_name: 'Rick' }
  },
  {
    id: 'm2',
    host_id: 'u4',
    turf_id: 't1',
    sport: Sport.FOOTBALL,
    required_players: 10,
    joined_players: ['u4', 'u5', 'u6', 'u7', 'u8'],
    start_time: new Date(Date.now() + 172800000).toISOString(), // Day after
    status: 'OPEN',
    turf: MOCK_TURFS[0],
    host: { ...MOCK_USER, id: 'u4', username: 'goal_machine', full_name: 'Leo' }
  }
];

export const MOCK_LEADERBOARD: LeaderboardEntry[] = [
  { user_id: 'u1', username: 'ace_striker', avatar_url: 'https://picsum.photos/50/50?r=1', matches_played: 45, points: 1250, rank: 1, tier: UserTier.GOLD },
  { user_id: 'u2', username: 'pickle_rick', avatar_url: 'https://picsum.photos/50/50?r=2', matches_played: 38, points: 980, rank: 2, tier: UserTier.FREE },
  { user_id: 'u3', username: 'net_master', avatar_url: 'https://picsum.photos/50/50?r=3', matches_played: 30, points: 850, rank: 3, tier: UserTier.FREE },
  { user_id: 'u4', username: 'speedy', avatar_url: 'https://picsum.photos/50/50?r=4', matches_played: 22, points: 600, rank: 4, tier: UserTier.FREE },
];

export const MOCK_TEAMS: Team[] = [
  { id: 'tm1', name: 'Mumbai Indians FC', logo_url: 'https://picsum.photos/200?r=10', captain_id: 'u1', members: ['u1', 'u2', 'u3'], matches_played: 12, wins: 8, city: 'Mumbai', primary_sport: Sport.FOOTBALL },
  { id: 'tm2', name: 'Bandra Blasters', logo_url: 'https://picsum.photos/200?r=11', captain_id: 'u4', members: ['u4', 'u5', 'u6'], matches_played: 10, wins: 5, city: 'Mumbai', primary_sport: Sport.CRICKET },
  { id: 'tm3', name: 'Powai Panthers', logo_url: 'https://picsum.photos/200?r=12', captain_id: 'u7', members: ['u7', 'u8'], matches_played: 15, wins: 10, city: 'Mumbai', primary_sport: Sport.FOOTBALL },
];

export const MOCK_CHATS: ChatRoom[] = [
  {
    id: 'c1',
    name: 'Weekend Football',
    participants: ['u1', 'u2', 'u3'],
    messages: [
      { id: 'msg1', sender_id: 'u2', text: 'Are we on for Saturday?', timestamp: new Date(Date.now() - 3600000).toISOString() },
      { id: 'msg2', sender_id: 'u1', text: 'Yes! Booked the slot.', timestamp: new Date(Date.now() - 1800000).toISOString() }
    ],
    avatar_url: 'https://picsum.photos/50?r=20',
    last_message: 'Yes! Booked the slot.'
  },
  {
    id: 'c2',
    name: 'Bandra Blasters Team',
    participants: ['u1', 'u4'],
    messages: [],
    avatar_url: 'https://picsum.photos/50?r=11',
    last_message: 'Strategy meeting at 6?'
  }
];

export const MOCK_WALLET_TRANSACTIONS: WalletTransaction[] = [
  { id: 'tx1', type: 'CREDIT', amount: 500, description: 'Added via UPI', date: new Date(Date.now() - 86400000).toISOString() },
  { id: 'tx2', type: 'DEBIT', amount: 1200, description: 'Booking: Kickoff Arena', date: new Date(Date.now() - 43200000).toISOString() },
];

export const MOCK_NOTIFICATIONS: Notification[] = [
  { id: 'n1', user_id: 'u1', type: 'BOOKING_CONFIRMED', message: 'Your booking at Kickoff Arena is confirmed!', is_read: false, created_at: new Date(Date.now() - 300000).toISOString() },
  { id: 'n2', user_id: 'u1', type: 'FRIEND_REQUEST', message: 'Rohan sent you a friend request.', is_read: false, created_at: new Date(Date.now() - 3600000).toISOString() },
  { id: 'n3', user_id: 'u1', type: 'WALLET', message: 'Refund of ₹1200 initiated.', is_read: true, created_at: new Date(Date.now() - 86400000).toISOString() }
];

export const MOCK_ACTIVITIES: ActivityLog[] = [
  { id: 'a1', user_id: 'u2', username: 'Rohan', avatar_url: 'https://picsum.photos/50?r=2', action: 'played Football at', target: 'Kickoff Arena', timestamp: '2 hours ago' },
  { id: 'a2', user_id: 'u3', username: 'Sarah', avatar_url: 'https://picsum.photos/50?r=3', action: 'joined a match for', target: 'Badminton', timestamp: '5 hours ago' },
  { id: 'a3', user_id: 'u4', username: 'Leo', avatar_url: 'https://picsum.photos/50?r=4', action: 'won the tournament', target: 'Monsoon Cup', timestamp: 'Yesterday' }
];

export const MOCK_TOURNAMENTS: Tournament[] = [
  {
    id: 'tr1', name: 'Mumbai Monsoon Cup', sport: Sport.FOOTBALL, start_date: '2024-07-15', end_date: '2024-07-20',
    entry_fee: 5000, prize_pool: 25000, location: 'Kickoff Arena, Andheri', registered_teams: 12, max_teams: 16,
    image_url: 'https://picsum.photos/600/300?r=99'
  },
  {
    id: 'tr2', name: 'Smash Zone Open', sport: Sport.BADMINTON, start_date: '2024-08-01', end_date: '2024-08-02',
    entry_fee: 1500, prize_pool: 10000, location: 'Smash Zone, Bandra', registered_teams: 8, max_teams: 32,
    image_url: 'https://picsum.photos/600/300?r=98'
  }
];
