"use client"
import { Search, LogOut, User, Settings } from "lucide-react"
import { useState, useRef, useEffect } from "react"

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
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
    <nav className="sticky top-0 z-50 bg-white shadow-md">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between gap-6">
          {/* Logo */}
          <div className="flex-shrink-0">
            <h1 className="text-2xl font-bold text-emerald-600">Seven Sisters</h1>
          </div>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-md">
            <div className="relative">
              <input
                type="text"
                placeholder="Search destinations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 border border-gray-300 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:border-emerald-500 focus:bg-white transition-colors"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            </div>
          </form>

          {/* Profile Section */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-10 h-10 rounded-full bg-emerald-500 hover:bg-emerald-600 text-white flex items-center justify-center transition-all duration-200 hover:shadow-lg"
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
