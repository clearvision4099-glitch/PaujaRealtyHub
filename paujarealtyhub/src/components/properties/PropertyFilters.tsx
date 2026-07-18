type PropertyFiltersProps = {
  selectedType: string;
  setSelectedType: (value: string) => void;
  sortOption: string;
  setSortOption: (value: string) => void;
};

export default function PropertyFilters({
  selectedType,
  setSelectedType,
  sortOption,
  setSortOption,
}: PropertyFiltersProps) {
  return (
    <section className="py-8 bg-white border-b">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-4">

        <select
          value={selectedType}
          onChange={(e) => setSelectedType(e.target.value)}
          className="border rounded-lg px-4 py-3"
        >
          <option value="">All Types</option>
          <option value="Apartment">Apartment</option>
          <option value="Villa">Villa</option>
          <option value="House">House</option>
          <option value="Hotel">Hotel</option>
          <option value="Short Let">Short Let</option>
          <option value="Commercial">Commercial</option>
          <option value="Land">Land</option>
        </select>

        <select
          value={sortOption}
          onChange={(e) => setSortOption(e.target.value)}
          className="border rounded-lg px-4 py-3"
        >
          <option value="default">Sort By</option>
          <option value="price-low">Price: Low → High</option>
          <option value="price-high">Price: High → Low</option>
          <option value="featured">Featured First</option>
        </select>

      </div>
    </section>
  );
}