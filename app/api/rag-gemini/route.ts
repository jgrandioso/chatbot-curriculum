import { type NextRequest, NextResponse } from "next/server"
import { createAPIsession } from "./utils";

export async function POST(req: NextRequest) {
  try {
    const { query, language = "es" } = await req.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query string is required" }, { status: 400 })
    }

    // Generate a response using Gemini in the specified language
    const text = createAPIsession(language)

    return NextResponse.json({ text })
  } catch (error) {
    console.error("RAG error:", error)
    return NextResponse.json({ error: "Failed to process the request" }, { status: 500 })
  }
}
