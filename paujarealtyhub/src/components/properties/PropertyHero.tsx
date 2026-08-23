export default function PropertyHero() {
  return (
    <section className="relative overflow-hidden bg-[#08192E] text-white py-20">

      {/* Decorative background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-24 right-10 w-80 h-80 rounded-full bg-[#C9A227]/10 blur-3xl" />
        <div className="absolute -bottom-32 left-10 w-96 h-96 rounded-full bg-[#163A5F]/40 blur-3xl" />
      </div>

      <div className="relative max-w-7xl mx-auto px-6 text-center">

        <span className="inline-flex items-center bg-white/10 border border-[#C9A227]/30 text-[#E4C45C] px-4 py-2 rounded-full text-sm font-semibold tracking-wide">
          Explore Properties
        </span>

        <h1 className="mt-6 text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight">
          Find Your Perfect
          <span className="text-[#C9A227]"> Property</span>
        </h1>

        <p className="mt-6 text-lg md:text-xl text-gray-300 leading-8 max-w-3xl mx-auto">
          Discover residential, commercial and investment
          opportunities from property owners, agents and
          developers on PaujaRealtyHub.
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-6 text-sm text-gray-300">
          <span>✓ Properties for Sale</span>
          <span>✓ Properties for Rent</span>
          <span>✓ Investment Opportunities</span>
        </div>

      </div>
    </section>
  );
}