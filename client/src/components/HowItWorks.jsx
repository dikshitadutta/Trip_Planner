"use client"
import { Compass, Sparkles, MapPin, CheckCircle } from "lucide-react"

export default function HowItWorks() {
  const steps = [
    {
      icon: Compass,
      title: "Choose Your Destination",
      description: "Pick from the seven states: Assam, Meghalaya, Manipur, Mizoram, Nagaland, Sikkim, and Tripura",
    },
    {
      icon: Sparkles,
      title: "Get Personalized Itineraries",
      description: "Our AI creates custom travel plans based on your interests, budget, and travel style",
    },
    {
      icon: MapPin,
      title: "Easy Bookings",
      description: "Book stays, activities, and transport all in one place with transparent pricing",
    },
    {
      icon: CheckCircle,
      title: "24/7 Travel Support",
      description: "Our expert travel consultants are here to help you throughout your journey",
    },
  ]

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">How it works?</h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Plan your dream North East India trip in just a few simple steps
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {steps.map((step, index) => {
            const Icon = step.icon
            return (
              <div key={index} className="flex flex-col gap-4">
                <div className="relative">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center">
                    <Icon className="w-8 h-8 text-white" />
                  </div>
                  <div className="absolute -bottom-2 -right-2 w-6 h-6 rounded-full bg-emerald-400 flex items-center justify-center text-white text-sm font-bold">
                    {index + 1}
                  </div>
                </div>
                <h3 className="text-xl font-bold text-gray-900">{step.title}</h3>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            )
          })}
        </div>

        <div className="mt-16 bg-emerald-50 rounded-2xl p-8 border-2 border-emerald-200">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">10K+</div>
              <p className="text-gray-700 font-medium">Happy Travelers</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">500+</div>
              <p className="text-gray-700 font-medium">Curated Experiences</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">4.8★</div>
              <p className="text-gray-700 font-medium">Average Rating</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-emerald-600 mb-2">24/7</div>
              <p className="text-gray-700 font-medium">Customer Support</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
