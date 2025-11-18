"use client"
import { Search, LogOut, User, Settings } from "lucide-react"
import { useState, useRef, useEffect } from "react"
import LocationAutocomplete from "./LocationAutocomplete"

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [isScrolled, setIsScrolled] = useState(false)
  const [isHovered, setIsHovered] = useState(false)
  const dropdownRef = useRef(null)

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
    setIsLoggedIn(true)
    setIsDropdownOpen(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setIsDropdownOpen(false)
  }

  const handleSearch = (e) => {
    e.preventDefault()
    console.log("Searching for:", searchQuery)
  }

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled || isHovered ? "bg-black/90 shadow-lg" : "bg-transparent"
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
                {isLoggedIn ? (
                  <>
                    <div className="px-4 py-3 border-b border-gray-200">
                      <p className="text-sm font-semibold text-gray-900">Welcome back!</p>
                      <p className="text-xs text-gray-600">user@example.com</p>
                    </div>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <User className="w-4 h-4" />
                      <span className="text-sm">Manage Profile</span>
                    </button>
                    <button
                      onClick={() => {
                        setIsDropdownOpen(false)
                      }}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-left"
                    >
                      <Settings className="w-4 h-4" />
                      <span className="text-sm">Settings</span>
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
                      Login
                    </button>
                    <button className="w-full px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-left border-t border-gray-200">
                      Sign Up
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
