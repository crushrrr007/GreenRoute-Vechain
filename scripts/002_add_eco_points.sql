-- Add eco_points column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS eco_points INTEGER DEFAULT 0;

-- Create a function to update eco_points when carbon is saved
CREATE OR REPLACE FUNCTION update_eco_points()
RETURNS TRIGGER AS $$
BEGIN
  -- Award 10 eco points for every kg of carbon saved
  UPDATE public.profiles
  SET eco_points = eco_points + (NEW.carbon_saved_kg * 10),
      total_carbon_saved = total_carbon_saved + NEW.carbon_saved_kg
  WHERE id = NEW.traveler_id;
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update eco_points
DROP TRIGGER IF EXISTS trigger_update_eco_points ON public.carbon_records;
CREATE TRIGGER trigger_update_eco_points
  AFTER INSERT ON public.carbon_records
  FOR EACH ROW
  EXECUTE FUNCTION update_eco_points();

-- Create index for eco_points
CREATE INDEX IF NOT EXISTS idx_profiles_eco_points ON public.profiles(eco_points DESC);
