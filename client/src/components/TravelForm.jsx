"use client"
import { Calendar, Users, UserCircle2, Hotel, ChevronLeft, Mail, X, Plus } from "lucide-react"
import { useState, useEffect, useCallback } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import LocationAutocomplete from "./LocationAutocomplete"
import GoogleAuth from "./GoogleAuth"
import { useLoadScript } from "@react-google-maps/api"

const libraries = ["places"]

export default function TravelForm() {
  const [step, setStep] = useState(1)
  const [user, setUser] = useState(null)
  const [formData, setFormData] = useState({
    destination: "",
    startDate: null,
    endDate: null,
    activityPreference: "Mixed Experience", // Default value since UI is removed
    hotelPreference: "standard", // Default value since UI is removed
    hotelBudgetMin: 1000,
    hotelBudgetMax: 5000,
    name: "",
    phone: "",
    otp: "",
    invitedEmails: [],
    groupType: "friends" // Defaulting to friends since selection is removed
  })
  const [emailInput, setEmailInput] = useState("")
  const [authError, setAuthError] = useState("")
  const [isCreatingTrip, setIsCreatingTrip] = useState(false)

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
    libraries,
  })

  const API_URL = "http://localhost:3001"

  const createTrip = useCallback(async (userData, tripFormData) => {
    setIsCreatingTrip(true)
    setAuthError("")

    try {
      console.log('Creating trip with user:', userData);
      console.log('Form data:', tripFormData);

      // Create trip with generated itinerary
      const tripResponse = await fetch(`${API_URL}/api/trips/create`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userData._id || userData.id,
          ...tripFormData,
          // Ensure dates are formatted correctly if needed by backend, 
          // though Date objects usually stringify to ISO
        })
      })

      const tripData = await tripResponse.json()

      if (tripData.success) {
        console.log("Trip created:", tripData.trip)
        // Store trip ID in localStorage
        localStorage.setItem('currentTripId', tripData.trip.id)
        localStorage.setItem('user', JSON.stringify(userData))

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

  const handleGoogleAuthSuccess = useCallback(async (userData, savedFormData) => {
    await createTrip(userData, savedFormData);
  }, [createTrip]);

  // Check for logged-in user on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
  }, []);

  // Save form data before OAuth and restore after
  useEffect(() => {
    // Check if returning from OAuth
    const params = new URLSearchParams(window.location.search);
    const userParam = params.get('user');

    if (userParam) {
      try {
        const userData = JSON.parse(decodeURIComponent(userParam));
        // Restore form data from sessionStorage
        const savedFormData = sessionStorage.getItem('tripFormData');
        const savedStep = sessionStorage.getItem('tripFormStep');

        if (savedFormData) {
          const parsedFormData = JSON.parse(savedFormData);
          // Restore Date objects from strings
          if (parsedFormData.startDate) parsedFormData.startDate = new Date(parsedFormData.startDate);
          if (parsedFormData.endDate) parsedFormData.endDate = new Date(parsedFormData.endDate);

          setFormData(parsedFormData);

          // Trigger trip creation with saved form data
          handleGoogleAuthSuccess(userData, parsedFormData);
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

  // Save form data when reaching step 2 (Login)
  useEffect(() => {
    if (step === 2) {
      sessionStorage.setItem('tripFormData', JSON.stringify(formData));
      sessionStorage.setItem('tripFormStep', step.toString());
    }
  }, [step, formData]);

  const handleNext = async (e) => {
    e.preventDefault()

    // Validate step 1
    if (step === 1) {
      if (!formData.destination || !formData.startDate || !formData.endDate) {
        setAuthError("Please fill in all required fields")
        return
      }
      setAuthError("")
    }

    // If user is logged in and we're at step 1, create trip directly
    if (step === 1 && user) {
      await createTrip(user, formData);
      return;
    }

    if (step < 2) {
      setStep(step + 1)
    }
  }

  const handleBack = () => {
    if (step > 1) {
      setStep(step - 1)
    }
  }

  const handleAddEmail = () => {
    if (emailInput && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailInput)) {
      if (!formData.invitedEmails.includes(emailInput)) {
        setFormData({
          ...formData,
          invitedEmails: [...formData.invitedEmails, emailInput]
        })
        setEmailInput("")
        setAuthError("")
      } else {
        setAuthError("Email already added")
      }
    } else {
      setAuthError("Please enter a valid email")
    }
  }

  const removeEmail = (emailToRemove) => {
    setFormData({
      ...formData,
      invitedEmails: formData.invitedEmails.filter(email => email !== emailToRemove)
    })
  }

  const handleDateChange = (dates) => {
    const [start, end] = dates;
    setFormData({ ...formData, startDate: start, endDate: end });
  };

  if (!isLoaded) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
      </div>
    )
  }

  return (
    <div className="bg-white/95 backdrop-blur-md border border-white/20 rounded-2xl shadow-2xl p-8 space-y-6">
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
            {step === 2 && "Login to Continue"}
          </h2>
          <p className="text-gray-600 text-sm mt-1">
            {step === 1 && "Where do you want to go?"}
            {step === 2 && "Secure your trip details"}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="flex gap-2">
        {[1, 2].map((s) => (
          <div
            key={s}
            className={`h-2 flex-1 rounded-full transition-colors ${s <= step ? "bg-emerald-500" : "bg-gray-200"
              }`}
          />
        ))}
      </div>

      {/* Error Message for all steps */}
      {authError && step < 2 && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {authError}
        </div>
      )}

      <form onSubmit={handleNext} className="space-y-5">
        {/* Step 1: Trip Details & Invites */}
        {step === 1 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Where to?
              </label>
              <LocationAutocomplete
                value={formData.destination}
                onChange={(value) => setFormData({ ...formData, destination: value })}
                placeholder="e.g. Shillong, Tawang, Kaziranga"
                region="northeast"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Dates (Optional)
              </label>
              <div className="relative w-full">
                <style>{`
                  .react-datepicker-wrapper { width: 100%; }
                  .react-datepicker__input-container input { width: 100%; }
                  .custom-datepicker {
                    font-family: inherit;
                    border: 2px solid #e5e7eb;
                    border-radius: 0.5rem;
                    padding: 0.75rem 1rem 0.75rem 2.5rem;
                    font-size: 0.875rem;
                    color: #111827;
                    transition: all 0.2s;
                  }
                  .custom-datepicker:focus {
                    outline: none;
                    border-color: #10b981;
                  }
                  .react-datepicker {
                    font-family: inherit;
                    border: none;
                    border-radius: 1rem;
                    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                  }
                  .react-datepicker__header {
                    background-color: #fff;
                    border-bottom: 1px solid #f3f4f6;
                    padding-top: 1rem;
                  }
                  .react-datepicker__current-month {
                    font-weight: 600;
                    color: #111827;
                    margin-bottom: 0.5rem;
                  }
                  .react-datepicker__day-name {
                    color: #6b7280;
                    font-weight: 500;
                  }
                  .react-datepicker__day {
                    margin: 0.2rem;
                    border-radius: 0.5rem;
                    transition: all 0.2s;
                  }
                  .react-datepicker__day:hover {
                    background-color: #ecfdf5;
                    color: #059669;
                  }
                  .react-datepicker__day--selected, 
                  .react-datepicker__day--in-range,
                  .react-datepicker__day--in-selecting-range {
                    background-color: #10b981 !important;
                    color: white !important;
                  }
                  .react-datepicker__day--keyboard-selected {
                    background-color: #d1fae5;
                    color: #065f46;
                  }
                  .react-datepicker__navigation {
                    top: 1rem;
                  }
                `}</style>
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                  <Calendar className="h-5 w-5 text-gray-400" />
                </div>
                <DatePicker
                  selected={formData.startDate}
                  onChange={handleDateChange}
                  startDate={formData.startDate}
                  endDate={formData.endDate}
                  selectsRange
                  minDate={new Date()}
                  placeholderText="Select dates"
                  className="custom-datepicker w-full"
                  dateFormat="dd MMM yyyy"
                  showPopperArrow={false}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-800 mb-2">
                Invite friends by email (Optional)
              </label>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    type="email"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="friend@example.com"
                    className="w-full pl-10 pr-4 py-3 border-2 border-gray-200 rounded-lg focus:outline-none focus:border-emerald-500 transition-colors"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddEmail();
                      }
                    }}
                  />
                </div>
                <button
                  type="button"
                  onClick={handleAddEmail}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white p-3 rounded-lg transition-colors"
                >
                  <Plus className="w-6 h-6" />
                </button>
              </div>

              {formData.invitedEmails.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-3">
                  {formData.invitedEmails.map((email) => (
                    <div key={email} className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-3 py-1.5 rounded-full text-sm border border-emerald-100">
                      <span>{email}</span>
                      <button
                        type="button"
                        onClick={() => removeEmail(email)}
                        className="hover:text-emerald-900"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Step 2: Login */}
        {step === 2 && (
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
        {step < 2 && (
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
