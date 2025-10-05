import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, MapPin, Calendar } from "lucide-react"
import Link from "next/link"

export default async function BrowseTripsPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  console.log("[v0] Browse trips - User:", user?.id, "Error:", error)

  if (error || !user) {
    redirect("/auth/login")
  }

  // Fetch active trips from other users
  const { data: trips, error: tripsError } = await supabase
    .from("trips")
    .select("*")
    .eq("status", "active")
    .neq("user_id", user.id)
    .order("created_at", { ascending: false })

  console.log("[v0] Browse trips - Fetched trips:", trips?.length, "Error:", tripsError)

  // Fetch profiles for the trip creators
  let tripsWithProfiles = trips || []
  if (trips && trips.length > 0) {
    const userIds = trips.map((trip) => trip.user_id)
    const { data: profiles, error: profilesError } = await supabase
      .from("profiles")
      .select("id, display_name")
      .in("id", userIds)

    console.log("[v0] Browse trips - Fetched profiles:", profiles?.length, "Error:", profilesError)

    // Merge profiles with trips
    tripsWithProfiles = trips.map((trip) => ({
      ...trip,
      profile: profiles?.find((p) => p.id === trip.user_id),
    }))
  }

  console.log("[v0] Browse trips - Final trips with profiles:", tripsWithProfiles.length)

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-50">
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
          <h1 className="text-4xl font-mono font-bold mb-2 bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Browse Trip Requests
          </h1>
          <p className="text-muted-foreground">Help travelers plan sustainable journeys and earn B3TR tokens</p>
        </div>

        {tripsWithProfiles && tripsWithProfiles.length > 0 ? (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tripsWithProfiles.map((trip) => (
              <Card key={trip.id} className="hover:border-primary hover:shadow-lg transition-all duration-300">
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <MapPin className="h-5 w-5 text-primary" />
                    <span className="text-xs px-2 py-1 rounded-full bg-primary/10 text-primary font-medium">
                      Active
                    </span>
                  </div>
                  <CardTitle className="font-mono">{trip.destination}</CardTitle>
                  <CardDescription>by {trip.profile?.display_name || "Anonymous Traveler"}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="h-4 w-4" />
                      <span>
                        {new Date(trip.start_date).toLocaleDateString()} -{" "}
                        {new Date(trip.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    {trip.budget && (
                      <div className="text-sm text-muted-foreground">Budget: ${trip.budget.toLocaleString()}</div>
                    )}
                    <Link href={`/trips/view/${trip.id}`}>
                      <Button className="w-full mt-4 shadow-md hover:shadow-lg transition-shadow">
                        Propose Itinerary
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border-dashed">
            <CardContent className="py-12 text-center">
              <Leaf className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
              <p className="text-muted-foreground mb-2 font-medium">No active trip requests at the moment.</p>
              <p className="text-sm text-muted-foreground">Check back soon for new opportunities to help travelers!</p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}
