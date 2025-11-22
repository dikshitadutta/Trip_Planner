import { useEffect, useRef, useState } from "react"
import { MapPin } from "lucide-react"

export default function TripMap({ activities, destination, selectedPlace, onAddToTrip }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)
  const markersRef = useRef([])
  const selectedMarkerRef = useRef(null)
  const [isAddToTripOpen, setIsAddToTripOpen] = useState(false)

  // Initialize Map
  useEffect(() => {
    const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    if (!GOOGLE_MAPS_KEY || GOOGLE_MAPS_KEY === 'your_google_maps_key_here') {
      console.log('Google Maps API key not configured')
      return
    }

    if (!window.google) {
      const script = document.createElement('script')
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_KEY}&libraries=places`
      script.async = true
      script.defer = true
      script.onload = initMap
      document.head.appendChild(script)
    } else {
      initMap()
    }

    function initMap() {
      if (!mapRef.current || !window.google) return

      const mapOptions = {
        zoom: 12,
        mapTypeControl: false,
        streetViewControl: false,
        fullscreenControl: false,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      }

      const map = new window.google.maps.Map(mapRef.current, mapOptions)
      mapInstanceRef.current = map

      // Initial centering
      const geocoder = new window.google.maps.Geocoder()
      geocoder.geocode({ address: destination }, (results, status) => {
        if (status === 'OK' && results[0]) {
          map.setCenter(results[0].geometry.location)
        } else {
          map.setCenter({ lat: 20.5937, lng: 78.9629 }) // Fallback to India
          map.setZoom(5)
        }
      })
    }
  }, [destination])

  // Update Activity Markers
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google) return

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null))
    markersRef.current = []

    const bounds = new window.google.maps.LatLngBounds()
    let hasValidLocations = false

    activities.forEach((act, index) => {
      if (act.coordinates && act.coordinates.lat && act.coordinates.lng) {
        const position = { lat: act.coordinates.lat, lng: act.coordinates.lng }
        const marker = new window.google.maps.Marker({
          position: position,
          map: mapInstanceRef.current,
          title: act.location,
          label: {
            text: String(index + 1),
            color: 'white',
            fontWeight: 'bold'
          },
        })
        markersRef.current.push(marker)
        bounds.extend(position)
        hasValidLocations = true
      }
    })

    if (hasValidLocations && !selectedPlace) {
      mapInstanceRef.current.fitBounds(bounds)
    }
  }, [activities, selectedPlace])

  // Handle Selected Place
  useEffect(() => {
    if (!mapInstanceRef.current || !window.google || !selectedPlace) {
      if (selectedMarkerRef.current) {
        selectedMarkerRef.current.setMap(null)
        selectedMarkerRef.current = null
      }
      return
    }

    // Remove previous selected marker
    if (selectedMarkerRef.current) {
      selectedMarkerRef.current.setMap(null)
    }

    if (selectedPlace.geometry) {
      const position = selectedPlace.geometry

      // Create new selected marker
      selectedMarkerRef.current = new window.google.maps.Marker({
        position: position,
        map: mapInstanceRef.current,
        title: selectedPlace.name,
        animation: window.google.maps.Animation.DROP,
        icon: {
          url: "http://maps.google.com/mapfiles/ms/icons/purple-dot.png"
        }
      })

      mapInstanceRef.current.panTo(position)
      mapInstanceRef.current.setZoom(15)
    }
  }, [selectedPlace])

  return (
    <div className="w-full h-full relative group">
      <div ref={mapRef} className="w-full h-full bg-gray-100">
        <div className="w-full h-full flex items-center justify-center text-gray-400">
          <div className="text-center">
            <MapPin className="h-8 w-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">Loading map...</p>
          </div>
        </div>
      </div>

      {/* Selected Place Overlay Card */}
      {selectedPlace && (
        <div className="absolute bottom-6 right-6 w-96 bg-white rounded-xl shadow-2xl animate-in slide-in-from-bottom-4 duration-300 z-10 overflow-hidden">
          {/* Close Button */}
          <button
            onClick={() => onAddToTrip(null, -1)}
            className="absolute top-3 right-3 p-1.5 text-gray-400 hover:text-gray-600 bg-white/90 backdrop-blur-sm rounded-full shadow-sm z-20 hover:bg-gray-100 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
          </button>

          {/* Hero Image */}
          <div className="relative h-40 bg-gray-100">
            {selectedPlace.photo ? (
              <img src={selectedPlace.photo} alt={selectedPlace.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-gray-400">
                <MapPin className="w-12 h-12" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* Title Overlay on Image */}
            <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
              <h2 className="font-bold text-xl mb-1 drop-shadow-md">{selectedPlace.name}</h2>
              <div className="flex items-center gap-2 text-sm">
                <div className="flex items-center gap-1 bg-white/20 backdrop-blur-sm px-2 py-0.5 rounded-full">
                  <span className="text-yellow-400">★</span>
                  <span className="font-semibold">{selectedPlace.rating}</span>
                  <span className="text-white/80 text-xs">({selectedPlace.user_ratings_total})</span>
                </div>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-4">
            {/* Location */}
            <div className="mb-3 pb-3 border-b border-gray-100">
              <div className="flex items-start gap-2">
                <MapPin className="w-4 h-4 text-emerald-600 mt-0.5 flex-shrink-0" />
                <p className="text-sm text-gray-600 line-clamp-2">{selectedPlace.address}</p>
              </div>
            </div>

            {/* Tabs */}
            <div className="mb-3">
              <div className="flex gap-4 border-b border-gray-200">
                <button
                  onClick={() => setIsAddToTripOpen(false)}
                  className={`pb-2 px-1 text-sm font-medium transition-colors relative ${!isAddToTripOpen ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  About
                  {!isAddToTripOpen && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-t-full" />
                  )}
                </button>
                <button
                  onClick={() => setIsAddToTripOpen(true)}
                  className={`pb-2 px-1 text-sm font-medium transition-colors relative ${isAddToTripOpen ? 'text-emerald-600' : 'text-gray-500 hover:text-gray-700'}`}
                >
                  Photos
                  {isAddToTripOpen && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-t-full" />
                  )}
                </button>
              </div>
            </div>

            {/* Tab Content */}
            <div className="mb-4" style={{ minHeight: '120px' }}>
              {!isAddToTripOpen ? (
                // About Tab
                <div className="space-y-3">
                  {selectedPlace.types && (
                    <div className="flex flex-wrap gap-1.5">
                      {selectedPlace.types.slice(0, 3).map((type, idx) => (
                        <span key={idx} className="px-2 py-0.5 bg-emerald-50 text-emerald-700 text-xs rounded-full capitalize">
                          {type.replace(/_/g, ' ')}
                        </span>
                      ))}
                    </div>
                  )}
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedPlace.description || "A popular destination worth visiting. This location offers a unique experience and is highly recommended by travelers. Click 'Add to trip' to include this in your itinerary."}
                  </p>
                </div>
              ) : (
                // Photos Tab
                <div className="grid grid-cols-2 gap-2">
                  {selectedPlace.photo ? (
                    <>
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100">
                        <img src={selectedPlace.photo} alt={`${selectedPlace.name} 1`} className="w-full h-full object-cover hover:scale-105 transition-transform cursor-pointer" />
                      </div>
                      <div className="aspect-square rounded-lg overflow-hidden bg-gray-100 flex items-center justify-center text-gray-400">
                        <div className="text-center">
                          <MapPin className="w-6 h-6 mx-auto mb-1" />
                          <p className="text-xs">More photos</p>
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="col-span-2 aspect-video rounded-lg bg-gray-100 flex items-center justify-center text-gray-400">
                      <div className="text-center">
                        <MapPin className="w-10 h-10 mx-auto mb-2" />
                        <p className="text-sm">No photos available</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Add to Trip Button */}
            <button
              onClick={() => {
                // Toggle day selector - we'll use a simple approach
                const dayIndex = prompt('Enter day number (1-10):');
                if (dayIndex) {
                  const day = parseInt(dayIndex) - 1;
                  if (day >= 0 && day < 10) {
                    onAddToTrip(selectedPlace, day);
                  }
                }
              }}
              className="w-full bg-emerald-600 text-white py-2.5 rounded-lg font-medium text-sm hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <MapPin className="w-4 h-4" />
              Add to trip
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
