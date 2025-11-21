"use client"
import { Calendar, Users, UserCircle2, Hotel, ChevronLeft } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import LocationAutocomplete from "./LocationAutocomplete"
import GoogleAuth from "./GoogleAuth"
import { useLoadScript } from "@react-google-maps/api"

const libraries = ["places"]

export default function TravelForm() {
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    departure: "Guwahati",
    destination: "",
    startDate: "",
    endDate: "",
    activityPreference: "Adventure & Trekking",
    groupType: "",
    hotelPreference: "",
    hotelBudgetMin: 1000,
    hotelBudgetMax: 5000,
    name: "",
    phone: "",
    otp: ""
  })
  const [authError, setAuthError] = useState("")
  const [isCreatingTrip, setIsCreatingTrip] = useState(false)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  const API_URL = "http://localhost:3001"

  const handleGoogleAuthSuccess = useCallback(async (user, savedFormData) => {
    setIsCreatingTrip(true)
    setAuthError("")

    try {
      console.log('Creating trip with user:', user);
      console.log('Form data:', savedFormData);

      // Create trip with generated itinerary
      const tripResponse = await fetch(`${API_URL}/api/trips/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: user._id || user.id,
          ...savedFormData
        })
      })

      const tripData = await tripResponse.json()

      if (tripData.success) {
        console.log("Trip created:", tripData.trip)
        // Store trip ID in localStorage
        localStorage.setItem('currentTripId', tripData.trip.id)
        localStorage.setItem('user', JSON.stringify(user))

        // Navigate to dashboard
        alert(`🎉 Your ${tripData.trip.duration}-day itinerary is ready!\n\nBudget: ₹${tripData.trip.budget.total.toLocaleString()}\n\nRedirecting to dashboard...`)
        window.location.href = '/dashboard'
      } else {
        console.error('Trip creation failed:', tripData);
        setAuthError(tripData.message || "Failed to generate itinerary")
      }
    } catch (error) {
      setAuthError("Network error. Please try again.")
      console.error("Trip creation error:", error)
    } finally {
      setIsCreatingTrip(false)
    }
  }, [API_URL]);

  // Save form data before OAuth and restore after
  useEffect(() => {
    // Check if returning from OAuth
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');

    if (userParam) {
      try {
        const user = JSON.parse(decodeURIComponent(userParam));
        // Restore form data from sessionStorage
        const savedFormData = sessionStorage.getItem('tripFormData');
        const savedStep = sessionStorage.getItem('tripFormStep');

        if (savedFormData) {
          const parsedFormData = JSON.parse(savedFormData);
          setFormData(parsedFormData);

          // Trigger trip creation with saved form data
          handleGoogleAuthSuccess(user, parsedFormData);
        }
        if (savedStep) {
          setStep(parseInt(savedStep));
        }

        // Clean up
        window.history.replaceState({}, document.title, window.location.pathname);
        sessionStorage.removeItem('tripFormData');
        sessionStorage.removeItem('tripFormStep');
      } catch (error) {
        console.error('Error handling OAuth return:', error);
        setAuthError('Authentication failed. Please try again.');
      }
    }
  }, [handleGoogleAuthSuccess]);

  // Save form data when reaching step 4
  useEffect(() => {
    if (step === 4) {
      sessionStorage.setItem('tripFormData', JSON.stringify(formData));
      sessionStorage.setItem('tripFormStep', step.toString());
    }
  }, [step, formData]);

  const handleNext = (e) => {
    e.preventDefault()

    // Validate step 1
    if (step === 1) {
      if (!formData.destination || !formData.startDate || !formData.endDate) {
        setAuthError("Please fill in all required fields")
        return
      }
      setAuthError("")
    }

    // Validate step 2
    if (step === 2 && !formData.groupType) {
      setAuthError("Please select a group type")
      return
    }

    // Validate step 3
    if (step === 3 && !formData.hotelPreference) {
      setAuthError("Please select a hotel preference")
      return
    }

    if (step < 4) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4">
        {step > 1 && (
          <button
            type="button"
            onClick={handleBack}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <ChevronLeft className="w-6 h-6 text-gray-600" />
          </button>
        )}
        <div className="flex-1">
          <h2 className="text-2xl font-bold text-gray-900">
            {step === 1 && "Plan Your Adventure"}
            {step === 2 && "Group Type"}
            {step === 3 && "Hotel Preferences"}
            {step === 4 && "Login to Continue"}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {step === 1 && "Create your perfect North East journey"}
            {step === 2 && "Who are you traveling with?"}
            {step === 3 && "Choose your accommodation preferences"}
            {step === 4 && "Secure your trip details"}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2">
        {[1, 2, 3, 4].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? "bg-emerald-500" : "bg-gray-200"
              }`}
          />
        ))}
      </div>

      {/* Error Message for all steps */}
      {authError && step < 4 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {authError}
        </div>
      )}

      <form onSubmit={handleNext} className="space-y-5">
        {/* Step 1: Trip Details */}
        {step === 1 && (
          <>
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                What do you want to explore?
              </label>
              <div className="space-y-3">
                <LocationAutocomplete
                  value={formData.departure}
                  onChange={(value) => setFormData({ ...formData, departure: value })}
                  placeholder="Departing from..."
                  region="northeast"
                />
                <LocationAutocomplete
                  value={formData.destination}
                  onChange={(value) => setFormData({ ...formData, destination: value })}
                  placeholder="Search destination..."
                  region="northeast"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                When are you planning to travel?
              </label>
              <div className="grid grid-cols-2 gap-3">
                <div className="flex items-center gap-2 border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-emerald-500 transition-colors">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <input
                    type="date"
                    value={formData.startDate}
                    onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="flex-1 bg-transparent outline-none text-gray-900 text-sm"
                    required
                  />
                </div>
                <div className="flex items-center gap-2 border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-emerald-500 transition-colors">
                  <Calendar className="w-5 h-5 text-gray-600" />
                  <input
                    type="date"
                    value={formData.endDate}
                    onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="flex-1 bg-transparent outline-none text-gray-900 text-sm"
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Activity Preferences
              </label>
              <select
                value={formData.activityPreference}
                onChange={(e) => setFormData({ ...formData, activityPreference: e.target.value })}
                className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 bg-white text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors"
              >
                <option>Adventure & Trekking</option>
                <option>Cultural & Heritage</option>
                <option>Nature & Wildlife</option>
                <option>Beach & Relaxation</option>
                <option>Mixed Experience</option>
              </select>
            </div>
          </>
        )}

        {/* Step 2: Group Type */}
        {step === 2 && (
          <div className="space-y-4">
            <label className="block text-sm font-semibold text-gray-800 mb-4">
              Select your group type
            </label>
            <div className="grid grid-cols-2 gap-4">
              {[
                { value: "solo", label: "Solo", icon: UserCircle2, desc: "Traveling alone" },
                { value: "couple", label: "Couple", icon: Users, desc: "Just the two of us" },
                { value: "friends", label: "Friends", icon: Users, desc: "Group of friends" },
                { value: "family", label: "Family", icon: Users, desc: "Family vacation" }
              ].map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => setFormData({ ...formData, groupType: type.value })}
                  className={`p-6 border-2 rounded-xl transition-all ${formData.groupType === type.value
                      ? "border-emerald-500 bg-emerald-50"
                      : "border-gray-200 hover:border-emerald-300"
                    }`}
                >
                  <type.icon className={`w-12 h-12 mx-auto mb-3 ${formData.groupType === type.value ? "text-emerald-500" : "text-gray-400"
                    }`} />
                  <h3 className="font-semibold text-gray-900 mb-1">{type.label}</h3>
                  <p className="text-sm text-gray-600">{type.desc}</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Hotel Preferences */}
        {step === 3 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-4">
                Hotel Preference
              </label>
              <div className="space-y-3">
                {[
                  { value: "budget", label: "Budget", desc: "Basic amenities, great value" },
                  { value: "standard", label: "Standard", desc: "Comfortable stay with good facilities" },
                  { value: "luxury", label: "Luxury", desc: "Premium experience with top amenities" }
                ].map((pref) => (
                  <button
                    key={pref.value}
                    type="button"
                    onClick={() => setFormData({ ...formData, hotelPreference: pref.value })}
                    className={`w-full p-4 border-2 rounded-lg text-left transition-all ${formData.hotelPreference === pref.value
                        ? "border-emerald-500 bg-emerald-50"
                        : "border-gray-200 hover:border-emerald-300"
                      }`}
                  >
                    <div className="flex items-center gap-3">
                      <Hotel className={`w-6 h-6 ${formData.hotelPreference === pref.value ? "text-emerald-500" : "text-gray-400"
                        }`} />
                      <div>
                        <h3 className="font-semibold text-gray-900">{pref.label}</h3>
                        <p className="text-sm text-gray-600">{pref.desc}</p>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Hotel Budget Range per Night
              </label>
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-lg font-semibold text-emerald-600">
                    ₹{formData.hotelBudgetMin.toLocaleString()}
                  </span>
                  <span className="text-gray-500">to</span>
                  <span className="text-lg font-semibold text-emerald-600">
                    ₹{formData.hotelBudgetMax.toLocaleString()}
                  </span>
                </div>

                <div className="relative pt-2 pb-6">
                  <div className="relative h-2 bg-gray-200 rounded-lg">
                    {/* Active range highlight */}
                    <div
                      className="absolute h-2 bg-emerald-500 rounded-lg"
                      style={{
                        left: `${((formData.hotelBudgetMin - 1000) / 14000) * 100}%`,
                        right: `${100 - ((formData.hotelBudgetMax - 1000) / 14000) * 100}%`
                      }}
                    />
                  </div>

                  {/* Min slider */}
                  <input
                    type="range"
                    min="1000"
                    max="15000"
                    step="500"
                    value={formData.hotelBudgetMin}
                    onChange={(e) => {
                      const val = parseInt(e.target.value)
                      if (val < formData.hotelBudgetMax - 500) {
                        setFormData({ ...formData, hotelBudgetMin: val })
                      }
                    }}
                    className="absolute w-full h-2 top-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                  />

                  {/* Max slider */}
                  <input
                    type="range"
                    min="1000"
                    max="15000"
                    step="500"
                    value={formData.hotelBudgetMax}
                    onChange={(e) => {
                      const val = parseInt(e.target.value)
                      if (val > formData.hotelBudgetMin + 500) {
                        setFormData({ ...formData, hotelBudgetMax: val })
                      }
                    }}
                    className="absolute w-full h-2 top-2 appearance-none bg-transparent pointer-events-none [&::-webkit-slider-thumb]:pointer-events-auto [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-emerald-500 [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:shadow-md [&::-moz-range-thumb]:pointer-events-auto [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:w-5 [&::-moz-range-thumb]:h-5 [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:bg-emerald-500 [&::-moz-range-thumb]:cursor-pointer [&::-moz-range-thumb]:border-2 [&::-moz-range-thumb]:border-white [&::-moz-range-thumb]:shadow-md"
                  />
                </div>

                <div className="flex justify-between text-xs text-gray-500">
                  <span>₹1,000</span>
                  <span>₹15,000</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Step 4: Login */}
        {step === 4 && (
          <div className="space-y-5">
            {/* Error Message */}
            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {authError}
              </div>
            )}

            {isCreatingTrip ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mx-auto mb-4"></div>
                <p className="text-gray-600">Creating your personalized itinerary...</p>
              </div>
            ) : (
              <GoogleAuth />
            )}
          </div>
        )}

        {/* Continue Button */}
        {step < 4 && (
          <button
            type="submit"
            onClick={handleNext}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/50 text-lg"
          >
            Continue
          </button>
        )}
      </form>

      <p className="text-center text-xs text-gray-600">Get your personalized itinerary in minutes</p>
    </div>
  )
}
