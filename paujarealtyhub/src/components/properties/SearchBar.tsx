"use client";

import type { Dispatch, SetStateAction } from "react";

type SearchBarProps = {
  searchTerm: string;
  setSearchTerm: Dispatch<SetStateAction<string>>;
};

export default function SearchBar({
  searchTerm,
  setSearchTerm,
}: SearchBarProps) {
  return (
    <section className="bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-6">
        <div className="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Search by property name, city, hotel, or short let..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1 border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-700"
          />

          <button
            type="button"
            className="bg-blue-700 text-white px-8 py-3 rounded-lg hover:bg-blue-800"
          >
            Search
          </button>
        </div>
      </div>
    </section>
  );
}