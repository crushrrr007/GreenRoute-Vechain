import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Plus, TrendingDown, Trophy, MapPin, Wallet } from "lucide-react"
import Link from "next/link"
import { CarbonTrackerWidget } from "@/components/carbon-tracker-widget"
import { signOut } from "@/app/actions/auth"
import { ConnectButton } from "@/components/wallet/connect-button"
import { WalletInfo } from "@/components/wallet/wallet-info"

export default async function DashboardPage() {
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

  // Fetch user trips
  const { data: trips } = await supabase
    .from("trips")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false })
    .limit(5)

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 glass-effect sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-mono font-bold text-foreground">GreenRoute</span>
          </Link>
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/dashboard" className="text-sm font-medium text-primary">
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
            <Link
              href="/wallet"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
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
        {/* Carbon Tracker Widget */}
        <div className="mb-8">
          <CarbonTrackerWidget />
        </div>

        <div className="mb-10">
          <h1 className="text-5xl font-mono font-bold mb-3 gradient-text">Welcome back, {profile?.display_name}!</h1>
          <p className="text-lg text-muted-foreground">
            Track your sustainable travel impact and plan your next eco-friendly adventure.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <Card className="border-2 hover:border-primary/30 hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Total Carbon Saved</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <TrendingDown className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-mono font-bold gradient-text">{profile?.total_carbon_saved || 0} kg</div>
              <p className="text-xs text-muted-foreground mt-2">CO₂ emissions reduced</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/30 hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">Eco Trips</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <MapPin className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-mono font-bold gradient-text">{profile?.total_trips || 0}</div>
              <p className="text-xs text-muted-foreground mt-2">Sustainable journeys</p>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/30 hover:shadow-lg transition-all">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">EcoPoints</CardTitle>
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                <Trophy className="h-5 w-5 text-primary" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-mono font-bold gradient-text">{profile?.eco_points || 0}</div>
              <p className="text-xs text-muted-foreground mt-2">Points earned</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid md:grid-cols-3 gap-6 mb-10">
          <Card className="border-2 border-primary/50 hover:border-primary hover:shadow-xl hover:shadow-primary/10 transition-all">
            <CardHeader>
              <CardTitle className="font-mono text-xl">Plan a New Trip</CardTitle>
              <CardDescription className="text-base">Get AI-powered eco-friendly itineraries</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/trips/create">
                <Button className="w-full shadow-lg shadow-primary/20">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Trip Request
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/30 hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="font-mono text-xl">Browse Trip Requests</CardTitle>
              <CardDescription className="text-base">Help travelers with sustainable itineraries</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/trips/browse">
                <Button variant="outline" className="w-full bg-transparent border-2">
                  View All Trips
                </Button>
              </Link>
            </CardContent>
          </Card>

          <Card className="border-2 hover:border-primary/30 hover:shadow-lg transition-all">
            <CardHeader>
              <CardTitle className="font-mono text-xl">Wallet Management</CardTitle>
              <CardDescription className="text-base">Manage your Web3 wallet and tokens</CardDescription>
            </CardHeader>
            <CardContent>
              <Link href="/wallet">
                <Button variant="outline" className="w-full bg-transparent border-2">
                  <Wallet className="mr-2 h-4 w-4" />
                  Manage Wallet
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        <div className="mb-10">
          <WalletInfo />
        </div>

        <Card className="border-2">
          <CardHeader>
            <CardTitle className="font-mono text-2xl">Your Recent Trips</CardTitle>
            <CardDescription className="text-base">View and manage your travel plans</CardDescription>
          </CardHeader>
          <CardContent>
            {trips && trips.length > 0 ? (
              <div className="space-y-4">
                {trips.map((trip) => (
                  <div
                    key={trip.id}
                    className="flex items-center justify-between p-6 border-2 border-border hover:border-primary/30 rounded-xl transition-all"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">{trip.destination}</h3>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(trip.start_date).toLocaleDateString()} -{" "}
                        {new Date(trip.end_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span
                        className={`text-xs font-medium px-3 py-1.5 rounded-full ${
                          trip.status === "active"
                            ? "bg-primary/10 text-primary border border-primary/20"
                            : trip.status === "completed"
                              ? "bg-green-500/10 text-green-600 border border-green-500/20"
                              : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {trip.status}
                      </span>
                      <Link href={`/trips/view/${trip.id}`}>
                        <Button size="sm" variant="ghost">
                          View
                        </Button>
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Plus className="h-8 w-8 text-primary" />
                </div>
                <p className="text-muted-foreground mb-6 text-lg">
                  No trips yet. Start planning your first eco-friendly adventure!
                </p>
                <Link href="/trips/create">
                  <Button className="shadow-lg shadow-primary/20">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Trip
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
