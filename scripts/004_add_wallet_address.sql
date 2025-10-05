-- Add wallet_address column to profiles table
-- This is required for Web3 wallet integration

ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS wallet_address TEXT UNIQUE;

-- Add index for faster wallet lookups
CREATE INDEX IF NOT EXISTS idx_profiles_wallet_address 
ON profiles(wallet_address);

-- Add comment for documentation
COMMENT ON COLUMN profiles.wallet_address IS 'Ethereum wallet address linked to this user profile';
