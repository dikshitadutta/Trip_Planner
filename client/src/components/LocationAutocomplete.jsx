import { MapPin } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import usePlacesAutocomplete from "use-places-autocomplete"

export default function LocationAutocomplete({ value, onChange, placeholder = "Search location..." }) {
  const [isOpen, setIsOpen] = useState(false)
  const suggestionsRef = useRef(null)
  const inputRef = useRef(null)

  const {
    ready,
    value: inputValue,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      /* Define search scope here if needed */
    },
    debounce: 300,
    defaultValue: value,
  })

  // Sync prop value with hook value
  useEffect(() => {
    if (value !== inputValue) {
      setValue(value, false)
    }
  }, [value, setValue, inputValue])

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

  const handleInput = (e) => {
    setValue(e.target.value)
    onChange(e.target.value)
    if (e.target.value) setIsOpen(true)
  }

  const handleSelect = ({ description }) => {
    setValue(description, false)
    clearSuggestions()
    onChange(description)
    setIsOpen(false)
  }

  return (
    <div className="relative">
      <div className="flex items-center gap-3 border-2 border-emerald-200 rounded-lg px-4 py-3 focus-within:border-emerald-500 transition-colors">
        <MapPin className="w-5 h-5 text-emerald-500 flex-shrink-0" />
        <input
          ref={inputRef}
          type="text"
          placeholder={placeholder}
          value={inputValue}
          onChange={handleInput}
          onFocus={() => inputValue && data.length > 0 && setIsOpen(true)}
          disabled={!ready}
          className="flex-1 bg-transparent outline-none text-gray-900 placeholder-gray-500 disabled:opacity-50"
          autoComplete="off"
        />
        {!ready && <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />}
      </div>

      {/* Suggestions Dropdown */}
      {isOpen && status === "OK" && (
        <div
          ref={suggestionsRef}
          className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {data.map((suggestion) => (
            <button
              key={suggestion.place_id}
              onClick={() => handleSelect(suggestion)}
              className="w-full text-left px-4 py-3 hover:bg-emerald-50 transition-colors border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{suggestion.description}</p>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {isOpen && status === "ZERO_RESULTS" && inputValue.length >= 2 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 p-4 text-center text-gray-500">
          No locations found
        </div>
      )}
    </div>
  )
}
