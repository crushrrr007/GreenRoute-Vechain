"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingDown, Leaf, Trophy } from "lucide-react"
import { createClient } from "@/lib/supabase/client"

export function CarbonTrackerWidget() {
  const [carbonSaved, setCarbonSaved] = useState(0)
  const [ecoPoints, setEcoPoints] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadData() {
      try {
        const supabase = createClient()
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!user) {
          setLoading(false)
          return
        }

        const { data: profile } = await supabase
          .from("profiles")
          .select("total_carbon_saved, eco_points")
          .eq("id", user.id)
          .single()

        if (profile) {
          setCarbonSaved(profile.total_carbon_saved || 0)
          setEcoPoints(profile.eco_points || 0)
        }
      } catch (error) {
        console.error("Error loading carbon data:", error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card className="border-2 border-primary">
        <CardHeader>
          <CardTitle className="font-mono flex items-center gap-2">
            <TrendingDown className="h-5 w-5 text-primary" />
            Carbon Saved
          </CardTitle>
          <CardDescription>Your total environmental impact</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-2xl font-mono font-bold text-muted-foreground">Loading...</div>
          ) : (
            <div>
              <div className="text-4xl font-mono font-bold text-primary">{carbonSaved.toFixed(1)} kg</div>
              <p className="text-sm text-muted-foreground mt-2">CO₂ emissions prevented</p>
              <div className="mt-4 space-y-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  <span>≈ {Math.round(carbonSaved / 20)} trees planted</span>
                </div>
                <div className="flex items-center gap-2">
                  <Leaf className="h-4 w-4" />
                  <span>≈ {Math.round(carbonSaved / 400)} flights offset</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-2 border-green-500">
        <CardHeader>
          <CardTitle className="font-mono flex items-center gap-2">
            <Trophy className="h-5 w-5 text-green-500" />
            EcoPoints
          </CardTitle>
          <CardDescription>Earned through sustainable travel</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-2xl font-mono font-bold text-muted-foreground">Loading...</div>
          ) : (
            <div>
              <div className="text-4xl font-mono font-bold text-green-500">{ecoPoints}</div>
              <p className="text-sm text-muted-foreground mt-2">Points earned</p>
              <div className="mt-4 text-sm text-muted-foreground">
                <p>10 points = 1 kg CO₂ saved</p>
                <p className="mt-1">Redeem points for eco-friendly rewards</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
