"use client"

/**
 * This is the main chatbot component for the application.
 * It's been simplified to use only Spanish language.
 */

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send, Maximize2, Minimize2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion } from "framer-motion"

// Spanish text constants
const SPANISH_TEXT = {
  newChat: "Nueva conversación",
  howCanIHelp: "¿Cómo puedo ayudarte hoy?",
  askAboutDocs:
    "Pregúntame cualquier cosa sobre los documentos precargados. Solo responderé basándome en la información de mi base de conocimientos.",
  messagePlaceholder: "Mensaje a Gemini...",
  disclaimer: "Gemini puede mostrar información inexacta, incluso sobre personas, así que verifica sus respuestas.",
  loading: "Cargando...",
  demoTitle: "Demo de RAG con Gemini",
  usingPreloadedContext: "Usando contexto precargado",
  enterFullscreen: "Pantalla completa",
  exitFullscreen: "Salir de pantalla completa",
  minimizeChatbot: "Minimizar chatbot",
  noInfo: "No tengo información sobre eso en mi base de conocimientos.",
}

/**
 * Main Chatbot Component
 *
 * This component serves as the primary interface for the Gemini RAG chatbot.
 * It handles conversation state, user interactions, and API communication.
 */
export default function Home() {
  // State for client-side rendering check
  const [isClient, setIsClient] = useState(false)

  // Chat interaction states
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)

  // Conversation management state
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; id: string }[]>([])

  // UI state management
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })

  // Refs for DOM manipulation
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatbotRef = useRef<HTMLDivElement>(null)

  /**
   * Set client-side rendering flag and focus input on mount
   */
  useEffect(() => {
    setIsClient(true)
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [])

  /**
   * Scroll to bottom when messages change
   */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  /**
   * Handle form submission for sending messages
   * @param e - Form event
   */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim() || loading) return

    // Add user message to the conversation
    const userMessage = { role: "user" as const, content: query, id: Date.now().toString() }
    setMessages((prev) => [...prev, userMessage])
    setQuery("")
    setLoading(true)

    try {
      // Send query to the API - hardcoded to Spanish
      const response = await fetch("/api/rag-gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          language: "es", // Hardcoded to Spanish
        }),
      })

      const data = await response.json()

      // Add assistant response to the conversation
      setMessages((prev) => [
        ...prev,
        { role: "assistant" as const, content: data.text, id: (Date.now() + 1).toString() },
      ])
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: "Estoy teniendo problemas para conectarme en este momento. Por favor, inténtalo de nuevo más tarde.",
          id: (Date.now() + 1).toString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Toggle fullscreen mode
   */
  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen)
    if (isMinimized) setIsMinimized(false)
  }

  /**
   * Toggle minimized mode
   */
  const toggleMinimized = () => {
    setIsMinimized(!isMinimized)
    if (isFullscreen) setIsFullscreen(false)
  }

  /**
   * Handle drag end for minimized chatbot
   * @param info - Drag event info
   */
  const handleDragEnd = (info: any) => {
    setPosition({
      x: info.point.x,
      y: info.point.y,
    })
  }

  // Only render the full UI after client-side hydration is complete
  if (!isClient) {
    return <div className="flex items-center justify-center h-screen">{SPANISH_TEXT.loading}</div>
  }

  // Render minimized chatbot
  if (isMinimized) {
    return (
      <motion.div
        drag
        dragMomentum={false}
        onDragEnd={handleDragEnd}
        initial={{ x: position.x, y: position.y }}
        animate={{ x: position.x, y: position.y }}
        className="fixed z-50 cursor-move"
      >
        <div className="bg-primary text-primary-foreground rounded-full p-3 shadow-lg flex items-center justify-center">
          <div className="relative">
            <Button
              variant="ghost"
              size="icon"
              className="text-primary-foreground hover:bg-primary/80 rounded-full"
              onClick={toggleMinimized}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-primary-foreground"
              >
                <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                <path d="M21 3v5h-5" />
              </svg>
            </Button>
          </div>
        </div>
      </motion.div>
    )
  }

  // Main chatbot UI
  return (
    <div
      ref={chatbotRef}
      className={cn(
        "flex bg-background w-full h-full transition-all duration-300 ease-in-out",
        isFullscreen ? "fixed inset-0 z-50" : "",
      )}
      style={{
        boxShadow: isFullscreen ? "none" : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* Main chat area - No sidebar as requested */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Top control bar */}
        <div className="absolute top-0 right-0 left-0 h-14 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-end px-4 border-b">
          <div className="flex items-center gap-2">
            {/* Fullscreen toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  {isFullscreen ? SPANISH_TEXT.exitFullscreen : SPANISH_TEXT.enterFullscreen}
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Minimize button */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full" onClick={toggleMinimized}>
                    <X className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{SPANISH_TEXT.minimizeChatbot}</TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        {/* Messages area */}
        <ScrollArea className="flex-1 p-4 pt-16 pb-32">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full flex-col gap-4 max-w-lg mx-auto text-center">
              <div className="rounded-full bg-primary/10 p-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="text-primary"
                >
                  <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                  <path d="M21 3v5h-5" />
                </svg>
              </div>
              <h2 className="text-xl font-bold">{SPANISH_TEXT.howCanIHelp}</h2>
              <p className="text-muted-foreground">{SPANISH_TEXT.askAboutDocs}</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
              {/* Map through messages and render each one */}
              {messages.map((message) => (
                <div key={message.id} className={cn("flex", message.role === "user" ? "justify-end" : "justify-start")}>
                  <div
                    className={cn("flex gap-3 max-w-[80%]", message.role === "user" ? "flex-row-reverse" : "flex-row")}
                  >
                    <Avatar className={cn(message.role === "assistant" ? "bg-primary/10" : "bg-secondary")}>
                      {message.role === "assistant" ? (
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="text-primary"
                        >
                          <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8" />
                          <path d="M21 3v5h-5" />
                        </svg>
                      ) : (
                        <span className="text-background">Tú</span>
                      )}
                    </Avatar>
                    <div
                      className={cn(
                        "rounded-lg p-4",
                        message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                      )}
                    >
                      <div className="whitespace-pre-wrap">{message.content}</div>
                    </div>
                  </div>
                </div>
              ))}
              {/* This ref is used to scroll to the bottom when new messages are added */}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input area */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-background/80 backdrop-blur-sm">
          <form onSubmit={handleSubmit} className="max-w-3xl mx-auto">
            <div className="relative">
              <Input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={SPANISH_TEXT.messagePlaceholder}
                className="pr-12 py-6 text-base rounded-full shadow-sm border-primary/20"
                disabled={loading}
              />
              <Button
                type="submit"
                size="icon"
                className="absolute right-1 top-1/2 transform -translate-y-1/2 h-10 w-10 rounded-full"
                disabled={!query.trim() || loading}
              >
                {loading ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              </Button>
            </div>
          </form>
          <div className="text-xs text-center mt-2 text-muted-foreground">{SPANISH_TEXT.disclaimer}</div>
        </div>
      </div>
    </div>
  )
}
