export default function ListingHeader() {
  return (
    <div className="bg-[#F9F8F3] rounded-2xl border border-[#C9A227]/20 p-6 mb-8">

      <div className="flex items-start gap-4">

        <div className="w-12 h-12 shrink-0 rounded-xl bg-[#08192E] text-[#C9A227] flex items-center justify-center text-2xl">
          🏠
        </div>

        <div>
          <span className="text-[#B8922E] text-xs font-semibold uppercase tracking-wider">
            New Property Listing
          </span>

          <h2 className="text-3xl font-bold text-[#0B1F3A] mt-1">
            Create New Listing
          </h2>

          <p className="text-gray-600 mt-2 leading-7">
            List residential, commercial, hospitality and land
            properties professionally on PaujaRealtyHub.
          </p>
        </div>

      </div>

    </div>
  );
}