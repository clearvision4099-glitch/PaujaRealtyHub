export default function FeaturedProperties() {
  const properties = [
    {
      id: 1,
      title: "Luxury Apartment",
      location: "Lagos, Nigeria",
      price: "$250,000",
    },
    {
      id: 2,
      title: "Modern Villa",
      location: "Accra, Ghana",
      price: "$480,000",
    },
    {
      id: 3,
      title: "Beach House",
      location: "Cape Town, South Africa",
      price: "$720,000",
    },
  ];

  return (
    <section className="py-16 px-6">
      <h2 className="text-3xl font-bold text-center mb-10">
        Featured Properties
      </h2>

      <div className="grid md:grid-cols-3 gap-6">
        {properties.map((property) => (
          <div
            key={property.id}
            className="border rounded-lg shadow-md p-6 hover:shadow-xl transition"
          >
            <h3 className="text-xl font-semibold">
              {property.title}
            </h3>

            <p className="text-gray-600 mt-2">
              {property.location}
            </p>

            <p className="text-blue-700 font-bold text-xl mt-3">
              {property.price}
            </p>

            <button className="mt-6 w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-800">
              View Property
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}