"use client"
import { ChevronRight } from "lucide-react"
import { useState, useEffect } from "react"
import assamImage from "../assets/assam.jpg"
import meghalayaImage from "../assets/meghalaya.jpg"
import sikkimImage from "../assets/sikkim.jpg"
import manipurImage from "../assets/Manipur.jpg"
import nagalandImage from "../assets/nagaland.jpeg"
import mizoramImage from "../assets/mizoram.jpeg"

export default function Destinations() {
  const [currentIndex, setCurrentIndex] = useState(0)

  const destinations = [
    {
      name: "Assam",
      title: "Tea Gardens & Wildlife",
      description: "Explore rolling tea plantations and the mighty Brahmaputra",
      image: assamImage,
    },
    {
      name: "Meghalaya",
      title: "Land of Clouds",
      description: "Visit living root bridges and waterfalls in the wettest place",
      image: meghalayaImage,
    },
    {
      name: "Sikkim",
      title: "Mountain Paradise",
      description: "Trek to Kanchenjunga and enjoy serene mountain landscapes",
      image: sikkimImage,
    },
  ]

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % destinations.length)
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % destinations.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [destinations.length])

  return (
    <section className="py-20 bg-white">
      <div className="container mx-auto px-4">
        <div className="mb-12">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-4xl font-bold text-gray-900">Featured Destinations</h2>
            <button
              onClick={nextSlide}
              className="w-12 h-12 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-all duration-200 hover:shadow-lg hover:shadow-emerald-500/50"
            >
              <ChevronRight className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden rounded-2xl">
          <div className="relative h-96">
            {destinations.map((destination, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-500 ${
                  index === currentIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-8 text-white">
                  <p className="text-emerald-400 font-semibold mb-2">{destination.name}</p>
                  <h3 className="text-3xl font-bold mb-2">{destination.title}</h3>
                  <p className="text-gray-200 text-lg">{destination.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Dots Navigation */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2 z-10">
            {destinations.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`w-3 h-3 rounded-full transition-all duration-200 ${
                  index === currentIndex ? "bg-emerald-500 w-8" : "bg-white/50 hover:bg-white/75"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Destination Cards Grid */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Manipur",
              highlight: "Loktak Lake & Dance",
              image: manipurImage,
            },
            {
              name: "Nagaland",
              highlight: "Tribal Culture & Festivals",
              image: nagalandImage,
            },
            {
              name: "Mizoram",
              highlight: "Blue Hills & Bamboo Forests",
              image: mizoramImage,
            },
          ].map((destination) => (
            <div key={destination.name} className="group cursor-pointer rounded-xl overflow-hidden">
              <div className="relative h-40 bg-gray-200 overflow-hidden">
                <img
                  src={destination.image}
                  alt={destination.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/50 transition-colors duration-300" />
              </div>
              <div className="bg-emerald-50 p-4 border-2 border-emerald-200">
                <h4 className="font-bold text-gray-900 mb-1">{destination.name}</h4>
                <p className="text-sm text-gray-600">{destination.highlight}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
