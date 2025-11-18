import { MapPin } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export default function LocationAutocomplete({ value, onChange, placeholder = "Search location...", region = "northeast" }) {
  const [suggestions, setSuggestions] = useState([])
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const suggestionsRef = useRef(null)
  const inputRef = useRef(null)

  const MAPBOX_API_KEY = import.meta.env.VITE_MAPBOX_API_KEY

  // North Eastern states bounding box (approximate)
  // Covers: Assam, Meghalaya, Tripura, Mizoram, Manipur, Nagaland, Arunachal Pradesh, Sikkim
  const NORTHEAST_BBOX = "88.0,21.5,97.5,29.5"

  // Fetch suggestions from Mapbox Geocoding API
  const fetchSuggestions = async (query) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([])
      return
    }

    setIsLoading(true)
    try {
      const bbox = region === "northeast" ? `&bbox=${NORTHEAST_BBOX}` : ""
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${MAPBOX_API_KEY}&country=IN${bbox}&limit=5`
      )
      const data = await response.json()

      if (data.features) {
        const formatted = data.features.map((feature) => ({
          id: feature.id,
          name: feature.place_name,
          coordinates: feature.geometry.coordinates,
          context: feature.context,
        }))
        setSuggestions(formatted)
        setIsOpen(true)
      }
    } catch (error) {
      console.error("Error fetching suggestions:", error)
      setSuggestions([])
    } finally {
      setIsLoading(false)
    }
  }

  // Debounce the API calls
  useEffect(() => {
    const timer = setTimeout(() => {
      if (value) {
        fetchSuggestions(value)
      }
    }, 300)

    return () => clearTimeout(timer)
  }, [value])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) && !inputRef.current?.contains(e.target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (suggestion) => {
    onChange(suggestion.name)
    setIsOpen(false)
    setSuggestions([])
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3 border-2 border-emerald-200 rounded-lg px-4 py-3 focus-within:border-emerald-500 transition-colors">
        <MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => value && suggestions.length > 0 && setIsOpen(true)}
          className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500"
          autoComplete="off"
        />
        {isLoading && <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && suggestions.length > 0 && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {suggestions.map((suggestion) => (
            <button
              key={suggestion.id}
              onClick={() => handleSelect(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{suggestion.name}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && !isLoading && suggestions.length === 0 && value.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
          No locations found
        </div>
      )}
    </div>
  )
}
