import PropertyCard from "./PropertyCard";
import { properties } from "@/data/properties";

type PropertyGridProps = {
  searchTerm?: string;
  selectedType?: string;
  sortOption?: string;
};

export default function PropertyGrid({
  searchTerm = "",
  selectedType = "",
  sortOption = "default",
}: PropertyGridProps) {
  let filteredProperties = properties.filter((property) => {
    // Hide featured properties since they appear above
    if (property.featured) return false;

    const search = searchTerm.toLowerCase();

    const matchesSearch =
      property.title.toLowerCase().includes(search) ||
      property.location.toLowerCase().includes(search) ||
      property.type.toLowerCase().includes(search) ||
      property.status.toLowerCase().includes(search);

    const matchesType =
      selectedType === "" || property.type === selectedType;

    return matchesSearch && matchesType;
  });

  // Sorting
  switch (sortOption) {
    case "price-low":
      filteredProperties.sort(
        (a, b) =>
          Number(a.price.replace(/[^0-9]/g, "")) -
          Number(b.price.replace(/[^0-9]/g, ""))
      );
      break;

    case "price-high":
      filteredProperties.sort(
        (a, b) =>
          Number(b.price.replace(/[^0-9]/g, "")) -
          Number(a.price.replace(/[^0-9]/g, ""))
      );
      break;

    case "featured":
      filteredProperties.sort(
        (a, b) => Number(b.featured) - Number(a.featured)
      );
      break;

    default:
      break;
  }

  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-7xl mx-auto px-6">

        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-900">
            Browse All Properties
          </h2>

          <p className="text-gray-600 mt-2">
            Explore every available property on PaujaRealtyHub.
          </p>
        </div>

        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {filteredProperties.length > 0 ? (
            filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
              />
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <h2 className="text-3xl font-bold text-gray-700">
                No properties found
              </h2>

              <p className="mt-4 text-gray-500">
                Try changing your search or filters.
              </p>
            </div>
          )}
        </div>

      </div>
    </section>
  );
}