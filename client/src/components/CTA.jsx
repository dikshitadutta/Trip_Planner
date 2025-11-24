"use client"
import { ArrowRight } from "lucide-react"

export default function CTA() {
  return (
    <section className="py-20 bg-gradient-to-r from-emerald-600 to-teal-600">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-4xl lg:text-5xl font-bold text-white mb-6 text-pretty">
          Ready to Start Your Journey?
        </h2>
        <p className="text-lg text-emerald-50 mb-8 max-w-2xl mx-auto">
          Start planning your unforgettable North East India adventure today. Get personalized recommendations and
          exclusive deals.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 font-bold py-4 px-8 rounded-lg hover:bg-gray-100 transition-all duration-200 hover:shadow-lg">
            Get Started Now
            <ArrowRight className="w-5 h-5" />
          </button>
          <button className="inline-flex items-center justify-center gap-2 bg-emerald-700 hover:bg-emerald-800 text-white font-bold py-4 px-8 rounded-lg transition-all duration-200 border-2 border-white/30">
            Learn More
          </button>
        </div>

        <p className="text-emerald-50 text-sm mt-8">
          Join 10,000+ travelers who have discovered the magic of North East India
        </p>
      </div>
    </section>
  )
}
