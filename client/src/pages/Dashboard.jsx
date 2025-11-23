import { useState, useEffect, useRef } from "react"
import {
  MapPin, Calendar, DollarSign, Hotel, Utensils, Activity, Clock,
  Edit2, Share2, Download, ChevronRight, Cloud, Plus, Search,
  MoreHorizontal, Sparkles, Layout, FileText, Compass, ChevronLeft, X
} from "lucide-react"
import { Autocomplete } from "@react-google-maps/api"
import TripMap from "../components/TripMap"

export default function Dashboard() {
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [regenerating, setRegenerating] = useState(false)
  const [user, setUser] = useState(null)
  const [activeSection, setActiveSection] = useState('itinerary')
  const [explorePlaces, setExplorePlaces] = useState({ attractions: [], hotels: [], restaurants: [] })
  const [activeExploreTab, setActiveExploreTab] = useState('attractions')
  const [isAddPlaceModalOpen, setIsAddPlaceModalOpen] = useState(false)
  const [expandedActivity, setExpandedActivity] = useState(null)
  const [selectedPlace, setSelectedPlace] = useState(null)
  const [selectedDayIndex, setSelectedDayIndex] = useState(null)
  const [newPlace, setNewPlace] = useState('')
  const autocompleteRef = useRef(null)
  const scrollRef = useRef(null)

  // Helper to find an image for an activity from the explorePlaces data
  const getActivityImage = (activityName) => {
    const allPlaces = [
      ...(explorePlaces.attractions || []),
      ...(explorePlaces.hotels || []),
      ...(explorePlaces.restaurants || [])
    ]

    // Try exact match first
    const exactMatch = allPlaces.find(p => p.name.toLowerCase() === activityName.toLowerCase())
    if (exactMatch?.photo) return exactMatch.photo

    // Try partial match
    const partialMatch = allPlaces.find(p =>
      p.name.toLowerCase().includes(activityName.toLowerCase()) ||
      activityName.toLowerCase().includes(p.name.toLowerCase())
    )
    return partialMatch?.photo || null
  }

  useEffect(() => {
    const loadTrip = async () => {
      const tripId = localStorage.getItem('currentTripId')
      const userData = JSON.parse(localStorage.getItem('user') || '{}')
      setUser(userData)

      if (!tripId) {
        window.location.href = '/'
        return
      }

      try {
        // Load trip first
        const tripRes = await fetch(`http://localhost:3001/api/trips/${tripId}`)
        const tripData = await tripRes.json()

        if (tripData.success) {
          setTrip(tripData.trip)

          // Then try to load explore places (don't block if fails)
          try {
            const exploreRes = await fetch(`http://localhost:3001/api/trips/${tripId}/explore`)
            const exploreData = await exploreRes.json()
            if (exploreData.success && exploreData.places) {
              setExplorePlaces(exploreData.places)
            }
          } catch (exploreError) {
            console.error('Error loading explore places:', exploreError)
          }
        }
      } catch (error) {
        console.error('Error loading trip:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTrip()
  }, [])

  const handleRegenerate = async () => {
    setRegenerating(true)
    try {
      const response = await fetch(`http://localhost:3001/api/trips/${trip._id}/generate`, {
        method: 'POST'
      })
      const data = await response.json()
      if (data.success) {
        setTrip(data.trip)
      }
    } catch (error) {
      console.error('Error regenerating itinerary:', error)
    } finally {
      setRegenerating(false)
    }
  }

  const handleAddToTrip = (place, dayIndex) => {
    if (!place) {
      // Close handler
      setSelectedPlace(null)
      return
    }

    if (dayIndex === -1) return // Just closing

    const updatedTrip = { ...trip }
    const newActivity = {
      time: "Flexible",
      activity: `Visit ${place.name}`,
      location: place.name,
      duration: "2 hours",
      cost: 0,
      description: place.description || "Added from Explore",
      coordinates: place.geometry ? { lat: place.geometry.lat, lng: place.geometry.lng } : null
    }

    if (updatedTrip.itinerary[dayIndex]) {
      updatedTrip.itinerary[dayIndex].activities.push(newActivity)
      setTrip(updatedTrip)
      setSelectedPlace(null) // Close after adding

      // Scroll to the day
      setTimeout(() => scrollToDay(dayIndex), 100)
    }
  }

  const openAddPlaceModal = (dayIndex) => {
    setSelectedDayIndex(dayIndex)
    setIsAddPlaceModalOpen(true)
    setNewPlace('')
  }

  const handlePlaceSelect = () => {
    if (autocompleteRef.current) {
      const place = autocompleteRef.current.getPlace()
      if (place && place.name) {
        setNewPlace(place.name)
      }
    }
  }

  const handleAddPlaceSubmit = async () => {
    if (!newPlace || selectedDayIndex === null) return

    // In a real app, we would send this to the backend to add to the specific day
    // For now, we'll update the local state to show it visually
    const updatedTrip = { ...trip }
    const newActivity = {
      time: "Flexible",
      activity: `Visit ${newPlace}`,
      location: newPlace,
      duration: "2 hours",
      cost: 0,
      description: "Added manually"
    }

    updatedTrip.itinerary[selectedDayIndex].activities.push(newActivity)
    setTrip(updatedTrip)
    setIsAddPlaceModalOpen(false)

    // TODO: Sync with backend
    // await fetch(...)
  }

  const scrollToDay = (index) => {
    const element = document.getElementById(`day-${index}`)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Loading your adventure...</p>
        </div>
      </div>
    )
  }

  if (!trip) return null

  const enrichedData = trip.enrichedData || {}
  const images = enrichedData.images || []

  return (
    <div className="flex h-screen bg-white overflow-hidden font-sans">
      {/* Left Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col flex-shrink-0 z-20">
        {/* Logo / Home */}
        <div className="p-4 border-b border-gray-100">
          <div className="flex items-center gap-2 text-emerald-600 font-bold text-xl cursor-pointer" onClick={() => window.location.href = '/'}>
            <Compass className="w-6 h-6" />
            <span>TripPlanner</span>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="p-4 space-y-1">
          <button
            onClick={() => setActiveSection('explore')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'explore' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <Layout className="w-4 h-4" />
            Explore
          </button>
          <button
            onClick={() => setActiveSection('notes')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'notes' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <FileText className="w-4 h-4" />
            Notes
          </button>
          <button
            onClick={() => setActiveSection('places')}
            className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeSection === 'places' ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'}`}
          >
            <MapPin className="w-4 h-4" />
            Places to visit
          </button>
        </div>

        {/* Itinerary List */}
        <div className="flex-1 overflow-y-auto px-4 py-2">
          <div className="flex items-center justify-between mb-2 px-2">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Itinerary</h3>
            <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${activeSection === 'itinerary' ? 'rotate-90' : ''}`} />
          </div>
          <div className="space-y-1">
            {trip.itinerary.map((day, index) => (
              <button
                key={index}
                onClick={() => scrollToDay(index)}
                className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-600 hover:bg-gray-50 transition-colors text-left group"
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gray-300 group-hover:bg-emerald-500 transition-colors" />
                <div className="flex-1 truncate">
                  <span className="font-medium text-gray-900 block truncate">Day {day.day}</span>
                  <span className="text-xs text-gray-500 truncate">{day.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* User Profile / Logout */}
        <div className="p-4 border-t border-gray-100 bg-gray-50">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold text-xs">
              {user?.name?.[0] || 'U'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">{user?.name || 'Traveler'}</p>
              <button onClick={() => { localStorage.clear(); window.location.href = '/'; }} className="text-xs text-gray-500 hover:text-red-600">
                Sign out
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-white relative" ref={scrollRef}>
        {/* Hero Header */}
        <div className="relative h-64 w-full group">
          {images.length > 0 ? (
            <img
              src={images[0].url}
              alt={trip.destination}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-r from-emerald-100 to-teal-100" />
          )}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors" />

          <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
            <div className="flex items-end justify-between">
              <div>
                <h1 className="text-4xl font-bold mb-2 drop-shadow-md">Trip to {trip.destination}</h1>
                <div className="flex items-center gap-4 text-sm font-medium drop-shadow-sm">
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    <Calendar className="w-4 h-4" />
                    <span>{new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-white/20 backdrop-blur-md px-3 py-1 rounded-full">
                    <DollarSign className="w-4 h-4" />
                    <span>₹{trip.budget.total.toLocaleString()}</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2">
                <button className="p-2 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full transition-colors">
                  <Share2 className="w-5 h-5" />
                </button>
                <button className="p-2 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full transition-colors">
                  <Edit2 className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="max-w-4xl mx-auto px-8 py-8 space-y-12">

          {/* Explore Section */}
          <section id="explore">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-emerald-500" />
                Explore {trip.destination}
              </h2>
            </div>

            {/* Explore Tabs */}
            <div className="flex gap-4 mb-6 border-b border-gray-100">
              {['attractions', 'hotels', 'restaurants'].map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveExploreTab(tab)}
                  className={`pb-2 px-1 text-sm font-medium capitalize transition-colors relative ${activeExploreTab === tab
                    ? 'text-emerald-600'
                    : 'text-gray-500 hover:text-gray-700'
                    }`}
                >
                  {tab}
                  {activeExploreTab === tab && (
                    <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-500 rounded-t-full" />
                  )}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-3 gap-4">
              {explorePlaces[activeExploreTab]?.length > 0 ? (
                explorePlaces[activeExploreTab].map((place, index) => (
                  <div key={index} className="group cursor-pointer" onClick={() => setSelectedPlace(place)}>
                    <div className="aspect-video rounded-xl overflow-hidden bg-gray-100 mb-2 relative">
                      {place.photo ? (
                        <img src={place.photo} alt={place.name} loading="lazy" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                      ) : (
                        <div className="w-full h-full bg-gray-200 flex items-center justify-center text-gray-400">
                          {activeExploreTab === 'attractions' ? <MapPin className="w-8 h-8" /> :
                            activeExploreTab === 'hotels' ? <Hotel className="w-8 h-8" /> :
                              <Utensils className="w-8 h-8" />}
                        </div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-3">
                        <span className="text-white font-medium text-sm">View Details</span>
                      </div>
                    </div>
                    <h3 className="font-semibold text-gray-900 truncate">{place.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-gray-500 mb-2">
                      <span className="text-yellow-500">★</span>
                      <span>{place.rating}</span>
                      <span>({place.user_ratings_total})</span>
                    </div>
                    <p className="text-xs text-gray-600 line-clamp-2">{place.description}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-3 py-8 text-center text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                  <p>No {activeExploreTab} found or loading...</p>
                </div>
              )}
            </div>
          </section>

          {/* Places to Visit Search */}
          <section className="bg-gray-50 rounded-xl p-6 border border-gray-100">
            <h2 className="text-lg font-bold text-gray-900 mb-4">Places to visit</h2>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search for places to add..."
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-white shadow-sm"
              />
            </div>
          </section>

          {/* Itinerary Section */}
          <section className="space-y-8">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Itinerary</h2>
              <button
                onClick={handleRegenerate}
                disabled={regenerating}
                className={`flex items-center gap-2 px-4 py-2 bg-emerald-50 text-emerald-700 rounded-lg font-medium hover:bg-emerald-100 transition-colors ${regenerating ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                {regenerating ? (
                  <>
                    <div className="w-4 h-4 border-2 border-emerald-700 border-t-transparent rounded-full animate-spin"></div>
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Regenerate with AI
                  </>
                )}
              </button>
            </div>

            <div className="space-y-8">
              {trip.itinerary.map((day, index) => (
                <div key={index} id={`day-${index}`} className="relative pl-8 border-l-2 border-gray-100 pb-8 last:pb-0">
                  {/* Timeline Dot */}
                  <div className="absolute -left-[9px] top-0 w-4 h-4 rounded-full bg-emerald-500 border-4 border-white shadow-sm" />

                  {/* Day Header */}
                  <div className="mb-6">
                    <h3 className="text-xl font-bold text-gray-900">
                      {new Date(day.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
                    </h3>
                    <p className="text-gray-500 text-sm mt-1">{day.title}</p>
                  </div>

                  {/* Activities List */}
                  <div className="space-y-4">
                    {day.activities.length > 0 ? (
                      day.activities.map((activity, actIndex) => {
                        const activityImage = getActivityImage(activity.location || activity.activity)
                        return (
                          <div
                            key={actIndex}
                            onClick={() => setExpandedActivity({ ...activity, image: activityImage })}
                            className="group bg-white border border-gray-200 rounded-xl p-4 hover:shadow-md transition-all cursor-pointer flex gap-4 items-start"
                          >
                            <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden relative">
                              {activityImage ? (
                                <img src={activityImage} alt={activity.activity} className="w-full h-full object-cover" />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-500">
                                  <MapPin className="w-6 h-6" />
                                </div>
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="flex justify-between items-start">
                                <h4 className="font-semibold text-gray-900 truncate">{activity.activity}</h4>
                                <button className="text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreHorizontal className="w-5 h-5" />
                                </button>
                              </div>
                              <p className="text-sm text-gray-500 line-clamp-2 mt-1">{activity.description}</p>
                              <div className="flex items-center gap-3 mt-3 text-xs text-gray-500">
                                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                  <Clock className="w-3 h-3" />
                                  {activity.time}
                                </span>
                                <span className="flex items-center gap-1 bg-gray-50 px-2 py-1 rounded">
                                  <DollarSign className="w-3 h-3" />
                                  ₹{activity.cost}
                                </span>
                              </div>
                            </div>
                          </div>
                        )
                      })
                    ) : (
                      <p className="text-sm text-gray-400 italic">No activities planned yet.</p>
                    )}

                    {/* Add Place Button */}
                    <button
                      onClick={() => openAddPlaceModal(index)}
                      className="w-full py-3 border-2 border-dashed border-gray-200 rounded-xl text-gray-500 font-medium hover:border-emerald-500 hover:text-emerald-600 hover:bg-emerald-50 transition-all flex items-center justify-center gap-2"
                    >
                      <Plus className="w-5 h-5" />
                      Add a place
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Notes Section */}
          <section className="pt-8 border-t border-gray-100">
            <h2 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FileText className="w-5 h-5 text-gray-400" />
              Trip Notes
            </h2>
            <textarea
              className="w-full h-32 p-4 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent resize-none text-gray-600"
              placeholder="Write down your thoughts, reminders, or packing list here..."
            ></textarea>
          </section>
        </div>
      </div>

      {/* Right Map Sidebar */}
      <div className="w-[600px] bg-gray-100 border-l border-gray-200 flex-shrink-0 relative hidden xl:block">
        <TripMap
          activities={trip.itinerary.flatMap(day => day.activities)}
          destination={trip.destination}
          selectedPlace={selectedPlace}
          onAddToTrip={handleAddToTrip}
        />
        {/* Floating Map Controls could go here */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <button className="p-2 bg-white rounded-lg shadow-md hover:bg-gray-50 text-gray-600">
            <Share2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Add Place Modal */}
      {isAddPlaceModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold">Add a Place</h3>
              <button onClick={() => setIsAddPlaceModalOpen(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Search for a place</label>
                <Autocomplete
                  onLoad={ref => autocompleteRef.current = ref}
                  onPlaceChanged={handlePlaceSelect}
                >
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input
                      type="text"
                      value={newPlace}
                      onChange={(e) => setNewPlace(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
                      placeholder="e.g., Taj Mahal, Cafe Coffee Day..."
                    />
                  </div>
                </Autocomplete>
              </div>

              <button
                onClick={handleAddPlaceSubmit}
                disabled={!newPlace}
                className={`w-full py-2 rounded-lg font-medium transition-colors ${newPlace
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                  }`}
              >
                Add to Day {selectedDayIndex + 1}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Expanded Activity Modal */}
      {expandedActivity && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 backdrop-blur-sm bg-black/30">
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in fade-in zoom-in duration-200">
            {/* Modal Header Image */}
            <div className="h-64 relative bg-gray-100 flex-shrink-0">
              {expandedActivity.image ? (
                <img
                  src={expandedActivity.image}
                  alt={expandedActivity.activity}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-emerald-50 text-emerald-500">
                  <MapPin className="w-16 h-16" />
                </div>
              )}
              <button
                onClick={() => setExpandedActivity(null)}
                className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/80 to-transparent">
                <h2 className="text-2xl font-bold text-white">{expandedActivity.activity}</h2>
                <p className="text-white/90 flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4" />
                  {expandedActivity.location}
                </p>
              </div>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto">
              <div className="flex items-center gap-4 mb-6">
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
                  <Clock className="w-4 h-4" />
                  {expandedActivity.time}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
                  <Activity className="w-4 h-4" />
                  {expandedActivity.duration}
                </div>
                <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-sm font-medium">
                  <DollarSign className="w-4 h-4" />
                  ₹{expandedActivity.cost}
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 uppercase tracking-wider mb-2">Description</h3>
                  <p className="text-gray-600 leading-relaxed">
                    {expandedActivity.description}
                  </p>
                </div>

                {/* Additional details could go here if available */}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 border-t border-gray-100 bg-gray-50 flex justify-end gap-3">
              <button
                onClick={() => setExpandedActivity(null)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
