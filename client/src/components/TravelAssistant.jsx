import { useState, useRef, useEffect } from "react"
import { MessageCircle, X, Send, Loader2, Sparkles } from "lucide-react"

export default function TravelAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Hi! I'm your North East India travel assistant. I can help you with:\n\n• Destination recommendations\n• Itinerary planning\n• Best routes & travel tips\n• Weather information\n• Best time to visit\n• Local attractions\n\nWhat would you like to know?",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus()
    }
  }, [isOpen])

  const handleSend = async () => {
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    setInput("")
    setMessages((prev) => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:3000/api/chat/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: userMessage }),
      })

      const data = await response.json()

      if (data.success) {
        setMessages((prev) => [
          ...prev,
          { role: "assistant", content: data.response },
        ])
      } else {
        setMessages((prev) => [
          ...prev,
          {
            role: "assistant",
            content: "Sorry, I encountered an error. Please try again.",
          },
        ])
      }
    } catch (error) {
      console.error("Chat error:", error)
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Sorry, I'm having trouble connecting. Please try again later.",
        },
      ])
    } finally {
      setIsLoading(false)
    }
  }

  const quickQuestions = [
    "Best time to visit Meghalaya?",
    "Plan a 5-day Sikkim itinerary",
    "How to reach Tawang?",
    "Top attractions in Shillong",
  ]

  const handleQuickQuestion = (question) => {
    setInput(question)
    inputRef.current?.focus()
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-600 hover:from-emerald-600 hover:via-teal-600 hover:to-cyan-700 text-white p-5 rounded-full shadow-2xl transition-all duration-300 hover:scale-110 group animate-bounce-slow"
        >
          {/* Animated Bot Icon */}
          <div className="relative">
            {/* Bot Head */}
            <div className="relative w-8 h-8">
              {/* Antenna */}
              <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-white rounded-full" />
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-white rounded-full animate-pulse" />
              
              {/* Head */}
              <div className="w-8 h-8 bg-white/20 backdrop-blur-sm rounded-lg border-2 border-white flex items-center justify-center">
                {/* Eyes */}
                <div className="flex gap-1.5">
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-blink" />
                  <div className="w-1.5 h-1.5 bg-white rounded-full animate-blink" style={{ animationDelay: '0.1s' }} />
                </div>
              </div>
              
              {/* Smile */}
              <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-3 h-1 border-b-2 border-white rounded-full" />
            </div>
          </div>

          {/* Pulse Ring */}
          <span className="absolute inset-0 rounded-full bg-emerald-400 animate-ping opacity-20" />
          
          {/* Notification Dot */}
          <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse border-2 border-white" />
          
          {/* Tooltip */}
          <div className="absolute bottom-full right-0 mb-3 px-4 py-2 bg-gray-900 text-white text-sm rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300 whitespace-nowrap shadow-xl">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-yellow-300" />
              <span>Ask me anything about NE India!</span>
            </div>
            <div className="absolute -bottom-1 right-4 w-2 h-2 bg-gray-900 rotate-45" />
          </div>
        </button>
      )}

      <style>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes blink {
          0%, 90%, 100% { opacity: 1; }
          95% { opacity: 0; }
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-blink {
          animation: blink 4s ease-in-out infinite;
        }
      `}</style>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 z-50 w-96 h-[600px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="relative bg-gradient-to-br from-emerald-600 via-teal-600 to-cyan-700 text-white p-5 overflow-hidden">
            {/* Animated Background Pattern */}
            <div className="absolute inset-0 opacity-10">
              <div className="absolute top-0 left-0 w-32 h-32 bg-white rounded-full blur-3xl animate-pulse" />
              <div className="absolute bottom-0 right-0 w-40 h-40 bg-white rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
            </div>

            <div className="relative flex items-center justify-between">
              <div className="flex items-center gap-3">
                {/* Modern Bot Avatar */}
                <div className="relative">
                  <div className="w-12 h-12 bg-white/20 backdrop-blur-md rounded-2xl border-2 border-white/40 flex items-center justify-center shadow-lg">
                    {/* Bot Face */}
                    <div className="relative">
                      {/* Antenna */}
                      <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-0.5 h-3 bg-white/60 rounded-full" />
                      <div className="absolute -top-5 left-1/2 -translate-x-1/2 w-2 h-2 bg-yellow-300 rounded-full animate-pulse shadow-lg shadow-yellow-300/50" />
                      
                      {/* Eyes */}
                      <div className="flex gap-2 mb-1">
                        <div className="w-2 h-2 bg-white rounded-full animate-blink" />
                        <div className="w-2 h-2 bg-white rounded-full animate-blink" style={{ animationDelay: '0.1s' }} />
                      </div>
                      
                      {/* Smile */}
                      <div className="w-4 h-1.5 border-b-2 border-white rounded-full" />
                    </div>
                  </div>
                  {/* Online Status */}
                  <span className="absolute -bottom-0.5 -right-0.5 w-3.5 h-3.5 bg-green-400 rounded-full border-2 border-white animate-pulse" />
                </div>

                <div>
                  <h3 className="font-bold text-lg flex items-center gap-2">
                    AI Travel Guide
                    <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
                  </h3>
                  <p className="text-xs text-white/80 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse" />
                    Online • North East Expert
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="hover:bg-white/20 p-2 rounded-xl transition-all duration-200 hover:rotate-90"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"} animate-fade-in`}
              >
                {/* Assistant Avatar */}
                {message.role === "assistant" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mr-2 flex-shrink-0 shadow-md">
                    <Sparkles className="w-4 h-4 text-white" />
                  </div>
                )}

                <div
                  className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${
                    message.role === "user"
                      ? "bg-gradient-to-br from-emerald-500 to-teal-600 text-white rounded-br-md"
                      : "bg-white text-gray-800 rounded-tl-md border border-gray-100"
                  }`}
                >
                  <p className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.content}
                  </p>
                  <p className={`text-xs mt-1 ${message.role === "user" ? "text-emerald-100" : "text-gray-400"}`}>
                    {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>

                {/* User Avatar */}
                {message.role === "user" && (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-gray-600 to-gray-800 flex items-center justify-center ml-2 flex-shrink-0 shadow-md">
                    <span className="text-white text-xs font-bold">You</span>
                  </div>
                )}
              </div>
            ))}

            {isLoading && (
              <div className="flex justify-start animate-fade-in">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center mr-2 flex-shrink-0 shadow-md">
                  <Sparkles className="w-4 h-4 text-white" />
                </div>
                <div className="bg-white text-gray-800 rounded-2xl rounded-tl-md px-4 py-3 shadow-sm border border-gray-100 flex items-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin text-emerald-500" />
                  <span className="text-sm text-gray-500">Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <style>{`
            @keyframes fade-in {
              from {
                opacity: 0;
                transform: translateY(10px);
              }
              to {
                opacity: 1;
                transform: translateY(0);
              }
            }
            .animate-fade-in {
              animation: fade-in 0.3s ease-out;
            }
          `}</style>

          {/* Quick Questions */}
          {messages.length === 1 && (
            <div className="px-4 py-3 bg-gradient-to-r from-emerald-50 to-teal-50 border-t border-emerald-100">
              <p className="text-xs font-semibold text-gray-700 mb-2 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-600" />
                Try asking:
              </p>
              <div className="flex flex-wrap gap-2">
                {quickQuestions.map((question, index) => (
                  <button
                    key={index}
                    onClick={() => handleQuickQuestion(question)}
                    className="text-xs bg-white hover:bg-emerald-500 hover:text-white text-emerald-700 px-3 py-2 rounded-lg transition-all duration-200 border border-emerald-200 hover:border-emerald-500 shadow-sm hover:shadow-md transform hover:scale-105"
                  >
                    {question}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-200">
            <div className="flex gap-2">
              <div className="flex-1 relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Ask me anything about NE India..."
                  className="w-full px-4 py-3 pr-10 border-2 border-gray-200 rounded-xl focus:outline-none focus:border-emerald-500 transition-all duration-200 bg-gray-50 focus:bg-white"
                  disabled={isLoading}
                />
                {input && (
                  <button
                    onClick={() => setInput("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
              <button
                onClick={handleSend}
                disabled={!input.trim() || isLoading}
                className="bg-gradient-to-br from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white p-3 rounded-xl transition-all duration-200 shadow-md hover:shadow-lg transform hover:scale-105 disabled:transform-none"
              >
                <Send className="w-5 h-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">Powered by AI • Instant responses</p>
          </div>
        </div>
      )}
    </>
  )
}
