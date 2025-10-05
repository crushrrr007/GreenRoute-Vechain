-- Remove blockchain-related fields from database schema
-- This migration removes Web3/blockchain references and focuses on points-based rewards

-- Remove blockchain fields from profiles table
ALTER TABLE public.profiles DROP COLUMN IF EXISTS wallet_address;

-- Remove blockchain fields from trips table
ALTER TABLE public.trips DROP COLUMN IF EXISTS blockchain_trip_id;

-- Remove blockchain fields from itineraries table
ALTER TABLE public.itineraries DROP COLUMN IF EXISTS blockchain_itinerary_id;

-- Remove blockchain fields from carbon_records table
ALTER TABLE public.carbon_records DROP COLUMN IF EXISTS blockchain_record_id;

-- Rename b3tr_rewards to eco_points for clarity
ALTER TABLE public.carbon_records RENAME COLUMN b3tr_rewards TO eco_points_earned;

-- Add new gamification fields to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS eco_points INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS level INTEGER DEFAULT 1;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS badges JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS achievements JSONB DEFAULT '[]'::jsonb;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS streak_days INTEGER DEFAULT 0;
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS last_activity_date DATE;

-- Create index for leaderboard queries
CREATE INDEX IF NOT EXISTS idx_profiles_eco_points ON public.profiles(eco_points DESC);
CREATE INDEX IF NOT EXISTS idx_profiles_level ON public.profiles(level DESC);
