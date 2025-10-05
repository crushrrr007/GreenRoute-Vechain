import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Button } from "@/components/ui/button"
import { Leaf, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { signOut } from "@/app/actions/auth"
import { ConnectButton } from "@/components/wallet/connect-button"
import { WalletInfo } from "@/components/wallet/wallet-info"
import { WalletTransactions } from "@/components/wallet/wallet-transactions"
import { EcoPointsManager } from "@/components/wallet/ecopoints-manager"
import { TokenBalances } from "@/components/wallet/token-balances"

export default async function WalletPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch user profile
  const { data: profile } = await supabase.from("profiles").select("*").eq("id", user.id).single()

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 glass-effect sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-mono font-bold text-foreground">GreenRoute</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/dashboard"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Dashboard
            </Link>
            <Link
              href="/trips/browse"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Browse Trips
            </Link>
            <Link
              href="/marketplace"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Marketplace
            </Link>
            <Link href="/wallet" className="text-sm font-medium text-primary">
              Wallet
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <ConnectButton />
            <span className="text-sm text-muted-foreground hidden sm:block">{profile?.display_name}</span>
            <form action={signOut}>
              <Button variant="ghost" size="sm">
                Sign Out
              </Button>
            </form>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Link href="/dashboard">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
          </Link>
          <h1 className="text-5xl font-mono font-bold mb-3 gradient-text">Wallet Management</h1>
          <p className="text-lg text-muted-foreground">
            Manage your Web3 wallet, view transactions, and track your EcoPoints tokens.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6 mb-8">
          <WalletInfo />
          <EcoPointsManager userId={user.id} ecoPoints={profile?.eco_points || 0} />
        </div>

        <div className="mb-8">
          <TokenBalances />
        </div>

        <WalletTransactions />
      </div>
    </div>
  )
}
