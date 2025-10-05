# 🌱 GreenRoute DApp

A sustainable travel platform built with Next.js, Web3, and VeChain blockchain integration. GreenRoute empowers users to make eco-friendly travel choices while earning rewards for sustainable practices.

[![Next.js](https://img.shields.io/badge/Next.js-14-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![VeChain](https://img.shields.io/badge/VeChain-Web3-green?style=for-the-badge&logo=vechain)](https://vechain.org/)
[![Supabase](https://img.shields.io/badge/Supabase-Database-green?style=for-the-badge&logo=supabase)](https://supabase.com/)

## 🚀 Features

### 🌍 Sustainable Travel
- **Carbon Footprint Tracking**: Real-time carbon emission calculations
- **Eco-Friendly Route Planning**: AI-powered sustainable itinerary generation
- **Green Transportation Options**: Public transit, cycling, and walking recommendations

### 💰 Web3 Rewards
- **EcoPoints System**: Earn tokens for sustainable travel choices
- **VeChain Integration**: Blockchain-based reward distribution
- **NFT Badges**: Collectible achievements for environmental milestones
- **Token Marketplace**: Trade eco-friendly travel rewards

### 🏪 Marketplace
- **Sustainable Businesses**: Discover eco-friendly local businesses
- **Green Certifications**: Verified environmental credentials
- **Community Reviews**: User-generated sustainability ratings

### 🔐 User Experience
- **Wallet Integration**: Seamless Web3 wallet connection
- **Real-time Tracking**: Live carbon footprint monitoring
- **Social Features**: Share sustainable achievements
- **Mobile Responsive**: Optimized for all devices

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **shadcn/ui** - Modern component library
- **Framer Motion** - Smooth animations

### Backend & Database
- **Supabase** - PostgreSQL database and authentication
- **Next.js API Routes** - Serverless backend functions
- **Real-time subscriptions** - Live data updates

### Web3 & Blockchain
- **VeChain** - Sustainable blockchain platform
- **Web3 Integration** - Wallet connectivity
- **Smart Contracts** - Automated reward distribution
- **IPFS** - Decentralized file storage

### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Husky** - Git hooks
- **pnpm** - Fast package management

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- pnpm (recommended) or npm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/crushrrr007/GreenRoute-Vechain.git
   cd GreenRoute-Vechain
   ```

2. **Install dependencies**
   ```bash
   pnpm install
   # or
   npm install
   ```

3. **Environment Setup**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure your environment variables:
   ```env
   # Supabase
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key
   
   # VeChain
   NEXT_PUBLIC_VECHAIN_NETWORK=testnet
   NEXT_PUBLIC_VECHAIN_RPC_URL=your_vechain_rpc_url
   
   # API Keys
   OPENAI_API_KEY=your_openai_key
   GOOGLE_MAPS_API_KEY=your_google_maps_key
   ```

4. **Database Setup**
   ```bash
   # Run the SQL scripts in order
   psql -h your_host -U your_user -d your_database -f scripts/001_create_tables.sql
   psql -h your_host -U your_user -d your_database -f scripts/002_add_eco_points.sql
   psql -h your_host -U your_user -d your_database -f scripts/003_add_web3_integration.sql
   ```

5. **Start Development Server**
   ```bash
   pnpm dev
   # or
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
greenroute-dapp/
├── app/                    # Next.js App Router
│   ├── actions/           # Server actions
│   ├── api/              # API routes
│   ├── auth/             # Authentication pages
│   ├── dashboard/        # User dashboard
│   ├── trips/            # Trip management
│   └── wallet/           # Wallet integration
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   └── wallet/          # Web3 wallet components
├── lib/                 # Utility libraries
│   ├── supabase/        # Database client
│   └── web3/           # Blockchain integration
├── scripts/            # Database migration scripts
├── public/             # Static assets
└── docs/              # Documentation
```

## 🌐 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on every push to main branch

### Manual Deployment
```bash
# Build the application
pnpm build

# Start production server
pnpm start
```

## 🔧 Configuration

### Supabase Setup
1. Create a new Supabase project
2. Run the database migration scripts
3. Configure Row Level Security (RLS) policies
4. Set up authentication providers

### VeChain Integration
1. Get VeChain testnet/mainnet RPC URL
2. Configure wallet connection settings
3. Deploy smart contracts for EcoPoints system
4. Set up IPFS for metadata storage

## 🤝 Contributing

We welcome contributions! 

### Development Workflow
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **VeChain Foundation** - For sustainable blockchain infrastructure
- **Supabase** - For backend-as-a-service platform
- **Next.js Team** - For the amazing React framework
- **shadcn/ui** - For beautiful component library


## 🌟 Roadmap

- [ ] **Mobile App** - React Native application
- [ ] **Advanced Analytics** - Detailed carbon footprint insights
- [ ] **Social Features** - Community challenges and leaderboards
- [ ] **Enterprise API** - B2B sustainability tracking
- [ ] **Multi-chain Support** - Ethereum, Polygon, and more
- [ ] **AI Integration** - Personalized eco-friendly recommendations

---

**Built with ❤️ for a sustainable future** 🌱

*Making every journey count for the planet*
