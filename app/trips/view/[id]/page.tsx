import { redirect, notFound } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Leaf, Calendar, DollarSign, TrendingDown } from "lucide-react"
import Link from "next/link"
import { ItineraryGenerator } from "@/components/itinerary-generator"
import { CompleteTripButton } from "@/components/complete-trip-button"

export default async function TripDetailPage({ params }: { params: { id: string } }) {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  if (!uuidRegex.test(params.id)) {
    notFound()
  }

  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
  }

  const { data: trip, error: tripError } = await supabase.from("trips").select("*").eq("id", params.id).single()

  if (!trip) {
    redirect("/dashboard")
  }

  const { data: tripOwnerProfile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", trip.user_id)
    .single()

  const { data: itineraries } = await supabase
    .from("itineraries")
    .select("*")
    .eq("trip_id", params.id)
    .order("created_at", { ascending: false })

  let itinerariesWithProfiles = itineraries || []
  if (itineraries && itineraries.length > 0) {
    const guideIds = itineraries.map((i) => i.guide_id).filter(Boolean)
    if (guideIds.length > 0) {
      const { data: guideProfiles } = await supabase.from("profiles").select("id, display_name").in("id", guideIds)

      itinerariesWithProfiles = itineraries.map((itinerary) => ({
        ...itinerary,
        profiles: guideProfiles?.find((p) => p.id === itinerary.guide_id) || null,
      }))
    }
  }

  const { data: acceptedItinerary } = await supabase
    .from("itineraries")
    .select("*")
    .eq("trip_id", params.id)
    .eq("status", "accepted")
    .maybeSingle()

  let acceptedItineraryWithProfile = acceptedItinerary
  if (acceptedItinerary?.guide_id) {
    const { data: guideProfile } = await supabase
      .from("profiles")
      .select("display_name")
      .eq("id", acceptedItinerary.guide_id)
      .single()

    acceptedItineraryWithProfile = {
      ...acceptedItinerary,
      profiles: guideProfile,
    }
  }

  const isOwner = trip.user_id === user.id

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
        {/* Trip Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h1 className="text-4xl font-mono font-bold mb-2">{trip.destination}</h1>
              <p className="text-muted-foreground">by {tripOwnerProfile?.display_name || "Anonymous"}</p>
            </div>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                trip.status === "active"
                  ? "bg-primary/10 text-primary"
                  : trip.status === "completed"
                    ? "bg-green-500/10 text-green-500"
                    : "bg-muted text-muted-foreground"
              }`}
            >
              {trip.status}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-primary" />
                  <div>
                    <div className="text-sm text-muted-foreground">Duration</div>
                    <div className="font-semibold">
                      {new Date(trip.start_date).toLocaleDateString()} - {new Date(trip.end_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {trip.budget && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <DollarSign className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Budget</div>
                      <div className="font-semibold">${trip.budget.toLocaleString()}</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {trip.carbon_footprint && (
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <TrendingDown className="h-5 w-5 text-primary" />
                    <div>
                      <div className="text-sm text-muted-foreground">Carbon Footprint</div>
                      <div className="font-semibold">{trip.carbon_footprint} kg CO₂</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {trip.preferences?.notes && (
            <Card className="mt-4">
              <CardHeader>
                <CardTitle className="text-lg">Travel Preferences</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">{trip.preferences.notes}</p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* AI Itinerary Generator */}
        {isOwner && (
          <div className="mb-8">
            <ItineraryGenerator
              tripId={trip.id}
              destination={trip.destination}
              startDate={trip.start_date}
              endDate={trip.end_date}
              budget={trip.budget}
              preferences={trip.preferences?.notes}
            />
          </div>
        )}

        {/* Complete Trip Button */}
        {isOwner && trip.status === "active" && acceptedItineraryWithProfile && (
          <Card className="mb-8 border-2 border-primary">
            <CardHeader>
              <CardTitle className="font-mono">Complete Your Trip</CardTitle>
              <CardDescription>Finalize your trip to record carbon savings and earn EcoPoints</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Carbon Saved</span>
                  <span className="font-semibold">{acceptedItineraryWithProfile.carbon_footprint} kg CO₂</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">EcoPoints Reward</span>
                  <span className="font-semibold text-green-500">
                    {acceptedItineraryWithProfile.carbon_footprint * 10} Points
                  </span>
                </div>
              </div>
              <CompleteTripButton
                tripId={trip.id}
                itineraryId={acceptedItineraryWithProfile.id}
                carbonSavedKg={acceptedItineraryWithProfile.carbon_footprint}
              />
            </CardContent>
          </Card>
        )}

        {/* Proposed Itineraries */}
        <div>
          <h2 className="text-2xl font-mono font-bold mb-4">{isOwner ? "Your Itineraries" : "Propose an Itinerary"}</h2>

          {itinerariesWithProfiles && itinerariesWithProfiles.length > 0 ? (
            <div className="space-y-4">
              {itinerariesWithProfiles.map((itinerary) => (
                <Card key={itinerary.id} className="hover:border-primary transition-colors">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="font-mono">
                          {itinerary.is_ai_generated ? "AI-Generated Itinerary" : "Custom Itinerary"}
                        </CardTitle>
                        <CardDescription>
                          {itinerary.is_ai_generated
                            ? "Generated by GreenRoute AI"
                            : `Proposed by ${(itinerary.profiles as { display_name: string })?.display_name || "Guide"}`}
                        </CardDescription>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-muted-foreground">Carbon Footprint</div>
                        <div className="text-lg font-semibold text-primary">{itinerary.carbon_footprint} kg CO₂</div>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {itinerary.itinerary_data?.summary && (
                        <p className="text-muted-foreground">{itinerary.itinerary_data.summary}</p>
                      )}
                      {itinerary.itinerary_data?.carbonSavings && (
                        <div className="flex items-center gap-2 text-sm">
                          <TrendingDown className="h-4 w-4 text-green-500" />
                          <span className="text-green-500 font-semibold">
                            {itinerary.itinerary_data.carbonSavings} kg CO₂ saved vs conventional travel
                          </span>
                        </div>
                      )}
                      <Link href={`/itineraries/${itinerary.id}`}>
                        <Button className="mt-4">View Full Itinerary</Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-12 text-center">
                <p className="text-muted-foreground mb-4">No itineraries yet.</p>
                {isOwner ? (
                  <p className="text-sm text-muted-foreground">
                    Generate an AI itinerary above or wait for guides to propose custom plans.
                  </p>
                ) : (
                  <Button>Propose Custom Itinerary</Button>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
