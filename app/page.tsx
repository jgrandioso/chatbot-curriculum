"use client"

import type React from "react"
import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Loader2, Send, Plus, Menu, Globe, ChevronLeft, ChevronRight, Maximize2, Minimize2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { languages, useLanguage } from "@/lib/languages"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { motion, AnimatePresence } from "framer-motion"

/**
 * Main Chatbot Component
 *
 * This component serves as the primary interface for the Gemini RAG chatbot.
 * It handles conversation state, user interactions, and API communication.
 */
export default function Home() {
  // Language context for internationalization
  const { language, setLanguage, getText } = useLanguage()

  // State for client-side rendering check
  const [isClient, setIsClient] = useState(false)

  // Chat interaction states
  const [query, setQuery] = useState("")
  const [loading, setLoading] = useState(false)

  // Conversation management states
  const [conversations, setConversations] = useState<{ id: string; title: string }[]>([])
  const [activeConversation, setActiveConversation] = useState("")
  const [messages, setMessages] = useState<{ role: "user" | "assistant"; content: string; id: string }[]>([])

  // UI state management
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [position, setPosition] = useState({ x: 20, y: 20 })

  // Refs for DOM manipulation
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const chatbotRef = useRef<HTMLDivElement>(null)

  // Track if we've initialized conversations
  const initializedRef = useRef(false)

  /**
   * Initialize conversations only once on first render
   */
  useEffect(() => {
    if (!initializedRef.current) {
      const initialId = Date.now().toString()
      setConversations([{ id: initialId, title: getText("newChat") }])
      setActiveConversation(initialId)
      initializedRef.current = true
    }
  }, [getText])

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
   * Update conversation titles when language changes
   * Carefully implemented to avoid infinite loops
   */
  useEffect(() => {
    if (conversations.length > 0 && initializedRef.current) {
      // Create a list of "New chat" strings in all languages
      const newChatStrings = Object.values(languages).map((lang) => {
        try {
          // This is a simplified approach - in a real app, you'd need a more robust way to get translations
          return "New chat" // This is just a placeholder
        } catch (e) {
          return "New chat"
        }
      })

      // Only update if there are default-titled conversations
      const hasDefaultTitles = conversations.some(
        (conv) => conv.title === getText("newChat") || newChatStrings.includes(conv.title),
      )

      if (hasDefaultTitles) {
        setConversations((prev) =>
          prev.map((conv) => {
            // Check if this conversation has a default title
            if (conv.title === getText("newChat") || newChatStrings.includes(conv.title)) {
              return { ...conv, title: getText("newChat") }
            }
            return conv
          }),
        )
      }
    }
  }, [language, getText]) // Removed conversations from dependencies to prevent infinite loop

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
      // Send query to the API
      const response = await fetch("/api/rag-gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: query.trim(),
          language, // Send the selected language to the API
        }),
      })

      const data = await response.json()

      // Add assistant response to the conversation
      setMessages((prev) => [
        ...prev,
        { role: "assistant" as const, content: data.text, id: (Date.now() + 1).toString() },
      ])

      // Update conversation title if this is the first message
      if (messages.length === 0) {
        setConversations((prev) =>
          prev.map((conv) => (conv.id === activeConversation ? { ...conv, title: query.substring(0, 30) } : conv)),
        )
      }
    } catch (error) {
      console.error("Error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant" as const,
          content: "I'm having trouble connecting right now. Please try again later.",
          id: (Date.now() + 1).toString(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }

  /**
   * Start a new chat conversation
   */
  const startNewChat = () => {
    const newId = Date.now().toString()
    setConversations((prev) => [...prev, { id: newId, title: getText("newChat") }])
    setActiveConversation(newId)
    setMessages([])
  }

  /**
   * Change the current language
   * @param code - Language code
   */
  const changeLanguage = (code: string) => {
    setLanguage(code)
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
    return <div className="flex items-center justify-center h-screen">{getText("loading")}</div>
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
        "flex bg-background transition-all duration-300 ease-in-out",
        isFullscreen ? "fixed inset-0 z-50" : "h-screen",
      )}
      style={{
        boxShadow: isFullscreen ? "none" : "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
      }}
    >
      {/* Mobile sidebar trigger */}
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden absolute top-4 left-4 z-10">
            <Menu />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0 w-[280px]">
          <MobileSidebar
            conversations={conversations}
            activeConversation={activeConversation}
            setActiveConversation={setActiveConversation}
            startNewChat={startNewChat}
          />
        </SheetContent>
      </Sheet>

      {/* Desktop sidebar with collapse functionality */}
      <AnimatePresence initial={false}>
        {!sidebarCollapsed && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: 280, opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="hidden md:flex flex-col border-r h-full overflow-hidden"
          >
            <div className="p-4">
              <Button onClick={startNewChat} className="w-full justify-start gap-2">
                <Plus size={16} />
                {getText("newChat")}
              </Button>
            </div>
            <Separator />
            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {conversations.map((conversation) => (
                  <Button
                    key={conversation.id}
                    variant={activeConversation === conversation.id ? "secondary" : "ghost"}
                    className={cn(
                      "w-full justify-start text-left truncate h-auto py-3",
                      activeConversation === conversation.id ? "bg-secondary" : "",
                    )}
                    onClick={() => setActiveConversation(conversation.id)}
                  >
                    {conversation.title}
                  </Button>
                ))}
              </div>
            </ScrollArea>
            <div className="p-4 mt-auto">
              <div className="text-xs text-muted-foreground">
                {getText("demoTitle")}
                <br />
                {getText("usingPreloadedContext")}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar collapse toggle button */}
      <div className="hidden md:flex items-center absolute left-[280px] top-1/2 transform -translate-y-1/2 z-10">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="outline"
                size="icon"
                className="rounded-full h-8 w-8 border-primary/20 bg-background shadow-md"
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              >
                {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              {sidebarCollapsed ? getText("expandSidebar") : getText("collapseSidebar")}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/* Main chat area */}
      <div className="flex-1 flex flex-col h-full relative">
        {/* Top control bar */}
        <div className="absolute top-0 right-0 left-0 h-14 bg-background/80 backdrop-blur-sm z-10 flex items-center justify-end px-4 border-b">
          {/* Language selector */}
          <div className="flex items-center gap-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon" className="rounded-full">
                        <Globe className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      {languages.map((lang) => (
                        <DropdownMenuItem key={lang.code} onClick={() => changeLanguage(lang.code)}>
                          <span className={language === lang.code ? "font-bold" : ""}>{lang.name}</span>
                        </DropdownMenuItem>
                      ))}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TooltipTrigger>
                <TooltipContent>{getText("changeLanguage")}</TooltipContent>
              </Tooltip>
            </TooltipProvider>

            {/* Fullscreen toggle */}
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="outline" size="icon" className="rounded-full" onClick={toggleFullscreen}>
                    {isFullscreen ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
                  </Button>
                </TooltipTrigger>
                <TooltipContent>{isFullscreen ? getText("exitFullscreen") : getText("enterFullscreen")}</TooltipContent>
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
                <TooltipContent>{getText("minimizeChatbot")}</TooltipContent>
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
              <h2 className="text-xl font-bold">{getText("howCanIHelp")}</h2>
              <p className="text-muted-foreground">{getText("askAboutDocs")}</p>
            </div>
          ) : (
            <div className="space-y-6 max-w-3xl mx-auto">
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
                        <span className="text-background">You</span>
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
                placeholder={getText("messagePlaceholder")}
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
          <div className="text-xs text-center mt-2 text-muted-foreground">{getText("disclaimer")}</div>
        </div>
      </div>
    </div>
  )
}

/**
 * Mobile Sidebar Component
 *
 * This component renders the sidebar for mobile devices.
 * It's displayed in a slide-out sheet.
 */
function MobileSidebar({
  conversations,
  activeConversation,
  setActiveConversation,
  startNewChat,
}: {
  conversations: { id: string; title: string }[]
  activeConversation: string
  setActiveConversation: (id: string) => void
  startNewChat: () => void
}) {
  const { getText } = useLanguage()

  return (
    <div className="flex flex-col h-full">
      <div className="p-4">
        <Button onClick={startNewChat} className="w-full justify-start gap-2">
          <Plus size={16} />
          {getText("newChat")}
        </Button>
      </div>
      <Separator />
      <ScrollArea className="flex-1">
        <div className="p-2 space-y-1">
          {conversations.map((conversation) => (
            <Button
              key={conversation.id}
              variant={activeConversation === conversation.id ? "secondary" : "ghost"}
              className={cn(
                "w-full justify-start text-left truncate h-auto py-3",
                activeConversation === conversation.id ? "bg-secondary" : "",
              )}
              onClick={() => setActiveConversation(conversation.id)}
            >
              {conversation.title}
            </Button>
          ))}
        </div>
      </ScrollArea>
      <div className="p-4 mt-auto">
        <div className="text-xs text-muted-foreground">
          {getText("demoTitle")}
          <br />
          {getText("usingPreloadedContext")}
        </div>
      </div>
    </div>
  )
}
