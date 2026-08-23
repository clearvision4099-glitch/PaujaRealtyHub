export default function Testimonials() {
  const benefits = [
    {
      icon: "🛡️",
      title: "Built Around Trust",
      description:
        "Property seekers can view seller and agent information and communicate directly before making decisions.",
    },
    {
      icon: "💬",
      title: "Direct Communication",
      description:
        "Contact property professionals through messaging, phone, WhatsApp or email from the property listing.",
    },
    {
      icon: "🔎",
      title: "Simple Property Discovery",
      description:
        "Search properties by location, property type and listing type to quickly find relevant opportunities.",
    },
  ];

  return (
    <section className="bg-[#F7F7F3] py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[#B8922E] font-semibold uppercase tracking-wider text-sm">
            Why PaujaRealtyHub
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-[#0B1F3A] mt-3">
            Property Connections Made Simpler
          </h2>

          <p className="text-gray-600 mt-4 text-lg">
            Designed to make discovering, listing and discussing
            property opportunities easier.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="bg-white rounded-2xl border border-gray-100 p-8 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
            >
              <div className="w-16 h-16 rounded-2xl bg-[#08192E] flex items-center justify-center text-3xl mb-6">
                {benefit.icon}
              </div>

              <h3 className="text-2xl font-bold text-[#0B1F3A]">
                {benefit.title}
              </h3>

              <p className="text-gray-600 leading-7 mt-4">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}