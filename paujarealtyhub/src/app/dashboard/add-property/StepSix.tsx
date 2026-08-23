type StepSixProps = {
  title: string;
  propertyType: string;
  listingType: string;
  price: string;
  city: string;
  propertyState: string;
  country: string;
  address: string;

  bedrooms: string;
  bathrooms: string;
  toilets: string;
  parking: string;
  size: string;
  furnishing: string;

  images: File[];
  video: File | null;
};

export default function StepSix({
  title,
  propertyType,
  listingType,
  price,
  city,
  propertyState,
  country,
  address,
  bedrooms,
  bathrooms,
  toilets,
  parking,
  size,
  furnishing,
  images,
  video,
}: StepSixProps) {
  const readyToPublish =
    title.trim() !== "" &&
    price.trim() !== "" &&
    address.trim() !== "" &&
    images.length > 0;

  return (
    <div className="space-y-8">

      {/* HEADING */}
      <div>
        <span className="text-[#B8922E] text-xs font-semibold uppercase tracking-wider">
          Step 6
        </span>

        <h2 className="text-2xl font-bold text-[#0B1F3A] mt-1">
          Review & Publish
        </h2>

        <p className="text-gray-500 mt-2">
          Review your property information before publishing the listing.
        </p>
      </div>

      {/* LISTING SUMMARY */}
      <section className="rounded-2xl border border-gray-100 p-6 bg-[#FAFAF8]">

        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 rounded-xl bg-[#08192E] text-[#C9A227] flex items-center justify-center">
            🏠
          </div>

          <h3 className="font-bold text-xl text-[#0B1F3A]">
            Listing Summary
          </h3>

        </div>

        <div className="grid sm:grid-cols-2 gap-5">

          <Info
            label="Title"
            value={title}
          />

          <Info
            label="Property Type"
            value={propertyType}
          />

          <Info
            label="Listing Type"
            value={listingType}
          />

          <Info
            label="Price"
            value={
              price
                ? `₦${price}`
                : "-"
            }
          />

          <Info
            label="Bedrooms"
            value={bedrooms}
          />

          <Info
            label="Bathrooms"
            value={bathrooms}
          />

          <Info
            label="Toilets"
            value={toilets}
          />

          <Info
            label="Parking"
            value={parking}
          />

          <Info
            label="Size"
            value={
              size
                ? `${size} sqm`
                : "-"
            }
          />

          <Info
            label="Furnishing"
            value={furnishing}
          />

        </div>

      </section>

      {/* LOCATION */}
      <section className="rounded-2xl border border-gray-100 p-6 bg-[#FAFAF8]">

        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 rounded-xl bg-[#08192E] text-[#C9A227] flex items-center justify-center">
            📍
          </div>

          <h3 className="font-bold text-xl text-[#0B1F3A]">
            Location
          </h3>

        </div>

        <div className="grid sm:grid-cols-2 gap-5">

          <Info
            label="Country"
            value={country}
          />

          <Info
            label="State"
            value={propertyState}
          />

          <Info
            label="City / Area"
            value={city}
          />

          <Info
            label="Address"
            value={address}
          />

        </div>

      </section>

      {/* MEDIA */}
      <section className="rounded-2xl border border-gray-100 p-6 bg-[#FAFAF8]">

        <div className="flex items-center gap-3 mb-6">

          <div className="w-10 h-10 rounded-xl bg-[#08192E] text-[#C9A227] flex items-center justify-center">
            📷
          </div>

          <h3 className="font-bold text-xl text-[#0B1F3A]">
            Media
          </h3>

        </div>

        <div className="grid sm:grid-cols-2 gap-5">

          <Info
            label="Images Uploaded"
            value={String(
              images.length
            )}
          />

          <Info
            label="Property Video"
            value={
              video
                ? "Attached"
                : "Not Attached"
            }
          />

        </div>

        {images.length > 0 && (
          <div className="mt-6">

            <p className="text-sm text-gray-500 mb-3">
              Image Preview
            </p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">

              {images
                .slice(0, 4)
                .map(
                  (
                    image,
                    index
                  ) => (
                    <div
                      key={index}
                      className="relative h-24 rounded-xl overflow-hidden border border-gray-200"
                    >

                      <img
                        src={URL.createObjectURL(
                          image
                        )}
                        alt={`Property preview ${
                          index + 1
                        }`}
                        className="w-full h-full object-cover"
                      />

                      {index === 0 && (
                        <span className="absolute bottom-1 left-1 bg-[#C9A227] text-[#08192E] text-[10px] font-bold px-2 py-1 rounded">
                          Cover
                        </span>
                      )}

                    </div>
                  )
                )}

            </div>

          </div>
        )}

      </section>

      {/* VALIDATION */}
      <section
        className={`rounded-2xl border p-6 ${
          readyToPublish
            ? "bg-green-50 border-green-200"
            : "bg-amber-50 border-amber-200"
        }`}
      >

        <div className="flex items-center justify-between gap-4 mb-5">

          <h3 className="font-bold text-xl text-[#0B1F3A]">
            Listing Check
          </h3>

          <span
            className={`text-xs font-bold px-3 py-1 rounded-full ${
              readyToPublish
                ? "bg-green-100 text-green-700"
                : "bg-amber-100 text-amber-700"
            }`}
          >
            {readyToPublish
              ? "READY"
              : "CHECK DETAILS"}
          </span>

        </div>

        <ul className="space-y-3">

          <Check
            text="Listing Title"
            ok={title.trim() !== ""}
          />

          <Check
            text="Price"
            ok={price.trim() !== ""}
          />

          <Check
            text="Property Address"
            ok={address.trim() !== ""}
          />

          <Check
            text="Property Images"
            ok={images.length > 0}
          />

          <Check
            text="State"
            ok={
              propertyState.trim() !==
              ""
            }
          />

          <Check
            text="City / Area"
            ok={city.trim() !== ""}
          />

        </ul>

      </section>

      {/* FINAL MESSAGE */}
      <div className="bg-[#08192E] rounded-2xl p-6 text-white">

        <div className="flex gap-4">

          <div className="text-3xl">
            ✓
          </div>

          <div>
            <h3 className="font-bold text-lg text-[#C9A227]">
              Final Step
            </h3>

            <p className="text-gray-300 mt-1 leading-6">
              Review the information above. When everything is correct,
              use the Publish Property button below to make your listing
              available on PaujaRealtyHub.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
}

function Info({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4">

      <p className="text-xs uppercase tracking-wide text-gray-400 font-semibold">
        {label}
      </p>

      <p className="font-semibold text-[#0B1F3A] mt-2 break-words">
        {value || "-"}
      </p>

    </div>
  );
}

function Check({
  text,
  ok,
}: {
  text: string;
  ok: boolean;
}) {
  return (
    <li
      className={`flex items-center gap-3 font-medium ${
        ok
          ? "text-green-700"
          : "text-red-600"
      }`}
    >
      <span
        className={`w-7 h-7 rounded-full flex items-center justify-center text-sm ${
          ok
            ? "bg-green-100"
            : "bg-red-100"
        }`}
      >
        {ok ? "✓" : "×"}
      </span>

      {text}
    </li>
  );
}