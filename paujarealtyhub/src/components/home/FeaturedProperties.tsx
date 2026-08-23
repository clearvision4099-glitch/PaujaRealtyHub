"use client";

import { useEffect, useState } from "react";
import { getFeaturedProperties } from "@/services/publicProperties";
import PropertyCard from "@/components/properties/PropertyCard";

export default function FeaturedProperties() {
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProperties() {
      const data = await getFeaturedProperties();

      setProperties(data);
      setLoading(false);
    }

    loadProperties();
  }, []);

  return (
    <section className="bg-white py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-12">

          <div>
            <span className="text-[#B8922E] font-semibold uppercase tracking-wider text-sm">
              Featured Listings
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1F3A] mt-3">
              Featured Properties
            </h2>

            <p className="text-gray-600 mt-3 text-lg">
              Discover some of the latest properties available on PaujaRealtyHub.
            </p>
          </div>

          <a
            href="/properties"
            className="inline-flex items-center justify-center bg-[#08192E] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
          >
            View All Properties →
          </a>

        </div>

        {loading ? (
          <div className="bg-[#F7F7F3] rounded-2xl py-16 text-center text-gray-500">
            Loading properties...
          </div>
        ) : properties.length === 0 ? (
          <div className="bg-[#F7F7F3] rounded-2xl py-16 text-center">
            <h3 className="text-xl font-bold text-[#0B1F3A]">
              No properties available yet
            </h3>

            <p className="text-gray-500 mt-2">
              Published properties will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {properties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}