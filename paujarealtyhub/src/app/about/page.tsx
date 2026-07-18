export default function AboutPage() {
  return (
    <main className="min-h-screen bg-gray-50">

      {/* Hero Section */}
      <section className="bg-blue-700 text-white py-20">
        <div className="max-w-6xl mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold">
            About PaujaRealtyHub
          </h1>

          <p className="mt-6 text-xl max-w-3xl mx-auto">
            Connecting buyers, sellers, agents, developers and real estate
            professionals through one trusted global property platform.
          </p>
        </div>
      </section>

      {/* Our Mission */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-4xl font-bold mb-8">
            Our Mission
          </h2>

          <p className="text-lg text-gray-700 leading-8">
            Our mission is to simplify real estate transactions by providing
            a secure, transparent and innovative platform where people can
            buy, sell, rent, lease and invest in properties anywhere in the
            world.
          </p>

        </div>
      </section>

      {/* Our Vision */}
      <section className="bg-white py-20">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-4xl font-bold mb-8">
            Our Vision
          </h2>

          <p className="text-lg text-gray-700 leading-8">
            We envision PaujaRealtyHub becoming the world's most trusted
            real estate ecosystem where every property transaction is safe,
            transparent and accessible to everyone.
          </p>

        </div>
      </section>

      {/* Core Values */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-6xl mx-auto px-6">

          <h2 className="text-4xl font-bold text-center mb-16">
            Our Core Values
          </h2>

          <div className="grid md:grid-cols-3 gap-10">

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold mb-4">
                Trust
              </h3>

              <p className="text-gray-600">
                Every listing and professional on our platform is built around
                transparency and credibility.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold mb-4">
                Innovation
              </h3>

              <p className="text-gray-600">
                We continuously develop technology that simplifies the real
                estate experience.
              </p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-8">
              <h3 className="text-2xl font-semibold mb-4">
                Excellence
              </h3>

              <p className="text-gray-600">
                We are committed to delivering world-class service to every
                client and partner.
              </p>
            </div>

          </div>

        </div>
      </section>

    </main>
  );
}