export default function Stats() {
  const stats = [
    {
      number: "250+",
      label: "Properties",
      icon: "🏠",
    },
    {
      number: "18",
      label: "Cities",
      icon: "🌍",
    },
    {
      number: "120",
      label: "Agents",
      icon: "👨‍💼",
    },
    {
      number: "95%",
      label: "Satisfied Clients",
      icon: "😊",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">

          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center bg-gray-50 rounded-2xl p-8 shadow-sm hover:shadow-lg transition duration-300"
            >
              <div className="text-5xl mb-4">
                {stat.icon}
              </div>

              <h2 className="text-4xl font-bold text-blue-700">
                {stat.number}
              </h2>

              <p className="mt-3 text-gray-600">
                {stat.label}
              </p>
            </div>
          ))}

        </div>

      </div>
    </section>
  );
}