import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { NextResponse } from "next/server"

function cleanJsonResponse(text: string): string {
  // Remove markdown code blocks if present
  let cleaned = text.trim()

  // Remove opening ```json or ```
  if (cleaned.startsWith("```json")) {
    cleaned = cleaned.slice(7)
  } else if (cleaned.startsWith("```")) {
    cleaned = cleaned.slice(3)
  }

  // Remove closing ```
  if (cleaned.endsWith("```")) {
    cleaned = cleaned.slice(0, -3)
  }

  return cleaned.trim()
}

export async function POST(request: Request) {
  try {
    const { destination, startDate, endDate, budget, preferences } = await request.json()

    // Calculate trip duration
    const start = new Date(startDate)
    const end = new Date(endDate)
    const days = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1 // Added +1 to include both start and end dates

    console.log("[v0] Generating itinerary for:", { destination, days, startDate, endDate })

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `Generate a detailed eco-friendly itinerary for the following trip:

Destination: ${destination}
Duration: ${days} days (${startDate} to ${endDate})
Budget: ${budget ? `$${budget}` : "Flexible"}
Preferences: ${preferences || "None specified"}

Create a day-by-day itinerary that prioritizes:
1. Public transportation and walking over private vehicles
2. Locally-owned accommodations and restaurants
3. Sustainable activities and eco-tourism
4. Minimal waste and environmental impact
5. Cultural immersion and community support

For each day, provide:
- Morning, afternoon, and evening activities
- Transportation methods with estimated carbon emissions
- Accommodation recommendations (eco-certified when possible)
- Local sustainable restaurants
- Estimated daily cost breakdown

Also include:
- Total estimated carbon footprint in kg CO2
- Comparison to conventional travel carbon footprint
- Carbon savings achieved through sustainable choices
- Tips for further reducing environmental impact

Format the response as a structured JSON object with the following schema:
{
  "summary": "Brief overview of the trip",
  "totalCarbonFootprint": number (in kg CO2),
  "conventionalCarbonFootprint": number (in kg CO2),
  "carbonSavings": number (in kg CO2),
  "dailyItinerary": [
    {
      "day": number,
      "date": "YYYY-MM-DD",
      "activities": [
        {
          "time": "morning|afternoon|evening",
          "title": "Activity name",
          "description": "Detailed description",
          "location": "Location name",
          "transportation": "Method of transport",
          "carbonImpact": number (in kg CO2),
          "cost": number (in USD)
        }
      ],
      "accommodation": {
        "name": "Hotel/hostel name",
        "type": "hotel|hostel|eco-lodge|homestay",
        "ecoRating": number (1-5),
        "cost": number (in USD),
        "sustainableFeatures": ["feature1", "feature2"]
      },
      "meals": [
        {
          "type": "breakfast|lunch|dinner",
          "restaurant": "Restaurant name",
          "cuisine": "Cuisine type",
          "isLocal": boolean,
          "cost": number (in USD)
        }
      ],
      "totalDayCost": number (in USD),
      "totalDayCarbon": number (in kg CO2)
    }
  ],
  "sustainabilityTips": ["tip1", "tip2", "tip3"],
  "totalEstimatedCost": number (in USD)
}

Return ONLY the JSON object, no additional text.`,
      temperature: 0.7,
      maxTokens: 4000,
    })

    console.log("[v0] AI response length:", text.length)
    console.log("[v0] AI response preview:", text.substring(0, 200))

    if (!text || text.trim().length === 0) {
      throw new Error("AI returned empty response")
    }

    const cleanedText = cleanJsonResponse(text)
    console.log("[v0] Cleaned text length:", cleanedText.length)
    console.log("[v0] Cleaned text preview:", cleanedText.substring(0, 200))

    let itinerary
    try {
      itinerary = JSON.parse(cleanedText)
    } catch (parseError) {
      console.error("[v0] JSON parse error:", parseError)
      console.error("[v0] Failed to parse text:", cleanedText.substring(0, 500))
      throw new Error("AI response was not valid JSON. Please try again.")
    }

    if (!itinerary.dailyItinerary || !Array.isArray(itinerary.dailyItinerary)) {
      throw new Error("Invalid itinerary structure returned by AI")
    }

    console.log("[v0] Successfully generated itinerary with", itinerary.dailyItinerary.length, "days")
    return NextResponse.json(itinerary)
  } catch (error) {
    console.error("[v0] Error generating itinerary:", error)
    return NextResponse.json(
      { error: `Failed to generate itinerary: ${error instanceof Error ? error.message : "Unknown error"}` },
      { status: 500 },
    )
  }
}
