import { useState, useEffect } from "react"
import { MapPin, Calendar, DollarSign, Users, Hotel, Utensils, Activity, Clock, Edit2, Share2, Download, ChevronRight } from "lucide-react"

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
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">Loading your adventure...</p>
        </div>
      </div>
    )
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Trip not found</p>
          <button 
            onClick={() => window.location.href = '/'}
            className="px-6 py-2 bg-emerald-500 text-white rounded-lg hover:bg-emerald-600 transition-colors"
          >
            Go Home
          </button>
        </div>
      </div>
    )
  }

  const currentDay = trip.itinerary[selectedDay]

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Modern Header */}
      <div className="bg-white/80 backdrop-blur-lg shadow-lg sticky top-0 z-50 border-b border-emerald-100">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl flex items-center justify-center">
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Seven Sisters</h1>
                <p className="text-sm text-gray-600">Welcome, {user?.name}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Share2 className="w-5 h-5 text-gray-600" />
              </button>
              <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                <Download className="w-5 h-5 text-gray-600" />
              </button>
              <button 
                onClick={() => {
                  localStorage.clear()
                  window.location.href = '/'
                }}
                className="px-4 py-2 text-gray-600 hover:text-gray-900 font-medium"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="bg-gradient-to-r from-emerald-500 to-teal-500 rounded-3xl shadow-2xl p-8 mb-8 text-white relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-white/10 rounded-full -ml-24 -mb-24"></div>
          
          <div className="relative z-10">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h2 className="text-4xl font-bold mb-2">{trip.destination}</h2>
                <p className="text-emerald-100 flex items-center gap-2 text-lg">
                  <Calendar className="w-5 h-5" />
                  {new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - {new Date(trip.endDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="text-right bg-white/20 backdrop-blur-sm rounded-2xl px-6 py-4">
                <p className="text-emerald-100 text-sm mb-1">Total Budget</p>
                <p className="text-4xl font-bold">₹{trip.budget.total.toLocaleString()}</p>
                <p className="text-emerald-100 text-sm mt-1">{trip.duration} Days Trip</p>
              </div>
            </div>

            {/* Budget Pills */}
            <div className="flex flex-wrap gap-3">
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Hotel className="w-4 h-4" />
                <span className="text-sm font-medium">Hotels: ₹{trip.budget.accommodation.toLocaleString()}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Utensils className="w-4 h-4" />
                <span className="text-sm font-medium">Food: ₹{trip.budget.food.toLocaleString()}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <Activity className="w-4 h-4" />
                <span className="text-sm font-medium">Activities: ₹{trip.budget.activities.toLocaleString()}</span>
              </div>
              <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full flex items-center gap-2">
                <MapPin className="w-4 h-4" />
                <span className="text-sm font-medium">Transport: ₹{trip.budget.transport.toLocaleString()}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Day Selector Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-24">
              <h3 className="text-lg font-bold text-gray-900 mb-4">Your Itinerary</h3>
              <div className="space-y-2">
                {trip.itinerary.map((day, index) => (
                  <button
                    key={index}
                    onClick={() => setSelectedDay(index)}
                    className={`w-full text-left p-4 rounded-xl transition-all ${
                      selectedDay === index
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-500 text-white shadow-lg scale-105'
                        : 'bg-gray-50 hover:bg-gray-100 text-gray-700'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <p className={`text-sm font-medium ${selectedDay === index ? 'text-emerald-100' : 'text-gray-500'}`}>
                          Day {day.day}
                        </p>
                        <p className={`font-semibold ${selectedDay === index ? 'text-white' : 'text-gray-900'}`}>
                          {day.title}
                        </p>
                        <p className={`text-xs mt-1 ${selectedDay === index ? 'text-emerald-100' : 'text-gray-500'}`}>
                          {new Date(day.date).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <ChevronRight className={`w-5 h-5 ${selectedDay === index ? 'text-white' : 'text-gray-400'}`} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Day Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Day Header */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-3xl font-bold text-gray-900">{currentDay.title}</h2>
                  <p className="text-gray-600 mt-1">
                    {new Date(currentDay.date).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                  </p>
                </div>
                <button className="p-3 bg-emerald-50 hover:bg-emerald-100 rounded-xl transition-colors">
                  <Edit2 className="w-5 h-5 text-emerald-600" />
                </button>
              </div>
            </div>

            {/* Activities */}
            <div className="space-y-4">
              {currentDay.activities.map((activity, index) => (
                <div key={index} className="bg-white rounded-2xl shadow-xl p-6 hover:shadow-2xl transition-shadow">
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-400 rounded-xl flex items-center justify-center">
                        <Activity className="w-8 h-8 text-white" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <h3 className="text-xl font-bold text-gray-900">{activity.activity}</h3>
                          <p className="text-gray-600 flex items-center gap-2 mt-1">
                            <Clock className="w-4 h-4" />
                            {activity.time} • {activity.duration}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-emerald-600">₹{activity.cost}</p>
                        </div>
                      </div>
                      <p className="text-gray-700 mb-3">{activity.description}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <MapPin className="w-4 h-4" />
                        <span>{activity.location}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Meals */}
            <div className="bg-white rounded-2xl shadow-xl p-6">
              <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                <Utensils className="w-6 h-6 text-orange-500" />
                Meals for the Day
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {currentDay.meals.map((meal, index) => (
                  <div key={index} className="bg-gradient-to-br from-orange-50 to-red-50 rounded-xl p-4 border-2 border-orange-100">
                    <p className="text-xs text-orange-600 font-semibold uppercase mb-1">{meal.mealType}</p>
                    <p className="font-bold text-gray-900 text-lg">{meal.restaurant}</p>
                    <p className="text-orange-600 font-semibold mt-2">₹{meal.cost}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Accommodation */}
            {currentDay.accommodation && (
              <div className="bg-white rounded-2xl shadow-xl p-6">
                <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                  <Hotel className="w-6 h-6 text-blue-500" />
                  Tonight's Stay
                </h3>
                <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border-2 border-blue-100">
                  <div className="flex items-start justify-between">
                    <div>
                      <h4 className="text-2xl font-bold text-gray-900 mb-2">{currentDay.accommodation.name}</h4>
                      <p className="text-gray-600 capitalize mb-3">{currentDay.accommodation.hotelType} Hotel</p>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span>Check-in: {currentDay.accommodation.checkIn}</span>
                        <span>•</span>
                        <span>Check-out: {currentDay.accommodation.checkOut}</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-3xl font-bold text-blue-600">₹{currentDay.accommodation.cost}</p>
                      <p className="text-sm text-gray-600">per night</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
