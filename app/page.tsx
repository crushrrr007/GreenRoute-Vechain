import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Leaf, TrendingDown, Globe, ArrowRight, Award, Sparkles, Users } from "lucide-react"
import { createClient } from "@/lib/supabase/server"
import { signOut } from "@/app/actions/auth"
import { ConnectButton } from "@/components/wallet/connect-button"

export default async function HomePage() {
  let user = null
  try {
    const supabase = await createClient()
    const { data } = await supabase.auth.getUser()
    user = data?.user
  } catch (error) {
    console.log("[v0] Error fetching user:", error)
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border/50 glass-effect sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="relative">
              <Leaf className="h-8 w-8 text-primary" />
              <div className="absolute inset-0 h-8 w-8 text-primary animate-pulse opacity-30" />
            </div>
            <span className="text-2xl font-mono font-bold text-foreground">GreenRoute</span>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="#how-it-works"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              How It Works
            </Link>
            <Link
              href="#features"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Features
            </Link>
            <Link
              href="#impact"
              className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
            >
              Impact
            </Link>
          </nav>
          <div className="flex items-center gap-3">
            <ConnectButton />
            {user ? (
              <>
                <Link href="/dashboard">
                  <Button variant="ghost" size="sm">
                    Dashboard
                  </Button>
                </Link>
                <form action={signOut}>
                  <Button type="submit" variant="outline" size="sm">
                    Sign Out
                  </Button>
                </form>
              </>
            ) : (
              <>
                <Link href="/auth/login">
                  <Button variant="ghost" size="sm">
                    Login
                  </Button>
                </Link>
                <Link href="/auth/sign-up">
                  <Button size="sm" className="shadow-lg shadow-primary/20">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>
        </div>
      </header>

      <section className="container mx-auto px-4 py-24 md:py-40">
        <div className="max-w-5xl mx-auto text-center animate-fade-in">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">AI-Powered Sustainable Travel</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-mono font-bold text-foreground mb-8 text-balance leading-tight">
            Travel Sustainably,
            <br />
            <span className="gradient-text">Earn Rewards</span>
          </h1>
          <p className="text-xl md:text-2xl text-muted-foreground mb-10 text-pretty leading-relaxed max-w-3xl mx-auto">
            Plan eco-friendly trips with AI assistance, track your carbon savings, and earn points for every sustainable
            journey.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link href="/auth/sign-up">
              <Button
                size="lg"
                className="text-lg px-10 py-6 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all"
              >
                Start Planning <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Link href="#how-it-works">
              <Button size="lg" variant="outline" className="text-lg px-10 py-6 bg-transparent border-2">
                Learn More
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-gradient-to-b from-secondary/30 to-background border-y border-border/50 py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all">
              <div className="text-5xl font-mono font-bold gradient-text mb-3">0 kg</div>
              <div className="text-sm font-medium text-muted-foreground">CO₂ Saved Globally</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all">
              <div className="text-5xl font-mono font-bold gradient-text mb-3">0</div>
              <div className="text-sm font-medium text-muted-foreground">Eco Trips Planned</div>
            </div>
            <div className="text-center p-6 rounded-2xl bg-card/50 border border-border/50 hover:border-primary/30 transition-all">
              <div className="text-5xl font-mono font-bold gradient-text mb-3">0</div>
              <div className="text-sm font-medium text-muted-foreground">EcoPoints Distributed</div>
            </div>
          </div>
        </div>
      </section>

      <section id="how-it-works" className="container mx-auto px-4 py-24">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-5xl md:text-6xl font-mono font-bold mb-4">How It Works</h2>
            <p className="text-xl text-muted-foreground">Three simple steps to sustainable travel</p>
          </div>

          <div className="grid gap-8">
            <Card className="p-10 border-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all group">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                  1
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-mono font-semibold mb-4 text-balance">Post Your Trip</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Share your destination, dates, and preferences. Our AI instantly generates an eco-friendly itinerary
                    optimized for minimal carbon emissions.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-10 border-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all group">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                  2
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-mono font-semibold mb-4 text-balance">Review Carbon Impact</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    See the carbon footprint comparison between traditional travel and your eco-route. Local guides can
                    also propose custom sustainable itineraries.
                  </p>
                </div>
              </div>
            </Card>

            <Card className="p-10 border-2 hover:border-primary/50 hover:shadow-xl hover:shadow-primary/10 transition-all group">
              <div className="flex items-start gap-8">
                <div className="flex-shrink-0 w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/70 text-primary-foreground flex items-center justify-center text-2xl font-bold shadow-lg group-hover:scale-110 transition-transform">
                  3
                </div>
                <div className="flex-1">
                  <h3 className="text-3xl font-mono font-semibold mb-4 text-balance">Earn EcoPoints Rewards</h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Complete your trip and earn EcoPoints based on verified carbon savings. Both travelers and guides
                    are rewarded for sustainable choices.
                  </p>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section
        id="features"
        className="bg-gradient-to-b from-background to-secondary/20 border-y border-border/50 py-24"
      >
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-5xl md:text-6xl font-mono font-bold mb-4">Features</h2>
              <p className="text-xl text-muted-foreground">Everything you need for sustainable travel</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              <Card className="p-8 hover:shadow-xl hover:shadow-primary/10 transition-all group border-2 hover:border-primary/30">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Sparkles className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">AI-Powered Itineraries</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Get instant eco-friendly travel plans optimized for public transport, shared rides, and green
                  accommodations.
                </p>
              </Card>

              <Card className="p-8 hover:shadow-xl hover:shadow-primary/10 transition-all group border-2 hover:border-primary/30">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <TrendingDown className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Carbon Tracking</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Real-time carbon footprint calculations with detailed breakdowns of your environmental impact.
                </p>
              </Card>

              <Card className="p-8 hover:shadow-xl hover:shadow-primary/10 transition-all group border-2 hover:border-primary/30">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Award className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Rewards & Badges</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Earn EcoPoints and unlock achievement badges for every sustainable travel choice you make.
                </p>
              </Card>

              <Card className="p-8 hover:shadow-xl hover:shadow-primary/10 transition-all group border-2 hover:border-primary/30">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Globe className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Eco Marketplace</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Connect with verified green hotels, EV rentals, and sustainable restaurants in your destination.
                </p>
              </Card>

              <Card className="p-8 hover:shadow-xl hover:shadow-primary/10 transition-all group border-2 hover:border-primary/30">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Community Challenges</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Join monthly eco-challenges and compete with travelers worldwide to reduce carbon emissions.
                </p>
              </Card>

              <Card className="p-8 hover:shadow-xl hover:shadow-primary/10 transition-all group border-2 hover:border-primary/30">
                <div className="w-14 h-14 rounded-xl bg-primary/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Leaf className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Carbon Offsets</h3>
                <p className="text-muted-foreground leading-relaxed">
                  Purchase verified carbon offsets directly through our platform to neutralize your travel impact.
                </p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      <section id="impact" className="container mx-auto px-4 py-24">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl md:text-6xl font-mono font-bold mb-8 text-balance">Make Every Trip Count</h2>
          <p className="text-xl text-muted-foreground mb-10 leading-relaxed">
            Join a community of eco-conscious travelers making a real impact on climate change. Every sustainable choice
            is tracked and rewarded with EcoPoints.
          </p>
          <Link href="/auth/sign-up">
            <Button
              size="lg"
              className="text-lg px-10 py-6 shadow-xl shadow-primary/20 hover:shadow-2xl hover:shadow-primary/30 transition-all"
            >
              Start Your Journey <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      <footer className="border-t border-border/50 bg-gradient-to-b from-background to-secondary/20 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Leaf className="h-6 w-6 text-primary" />
              <span className="text-lg font-mono font-bold">GreenRoute</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Sustainable Travel Platform • Track Your Impact • Earn Rewards
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
