-- Add Web3 wallet integration to profiles
-- This migration re-adds wallet support for blockchain features

-- Add wallet_address back to profiles table
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet_address TEXT UNIQUE;

-- Add wallet connection timestamp
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS wallet_connected_at TIMESTAMP WITH TIME ZONE;

-- Add preferred chain ID
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS preferred_chain_id INTEGER;

-- Create web3_transactions table for tracking on-chain activities
CREATE TABLE IF NOT EXISTS public.web3_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  wallet_address TEXT NOT NULL,
  transaction_hash TEXT NOT NULL UNIQUE,
  chain_id INTEGER NOT NULL,
  transaction_type TEXT CHECK (transaction_type IN ('reward_claim', 'token_transfer', 'nft_mint', 'other')),
  amount TEXT,
  status TEXT CHECK (status IN ('pending', 'confirmed', 'failed')) DEFAULT 'pending',
  block_number BIGINT,
  gas_used TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.web3_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for web3_transactions
CREATE POLICY "Users can view own transactions"
  ON public.web3_transactions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own transactions"
  ON public.web3_transactions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_profiles_wallet_address ON public.profiles(wallet_address);
CREATE INDEX IF NOT EXISTS idx_web3_transactions_user_id ON public.web3_transactions(user_id);
CREATE INDEX IF NOT EXISTS idx_web3_transactions_wallet_address ON public.web3_transactions(wallet_address);
CREATE INDEX IF NOT EXISTS idx_web3_transactions_hash ON public.web3_transactions(transaction_hash);
CREATE INDEX IF NOT EXISTS idx_web3_transactions_status ON public.web3_transactions(status);

-- Add comment for documentation
COMMENT ON TABLE public.web3_transactions IS 'Tracks blockchain transactions for wallet-connected users';
COMMENT ON COLUMN public.profiles.wallet_address IS 'Ethereum-compatible wallet address (0x...)';
COMMENT ON COLUMN public.profiles.preferred_chain_id IS 'User preferred blockchain network (1=Mainnet, 11155111=Sepolia, etc.)';
