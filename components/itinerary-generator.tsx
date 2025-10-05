"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Loader2 } from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import { useRouter } from "next/navigation"

interface ItineraryGeneratorProps {
  tripId: string
  destination: string
  startDate: string
  endDate: string
  budget: number | null
  preferences: string | null
}

export function ItineraryGenerator({
  tripId,
  destination,
  startDate,
  endDate,
  budget,
  preferences,
}: ItineraryGeneratorProps) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const handleGenerate = async () => {
    setIsGenerating(true)
    setError(null)

    try {
      console.log("[v0] Generating itinerary for trip:", tripId) // Added debug logging

      // Call AI API to generate itinerary
      const response = await fetch("/api/generate-itinerary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination,
          startDate,
          endDate,
          budget,
          preferences,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: "Unknown error" }))
        throw new Error(errorData.error || "Failed to generate itinerary")
      }

      const itineraryData = await response.json()
      console.log("[v0] Received itinerary data:", itineraryData) // Added debug logging

      if (itineraryData.error) {
        throw new Error(itineraryData.error)
      }

      // Save itinerary to database
      const supabase = createClient()
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error("Not authenticated")

      const { data: itinerary, error: dbError } = await supabase
        .from("itineraries")
        .insert({
          trip_id: tripId,
          guide_id: user.id,
          itinerary_data: itineraryData,
          carbon_footprint: itineraryData.totalCarbonFootprint,
          is_ai_generated: true,
          status: "proposed",
        })
        .select()
        .single()

      if (dbError) throw dbError

      console.log("[v0] Itinerary saved successfully") // Added debug logging
      // Refresh the page to show new itinerary
      router.refresh()
    } catch (err) {
      console.error("[v0] Error in handleGenerate:", err) // Added debug logging
      setError(err instanceof Error ? err.message : "Failed to generate itinerary")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <Card className="border-2 border-primary">
      <CardHeader>
        <CardTitle className="font-mono flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          AI Itinerary Generator
        </CardTitle>
        <CardDescription>
          Get an instant eco-friendly itinerary powered by AI with carbon footprint analysis
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && <p className="text-sm text-destructive mb-4">{error}</p>}
        <Button onClick={handleGenerate} disabled={isGenerating} className="w-full">
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Generating Sustainable Itinerary...
            </>
          ) : (
            <>
              <Sparkles className="mr-2 h-4 w-4" />
              Generate AI Itinerary
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  )
}
