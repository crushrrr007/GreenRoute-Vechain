import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf, Hotel, Utensils, Car, Activity } from "lucide-react"
import Link from "next/link"

export default async function MarketplacePage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch verified eco businesses
  const { data: businesses } = await supabase
    .from("eco_businesses")
    .select("*")
    .eq("is_verified", true)
    .order("rating", { ascending: false })
    .limit(12)

  const getBusinessIcon = (type: string) => {
    switch (type) {
      case "hotel":
        return <Hotel className="h-5 w-5" />
      case "restaurant":
        return <Utensils className="h-5 w-5" />
      case "transport":
        return <Car className="h-5 w-5" />
      case "activity":
        return <Activity className="h-5 w-5" />
      default:
        return <Leaf className="h-5 w-5" />
    }
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Leaf className="h-8 w-8 text-primary" />
            <span className="text-2xl font-mono font-bold text-foreground">GreenRoute</span>
          </Link>
          <Link href="/dashboard">
            <span className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Back to Dashboard
            </span>
          </Link>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-mono font-bold mb-2">Eco Marketplace</h1>
          <p className="text-muted-foreground">Discover verified sustainable businesses for your travels</p>
        </div>

        {businesses && businesses.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {businesses.map((business) => (
              <Card key={business.id} className="hover:border-primary transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="text-primary">{getBusinessIcon(business.business_type)}</div>
                    {business.rating && <span className="text-sm font-semibold">⭐ {business.rating.toFixed(1)}</span>}
                  </div>
                  <CardTitle className="font-mono">{business.name}</CardTitle>
                  <CardDescription className="capitalize">{business.business_type}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground line-clamp-2">{business.description}</p>
                    <div className="text-sm text-muted-foreground">{business.location}</div>
                    {business.certifications && business.certifications.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {business.certifications.slice(0, 2).map((cert, idx) => (
                          <span key={idx} className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary">
                            {cert}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card>
            <CardContent className="py-12 text-center">
              <p className="text-muted-foreground mb-4">No eco-businesses listed yet.</p>
              <p className="text-sm text-muted-foreground">Check back soon as we add verified sustainable partners!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
