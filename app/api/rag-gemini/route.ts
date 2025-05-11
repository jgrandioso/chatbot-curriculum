import { type NextRequest, NextResponse } from "next/server"
import { GoogleGenAI } from "@google/genai";
import { google } from "@ai-sdk/google"
import { embed, generateText, embedMany } from "ai"
import { noInfoResponses } from "@/lib/languages"
import { createAPIsession } from "./utils";

// Pre-loaded knowledge base - replace with your own documents



export async function POST(req: NextRequest) {
  try {
    const { query, language = "es" } = await req.json()

    if (!query || typeof query !== "string") {
      return NextResponse.json({ error: "Query string is required" }, { status: 400 })
    }

    // Get language-specific "no information" response for the system prompt
    const noInfoResponse = noInfoResponses[language] || noInfoResponses.en

    // Generate a response using Gemini in the specified language
    const text = createAPIsession(language)

    return NextResponse.json({ text })
  } catch (error) {
    console.error("RAG error:", error)
    return NextResponse.json({ error: "Failed to process the request" }, { status: 500 })
  }
}
