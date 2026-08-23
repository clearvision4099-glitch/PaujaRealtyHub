type StepOneProps = {
  title: string;
  setTitle: (value: string) => void;

  listingType: string;
  setListingType: (value: string) => void;

  propertyType: string;
  setPropertyType: (value: string) => void;
};

export default function StepOne({
  title,
  setTitle,
  listingType,
  setListingType,
  propertyType,
  setPropertyType,
}: StepOneProps) {
  const inputStyle =
    "w-full border border-gray-200 rounded-xl p-4 bg-[#FAFAF8] text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition";

  return (
    <div className="space-y-7">

      {/* STEP HEADING */}
      <div>
        <span className="text-[#B8922E] text-xs font-semibold uppercase tracking-wider">
          Step 1
        </span>

        <h2 className="text-2xl font-bold text-[#0B1F3A] mt-1">
          Listing Information
        </h2>

        <p className="text-gray-500 mt-2">
          Start by entering the basic information about your property.
        </p>
      </div>

      {/* TITLE */}
      <div>
        <label className="block mb-2 font-semibold text-[#0B1F3A]">
          Listing Title
        </label>

        <input
          type="text"
          value={title}
          onChange={(e) =>
            setTitle(e.target.value)
          }
          placeholder="e.g. Luxury 4 Bedroom Duplex in Lekki"
          className={inputStyle}
        />

        <p className="text-xs text-gray-400 mt-2">
          Use a clear and descriptive title that helps buyers or renters
          understand the property.
        </p>
      </div>

      {/* TYPES */}
      <div className="grid md:grid-cols-2 gap-6">

        {/* LISTING TYPE */}
        <div>
          <label className="block mb-2 font-semibold text-[#0B1F3A]">
            Listing Type
          </label>

          <select
            value={listingType}
            onChange={(e) =>
              setListingType(e.target.value)
            }
            className={inputStyle}
          >
            <option>Sale</option>
            <option>Rent</option>
            <option>Lease</option>
            <option>Short Let</option>
            <option>Auction</option>
            <option>Joint Venture</option>
          </select>

          <p className="text-xs text-gray-400 mt-2">
            Select how the property is being offered.
          </p>
        </div>

        {/* PROPERTY TYPE */}
        <div>
          <label className="block mb-2 font-semibold text-[#0B1F3A]">
            Property Type
          </label>

          <select
            value={propertyType}
            onChange={(e) =>
              setPropertyType(e.target.value)
            }
            className={inputStyle}
          >
            <option>Apartment</option>
            <option>House</option>
            <option>Duplex</option>
            <option>Villa</option>
            <option>Bungalow</option>
            <option>Terrace</option>
            <option>Land</option>
            <option>Commercial Property</option>
            <option>Office Space</option>
            <option>Warehouse</option>
            <option>Shop</option>
            <option>Hotel</option>
            <option>Event Centre</option>
          </select>

          <p className="text-xs text-gray-400 mt-2">
            Choose the category that best describes the property.
          </p>
        </div>

      </div>

    </div>
  );
}