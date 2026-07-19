import Image from "next/image";
import { notFound } from "next/navigation";
import { properties } from "@/data/properties";

type PageProps = {
  params: {
    id: string;
  };
};

export default function PropertyDetailsPage({ params }: PageProps) {
  const property = properties.find(
    (item) => item.id === Number(params.id)
  );

  if (!property) {
    notFound();
  }

  return (
    <main className="bg-gray-100 min-h-screen py-16">

      <div className="max-w-7xl mx-auto px-6">

        <div className="bg-white rounded-2xl shadow-lg overflow-hidden">

          <div className="relative w-full h-[550px]">

            <Image
              src={property.image}
              alt={property.title}
              fill
              priority
              className="object-cover"
            />

            {property.featured && (
              <span className="absolute top-6 left-6 bg-yellow-500 text-white px-4 py-2 rounded-full font-semibold shadow-lg">
                ⭐ Featured Property
              </span>
            )}

          </div>

          <div className="p-10">

            <div className="flex flex-col lg:flex-row justify-between gap-8">

              <div>

                <span className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-semibold">
                  {property.type}
                </span>

                <h1 className="text-5xl font-bold mt-6">
                  {property.title}
                </h1>

                <p className="text-gray-500 mt-4 text-lg">
                  📍 {property.location}
                </p>

              </div>

              <div>

                <h2 className="text-4xl font-bold text-blue-700">
                  {property.price}
                </h2>

                <p className="text-gray-500 mt-3">
                  {property.status}
                </p>

              </div>

            </div>

            <hr className="my-10" />

            <div className="grid grid-cols-3 gap-6 text-center">

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-4xl mb-3">🛏</div>
                <h3 className="font-bold text-2xl">
                  {property.bedrooms}
                </h3>
                <p>Bedrooms</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-4xl mb-3">🚿</div>
                <h3 className="font-bold text-2xl">
                  {property.bathrooms}
                </h3>
                <p>Bathrooms</p>
              </div>

              <div className="bg-gray-50 rounded-xl p-6">
                <div className="text-4xl mb-3">📐</div>
                <h3 className="font-bold text-2xl">
                  {property.size}
                </h3>
                <p>Size</p>
              </div>

            </div>

            <hr className="my-10" />

            <h2 className="text-3xl font-bold mb-6">
              Description
            </h2>

            <p className="text-gray-600 leading-8 text-lg">
              This beautiful {property.type.toLowerCase()} located in{" "}
              {property.location} offers exceptional comfort, premium
              finishing, modern architecture and an excellent investment
              opportunity. It is suitable for families, professionals,
              and investors seeking quality real estate.
            </p>

            <button className="mt-12 bg-blue-700 hover:bg-blue-800 transition text-white px-8 py-4 rounded-xl text-lg font-semibold">
              Contact Agent
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}