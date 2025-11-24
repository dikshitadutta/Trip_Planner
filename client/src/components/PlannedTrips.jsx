import { useState, useEffect } from "react"
import { Calendar, MapPin, ArrowRight, Clock } from "lucide-react"

export default function PlannedTrips() {
    const [trips, setTrips] = useState([])
    const [loading, setLoading] = useState(true)
    const [user, setUser] = useState(null)

    useEffect(() => {
        const storedUser = localStorage.getItem('user')
        if (storedUser) {
            try {
                const userData = JSON.parse(storedUser)
                setUser(userData)
                fetchTrips(userData.id || userData._id)
            } catch (error) {
                console.error('Error parsing user:', error)
            }
        } else {
            setLoading(false)
        }
    }, [])

    const fetchTrips = async (userId) => {
        try {
            const response = await fetch(`http://localhost:3000/api/trips/user/${userId}`)
            const data = await response.json()
            if (data.success) {
                setTrips(data.trips)
            }
        } catch (error) {
            console.error('Error fetching trips:', error)
        } finally {
            setLoading(false)
        }
    }

    const handleViewTrip = (tripId) => {
        localStorage.setItem('currentTripId', tripId)
        window.location.href = '/dashboard'
    }

    if (!user || trips.length === 0) return null

    return (
        <section className="py-24 bg-gradient-to-b from-white to-gray-50 relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-gray-200 to-transparent" />
            <div className="absolute -top-40 -right-40 w-96 h-96 bg-emerald-500/5 rounded-full blur-3xl" />
            <div className="absolute top-20 -left-20 w-72 h-72 bg-blue-500/5 rounded-full blur-3xl" />

            <div className="container mx-auto px-4 relative z-10">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
                    <div className="max-w-2xl">
                        <span className="text-emerald-600 font-semibold tracking-wider uppercase text-sm mb-2 block">Welcome Back</span>
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
                            Your Upcoming <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Adventures</span>
                        </h2>
                        <p className="text-gray-600 text-lg leading-relaxed">
                            Adventure awaits. Here are the trips you've planned to explore the world.
                        </p>
                    </div>
                    <button
                        onClick={() => window.location.href = '/dashboard'}
                        className="group flex items-center gap-3 px-6 py-3 bg-white border border-gray-200 rounded-full hover:border-emerald-500 hover:shadow-lg hover:shadow-emerald-500/10 transition-all duration-300"
                    >
                        <span className="font-semibold text-gray-700 group-hover:text-emerald-600 transition-colors">View All Trips</span>
                        <div className="w-8 h-8 rounded-full bg-gray-100 group-hover:bg-emerald-500 flex items-center justify-center transition-colors">
                            <ArrowRight className="w-4 h-4 text-gray-600 group-hover:text-white transition-colors" />
                        </div>
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
                    {trips.map((trip) => (
                        <div
                            key={trip._id}
                            onClick={() => handleViewTrip(trip._id)}
                            className="group relative bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-emerald-500/20 transition-all duration-500 cursor-pointer border border-gray-100 hover:border-emerald-500/30 hover:-translate-y-2"
                        >
                            {/* Image Section */}
                            <div className="relative h-64 overflow-hidden">
                                {trip.enrichedData?.images?.[0]?.url ? (
                                    <img
                                        src={trip.enrichedData.images[0].url}
                                        alt={trip.destination}
                                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    />
                                ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center">
                                        <MapPin className="w-16 h-16 text-white/50" />
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                                {/* Floating Badge */}
                                <div className="absolute top-4 right-4 bg-white/20 backdrop-blur-md border border-white/30 px-3 py-1 rounded-full">
                                    <span className="text-xs font-medium text-white">{trip.duration} Days</span>
                                </div>

                                <div className="absolute bottom-0 left-0 right-0 p-6 text-white transform translate-y-2 group-hover:translate-y-0 transition-transform duration-500">
                                    <div className="flex items-center gap-2 text-emerald-300 text-sm font-medium mb-2 opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                                        <MapPin className="w-4 h-4" />
                                        <span>North East India</span>
                                    </div>
                                    <h3 className="text-2xl font-bold mb-2 leading-tight">{trip.destination}</h3>
                                    <div className="flex items-center gap-4 text-sm text-white/80">
                                        <div className="flex items-center gap-1.5">
                                            <Calendar className="w-4 h-4" />
                                            <span>{new Date(trip.startDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Content Section */}
                            <div className="p-6">
                                <div className="flex items-center justify-between">
                                    <div className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center text-gray-400 group-hover:border-emerald-500 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                                        <ArrowRight className="w-5 h-5" />
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
