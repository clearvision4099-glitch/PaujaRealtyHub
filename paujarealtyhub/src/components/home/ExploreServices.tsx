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
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center">
          Explore Real Estate Services
        </h2>

        <p className="text-center text-gray-600 mt-4 mb-12">
          Everything you need in one trusted global real estate hub.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {services.map((service) => (
            <div
              key={service.title}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-2xl transition duration-300"
            >
              <div className="text-5xl mb-6">{service.icon}</div>

              <h3 className="text-2xl font-semibold mb-3">
                {service.title}
              </h3>

              <p className="text-gray-600">
                {service.description}
              </p>

              <button className="mt-6 text-blue-700 font-semibold hover:underline">
                Learn More →
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}