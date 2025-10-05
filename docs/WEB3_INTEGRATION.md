# Web3 Wallet Integration - GreenRoute

## Overview
GreenRoute now has full Web3 wallet integration, allowing users to connect their Ethereum wallets, manage tokens, and prepare for blockchain-based rewards.

## Features Implemented

### 1. Wallet Connection
- **Multiple Wallet Support**: MetaMask, WalletConnect, Coinbase Wallet
- **Multi-Chain Support**: Ethereum Mainnet, Sepolia, Polygon, Base
- **Auto-Sync**: Wallet addresses automatically sync with user profiles in Supabase

### 2. Wallet Management Dashboard
- **Location**: `/wallet` page
- **Features**:
  - View wallet address with copy/explorer links
  - Display network and native token balance
  - Sync wallet with profile
  - Disconnect wallet functionality
  - EcoPoints token management (ready for smart contract)
  - Token balances display (native + ERC-20)
  - Transaction history from blockchain

### 3. Database Integration
- **Profiles Table**: Added `wallet_address` column with unique constraint
- **Web3 Transactions Table**: Tracks all blockchain transactions
- **EcoPoints Column**: Ready for token reward system

### 4. Components Created
- `ConnectButton`: Dropdown menu for wallet connection
- `WalletInfo`: Displays connected wallet details
- `EcoPointsManager`: Manage EcoPoints tokens (placeholder for smart contract)
- `TokenBalances`: Display all token balances
- `WalletTransactions`: Show transaction history from blockchain

## Environment Variables Required

\`\`\`env
NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID=your_project_id_here
\`\`\`

Get your WalletConnect Project ID from: https://cloud.walletconnect.com/

## Database Schema

### Profiles Table (Updated)
\`\`\`sql
ALTER TABLE profiles
ADD COLUMN wallet_address TEXT UNIQUE;
ADD COLUMN eco_points INTEGER DEFAULT 0;
ADD COLUMN wallet_connected_at TIMESTAMP WITH TIME ZONE;
ADD COLUMN preferred_chain_id INTEGER;
\`\`\`

### Web3 Transactions Table
\`\`\`sql
CREATE TABLE web3_transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id),
  wallet_address TEXT NOT NULL,
  transaction_hash TEXT UNIQUE NOT NULL,
  transaction_type TEXT NOT NULL,
  amount TEXT,
  chain_id INTEGER NOT NULL,
  block_number BIGINT,
  gas_used TEXT,
  status TEXT DEFAULT 'pending',
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

## Setup Instructions

### 1. Run Database Migrations
Execute the following SQL scripts in order:
\`\`\`bash
# Add wallet_address column to profiles
scripts/004_add_wallet_address.sql
\`\`\`

### 2. Configure WalletConnect
1. Go to https://cloud.walletconnect.com/
2. Create a new project
3. Copy the Project ID
4. Add to your environment variables as `NEXT_PUBLIC_WALLET_CONNECT_PROJECT_ID`

### 3. Deploy to Production
The wallet integration works in the v0 preview, but for full functionality:
1. Click "Publish" in the top right of v0
2. Deploy to Vercel
3. Add environment variables in Vercel project settings

## Usage

### Connecting a Wallet
1. Click "Connect Wallet" button in the header
2. Select your preferred wallet (MetaMask, WalletConnect, etc.)
3. Approve the connection in your wallet
4. Your wallet address is automatically synced to your profile

### Viewing Wallet Details
1. Navigate to `/wallet` page
2. View your wallet address, network, and balance
3. See your EcoPoints balance
4. View transaction history
5. Manage token balances

### Disconnecting
1. Click the "Disconnect" button on the wallet page
2. Your wallet address is removed from your profile
3. You can reconnect anytime

## Next Steps

### Smart Contract Integration
To enable actual EcoPoints token functionality:

1. **Deploy EcoPoints Token Contract**
   - Create an ERC-20 token contract
   - Deploy to your preferred network (Polygon recommended for low fees)
   - Update the token address in the code

2. **Update EcoPointsManager Component**
   - Replace placeholder functions with actual contract calls
   - Implement mint/claim functionality
   - Add transfer capabilities

3. **Reward Distribution**
   - Connect carbon tracking to token rewards
   - Implement automated reward distribution
   - Add staking/governance features

### Additional Features
- NFT badges for achievements
- Token staking for premium features
- DAO governance for platform decisions
- Cross-chain bridge integration
- DeFi integrations (swap, liquidity pools)

## Troubleshooting

### WalletConnect Analytics Error
**Error**: "fetch to https://pulse.walletconnect.org/e failed"
**Solution**: This is a non-critical analytics error in the v0 preview environment. It won't occur in production deployments.

### Wallet Not Connecting
1. Ensure WalletConnect Project ID is set
2. Check that your wallet extension is installed and unlocked
3. Try refreshing the page
4. Check browser console for specific errors

### Database Sync Issues
1. Verify the `wallet_address` column exists in profiles table
2. Run the migration script: `scripts/004_add_wallet_address.sql`
3. Check Supabase logs for any errors

## Security Considerations

1. **Never store private keys**: The app only stores public wallet addresses
2. **Row Level Security**: Ensure RLS policies are enabled on all tables
3. **Wallet verification**: Consider implementing signature verification for sensitive operations
4. **Rate limiting**: Implement rate limiting on wallet sync endpoints
5. **Input validation**: All wallet addresses are validated before storage

## Support

For issues or questions:
1. Check the v0 diagnostics panel for runtime errors
2. Review Supabase logs for database issues
3. Open a support ticket at vercel.com/help
4. Check WalletConnect documentation: https://docs.walletconnect.com/

---

**Integration Status**: ✅ Complete
**Last Updated**: 2025
**Version**: 1.0.0
