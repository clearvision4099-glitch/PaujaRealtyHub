type StepThreeProps = {
  bedrooms: string;
  setBedrooms: (value: string) => void;

  bathrooms: string;
  setBathrooms: (value: string) => void;

  toilets: string;
  setToilets: (value: string) => void;

  parking: string;
  setParking: (value: string) => void;

  size: string;
  setSize: (value: string) => void;

  furnishing: string;
  setFurnishing: (value: string) => void;
};

export default function StepThree({
  bedrooms,
  setBedrooms,
  bathrooms,
  setBathrooms,
  toilets,
  setToilets,
  parking,
  setParking,
  size,
  setSize,
  furnishing,
  setFurnishing,
}: StepThreeProps) {
  const handleSizeChange = (value: string) => {
    const numbers = value.replace(/\D/g, "");
    setSize(numbers);
  };

  const inputStyle =
    "w-full border border-gray-200 rounded-xl p-4 bg-[#FAFAF8] text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition";

  return (
    <div className="space-y-7">

      <div>
        <span className="text-[#B8922E] text-xs font-semibold uppercase tracking-wider">
          Step 3
        </span>

        <h2 className="text-2xl font-bold text-[#0B1F3A] mt-1">
          Property Features
        </h2>

        <p className="text-gray-500 mt-2">
          Enter the main physical features of the property.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">

        <div>
          <label className="block mb-2 font-semibold text-[#0B1F3A]">
            Bedrooms
          </label>

          <input
            type="number"
            min="0"
            value={bedrooms}
            onChange={(e) =>
              setBedrooms(e.target.value)
            }
            className={inputStyle}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-[#0B1F3A]">
            Bathrooms
          </label>

          <input
            type="number"
            min="0"
            value={bathrooms}
            onChange={(e) =>
              setBathrooms(e.target.value)
            }
            className={inputStyle}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-[#0B1F3A]">
            Toilets
          </label>

          <input
            type="number"
            min="0"
            value={toilets}
            onChange={(e) =>
              setToilets(e.target.value)
            }
            className={inputStyle}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-[#0B1F3A]">
            Parking Spaces
          </label>

          <input
            type="number"
            min="0"
            value={parking}
            onChange={(e) =>
              setParking(e.target.value)
            }
            className={inputStyle}
          />
        </div>

        <div>
          <label className="block mb-2 font-semibold text-[#0B1F3A]">
            Property Size
          </label>

          <div className="relative">
            <input
              type="text"
              value={size}
              onChange={(e) =>
                handleSizeChange(e.target.value)
              }
              placeholder="450"
              className={`${inputStyle} pr-20`}
            />

            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B8922E] font-semibold">
              sqm
            </span>
          </div>
        </div>

        <div>
          <label className="block mb-2 font-semibold text-[#0B1F3A]">
            Furnishing
          </label>

          <select
            value={furnishing}
            onChange={(e) =>
              setFurnishing(e.target.value)
            }
            className={inputStyle}
          >
            <option value="">Select</option>
            <option>Furnished</option>
            <option>Semi Furnished</option>
            <option>Unfurnished</option>
          </select>
        </div>

      </div>

    </div>
  );
}