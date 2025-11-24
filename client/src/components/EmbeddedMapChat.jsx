import { Send, Loader2, MapPin, Plus } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import { GoogleMap, useLoadScript, Marker, InfoWindow } from "@react-google-maps/api"

const libraries = ["places"]

const mapContainerStyle = {
  width: "100%",
  height: "100%",
}

const defaultCenter = {
  lat: 37.0902,
  lng: -95.7129,
}

const quickQuestions = [
  "Best budget options?",
  "How to get tickets?",
  "What to pack for events?",
  "How to travel between cities?"
]

export default function EmbeddedMapChat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: "Where to today?\n\n🎯 Start planning a trip to discover amazing destinations.\n\nThat sounds like an exciting way to explore! I can help you plan your perfect journey. To get started, I'll highlight some of the most popular destinations and events.\n\n**Next Steps & Questions**\n\n• Do you have a specific event, sport, or festival you'd like to experience?\n• Are there certain cities you want to visit, or are you open to going wherever the best events are?\n• What time of year do you plan to travel, and how long would you like your trip to be?\n\nLet me know what interests you most, and I'll start building a personalized itinerary around the major events that excite you! Which event or city sounds most appealing to you?"
    }
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [mapCenter, setMapCenter] = useState(defaultCenter)
  const [mapZoom, setMapZoom] = useState(4)
  const [markers, setMarkers] = useState([
    { id: 1, name: "New York City", lat: 40.7128, lng: -74.0060 },
    { id: 2, name: "Los Angeles", lat: 34.0522, lng: -118.2437 },
    { id: 3, name: "Dallas", lat: 32.7767, lng: -96.7970 },
  ])
  const messagesEndRef = useRef(null)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOO