"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { createClient } from "@/lib/supabase/client"
import { Loader2 } from "lucide-react"

interface TripCreateFormProps {
  userId: string
}

export function TripCreateForm({ userId }: TripCreateFormProps) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const [formData, setFormData] = useState({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "",
    preferences: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    console.log("[v0] Trip create form - Submitting:", formData)

    try {
      const supabase = createClient()

      // Create trip in database
      const { data: trip, error: tripError } = await supabase
        .from("trips")
        .insert({
          user_id: userId,
          destination: formData.destination,
          start_date: formData.startDate,
          end_date: formData.endDate,
          budget: formData.budget ? Number.parseInt(formData.budget) : null,
          preferences: formData.preferences ? { notes: formData.preferences } : null,
          status: "active",
        })
        .select()
        .single()

      console.log("[v0] Trip create form - Created trip:", trip?.id, "Error:", tripError)

      if (tripError) throw tripError

      console.log("[v0] Trip create form - Redirecting to:", `/trips/view/${trip.id}`)
      router.push(`/trips/view/${trip.id}`)
    } catch (err) {
      console.error("[v0] Trip create form - Error:", err)
      setError(err instanceof Error ? err.message : "Failed to create trip")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="destination">Destination</Label>
        <Input
          id="destination"
          placeholder="e.g., Paris, France"
          required
          value={formData.destination}
          onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date</Label>
          <Input
            id="startDate"
            type="date"
            required
            value={formData.startDate}
            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            required
            value={formData.endDate}
            onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="budget">Budget (USD)</Label>
        <Input
          id="budget"
          type="number"
          placeholder="e.g., 2000"
          value={formData.budget}
          onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="preferences">Travel Preferences</Label>
        <Textarea
          id="preferences"
          placeholder="Tell us about your interests, dietary restrictions, accessibility needs, etc."
          rows={4}
          value={formData.preferences}
          onChange={(e) => setFormData({ ...formData, preferences: e.target.value })}
        />
      </div>

      {error && <p className="text-sm text-destructive">{error}</p>}

      <Button type="submit" className="w-full" disabled={isLoading}>
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Creating Trip...
          </>
        ) : (
          "Generate Eco-Itinerary"
        )}
      </Button>
    </form>
  )
}
