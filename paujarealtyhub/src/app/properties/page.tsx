"use client";

import { useState } from "react";
import PropertyHero from "@/components/properties/PropertyHero";
import SearchBar from "@/components/properties/SearchBar";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyGrid from "@/components/properties/PropertyGrid";

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <>
      <PropertyHero />

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <PropertyFilters />

      <PropertyGrid />
    </>
  );
}