type StepTwoProps = {
  description: string;
  setDescription: (value: string) => void;

  price: string;
  setPrice: (value: string) => void;
};

export default function StepTwo({
  description,
  setDescription,
  price,
  setPrice,
}: StepTwoProps) {
  const handlePriceChange = (value: string) => {
    const numbers = value.replace(/\D/g, "");

    if (numbers === "") {
      setPrice("");
      return;
    }

    const formatted =
      Number(numbers).toLocaleString("en-US");

    setPrice(formatted);
  };

  const inputStyle =
    "w-full border border-gray-200 rounded-xl p-4 bg-[#FAFAF8] text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition";

  return (
    <div className="space-y-8">

      <div>
        <span className="text-[#B8922E] text-xs font-semibold uppercase tracking-wider">
          Step 2
        </span>

        <h2 className="text-2xl font-bold text-[#0B1F3A] mt-1">
          Property Details
        </h2>

        <p className="text-gray-500 mt-2">
          Enter the property price and provide a clear description.
        </p>
      </div>

      <div>
        <label className="block mb-2 font-semibold text-[#0B1F3A]">
          Property Price
        </label>

        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8922E] font-bold text-lg">
            ₦
          </span>

          <input
            type="text"
            inputMode="numeric"
            value={price}
            onChange={(e) =>
              handlePriceChange(e.target.value)
            }
            placeholder="25,000,000"
            className={`${inputStyle} pl-10 text-lg font-semibold`}
          />
        </div>

        <p className="text-xs text-gray-400 mt-2">
          Enter the full asking price for the property.
        </p>
      </div>

      <div>
        <label className="block mb-2 font-semibold text-[#0B1F3A]">
          Property Description
        </label>

        <textarea
          rows={8}
          value={description}
          onChange={(e) =>
            setDescription(e.target.value)
          }
          placeholder="Describe the property in detail. Mention its condition, surroundings, nearby landmarks, unique selling points, and any other information that will help buyers or tenants."
          className={`${inputStyle} resize-none leading-7`}
        />

        <p className="text-xs text-gray-400 mt-2">
          A detailed description helps buyers and renters understand the property before contacting you.
        </p>
      </div>

    </div>
  );
}