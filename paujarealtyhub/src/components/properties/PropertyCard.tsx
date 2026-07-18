import Image from "next/image";
import Link from "next/link";

type Property = {
  id: number;
  title: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  size: string;
  image: string;
};

type PropertyCardProps = {
  property: Property;
};

export default function PropertyCard({ property }: PropertyCardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition">

      <div className="relative w-full h-56">
        <Image
          src={property.image}
          alt={property.title}
          fill
          className="object-cover"
        />
      </div>

      <div className="p-6">

        <h2 className="text-2xl font-bold">
          {property.title}
        </h2>

        <p className="text-gray-600 mt-2">
          📍 {property.location}
        </p>

        <p className="text-blue-700 text-2xl font-bold mt-4">
          {property.price}
        </p>

        <div className="flex justify-between mt-6 text-gray-700">
          <span>🛏 {property.bedrooms}</span>
          <span>🚿 {property.bathrooms}</span>
          <span>📐 {property.size}</span>
        </div>

        <Link
          href={`/properties/${property.id}`}
          className="block w-full mt-8 bg-blue-700 text-white py-3 rounded-lg hover:bg-blue-800 text-center"
        >
          View Details
        </Link>

      </div>

    </div>
  );
}