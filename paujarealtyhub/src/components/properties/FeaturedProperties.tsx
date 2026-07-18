import PropertyCard from "./PropertyCard";
import { properties } from "@/data/properties";

export default function FeaturedProperties() {
  const featuredProperties = properties.filter(
    (property) => property.featured
  );

  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-6">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-4xl font-bold text-gray-900">
              ⭐ Featured Properties
            </h2>

            <p className="text-gray-600 mt-2">
              Discover our hand-picked premium listings.
            </p>
          </div>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {featuredProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
            />
          ))}
        </div>

      </div>
    </section>
  );
}