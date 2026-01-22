
import { UserProfile, UserType, KycStatus, Sport, OpenMatch, LeaderboardEntry, UserTier, Team, ChatRoom, WalletTransaction, Notification, ActivityLog, Tournament, Turf, TournamentBracketData, FriendActivity, MerchItem, Coach, RentalItem, Booking } from './types';

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
    total_score: 122, 
    mvp_badges: 3
  },
  credibility: {
    total: 88,
    breakdown: {
      reliability: 95,
      skill: 80,
      fair_play: 90
    },
    endorsements: [
      { skill: 'Pace', count: 12 },
      { skill: 'Finishing', count: 8 },
      { skill: 'Teamwork', count: 15 },
      { skill: 'Vision', count: 5 }
    ]
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
  },
  // Bhavnagar Locations
  {
    id: 't4',
    owner_id: 'o4',
    name: 'Bhavnagar Sports Arena',
    location: 'Waghawadi Road, Bhavnagar',
    city: 'Bhavnagar',
    sports_supported: [Sport.FOOTBALL, Sport.CRICKET],
    price_per_hour: 1000,
    rating: 4.6,
    images: ['https://picsum.photos/500/300?random=5'],
    facilities: ['Parking', 'Floodlights', 'Cafe'],
    lat: 21.7589,
    lng: 72.1437,
    is_verified: true,
    has_coach: true,
    has_referee: true,
    weather_condition: 'Sunny',
    rental_equipment: [
      { id: 'eq5', name: 'Cricket Bat (English Willow)', price: 150, icon: '🏏' }
    ]
  },
  {
    id: 't5',
    owner_id: 'o5',
    name: 'Victoria Greens',
    location: 'Near Victoria Park, Bhavnagar',
    city: 'Bhavnagar',
    sports_supported: [Sport.FOOTBALL, Sport.TENNIS],
    price_per_hour: 900,
    rating: 4.4,
    images: ['https://picsum.photos/500/300?random=6'],
    facilities: ['Changing Rooms', 'Water', 'Natural Grass'],
    lat: 21.7460,
    lng: 72.1340,
    is_verified: false,
    has_coach: false,
    has_referee: true,
    rental_equipment: []
  },
  {
    id: 't6',
    owner_id: 'o6',
    name: 'Gohilwad Smash Center',
    location: 'Kalanala, Bhavnagar',
    city: 'Bhavnagar',
    sports_supported: [Sport.BADMINTON, Sport.PICKLEBALL],
    price_per_hour: 600,
    rating: 4.7,
    images: ['https://picsum.photos/500/300?random=7'],
    facilities: ['AC', 'Pro Shop', 'Lockers'],
    lat: 21.7690,
    lng: 72.1580,
    is_verified: true,
    has_coach: true,
    has_referee: false,
    rental_equipment: [
      { id: 'eq6', name: 'Paddle (Carbon)', price: 100, icon: '🏓' }
    ]
  }
];

export const MOCK_BOOKINGS: Booking[] = [
  {
    id: 'b_upcoming_1',
    turf_id: 't1',
    user_id: 'u1',
    sport: Sport.FOOTBALL,
    start_time: new Date(Date.now() + 172800000).toISOString(), // 2 days from now
    end_time: new Date(Date.now() + 172800000 + 3600000).toISOString(),
    price: 1200,
    status: 'CONFIRMED',
    turf: MOCK_TURFS[0],
    payment_mode: 'FULL',
    is_recurring: false
  },
  {
    id: 'b_past_1',
    turf_id: 't2',
    user_id: 'u1',
    sport: Sport.BADMINTON,
    start_time: new Date(Date.now() - 86400000).toISOString(), // Yesterday
    end_time: new Date(Date.now() - 86400000 + 3600000).toISOString(),
    price: 800,
    status: 'COMPLETED',
    turf: MOCK_TURFS[1],
    payment_mode: 'SPLIT',
    split_with: ['Rohan'],
    is_recurring: false
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

export const MOCK_BRACKET: TournamentBracketData = {
    id: 'br1',
    tournament_id: 'tr1',
    matches: [
        // Quarter Finals
        { id: 'm1', round: 1, team1: { name: 'Mumbai Indians FC', score: 2 }, team2: { name: 'Juhu Juggernauts', score: 1 }, date: '2024-07-15', status: 'COMPLETED', winner: 'Mumbai Indians FC' },
        { id: 'm2', round: 1, team1: { name: 'Bandra Boys', score: 0 }, team2: { name: 'Powai Panthers', score: 3 }, date: '2024-07-15', status: 'COMPLETED', winner: 'Powai Panthers' },
        { id: 'm3', round: 1, team1: { name: 'Thane Tigers', score: 1 }, team2: { name: 'Dadar Dynamos', score: 0 }, date: '2024-07-16', status: 'COMPLETED', winner: 'Thane Tigers' },
        { id: 'm4', round: 1, team1: { name: 'Colaba Coolers', score: 2 }, team2: { name: 'Worli Warriors', score: 2 }, date: '2024-07-16', status: 'COMPLETED', winner: 'Worli Warriors' }, // Penalties implied
        // Semi Finals
        { id: 'm5', round: 2, team1: { name: 'Mumbai Indians FC', score: 1 }, team2: { name: 'Powai Panthers', score: 2 }, date: '2024-07-18', status: 'COMPLETED', winner: 'Powai Panthers' },
        { id: 'm6', round: 2, team1: { name: 'Thane Tigers' }, team2: { name: 'Worli Warriors' }, date: '2024-07-18', status: 'SCHEDULED' },
        // Finals
        { id: 'm7', round: 3, team1: { name: 'Powai Panthers' }, team2: { name: 'TBD' }, date: '2024-07-20', status: 'SCHEDULED' },
    ]
};

export const MOCK_FRIENDS_ACTIVITY: FriendActivity[] = [
  {
    id: 'fa1',
    user_id: 'u2',
    username: 'pickle_rick',
    avatar_url: 'https://picsum.photos/50/50?r=2',
    turf_id: 't2',
    turf_name: 'Smash Zone',
    sport: 'Pickleball',
    start_time: new Date().toISOString(), // Live
    status: 'LIVE',
    lat: 19.0596,
    lng: 72.8295
  },
  {
    id: 'fa2',
    user_id: 'u3',
    username: 'net_master',
    avatar_url: 'https://picsum.photos/50/50?r=3',
    turf_id: 't1',
    turf_name: 'Kickoff Arena',
    sport: 'Football',
    start_time: new Date(Date.now() + 3600000).toISOString(), // Upcoming
    status: 'UPCOMING',
    lat: 19.1136,
    lng: 72.8697
  },
  {
    id: 'fa3',
    user_id: 'u4',
    username: 'speedy',
    avatar_url: 'https://picsum.photos/50/50?r=4',
    turf_id: 't3',
    turf_name: 'Green Field Box',
    sport: 'Cricket',
    start_time: new Date(Date.now() - 1800000).toISOString(), // Playing for 30 mins
    status: 'LIVE',
    lat: 19.1187,
    lng: 72.9073
  }
];

export const MOCK_MERCH_ITEMS: MerchItem[] = [
  {
    id: 'merch1',
    name: 'Turfex Pro Jersey',
    description: 'Breathable, sweat-wicking fabric designed for high-intensity matches. Features the iconic Turfex home colors.',
    price: 899,
    category: 'Apparel',
    image_url: 'https://images.unsplash.com/photo-1529815482062-79482b834725?w=500&auto=format&fit=crop&q=60',
    rating: 4.8,
    reviews_count: 124,
    is_new: true,
    colors: ['#1A1A1A', '#0057FF']
  },
  {
    id: 'merch2',
    name: 'Elite Grip Socks',
    description: 'Anti-slip technology to keep you locked in your boots. Prevent blisters and improve agility.',
    price: 299,
    original_price: 399,
    category: 'Apparel',
    image_url: 'https://images.unsplash.com/photo-1579758629938-03607ccdbaba?w=500&auto=format&fit=crop&q=60',
    rating: 4.9,
    reviews_count: 450,
    is_bestseller: true,
    colors: ['#FFFFFF', '#000000']
  },
  {
    id: 'merch3',
    name: 'Match Day Football',
    description: 'FIFA quality approved size 5 football. Thermally bonded surface for predictable trajectory.',
    price: 1499,
    category: 'Equipment',
    image_url: 'https://images.unsplash.com/photo-1614632537190-23e4146777db?w=500&auto=format&fit=crop&q=60',
    rating: 4.7,
    reviews_count: 89
  },
  {
    id: 'merch4',
    name: 'Turfex Sipper',
    description: '750ml insulated bottle to keep your water cold during those hot afternoon games.',
    price: 499,
    category: 'Accessories',
    image_url: 'https://images.unsplash.com/photo-1602143407151-011141950038?w=500&auto=format&fit=crop&q=60',
    rating: 4.5,
    reviews_count: 56,
    colors: ['#0057FF', '#FF7043']
  },
  {
    id: 'merch5',
    name: 'Tactical Duffle',
    description: 'Separate compartment for boots and wet clothes. 40L capacity.',
    price: 1999,
    category: 'Accessories',
    image_url: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=500&auto=format&fit=crop&q=60',
    rating: 4.9,
    reviews_count: 210,
    is_bestseller: true
  },
  {
    id: 'merch6',
    name: 'Training Bibs (Set)',
    description: 'Set of 10 lightweight mesh bibs. Essential for organizing practice matches.',
    price: 1200,
    category: 'Equipment',
    image_url: 'https://images.unsplash.com/photo-1517466787929-bc90951d6dbb?w=500&auto=format&fit=crop&q=60',
    rating: 4.6,
    reviews_count: 34,
    colors: ['#32CD32', '#FFD700']
  }
];

export const MOCK_COACHES: Coach[] = [
  {
    id: 'ch1',
    name: 'Rahul Dravid (Ex-State)',
    sport: 'Cricket',
    experience: '15 Years',
    rate_per_session: 1500,
    rating: 4.9,
    reviews_count: 120,
    avatar_url: 'https://randomuser.me/api/portraits/men/45.jpg',
    specialization: 'Batting Technique',
    is_verified: true
  },
  {
    id: 'ch2',
    name: 'Sunil Chhetri Acad.',
    sport: 'Football',
    experience: '8 Years',
    rate_per_session: 800,
    rating: 4.7,
    reviews_count: 85,
    avatar_url: 'https://randomuser.me/api/portraits/men/32.jpg',
    specialization: 'Striker Drills',
    is_verified: true
  },
  {
    id: 'ch3',
    name: 'Saina Club',
    sport: 'Badminton',
    experience: '10 Years',
    rate_per_session: 1200,
    rating: 4.8,
    reviews_count: 200,
    avatar_url: 'https://randomuser.me/api/portraits/women/44.jpg',
    specialization: 'Agility & Smash',
    is_verified: true
  },
  {
    id: 'ch4',
    name: 'Pickle Pro Steve',
    sport: 'Pickleball',
    experience: '3 Years',
    rate_per_session: 500,
    rating: 4.6,
    reviews_count: 40,
    avatar_url: 'https://randomuser.me/api/portraits/men/22.jpg',
    specialization: 'Dinking & Strategy',
    is_verified: false
  }
];

export const MOCK_RENTALS: RentalItem[] = [
  {
    id: 'r1',
    name: 'Wilson Pro Staff RF97',
    category: 'Tennis',
    daily_rate: 300,
    owner_id: 'u5',
    owner_name: 'Roger F.',
    owner_avatar: 'https://randomuser.me/api/portraits/men/88.jpg',
    image_url: 'https://images.unsplash.com/photo-1622279457486-62dcc4a431d6?w=500&auto=format&fit=crop&q=60',
    distance_km: 1.2,
    description: 'Pro level racket, freshly strung. Great condition.',
    available: true
  },
  {
    id: 'r2',
    name: 'Nike Mercurial Superfly (Size 9)',
    category: 'Football',
    daily_rate: 200,
    owner_id: 'u6',
    owner_name: 'Cristiano',
    owner_avatar: 'https://randomuser.me/api/portraits/men/7.jpg',
    image_url: 'https://images.unsplash.com/photo-1511886929837-354d827aae26?w=500&auto=format&fit=crop&q=60',
    distance_km: 0.5,
    description: 'Elite cleats for turf. Used only twice.',
    available: true
  },
  {
    id: 'r3',
    name: 'GM Diamond Cricket Bat',
    category: 'Cricket',
    daily_rate: 400,
    owner_id: 'u7',
    owner_name: 'Ben S.',
    owner_avatar: 'https://randomuser.me/api/portraits/men/33.jpg',
    image_url: 'https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=500&auto=format&fit=crop&q=60',
    distance_km: 2.5,
    description: 'English willow, Grade 1. incredible ping.',
    available: true
  }
];
