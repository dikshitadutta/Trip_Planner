import { BrowserRouter, Routes, Route } from "react-router-dom"
import Navbar from "./components/Navbar"
import VideoHero from "./components/VideoHero"
import Hero from "./components/Hero"
import HowItWorks from "./components/HowItWorks"
import Destinations from "./components/Destinations"
import CTA from "./components/CTA"
import Footer from "./components/Footer"
import Dashboard from "./pages/Dashboard"

function HomePage() {
  return (
    <>
      <Navbar />
      <main className="overflow-hidden">
        <VideoHero />
        <Hero />
        <HowItWorks />
        <Destinations />
        <CTA />
        <Footer />
      </main>
    </>
  )
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
