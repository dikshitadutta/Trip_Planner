import { useState } from "react"
import { Mountain, Utensils, Users, Palette, X, Send, MapPin } from "lucide-react"
import MapExplorer from "./MapExplorer"

const exploreOptions = [
  {
    id: "views",
    icon: Mountain,
    label: "Show me incredible views",
    prompt: "I want to see breathtaking scenic views and natural wonders",
    suggestions: [
      "Best mountain viewpoints",
      "Scenic coastal drives",
      "Sunrise/sunset spots",
      "Natural wonders"
    ]
  },
  {
    id: "restaurants",
    icon: Utensils,
    label: "Find bucket-list restaurants",
    prompt: "Show me must-visit restaurants and unique dining experiences",
    suggestions: [
      "Michelin-starred restaurants",
      "Local food markets",
      "Rooftop dining",
      "Street food spots"
    ]
  },
  {
    id: "family",
    icon: Users,
    label: "Build my family road trip",
    prompt: "Help me plan a family-friendly road trip",
    suggestions: [
      "Kid-friendly attractions",
      "Family hotels",
      "Rest stops with playgrounds",
      "Educational sites"
    ]
  },
  {
    id: "arts",
    icon: Palette,
    label: "See top arts destinations",
    prompt: "Show me the best art galleries, museums, and cultural sites",
    suggestions: [
      "Famous art museums",
      "Street art districts",
      "Cultural festivals",
      "Historic theaters"
    ]
  }
]

export default function ExploreOptions() {
  const [selectedOption, setSelectedOption] = useState(null)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState(null)

  const handleOptionClick = (option) => {
    setSelectedOption(option)
    setMessages([
      {
        role: "assistant",
        content: `Great choice! I'll help you ${option.label.toLowerCase()}. What destination are you interested in?`,
        suggestions: option.suggestions
      }
    ])
  }

  const handleSendMessage = async (message) => {
    if (!message.trim()) return

    const userMessage = message.trim()
    setInput("")
    setMessages(prev => [...prev, { role: "user", content: userMessage }])
    setIsLoading(true)

    try {
      const response = await fetch("http://localhost:3000/api/explore/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          message: userMessage,
          context: selectedOption.prompt 
        }),
      })

      const data = await response.json()

      if (data.success) {
        setMessages(prev => [
          ...prev,
          { 
            role: "assistant", 
            content: data.response,
            location: data.location
          }
        ])
        
        if (data.location) {
          setSelectedLocation(data.location)
        }
      }
    } catch (error) {
      console.error("Error:", erro