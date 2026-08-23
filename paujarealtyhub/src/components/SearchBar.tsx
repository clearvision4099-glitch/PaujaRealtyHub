"use client";

import { useState } from "react";

export default function SearchBar({
  onSearch,
}: {
  onSearch: (filters: any) => void;
}) {
  const [keyword, setKeyword] = useState("");
  const [state, setState] = useState("");
  const [city, setCity] = useState("");
  const [type, setType] = useState("");
  const [listing, setListing] = useState("");

  return (
    <div className="bg-white rounded-xl shadow p-6 grid md:grid-cols-6 gap-4">

      <input
        placeholder="Keyword"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
        className="border rounded-lg p-3"
      />

      <input
        placeholder="State"
        value={state}
        onChange={(e) => setState(e.target.value)}
        className="border rounded-lg p-3"
      />

      <input
        placeholder="City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="border rounded-lg p-3"
      />

      <select
        value={type}
        onChange={(e) => setType(e.target.value)}
        className="border rounded-lg p-3"
      >
        <option value="">Property Type</option>
        <option>House</option>
        <option>Apartment</option>
        <option>Land</option>
        <option>Commercial Property</option>
      </select>

      <select
        value={listing}
        onChange={(e) => setListing(e.target.value)}
        className="border rounded-lg p-3"
      >
        <option value="">Listing Type</option>
        <option>Sale</option>
        <option>Rent</option>
      </select>

      <button
        onClick={() =>
          onSearch({
            keyword,
            state,
            city,
            type,
            listing,
          })
        }
        className="bg-blue-700 text-white rounded-lg"
      >
        Search
      </button>

    </div>
  );
}