export default function FeaturedAgents() {
  const agents = [
    {
      name: "Sarah Johnson",
      company: "Pauja Realty",
      location: "Lagos, Nigeria",
      listings: 48,
    },
    {
      name: "Michael Brown",
      company: "Global Homes",
      location: "Accra, Ghana",
      listings: 35,
    },
    {
      name: "Amina Hassan",
      company: "Prime Estates",
      location: "Nairobi, Kenya",
      listings: 52,
    },
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center">
          Featured Agents
        </h2>

        <p className="text-center text-gray-600 mt-4 mb-12">
          Connect with trusted real estate professionals.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {agents.map((agent) => (
            <div
              key={agent.name}
              className="bg-gray-50 rounded-2xl shadow-md p-8 text-center hover:shadow-xl transition"
            >
              <div className="w-24 h-24 rounded-full bg-blue-700 text-white flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                {agent.name.charAt(0)}
              </div>

              <h3 className="text-2xl font-semibold">
                {agent.name}
              </h3>

              <p className="text-blue-700 mt-2">
                {agent.company}
              </p>

              <p className="text-gray-600 mt-2">
                {agent.location}
              </p>

              <p className="mt-4 font-semibold">
                {agent.listings} Active Listings
              </p>

              <button className="mt-6 bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800">
                View Profile
              </button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}