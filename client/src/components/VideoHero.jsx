import videoFile from "../assets/NE.mp4"

const states = [
  { name: "Assam", slug: "assam" },
  { name: "Meghalaya", slug: "meghalaya" },
  { name: "Tripura", slug: "tripura" },
  { name: "Mizoram", slug: "mizoram" },
  { name: "Manipur", slug: "manipur" },
  { name: "Nagaland", slug: "nagaland" },
  { name: "Arunachal Pradesh", slug: "arunachal-pradesh" },
  { name: "Sikkim", slug: "sikkim" },
]

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
      <div className="relative z-10 h-full flex flex-col items-center justify-between px-4 py-12">
        {/* Top Section - Title */}
        <div className="text-center pt-20">
          <h1 className="text-6xl md:text-7xl font-light text-white mb-4 tracking-wide drop-shadow-lg">
            Seven Sisters
          </h1>
          <p className="text-lg md:text-xl text-white/90 font-light drop-shadow-md">
            Discover North East India
          </p>
        </div>

        {/* Middle Section - State Links */}
        <div className="flex flex-wrap justify-center gap-6 md:gap-8 max-w-4xl">
          {states.map((state) => (
            <a
              key={state.slug}
              href={`/states/${state.slug}`}
              className="group relative text-white font-light text-sm md:text-base tracking-wide transition-all duration-300 hover:tracking-widest"
            >
              {/* Text */}
              <span className="relative inline-block">
                {state.name}
                {/* Minimal underline on hover */}
                <span className="absolute bottom-0 left-0 w-0 h-px bg-white transition-all duration-300 group-hover:w-full" />
              </span>
            </a>
          ))}
        </div>

        {/* Bottom Section - Scroll Indicator */}
        <div className="flex flex-col items-center gap-2 pb-8">
          <p className="text-white/70 text-xs tracking-widest uppercase font-light">Scroll to explore</p>
          <svg className="w-5 h-5 text-white/70 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  )
}
