export default function Testimonials() {
  const testimonials = [
    {
      name: "James Okoro",
      country: "Nigeria",
      message:
        "PaujaRealtyHub made buying my first investment property abroad simple and stress-free.",
    },
    {
      name: "Grace Mensah",
      country: "Ghana",
      message:
        "I listed my commercial property and connected with genuine buyers within weeks.",
    },
    {
      name: "David Smith",
      country: "United Kingdom",
      message:
        "The platform gave me confidence to invest internationally with verified professionals.",
    },
  ];

  return (
    <section className="py-20 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <h2 className="text-4xl font-bold text-center">
          What Our Clients Say
        </h2>

        <p className="text-center text-gray-600 mt-4 mb-12">
          Building trust through successful real estate experiences.
        </p>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-white rounded-2xl shadow-lg p-8 hover:shadow-xl transition"
            >
              <div className="text-yellow-500 text-2xl mb-4">
                ⭐⭐⭐⭐⭐
              </div>

              <p className="italic text-gray-700">
                "{testimonial.message}"
              </p>

              <div className="mt-6">
                <h3 className="font-bold">
                  {testimonial.name}
                </h3>

                <p className="text-gray-500">
                  {testimonial.country}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}