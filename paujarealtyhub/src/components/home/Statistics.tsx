export default function Statistics() {
  const stats = [
    {
      number: "24/7",
      label: "Property Discovery",
      description: "Browse listings whenever you need them.",
    },
    {
      number: "Direct",
      label: "Agent Contact",
      description: "Call, message, email or connect through WhatsApp.",
    },
    {
      number: "Smart",
      label: "Property Search",
      description: "Search by location, property type and listing type.",
    },
    {
      number: "Growing",
      label: "Property Network",
      description: "Built to connect property seekers and professionals.",
    },
  ];

  return (
    <section className="bg-[#08192E] py-20 text-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[#C9A227] font-semibold uppercase tracking-wider text-sm">
            Built for Real Estate
          </span>

          <h2 className="text-4xl md:text-5xl font-bold mt-3">
            A Smarter Way to Find Property
          </h2>

          <p className="mt-4 text-gray-300 text-lg">
            PaujaRealtyHub brings property discovery,
            communication and listing management together
            in one trusted platform.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">

          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-white/5 border border-white/10 rounded-2xl p-7 hover:border-[#C9A227]/60 hover:bg-white/10 transition"
            >
              <div className="w-10 h-1 bg-[#C9A227] rounded-full mb-6" />

              <h3 className="text-3xl font-bold text-[#C9A227]">
                {stat.number}
              </h3>

              <p className="mt-3 text-lg font-semibold text-white">
                {stat.label}
              </p>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                {stat.description}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}