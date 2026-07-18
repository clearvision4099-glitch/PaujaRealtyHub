"use client";

import { useState } from "react";

import PropertyHero from "@/components/properties/PropertyHero";
import SearchBar from "@/components/properties/SearchBar";
import PropertyFilters from "@/components/properties/PropertyFilters";
import FeaturedProperties from "@/components/properties/FeaturedProperties";
import PropertyGrid from "@/components/properties/PropertyGrid";

export default function PropertiesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("");
  const [sortOption, setSortOption] = useState("default");

  return (
    <>
      <PropertyHero />

      <SearchBar
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      <PropertyFilters
        selectedType={selectedType}
        setSelectedType={setSelectedType}
        sortOption={sortOption}
        setSortOption={setSortOption}
      />

      <FeaturedProperties />

      <PropertyGrid
        searchTerm={searchTerm}
        selectedType={selectedType}
      />
    </>
  );
}