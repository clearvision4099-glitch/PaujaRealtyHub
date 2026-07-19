"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

type Property = {
  id: number;
  title: string;
  type: string;
  status: string;
  location: string;
  price: string;
  bedrooms: number;
  bathrooms: number;
  size: string;
  image: string;
  featured: boolean;
};

type PropertyCardProps = {
  property: Property;
};

export default function PropertyCard({ property }: PropertyCardProps) {
  const [isFavourite, setIsFavourite] = useState(false);

  return (
    <div className="bg-white rounded-2xl shadow-md overflow-hidden transition-all duration-300 hover:shadow-2xl hover:-translate-y-2">

      <div className="relative w-full h-56 overflow-hidden">

        <Image
          src={property.image}
          alt={property.title}
          fill
          sizes="(max-width:768px)100vw,(max-width:1200px)50vw,33vw"
          className="object-cover transition-transform duration-500 hover:scale-110"
        />

        <button
          onClick={() => setIsFavourite(!isFavourite)}
          className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white shadow-lg flex items-center justify-center hover:scale-110 transition"
        >
          <span className="text-2xl">
            {isFavourite ? "❤️" : "🤍"}
          </span>
        </button>

        {property.featured && (
          <span className="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow">
            ⭐ Featured
          </span>
        )}

      </div>

      <div className="p-6">

        <div className="flex justify-between items-center mb-4">

          <span className="bg-blue-100 text-blue-700 text-xs font-semibold px-3 py-1 rounded-full">
            {property.type}
          </span>

          <span className="bg-green-100 text-green-700 text-xs font-semibold px-3 py-1 rounded-full">
            {property.status}
          </span>

        </div>

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
          className="block w-full mt-8 bg-blue-700 text-white py-3 rounded-lg text-center transition-colors duration-300 hover:bg-blue-800"
        >
          View Details
        </Link>

      </div>

    </div>
  );
}