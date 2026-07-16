import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />

      <main className="max-w-7xl mx-auto px-6 py-20">
        <h1 className="text-5xl font-bold text-gray-900">
          Find Your Dream Property Anywhere in the World
        </h1>

        <p className="mt-6 text-xl text-gray-600 max-w-2xl">
          PaujaRealtyHub connects buyers, sellers, agents, developers and
          property professionals on one trusted global platform.
        </p>

        <button className="mt-8 bg-blue-700 text-white px-8 py-4 rounded-lg hover:bg-blue-800">
          Explore Properties
        </button>
      </main>
    </>
  );
}