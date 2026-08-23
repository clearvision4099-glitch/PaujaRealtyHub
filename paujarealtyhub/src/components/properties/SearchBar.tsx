"use client";

import type {
  Dispatch,
  SetStateAction,
} from "react";

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: Dispatch<
    SetStateAction<string>
  >;
};

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {
  function clearSearch() {
    setSearchTerm("");
  }

  return (
    <section className="bg-[#F7F7F3] pt-10 pb-5">
      <div className="max-w-7xl mx-auto px-6">

        <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-5 md:p-6">

          <div className="flex items-center gap-3 mb-4">
            <div className="w-1 h-7 bg-[#C9A227] rounded-full" />

            <div>
              <h2 className="font-bold text-[#0B1F3A]">
                Search Properties
              </h2>

              <p className="text-sm text-gray-500">
                Search by property name or location
              </p>
            </div>
          </div>

          <div className="relative">

            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">
              🔎
            </span>

            <input
              type="text"
              placeholder="Search property name, city, hotel, short let..."
              value={searchTerm}
              onChange={(e) =>
                setSearchTerm(e.target.value)
              }
              className="w-full border border-gray-200 rounded-xl pl-12 pr-28 py-4 text-[#0B1F3A] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition"
            />

            {searchTerm && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-[#B8922E] hover:text-[#08192E] transition"
              >
                Clear
              </button>
            )}

          </div>

        </div>

      </div>
    </section>
  );
}