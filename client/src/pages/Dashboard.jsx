import { useState, useEffect } from "react"
import { MapPin, Calendar, DollarSign, Hotel, Utensils, Activity, Clock, Edit2, Share2, Download, ChevronRight, Cloud, Droplets, Wind, Info, Image as ImageIcon, BookOpen, Plane } from "lucide-react"
import TripMap from "../components/TripMap"

export default function Dashboard() {
  const [trip, setTrip] = useState(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState(null)
  const [selectedDay, setSelectedDay] = useState(0)

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
        const response = await fetch(`http://localhost:3001/api/trips/${tripId}`)
        const data = await response.json()
        
        if (data.success) {
          setTrip(data.trip)
        }
      } catch (error) {
        console.error('Error loading trip:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTrip()
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground font-medium">Loading your adventure...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-muted-foreground mb-4">Trip not found</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const currentDay = trip.itinerary[selectedDay]
  const enrichedData = trip.enrichedData || {}
  const weather = enrichedData.weather
  const images = enrichedData.images || []
  const destinationInfo = enrichedData.destinationInfo

  return (
    <div className="min-h-screen bg-background">
      {/* Modern Header */}
      <header className="border-b bg-card/50 backdrop-blur-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Plane className="h-6 w-6 text-primary" />
                <h1 className="text-xl font-bold">Seven Sisters</h1>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                <Share2 className="h-5 w-5 text-muted-foreground" />
              </button>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                <Download className="h-5 w-5 text-muted-foreground" />
              </button>
              <button 
                onClick={() => {
                  localStorage.clear()
                  window.location.href = '/'
                }}
                className="px-4 py-2 text-muted-foreground hover:text-foreground font-medium transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section with Image */}
      <div className="relative h-80 overflow-hidden">
        {images.length > 0 ? (
          <img 
            src={images[0].url} 
            alt={trip.destination}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-primary/20 via-secondary/20 to-accent/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        
        <div className="absolute bottom-0 left-0 right-0 p-8">
          <div className="container mx-auto">
            <div className="flex items-end justify-between">
              <div>
                <h2 className="text-4xl font-bold text-foreground mb-2">{trip.destination}</h2>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Calendar className="h-4 w-4" />
                    <span>{new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                  </div>
                  <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                    <Clock className="h-4 w-4" />
                    <span>{trip.duration} Days</span>
                  </div>
                  {weather && weather.current && (
                    <div className="flex items-center gap-2 bg-card/80 backdrop-blur-sm px-3 py-1.5 rounded-full">
                      <Cloud className="h-4 w-4" />
                      <span>{weather.current.temp}°C, {weather.current.description}</span>
                    </div>
                  )}
                </div>
              </div>
              <div className="text-right bg-card/80 backdrop-blur-sm rounded-2xl px-6 py-4">
                <p className="text-muted-foreground text-sm mb-1">Total Budget</p>
                <p className="text-3xl font-bold text-primary">₹{trip.budget.total.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Sidebar - Day Selector */}
          <div className="lg:col-span-1 space-y-6">
            {/* Days Navigation */}
            <div className="bg-card rounded-xl border p-4 sticky top-24">
              <h3 className="font-semibold mb-4">Your Itinerary</h3>
              <div className="space-y-2">
                {trip.itinerary.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDay(index)}
                    className={`w-full text-left p-3 rounded-lg transition-all ${
                      selectedDay === index
                        ? 'bg-primary text-primary-foreground shadow-md'
                        : 'bg-muted/50 hover:bg-muted text-foreground'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className={`text-xs font-medium ${selectedDay === index ? 'text-primary-foreground/80' : 'text-muted-foreground'}`}>
                          Day {day.day}
                        </p>
                        <p className={`font-semibold text-sm ${selectedDay === index ? 'text-primary-foreground' : 'text-foreground'}`}>
                          {day.title}
                        </p>
                        <p className={`text-xs mt-0.5 ${selectedDay === index ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>
                          {new Date(day.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <ChevronRight className={`w-4 h-4 ${selectedDay === index ? 'text-primary-foreground' : 'text-muted-foreground'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Quick Facts */}
            {(weather || destinationInfo) && (
              <div className="bg-card rounded-xl border p-4">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  Quick Facts
                </h3>
                <div className="space-y-3">
                  {weather && weather.current ? (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Cloud className="h-4 w-4" />
                          <span>Temperature</span>
                        </div>
                        <span className="font-medium">{weather.current.temp}°C</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Droplets className="h-4 w-4" />
                          <span>Humidity</span>
                        </div>
                        <span className="font-medium">{weather.current.humidity}%</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Wind className="h-4 w-4" />
                          <span>Wind Speed</span>
                        </div>
                        <span className="font-medium">{weather.current.wind_speed} m/s</span>
                      </div>
                    </>
                  ) : (
                    <p className="text-sm text-muted-foreground">Weather data unavailable</p>
                  )}
                </div>
              </div>
            )}

            {/* Budget Breakdown */}
            <div className="bg-card rounded-xl border p-4">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <DollarSign className="h-5 w-5" />
                Budget Breakdown
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Accommodation</span>
                  <span className="font-medium">₹{trip.budget.accommodation.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Food & Dining</span>
                  <span className="font-medium">₹{trip.budget.food.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Activities</span>
                  <span className="font-medium">₹{trip.budget.activities.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Transportation</span>
                  <span className="font-medium">₹{trip.budget.transport.toLocaleString()}</span>
                </div>
                <div className="border-t pt-3 flex items-center justify-between font-semibold">
                  <span>Total</span>
                  <span className="text-primary">₹{trip.budget.total.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content - Day Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Destination Info */}
            {destinationInfo && (
              <div className="bg-card rounded-xl border p-6">
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <BookOpen className="h-5 w-5" />
                  About {destinationInfo.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {destinationInfo.description}
                </p>
                {destinationInfo.url && (
                  <a 
                    href={destinationInfo.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary text-sm hover:underline mt-2 inline-block"
                  >
                    Read more on Wikipedia →
                  </a>
                )}
              </div>
            )}

            {/* Day Header */}
            <div className="bg-card rounded-xl border p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">{currentDay.title}</h2>
                  <p className="text-muted-foreground mt-1">
                    {new Date(currentDay.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <button className="p-2 bg-muted hover:bg-muted/80 rounded-lg transition-colors">
                  <Edit2 className="h-5 w-5" />
                </button>
              </div>
            </div>

            {/* Activities */}
            <div className="space-y-4">
              {currentDay.activities.map((activity, index) => (
                <div key={index} className="bg-card rounded-xl border p-6 hover:shadow-md transition-shadow">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center">
                        <Activity className="w-6 h-6 text-primary" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="text-sm font-medium text-muted-foreground">{activity.time}</span>
                            <span className="text-sm text-muted-foreground">• {activity.duration}</span>
                          </div>
                          <h3 className="text-lg font-semibold mb-1">{activity.activity}</h3>
                          <p className="text-muted-foreground text-sm mb-2">{activity.description}</p>
                          <div className="flex items-center gap-1 text-sm text-muted-foreground">
                            <MapPin className="h-3 w-3" />
                            <span>{activity.location}</span>
                          </div>
                        </div>
                        <div className="text-right ml-4">
                          <p className="text-xl font-bold text-primary">₹{activity.cost}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Meals */}
            <div className="bg-card rounded-xl border p-6">
              <h3 className="font-semibold mb-4 flex items-center gap-2">
                <Utensils className="h-5 w-5" />
                Meals for the Day
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentDay.meals.map((meal, index) => (
                  <div key={index} className="bg-muted/50 rounded-lg p-4 border">
                    <p className="text-xs text-muted-foreground font-semibold uppercase mb-1">{meal.mealType}</p>
                    <p className="font-semibold text-foreground">{meal.restaurant}</p>
                    <p className="text-primary font-semibold mt-2">₹{meal.cost}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Accommodation */}
            {currentDay.accommodation && (
              <div className="bg-card rounded-xl border p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <Hotel className="h-5 w-5" />
                  Tonight's Stay
                </h3>
                <div className="bg-muted/50 rounded-lg p-6 border">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-xl font-bold mb-2">{currentDay.accommodation.name}</h4>
                      <p className="text-muted-foreground capitalize mb-3">{currentDay.accommodation.hotelType} Hotel</p>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span>Check-in: {currentDay.accommodation.checkIn}</span>
                        <span>•</span>
                        <span>Check-out: {currentDay.accommodation.checkOut}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-primary">₹{currentDay.accommodation.cost}</p>
                      <p className="text-sm text-muted-foreground">per night</p>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Map */}
            <TripMap 
              activities={currentDay.activities}
              destination={trip.destination}
            />

            {/* Photo Gallery */}
            {images.length > 0 && (
              <div className="bg-card rounded-xl border p-6">
                <h3 className="font-semibold mb-4 flex items-center gap-2">
                  <ImageIcon className="h-5 w-5" />
                  Destination Gallery
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {images.slice(0, 6).map((image, index) => (
                    <div key={index} className="relative aspect-video rounded-lg overflow-hidden group cursor-pointer">
                      <img 
                        src={image.thumbnail || image.url} 
                        alt={image.description || trip.destination}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                      />
                      {image.photographer && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-2">
                          <p className="text-white text-xs">Photo by {image.photographer}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
