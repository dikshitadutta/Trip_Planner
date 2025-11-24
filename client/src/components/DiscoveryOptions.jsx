import { useState } from "react"
import { Mountain, Utensils, Users, Palette, Sparkles } from "lucide-react"
import MapChatbot from "./MapChatbot"

const discoveryOptions = [
  {
    id: "incredible-views",
    icon: Mountain,
    label: "Show me incredible views",
    prompt: "I want to discover breathtaking scenic views and natural wonders around the world",
  },
  {
    id: "bucket-list",
    icon: Sparkles,
    label: "Find bucket-list restaurants",
    prompt: "Show me world-famous restaurants and unique dining experiences I must try",
  },
  {
    id: "family-trip",
    icon: Users,
    label: "Build my family road trip",
    prompt: "Help me plan a perfect family-friendly road trip with activities for all ages",
  },
  {
    id: "arts-destinations",
    icon: Palette,
    label: "See top arts destinations",
    prompt: "I want to explore cities with amazing art museums, galleries, and cultural experiences",
  },
]

export default function DiscoveryOptions() {
  const [selectedOption, setSelectedOption] = useState(null)
  const [isMapOpen, setIsMapOpen] = useState(false)

  const handleOptionClick = (option) => {
    setSelectedOption(option)
    setIsMapOpen(true)
  }

  const handleClose = () => {
    setIsMapOpen(false)
    setTimeout(() => setSelectedOption(null), 300)
  }

  return (
    <>
      {/* Discovery Options Bar */}
      <section className="relative py-16 bg-gradient-to-b from-white to-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-8">
            <p className="text-emerald-600 font-semibold mb-2 flex items-center justify-center gap-2">
              <Sparkles className="w-5 h-5" />
              Get travel ideas
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-4">
            {discoveryOptions.map((option) => {
              const Icon = option.icon
              return (
                <button
                  key={option.id}
                  onClick={() => handleOptionClick(option)}
                  className="group flex items-center gap-3 px-6 py-4 bg-white hover:bg-emerald-50 border-2 border-gray-200 hover:border-emerald-500 rounded-full transition-all duration-300 shadow-sm hover:shadow-md"
                >
                  <Icon className="w-5 h-5 text-gray-600 group-hover:text-emerald-600 transition-colors" />
                  <span className="font-medium text-gray-800 group-hover:text-emerald-600 transition-colors">
                    {option.label}
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </section>

      {/* Map Chatbot Modal */}
      {isMapOpen && selectedOption && (
        <MapChatbot
          isOpen={isMapOpen}
          onClose={handleClose}
          initialPrompt={selectedOption.prompt}
          title={selectedOption.label}
        />
      )}
    </>
  )
}
