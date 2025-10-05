"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface CompleteTripButtonProps {
  tripId: string
  itineraryId: string
  carbonSavedKg: number
}

export function CompleteTripButton({ tripId, itineraryId, carbonSavedKg }: CompleteTripButtonProps) {
  const [isCompleting, setIsCompleting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleComplete = async () => {
    setIsCompleting(true)
    setError(null)

    try {
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) {
        setError("Please log in to complete trip")
        return
      }

      const ecoPointsEarned = Math.round(carbonSavedKg * 10)

      await supabase
        .from("trips")
        .update({
          status: "completed",
          carbon_footprint: carbonSavedKg,
        })
        .eq("id", tripId)

      // Get current profile stats
      const { data: profile } = await supabase
        .from("profiles")
        .select("total_carbon_saved, total_trips, eco_points")
        .eq("id", user.id)
        .single()

      await supabase
        .from("profiles")
        .update({
          total_carbon_saved: (profile?.total_carbon_saved || 0) + carbonSavedKg,
          total_trips: (profile?.total_trips || 0) + 1,
          eco_points: (profile?.eco_points || 0) + ecoPointsEarned,
        })
        .eq("id", user.id)

      const { data: itinerary } = await supabase.from("itineraries").select("guide_id").eq("id", itineraryId).single()

      if (itinerary) {
        await supabase.from("carbon_records").insert({
          trip_id: tripId,
          itinerary_id: itineraryId,
          traveler_id: user.id,
          guide_id: itinerary.guide_id,
          carbon_saved_kg: carbonSavedKg,
          eco_points_earned: ecoPointsEarned,
          is_verified: true,
          verified_at: new Date().toISOString(),
        })
      }

      router.refresh()
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to complete trip")
    } finally {
      setIsCompleting(false)
    }
  }

  return (
    <div>
      {error && <p className="text-sm text-destructive mb-2">{error}</p>}
      <Button onClick={handleComplete} disabled={isCompleting} className="w-full">
        {isCompleting ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Completing Trip...
          </>
        ) : (
          <>
            <CheckCircle className="mr-2 h-4 w-4" />
            Complete Trip & Earn Points
          </>
        )}
      </Button>
    </div>
  )
}
