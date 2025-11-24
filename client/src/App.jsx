import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import VideoHero from "./components/VideoHero"
import Hero from "./components/Hero"
import PlannedTrips from "./components/PlannedTrips"
import HowItWorks from "./components/HowItWorks"
import Destinations from "./components/Destinations"
import CTA from "./components/CTA"
import Footer from "./components/Footer"
import TravelAssistant from "./components/TravelAssistant"
import Dashboard from "./pages/Dashboard"
import AuthSuccess from "./pages/AuthSuccess"

function HomePage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        <VideoHero />
        <Hero />
        <PlannedTrips />
        <HowItWorks />
        <Destinations />
        <CTA />
        <Footer />
      </main>
      <TravelAssistant />
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/auth-success" element={<AuthSuccess />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
