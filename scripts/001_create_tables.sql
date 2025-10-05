-- Create profiles table for user management
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT UNIQUE,
  display_name TEXT,
  bio TEXT,
  user_type TEXT CHECK (user_type IN ('traveler', 'guide', 'both')) DEFAULT 'traveler',
  total_carbon_saved INTEGER DEFAULT 0,
  total_trips INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create trips table for off-chain trip details
CREATE TABLE IF NOT EXISTS public.trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blockchain_trip_id INTEGER UNIQUE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  destination TEXT NOT NULL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  end_date TIMESTAMP WITH TIME ZONE NOT NULL,
  preferences JSONB,
  budget INTEGER,
  carbon_footprint INTEGER,
  status TEXT CHECK (status IN ('active', 'completed', 'cancelled')) DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create itineraries table for detailed itinerary data
CREATE TABLE IF NOT EXISTS public.itineraries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blockchain_itinerary_id INTEGER UNIQUE,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  guide_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  itinerary_data JSONB NOT NULL,
  carbon_footprint INTEGER NOT NULL,
  status TEXT CHECK (status IN ('proposed', 'accepted', 'rejected')) DEFAULT 'proposed',
  is_ai_generated BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create eco_businesses table for marketplace
CREATE TABLE IF NOT EXISTS public.eco_businesses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  business_type TEXT CHECK (business_type IN ('hotel', 'restaurant', 'transport', 'activity', 'other')),
  location TEXT NOT NULL,
  description TEXT,
  certifications TEXT[],
  contact_info JSONB,
  rating DECIMAL(2,1) CHECK (rating >= 0 AND rating <= 5),
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create carbon_records table for tracking
CREATE TABLE IF NOT EXISTS public.carbon_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  blockchain_record_id INTEGER UNIQUE,
  trip_id UUID NOT NULL REFERENCES public.trips(id) ON DELETE CASCADE,
  itinerary_id UUID NOT NULL REFERENCES public.itineraries(id) ON DELETE CASCADE,
  traveler_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  guide_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  carbon_saved_kg INTEGER NOT NULL,
  b3tr_rewards INTEGER NOT NULL,
  is_verified BOOLEAN DEFAULT FALSE,
  verified_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.trips ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.itineraries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.eco_businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.carbon_records ENABLE ROW LEVEL SECURITY;

-- RLS Policies for profiles
CREATE POLICY "Users can view all profiles"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- RLS Policies for trips
CREATE POLICY "Anyone can view active trips"
  ON public.trips FOR SELECT
  USING (status = 'active' OR auth.uid() = user_id);

CREATE POLICY "Users can create own trips"
  ON public.trips FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own trips"
  ON public.trips FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own trips"
  ON public.trips FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for itineraries
CREATE POLICY "Anyone can view itineraries for active trips"
  ON public.itineraries FOR SELECT
  USING (true);

CREATE POLICY "Users can create itineraries"
  ON public.itineraries FOR INSERT
  WITH CHECK (auth.uid() = guide_id);

CREATE POLICY "Guides can update own itineraries"
  ON public.itineraries FOR UPDATE
  USING (auth.uid() = guide_id);

-- RLS Policies for eco_businesses
CREATE POLICY "Anyone can view verified businesses"
  ON public.eco_businesses FOR SELECT
  USING (is_verified = true);

-- RLS Policies for carbon_records
CREATE POLICY "Users can view own carbon records"
  ON public.carbon_records FOR SELECT
  USING (auth.uid() = traveler_id OR auth.uid() = guide_id);

CREATE POLICY "System can insert carbon records"
  ON public.carbon_records FOR INSERT
  WITH CHECK (true);

-- Create indexes for better performance
CREATE INDEX idx_trips_user_id ON public.trips(user_id);
CREATE INDEX idx_trips_status ON public.trips(status);
CREATE INDEX idx_itineraries_trip_id ON public.itineraries(trip_id);
CREATE INDEX idx_itineraries_guide_id ON public.itineraries(guide_id);
CREATE INDEX idx_carbon_records_traveler_id ON public.carbon_records(traveler_id);
CREATE INDEX idx_eco_businesses_type ON public.eco_businesses(business_type);
