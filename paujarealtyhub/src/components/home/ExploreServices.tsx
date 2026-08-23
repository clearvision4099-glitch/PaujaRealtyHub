export default function ExploreServices() {
  const services = [
    {
      title: "Buy Property",
      icon: "🏠",
      description:
        "Find houses, apartments, land and commercial properties worldwide.",
    },
    {
      title: "Rent Property",
      icon: "🏡",
      description:
        "Discover rental homes, apartments and offices with ease.",
    },
    {
      title: "Lease Property",
      icon: "📑",
      description:
        "Lease warehouses, office spaces and commercial buildings.",
    },
    {
      title: "Sell Property",
      icon: "💰",
      description:
        "List your property and reach buyers from around the world.",
    },
    {
      title: "Invest",
      icon: "🌍",
      description:
        "Explore investment opportunities and new developments.",
    },
    {
      title: "Develop",
      icon: "🏗️",
      description:
        "Connect with developers and showcase new projects.",
    },
  ];

  return (
    <section className="bg-[#F7F7F3] py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center max-w-3xl mx-auto mb-14">

          <span className="inline-block text-[#B8922E] font-semibold tracking-wide uppercase text-sm">
            Explore Pauja
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-[#0B1F3A] mt-3">
            Explore Real Estate Services
          </h2>

          <p className="text-gray-600 mt-4 text-lg">
            Everything you need in one trusted global real estate hub.
          </p>

        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

          {services.map((service) => (
            <div
              key={service.title}
              className="group bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#08192E] text-3xl flex items-center justify-center mb-6 group-hover:bg-[#C9A227] transition">
                {service.icon}
              </div>

              <h3 className="text-2xl font-bold text-[#0B1F3A] mb-3">
                {service.title}
              </h3>

              <p className="text-gray-600 leading-7">
                {service.description}
              </p>

              <button
                type="button"
                className="mt-6 inline-flex items-center gap-2 text-[#B8922E] font-semibold hover:text-[#08192E] transition"
              >
                Learn More
                <span>→</span>
              </button>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}