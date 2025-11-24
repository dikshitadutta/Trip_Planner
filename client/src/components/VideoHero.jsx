import videoFile from "../assets/NE.mp4"

export default function VideoHero() {
  return (
    <section className="relative w-full h-screen overflow-hidden pt-0">
      {/* Video Background */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src={videoFile} type="video/mp4" />
        Your browser does not support the video tag.
      </video>

      {/* Subtle Dark Overlay */}
      <div className="absolute inset-0 bg-black/30" />

      {/* Content */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-12">
        {/* Center Title */}
        <div className="text-center">
          <h1 className="text-6xl md:text-7xl font-light text-white mb-4 tracking-wide drop-shadow-lg">
            Explore the World
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-light drop-shadow-md">
            Your Journey Starts Here
          </p>
        </div>

        {/* Bottom Section - Scroll Indicator */}
        <div className="absolute bottom-8 flex flex-col items-center gap-2">
          <p className="text-white/70 text-xs tracking-widest uppercase font-light">Scroll to explore</p>
          <svg className="w-5 h-5 text-white/70 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
