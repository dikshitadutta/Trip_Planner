"use client"
import { Mail, Phone, MapPin, Facebook, Instagram, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold text-white mb-4">Seven Sisters Journies</h3>
            <p className="text-sm text-gray-400">
              Your gateway to discovering the untouched beauty of North East India
            </p>
            <div className="flex gap-4 mt-4">
              <Facebook className="w-5 h-5 hover:text-emerald-500 cursor-pointer transition-colors" />
              <Instagram className="w-5 h-5 hover:text-emerald-500 cursor-pointer transition-colors" />
              <Twitter className="w-5 h-5 hover:text-emerald-500 cursor-pointer transition-colors" />
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <a href="#" className="hover:text-emerald-500 transition-colors">
                  Destinations
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-500 transition-colors">
                  Itineraries
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-500 transition-colors">
                  Travel Blog
                </a>
              </li>
              <li>
                <a href="#" className="hover:text-emerald-500 transition-colors">
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="text-white font-bold mb-4">Support</h4>
            <ul className="space-y-3 text-sm">
              <li className="flex gap-2 items-start">
                <Phone className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                <span>+91 9876543210</span>
              </li>
              <li className="flex gap-2 items-start">
                <Mail className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                <span>hello@sevensistersjournie.com</span>
              </li>
              <li className="flex gap-2 items-start">
                <MapPin className="w-4 h-4 text-emerald-500 mt-1 flex-shrink-0" />
                <span>Guwahati, Assam, India</span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h4 className="text-white font-bold mb-4">Newsletter</h4>
            <p className="text-sm text-gray-400 mb-3">Get travel tips and exclusive deals</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Your email"
                className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 transition-colors"
              />
              <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-4 py-2 rounded transition-colors">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-sm">
          <p>&copy; 2025 Seven Sisters Journies. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <a href="#" className="hover:text-emerald-500 transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-emerald-500 transition-colors">
              Terms of Service
            </a>
            <a href="#" className="hover:text-emerald-500 transition-colors">
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
