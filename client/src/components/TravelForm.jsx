"use client"
import { MapPin, Calendar, Users } from "lucide-react"
import { useState } from "react"
import LocationAutocomplete from "./LocationAutocomplete"

export default function TravelForm() {
  const [formData, setFormData] = useState({
    departure: "Guwahati",
    destination: "",
    startDate: "",
    endDate: "",
    travelers: "2",
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log("Form submitted:", formData)
  }

  return (
    <div className="bg-white rounded-2xl shadow-2xl p-8 space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Plan Your Adventure</h2>
        <p className="text-gray-600 text-sm mt-1">Create your perfect North East journey</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Where Column */}
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

        {/* When Column */}
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
              />
            </div>
            <div className="flex items-center gap-2 border-2 border-gray-200 rounded-lg px-4 py-3 focus-within:border-emerald-500 transition-colors">
              <Calendar className="w-5 h-5 text-gray-600" />
              <input
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="flex-1 bg-transparent outline-none text-gray-900 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Activity Preferences */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Activity Preferences
          </label>
          <select className="w-full border-2 border-gray-200 rounded-lg px-4 py-3 bg-white text-gray-900 focus:outline-none focus:border-emerald-500 transition-colors">
            <option>Adventure & Trekking</option>
            <option>Cultural & Heritage</option>
            <option>Nature & Wildlife</option>
            <option>Beach & Relaxation</option>
            <option>Mixed Experience</option>
          </select>
        </div>

        {/* Travelers */}
        <div>
          <label className="block text-sm font-semibold text-gray-800 mb-2">
            Number of Travelers
          </label>
          <div className="flex items-center gap-2 border-2 border-gray-200 rounded-lg px-4 py-3">
            <Users className="w-5 h-5 text-gray-600" />
            <select
              value={formData.travelers}
              onChange={(e) => setFormData({ ...formData, travelers: e.target.value })}
              className="flex-1 bg-transparent outline-none text-gray-900"
            >
              <option>1</option>
              <option>2</option>
              <option>3</option>
              <option>4</option>
              <option>5+</option>
            </select>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-4 px-6 rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/50 text-lg"
        >
          Start Planning
        </button>
      </form>

      <p className="text-center text-xs text-gray-600">Get your personalized itinerary in minutes</p>
    </div>
  )
}
