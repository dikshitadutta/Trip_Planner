"use client"
import TravelForm from "./TravelForm"
import { ArrowRight } from "lucide-react"
import heroImage from "../assets/north east.jpg"

export default function Hero() {
  return (
    <section className="relative min-h-screen bg-gradient-to-b from-background via-background to-background flex items-center overflow-hidden">
      {/* Hero Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: `url(${heroImage})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundAttachment: "fixed",
        }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      <div className="relative z-10 container mx-auto px-4 py-20 grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Left Column - Content */}
        <div className="flex flex-col gap-6 text-white">
          <div className="flex items-center gap-2 text-emerald-400 font-medium text-sm">
            <span className="inline-block w-8 h-0.5 bg-emerald-400" />
            Plan Your Perfect Trip
          </div>

          <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-pretty">
            Discover Your Next Adventure
          </h1>

          <p className="text-lg text-gray-200 leading-relaxed max-w-md">
            Experience amazing destinations worldwide with personalized itineraries designed just for you.
          </p>

          <button className="inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-3 px-6 rounded-lg w-fit transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/50">
            Plan Your Journey
            <ArrowRight className="w-5 h-5" />
          </button>

          {/* Features Row */}
          <div className="grid grid-cols-3 gap-4 pt-8 border-t border-white/10">
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">195+</div>
              <div className="text-sm text-gray-300">Countries</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">1000+</div>
              <div className="text-sm text-gray-300">Destinations</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-emerald-400">24/7</div>
              <div className="text-sm text-gray-300">AI Support</div>
            </div>
          </div>
        </div>

        {/* Right Column - Form */}
        <div className="lg:sticky lg:top-20">
          <TravelForm />
        </div>
      </div>
    </section>
  )
}
