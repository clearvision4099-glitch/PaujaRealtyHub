type PropertyFiltersProps = {
  selectedType: string;
  setSelectedType: React.Dispatch<React.SetStateAction<string>>;
};

export default function PropertyFilters({
  selectedType,
  setSelectedType,
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

        <select className="border rounded-lg px-4 py-3">
          <option>All Status</option>
          <option>For Sale</option>
          <option>For Rent</option>
          <option>Lease</option>
        </select>

        <select className="border rounded-lg px-4 py-3">
          <option>Bedrooms</option>
          <option>1+</option>
          <option>2+</option>
          <option>3+</option>
          <option>4+</option>
          <option>5+</option>
        </select>

      </div>
    </section>
  );
}