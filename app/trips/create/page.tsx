import { redirect } from "next/navigation"
import { createClient } from "@/lib/supabase/server"
import { TripCreateForm } from "@/components/trip-create-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Leaf } from "lucide-react"
import Link from "next/link"

export default async function CreateTripPage() {
  const supabase = await createClient()

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser()

  if (error || !user) {
    redirect("/auth/login")
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

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-mono">Plan Your Eco-Friendly Trip</CardTitle>
            <CardDescription>
              Share your travel details and get AI-powered sustainable itineraries with carbon footprint analysis
            </CardDescription>
          </CardHeader>
          <CardContent>
            <TripCreateForm userId={user.id} />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
