export default function PropertyFilters() {
  return (
    <section className="bg-gray-50 py-6 border-b">
      <div className="max-w-7xl mx-auto px-6 flex flex-wrap gap-4">
        <button className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-800">
          Buy
        </button>

        <button className="bg-white border px-6 py-2 rounded-lg hover:bg-gray-100">
          Rent
        </button>

        <button className="bg-white border px-6 py-2 rounded-lg hover:bg-gray-100">
          Lease
        </button>
      </div>
    </section>
  );
}