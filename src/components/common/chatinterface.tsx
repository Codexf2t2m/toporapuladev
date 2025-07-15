"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { X, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface Message {
  id: number
  text: string
  sender: "user" | "bot"
}

interface ChatInterfaceProps {
  isOpen: boolean
  onClose: () => void
}

export default function ChatInterface({ isOpen, onClose }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hi there! I'm your AI assistant. How can I help you today?",
      sender: "bot",
    },
  ])
  const [input, setInput] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    // Add user message
    const newUserMessage: Message = {
      id: messages.length + 1,
      text: input,
      sender: "user",
    }
    setMessages((prev) => [...prev, newUserMessage])
    setInput("")

    // Simulate bot thinking and responding
    setIsSpeaking(true)
    setTimeout(() => {
      const botResponses = [
        "I understand what you're asking. Let me help with that.",
        "That's an interesting question! Here's what I think...",
        "I'd be happy to assist with that request.",
        "Let me process that information and get back to you.",
        "I have some suggestions that might help with your question.",
      ]

      const randomResponse = botResponses[Math.floor(Math.random() * botResponses.length)]

      const newBotMessage: Message = {
        id: messages.length + 2,
        text: randomResponse,
        sender: "bot",
      }

      setMessages((prev) => [...prev, newBotMessage])
      setIsSpeaking(false)
    }, 2000)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSendMessage()
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md flex flex-col h-full shadow-xl animate-slide-in">
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-lg font-semibold">AI Assistant</h2>
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close chat">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="flex-1 flex flex-col">
          {/* 3D Avatar Container */}
          

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div key={message.id} className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}>
                <div
                  className={`max-w-[80%] rounded-lg p-3 ${
                    message.sender === "user" ? "bg-violet-600 text-white" : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {message.text}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area - Enhanced for better visibility */}
          <div className="p-4 border-t bg-gray-50">
            <div className="flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message..."
                className="flex-1 bg-white border-gray-300 focus:border-violet-500 focus:ring-violet-500 text-base"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!input.trim()}
                className="bg-violet-600 hover:bg-violet-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Send
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
