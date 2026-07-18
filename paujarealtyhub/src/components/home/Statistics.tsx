export default function Statistics() {
  const stats = [
    {
      number: "10,000+",
      label: "Properties Listed",
    },
    {
      number: "500+",
      label: "Verified Agents",
    },
    {
      number: "50+",
      label: "Countries Covered",
    },
    {
      number: "100,000+",
      label: "Happy Clients",
    },
  ];

  return (
    <section className="py-20 bg-blue-700 text-white">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center">
          PaujaRealtyHub by the Numbers
        </h2>

        <p className="text-center mt-4 text-blue-100 mb-12">
          Building trust through global real estate connections.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="bg-blue-600 rounded-xl p-8 shadow-lg hover:bg-blue-500 transition"
            >
              <h3 className="text-4xl font-bold">
                {stat.number}
              </h3>

              <p className="mt-3 text-blue-100">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}