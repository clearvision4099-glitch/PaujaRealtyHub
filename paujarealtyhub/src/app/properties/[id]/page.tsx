import { properties } from "@/data/properties";

type Props = {
  params: Promise<{
    id: string;
  }>;
};

export default async function PropertyDetailsPage({ params }: Props) {
  const { id } = await params;

  const property = properties.find(
    (p) => p.id === Number(id)
  );

  if (!property) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <h1 className="text-4xl font-bold">
          Property Not Found
        </h1>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gray-100 py-16">
      <div className="max-w-6xl mx-auto px-6">

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="h-96 bg-blue-100 flex items-center justify-center text-9xl">
            {property.image}
          </div>

          <div className="p-8">

            <h1 className="text-4xl font-bold">
              {property.title}
            </h1>

            <p className="text-gray-600 mt-3">
              📍 {property.location}
            </p>

            <p className="text-blue-700 text-3xl font-bold mt-6">
              {property.price}
            </p>

            <div className="flex gap-8 mt-8 text-lg">
              <span>🛏 {property.bedrooms} Bedrooms</span>
              <span>🚿 {property.bathrooms} Bathrooms</span>
              <span>📐 {property.size}</span>
            </div>

            <h2 className="text-2xl font-bold mt-10">
              Description
            </h2>

            <p className="mt-4 text-gray-700 leading-8">
              {property.description}
            </p>

            <button className="mt-10 bg-blue-700 text-white px-8 py-4 rounded-lg hover:bg-blue-800">
              Contact Agent
            </button>

          </div>

        </div>

      </div>
    </main>
  );
}