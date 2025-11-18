import Navbar from "./components/Navbar"
import VideoHero from "./components/VideoHero"
import Hero from "./components/Hero"
import HowItWorks from "./components/HowItWorks"
import Destinations from "./components/Destinations"
import CTA from "./components/CTA"
import Footer from "./components/Footer"

function App() {
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

export default App
