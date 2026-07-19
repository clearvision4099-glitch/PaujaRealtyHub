import PropertyCard from "./PropertyCard";
import { properties } from "@/data/properties";

export default function SimilarProperties() {
  const similarProperties = properties.slice(0, 3);

  return (
    <section className="mt-16">

      <h2 className="text-3xl font-bold mb-8">
        Similar Properties
      </h2>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

        {similarProperties.map((property) => (
          <PropertyCard
            key={property.id}
            property={property}
          />
        ))}

      </div>

    </section>
  );
}