"use client"
import { Search, LogOut, User } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import LocationAutocomplete from "./LocationAutocomplete"

export default function Navbar() {
  const [user, setUser] = useState(null)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const dropdownRef = useRef(null)

  const API_URL = "http://localhost:3001"

  // Check if user is logged in on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser))
      } catch (error) {
        console.error('Error parsing stored user:', error)
        localStorage.removeItem('user')
      }
    }
  }, [])

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }

    document.addEventListener("mousedown", handleClickOutside)
    window.addEventListener("scroll", handleScroll)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])

  const handleLogin = () => {
    // Redirect to Google OAuth
    window.location.href = `${API_URL}/api/auth/google`
  }

  const handleLogout = async () => {
    try {
      await fetch(`${API_URL}/api/auth/logout`, {
        method: 'POST',
        credentials: 'include'
      })
      localStorage.removeItem('user')
      localStorage.removeItem('currentTripId')
      setUser(null)
      setIsDropdownOpen(false)
      // Redirect to home page
      window.location.href = '/'
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${isScrolled || isHovered
          ? "bg-black/80 backdrop-blur-md shadow-lg border-b border-white/10"
          : "bg-transparent"
        }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-white drop-shadow-lg">Seven Sisters</h1>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-md">
            <LocationAutocomplete
              value={searchQuery}
              onChange={setSearchQuery}
              placeholder="Search destinations..."
              region="northeast"
            />
          </div>

          {/* Profile Section */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center transition-all duration-200 hover:shadow-lg backdrop-blur-sm"
            >
              <User className="w-6 h-6" />
            </button>

            {/* Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 overflow-hidden">
                {user ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                    </div>
                    <button
                      onClick={() => {
                        window.location.href = '/dashboard'
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">My Trips</span>
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors text-left border-t border-gray-200"
                    >
                      <LogOut className="w-4 h-4" />
                      <span className="text-sm">Logout</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={handleLogin}
                      className="w-full px-4 py-3 text-emerald-600 hover:bg-emerald-50 transition-colors text-left font-semibold"
                    >
                      Login with Google
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}
