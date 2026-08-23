"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";

type PropertyFiltersProps = {
  selectedState: string;
  setSelectedState: (value: string) => void;

  selectedCity: string;
  setSelectedCity: (value: string) => void;

  selectedType: string;
  setSelectedType: (value: string) => void;

  listingType: string;
  setListingType: (value: string) => void;

  minPrice: string;
  setMinPrice: (value: string) => void;

  maxPrice: string;
  setMaxPrice: (value: string) => void;

  sortOption: string;
  setSortOption: (value: string) => void;
};

export default function PropertyFilters({
  selectedState,
  setSelectedState,
  selectedCity,
  setSelectedCity,
  selectedType,
  setSelectedType,
  listingType,
  setListingType,
  minPrice,
  setMinPrice,
  maxPrice,
  setMaxPrice,
  sortOption,
  setSortOption,
}: PropertyFiltersProps) {
  const [locations, setLocations] = useState<
    { state: string; city: string }[]
  >([]);

  useEffect(() => {
    loadLocations();
  }, []);

  async function loadLocations() {
    const { data, error } = await supabase
      .from("properties")
      .select("state, city")
      .eq("status", "Published")
      .not("state", "is", null)
      .not("city", "is", null);

    if (error) {
      console.error(
        "LOAD LOCATIONS ERROR:",
        error
      );
      return;
    }

    setLocations(
      (data || []).filter(
        (item) =>
          item.state?.trim() &&
          item.city?.trim()
      )
    );
  }

  const states = useMemo(() => {
    return Array.from(
      new Set(
        locations
          .map((item) =>
            item.state.trim()
          )
          .filter(Boolean)
      )
    ).sort();
  }, [locations]);

  const cities = useMemo(() => {
    if (!selectedState) return [];

    return Array.from(
      new Set(
        locations
          .filter(
            (item) =>
              item.state
                .trim()
                .toLowerCase() ===
              selectedState
                .trim()
                .toLowerCase()
          )
          .map((item) =>
            item.city.trim()
          )
          .filter(Boolean)
      )
    ).sort();
  }, [locations, selectedState]);

  function handleStateChange(
    value: string
  ) {
    setSelectedState(value);
    setSelectedCity("");
  }

  function clearFilters() {
    setSelectedState("");
    setSelectedCity("");
    setSelectedType("");
    setListingType("");
    setMinPrice("");
    setMaxPrice("");
    setSortOption("default");
  }

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 bg-[#FAFAF8] text-[#0B1F3A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition";

  return (
    <section className="bg-[#F7F7F3] pb-10">
      <div className="max-w-7xl mx-auto px-6">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6">

          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">

            <div>
              <span className="text-[#B8922E] font-semibold uppercase tracking-wider text-xs">
                Refine Results
              </span>

              <h2 className="text-2xl font-bold text-[#0B1F3A] mt-1">
                Property Filters
              </h2>
            </div>

            <button
              type="button"
              onClick={clearFilters}
              className="self-start md:self-auto border border-[#C9A227]/40 text-[#9A7720] px-5 py-2 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
            >
              Clear Filters
            </button>

          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">

            <select
              value={selectedState}
              onChange={(e) =>
                handleStateChange(
                  e.target.value
                )
              }
              className={inputClass}
            >
              <option value="">
                All States
              </option>

              {states.map((state) => (
                <option
                  key={state}
                  value={state}
                >
                  {state}
                </option>
              ))}
            </select>

            <select
              value={selectedCity}
              onChange={(e) =>
                setSelectedCity(
                  e.target.value
                )
              }
              disabled={!selectedState}
              className={`${inputClass} disabled:bg-gray-100 disabled:text-gray-400`}
            >
              <option value="">
                {selectedState
                  ? "All Cities"
                  : "Select a state first"}
              </option>

              {cities.map((city) => (
                <option
                  key={city}
                  value={city}
                >
                  {city}
                </option>
              ))}
            </select>

            <select
              value={selectedType}
              onChange={(e) =>
                setSelectedType(
                  e.target.value
                )
              }
              className={inputClass}
            >
              <option value="">
                All Property Types
              </option>

              <option value="Apartment">
                Apartment
              </option>

              <option value="Villa">
                Villa
              </option>

              <option value="House">
                House
              </option>

              <option value="Hotel">
                Hotel
              </option>

              <option value="Short Let">
                Short Let
              </option>

              <option value="Commercial">
                Commercial
              </option>

              <option value="Land">
                Land
              </option>

              <option value="Event Centre">
                Event Centre
              </option>

              <option value="Airbnb">
                Airbnb
              </option>
            </select>

            <select
              value={listingType}
              onChange={(e) =>
                setListingType(
                  e.target.value
                )
              }
              className={inputClass}
            >
              <option value="">
                Buy or Rent
              </option>

              <option value="Sale">
                For Sale
              </option>

              <option value="Rent">
                For Rent
              </option>

              <option value="Short Let">
                Short Let
              </option>
            </select>

            <input
              type="number"
              min="0"
              placeholder="Minimum Price"
              value={minPrice}
              onChange={(e) =>
                setMinPrice(
                  e.target.value
                )
              }
              className={inputClass}
            />

            <input
              type="number"
              min="0"
              placeholder="Maximum Price"
              value={maxPrice}
              onChange={(e) =>
                setMaxPrice(
                  e.target.value
                )
              }
              className={inputClass}
            />

            <select
              value={sortOption}
              onChange={(e) =>
                setSortOption(
                  e.target.value
                )
              }
              className={inputClass}
            >
              <option value="default">
                Sort By
              </option>

              <option value="price-low">
                Price: Low → High
              </option>

              <option value="price-high">
                Price: High → Low
              </option>

              <option value="newest">
                Newest First
              </option>
            </select>

            <div className="rounded-xl bg-[#08192E] text-white px-4 py-3 flex items-center justify-center text-sm font-semibold">
              Search updates automatically
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}