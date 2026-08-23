"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Hero() {
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState("");
  const [propertyType, setPropertyType] = useState("");
  const [listingType, setListingType] = useState("");

  function handleSearch() {
    const params = new URLSearchParams();

    if (searchTerm.trim()) {
      params.set("search", searchTerm.trim());
    }

    if (propertyType) {
      params.set("type", propertyType);
    }

    if (listingType) {
      params.set("listing", listingType);
    }

    const query = params.toString();

    router.push(
      query
        ? `/properties?${query}`
        : "/properties"
    );
  }

  function handleKeyDown(
    e: React.KeyboardEvent<HTMLInputElement>
  ) {
    if (e.key === "Enter") {
      handleSearch();
    }
  }

  return (
    <section className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-700 text-white">

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 sm:py-16 md:py-24">

        {/* HERO CONTENT */}

        <div className="max-w-4xl">

          <span className="inline-block bg-blue-600/40 border border-blue-300/20 px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm font-semibold text-blue-100">
            Nigeria&apos;s Trusted Property Marketplace
          </span>

          <h1 className="mt-4 sm:mt-6 text-3xl sm:text-4xl md:text-6xl font-extrabold leading-tight">
            Find Verified Properties
            <br className="hidden sm:block" />
            <span className="sm:hidden"> </span>
            Across Nigeria
          </h1>

          <p className="mt-4 sm:mt-6 text-base sm:text-lg md:text-xl text-blue-100 leading-7 sm:leading-8 max-w-3xl">
            Buy, rent or invest with confidence. Discover verified
            properties from trusted agents, developers and property
            owners nationwide.
          </p>

        </div>

        {/* SEARCH PANEL */}

        <div className="mt-8 sm:mt-10 md:mt-12 bg-white rounded-2xl shadow-2xl p-4 sm:p-6 text-[#0B1F3A]">

          <div className="mb-5">

            <span className="text-[#B8922E] text-xs font-bold uppercase tracking-widest">
              Property Search
            </span>

            <h2 className="text-xl sm:text-2xl font-bold mt-1">
              Find your next property
            </h2>

          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-3 sm:gap-4">

            {/* SEARCH */}

            <div className="md:col-span-2">

              <label className="block text-sm font-semibold mb-2">
                Location or property
              </label>

              <input
                type="text"
                value={searchTerm}
                onChange={(e) =>
                  setSearchTerm(e.target.value)
                }
                onKeyDown={handleKeyDown}
                placeholder="e.g. Lekki, hotel, apartment..."
                className="w-full border border-gray-200 bg-[#FAFAF8] rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent"
              />

            </div>

            {/* PROPERTY TYPE */}

            <div>

              <label className="block text-sm font-semibold mb-2">
                Property Type
              </label>

              <select
                value={propertyType}
                onChange={(e) =>
                  setPropertyType(e.target.value)
                }
                className="w-full border border-gray-200 bg-[#FAFAF8] rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              >
                <option value="">
                  All Types
                </option>

                <option value="Apartment">
                  Apartment
                </option>

                <option value="House">
                  House
                </option>

                <option value="Duplex">
                  Duplex
                </option>

                <option value="Villa">
                  Villa
                </option>

                <option value="Bungalow">
                  Bungalow
                </option>

                <option value="Land">
                  Land
                </option>

                <option value="Commercial Property">
                  Commercial
                </option>

                <option value="Office Space">
                  Office Space
                </option>

                <option value="Warehouse">
                  Warehouse
                </option>

                <option value="Hotel">
                  Hotel
                </option>

                <option value="Event Centre">
                  Event Centre
                </option>
              </select>

            </div>

            {/* LISTING TYPE */}

            <div>

              <label className="block text-sm font-semibold mb-2">
                Buy or Rent
              </label>

              <select
                value={listingType}
                onChange={(e) =>
                  setListingType(e.target.value)
                }
                className="w-full border border-gray-200 bg-[#FAFAF8] rounded-xl px-4 py-3 text-sm sm:text-base focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              >
                <option value="">
                  Any Listing
                </option>

                <option value="Sale">
                  For Sale
                </option>

                <option value="Rent">
                  For Rent
                </option>

                <option value="Lease">
                  Lease
                </option>

                <option value="Short Let">
                  Short Let
                </option>

                <option value="Auction">
                  Auction
                </option>

                <option value="Joint Venture">
                  Joint Venture
                </option>
              </select>

            </div>

          </div>

          {/* SEARCH BUTTON */}

          <div className="mt-4 sm:mt-5">

            <button
              type="button"
              onClick={handleSearch}
              className="w-full sm:w-auto bg-[#C9A227] text-[#08192E] px-7 py-3 rounded-xl font-bold hover:brightness-110 transition"
            >
              🔎 Search Properties
            </button>

          </div>

        </div>

        {/* QUICK BENEFITS */}

        <div className="mt-7 sm:mt-9 flex flex-col sm:flex-row sm:flex-wrap gap-3 sm:gap-6 text-sm sm:text-base text-blue-100">

          <span>
            ✓ Properties for Sale
          </span>

          <span>
            ✓ Properties for Rent
          </span>

          <span>
            ✓ Investment Opportunities
          </span>

        </div>

      </div>

    </section>
  );
}