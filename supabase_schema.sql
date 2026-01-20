-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. PROFILES TABLE (Extends Supabase Auth)
CREATE TABLE public.profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    phone TEXT UNIQUE NOT NULL,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    city TEXT DEFAULT 'Mumbai',
    sports_preferences TEXT[],
    user_type TEXT CHECK (user_type IN ('PLAYER', 'OWNER')) DEFAULT 'PLAYER',
    kyc_status TEXT CHECK (kyc_status IN ('PENDING', 'VERIFIED', 'REJECTED', 'NONE')) DEFAULT 'NONE',
    turfex_points INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 2. TURFS TABLE
CREATE TABLE public.turfs (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    owner_id UUID REFERENCES public.profiles(id) NOT NULL,
    name TEXT NOT NULL,
    location TEXT NOT NULL,
    city TEXT NOT NULL,
    sports_supported TEXT[],
    price_per_hour NUMERIC NOT NULL,
    rating NUMERIC DEFAULT 0,
    images TEXT[],
    facilities TEXT[],
    lat DOUBLE PRECISION,
    lng DOUBLE PRECISION,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 3. SLOTS TABLE (For Availability)
CREATE TABLE public.slots (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    turf_id UUID REFERENCES public.turfs(id) ON DELETE CASCADE,
    sport TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    is_booked BOOLEAN DEFAULT FALSE,
    price_override NUMERIC
);

-- 4. BOOKINGS TABLE
CREATE TABLE public.bookings (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    turf_id UUID REFERENCES public.turfs(id),
    user_id UUID REFERENCES public.profiles(id),
    sport TEXT NOT NULL,
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    end_time TIMESTAMP WITH TIME ZONE NOT NULL,
    price NUMERIC NOT NULL,
    status TEXT CHECK (status IN ('CONFIRMED', 'CANCELLED', 'COMPLETED')) DEFAULT 'CONFIRMED',
    team_members UUID[], -- Array of user_ids
    payment_status TEXT DEFAULT 'PAID',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 5. OPEN MATCHES TABLE
CREATE TABLE public.open_matches (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    host_id UUID REFERENCES public.profiles(id),
    turf_id UUID REFERENCES public.turfs(id),
    sport TEXT NOT NULL,
    required_players INTEGER NOT NULL,
    joined_players UUID[],
    start_time TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT CHECK (status IN ('OPEN', 'FULL', 'COMPLETED')) DEFAULT 'OPEN',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now())
);

-- 6. LEADERBOARDS (Materialized View or Table updated via triggers)
CREATE TABLE public.leaderboards (
    user_id UUID REFERENCES public.profiles(id),
    city TEXT,
    sport TEXT,
    matches_played INTEGER DEFAULT 0,
    points INTEGER DEFAULT 0,
    rank INTEGER,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    PRIMARY KEY (user_id, city, sport)
);

-- 7. FRIENDSHIPS
CREATE TABLE public.friendships (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_a UUID REFERENCES public.profiles(id),
    user_b UUID REFERENCES public.profiles(id),
    status TEXT CHECK (status IN ('PENDING', 'ACCEPTED', 'BLOCKED')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;

-- Policies (Example)
-- Profiles are viewable by everyone (for social features)
CREATE POLICY "Public profiles are viewable by everyone" ON public.profiles FOR SELECT USING (true);
-- Users can update own profile
CREATE POLICY "Users can update own profile" ON public.profiles FOR UPDATE USING (auth.uid() = id);

-- Realtime Listeners
-- Run this in Supabase SQL Editor to enable realtime on bookings and matches
-- alter publication supabase_realtime add table bookings;
-- alter publication supabase_realtime add table open_matches;
