"use client"

import { useEffect, useState } from "react"
import dynamic from "next/dynamic"

// Import the main page component dynamically to avoid SSR issues
const ChatbotPage = dynamic(() => import("@/app/page"), {
  ssr: false,
})

/**
 * Chatbot Widget Component
 *
 * This component renders the chatbot in a widget format that can be embedded
 * in other pages, such as a resume or portfolio site.
 */
export default function ChatbotWidget() {
  const [mounted, setMounted] = useState(false)

  // Only render on client-side to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="fixed bottom-20 right-4 z-50 w-[400px] h-[600px] shadow-xl rounded-lg overflow-hidden border border-border">
      <ChatbotPage />
    </div>
  )
}
