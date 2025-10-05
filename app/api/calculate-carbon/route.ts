import { groq } from "@ai-sdk/groq"
import { generateText } from "ai"
import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { activities } = await request.json()

    const { text } = await generateText({
      model: groq("llama-3.3-70b-versatile"),
      prompt: `Calculate the estimated CO2 emissions for the following travel activities:

${JSON.stringify(activities, null, 2)}

For each activity, consider:
- Transportation method and distance
- Accommodation type and energy usage
- Food choices (local vs imported, plant-based vs meat)
- Activity type and resource consumption

Return a JSON object with:
{
  "totalCarbon": number (total kg CO2),
  "breakdown": [
    {
      "category": "transportation|accommodation|food|activities",
      "amount": number (kg CO2),
      "percentage": number (0-100)
    }
  ],
  "comparison": {
    "equivalentTrees": number (trees needed to offset),
    "equivalentCarMiles": number (miles driven in average car),
    "equivalentFlights": number (short-haul flights)
  }
}

Return ONLY the JSON object, no additional text.`,
      temperature: 0.7,
      maxTokens: 2000,
    })

    const carbonData = JSON.parse(text)
    return NextResponse.json(carbonData)
  } catch (error) {
    console.error("Error calculating carbon:", error)
    return NextResponse.json({ error: "Failed to calculate carbon footprint" }, { status: 500 })
  }
}
