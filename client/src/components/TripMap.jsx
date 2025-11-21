import { useEffect, useRef } from "react"
import { MapPin } from "lucide-react"

export default function TripMap({ activities, destination }) {
  const mapRef = useRef(null)
  const mapInstanceRef = useRef(null)

  useEffect(() => {
    const GOOGLE_MAPS_KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY

    if (!GOOGLE_MAPS_KEY || GOOGLE_MAPS_KEY === 'your_google_maps_key_here') {
      console.log('Google Maps API key not configured')
      return
    }

    // Load Google Maps script
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

      // Get all valid coordinates
      const locations = activities
        .filter(act => act.coordinates && act.coordinates.lat && act.coordinates.lng)
        .map(act => ({
          position: { lat: act.coordinates.lat, lng: act.coordinates.lng },
          title: act.location,
          activity: act.activity
        }))

      if (locations.length === 0) {
        // Default to India if no coordinates
        locations.push({
          position: { lat: 25.5788, lng: 91.8933 },
          title: destination,
          activity: 'Destination'
        })
      }

      // Create map centered on first location
      const map = new window.google.maps.Map(mapRef.current, {
        zoom: 12,
        center: locations[0].position,
        styles: [
          {
            featureType: "poi",
            elementType: "labels",
            stylers: [{ visibility: "off" }]
          }
        ]
      })

      mapInstanceRef.current = map

      // Add markers for each location
      const bounds = new window.google.maps.LatLngBounds()
      
      locations.forEach((location, index) => {
        const marker = new window.google.maps.Marker({
          position: location.position,
          map: map,
          title: location.title,
          label: {
            text: String(index + 1),
            color: 'white',
            fontWeight: 'bold'
          },
          animation: window.google.maps.Animation.DROP
        })

        // Info window
        const infoWindow = new window.google.maps.InfoWindow({
          content: `
            <div style="padding: 8px;">
              <h3 style="font-weight: bold; margin-bottom: 4px;">${location.title}</h3>
              <p style="color: #666; font-size: 14px;">${location.activity}</p>
            </div>
          `
        })

        marker.addListener('click', () => {
          infoWindow.open(map, marker)
        })

        bounds.extend(location.position)
      })

      // Fit map to show all markers
      if (locations.length > 1) {
        map.fitBounds(bounds)
      }
    }
  }, [activities, destination])

  return (
    <div className="bg-card rounded-xl border overflow-hidden">
      <div className="p-4 border-b">
        <h3 className="font-semibold flex items-center gap-2">
          <MapPin className="h-5 w-5" />
          Map View
        </h3>
      </div>
      <div 
        ref={mapRef} 
        className="w-full h-[400px] bg-muted"
      >
        {/* Fallback if Google Maps not loaded */}
        <div className="w-full h-full flex items-center justify-center text-muted-foreground">
          <div className="text-center">
            <MapPin className="h-12 w-12 mx-auto mb-2 opacity-50" />
            <p className="text-sm">Loading map...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
