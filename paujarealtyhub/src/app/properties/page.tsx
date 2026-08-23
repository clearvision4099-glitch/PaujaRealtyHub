"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import { useSearchParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import PropertyHero from "@/components/properties/PropertyHero";
import SearchBar from "@/components/properties/SearchBar";
import PropertyFilters from "@/components/properties/PropertyFilters";
import PropertyGrid from "@/components/properties/PropertyGrid";

function PropertiesContent() {
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] =
    useState("");

  const [
    selectedState,
    setSelectedState,
  ] = useState("");

  const [
    selectedCity,
    setSelectedCity,
  ] = useState("");

  const [
    selectedType,
    setSelectedType,
  ] = useState("");

  const [
    listingType,
    setListingType,
  ] = useState("");

  const [
    minPrice,
    setMinPrice,
  ] = useState("");

  const [
    maxPrice,
    setMaxPrice,
  ] = useState("");

  const [
    sortOption,
    setSortOption,
  ] = useState("default");

  useEffect(() => {
    setSearchTerm(
      searchParams.get("search") || ""
    );

    setSelectedState(
      searchParams.get("state") || ""
    );

    setSelectedCity(
      searchParams.get("city") || ""
    );

    setSelectedType(
      searchParams.get("type") || ""
    );

    setListingType(
      searchParams.get("listing") || ""
    );

    setMinPrice(
      searchParams.get("minPrice") || ""
    );

    setMaxPrice(
      searchParams.get("maxPrice") || ""
    );
  }, [searchParams]);

  return (
    <>
      <Navbar />

      <main className="bg-[#F7F7F3] min-h-screen">
        <PropertyHero />

        <SearchBar
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />

        <PropertyFilters
          selectedState={selectedState}
          setSelectedState={setSelectedState}
          selectedCity={selectedCity}
          setSelectedCity={setSelectedCity}
          selectedType={selectedType}
          setSelectedType={setSelectedType}
          listingType={listingType}
          setListingType={setListingType}
          minPrice={minPrice}
          setMinPrice={setMinPrice}
          maxPrice={maxPrice}
          setMaxPrice={setMaxPrice}
          sortOption={sortOption}
          setSortOption={setSortOption}
        />

        <PropertyGrid
          searchTerm={searchTerm}
          selectedState={selectedState}
          selectedCity={selectedCity}
          selectedType={selectedType}
          listingType={listingType}
          minPrice={minPrice}
          maxPrice={maxPrice}
          sortOption={sortOption}
        />
      </main>

      <Footer />
    </>
  );
}

export default function PropertiesPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#F7F7F3]">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />

            <p className="text-gray-500 mt-4">
              Loading properties...
            </p>
          </div>
        </div>
      }
    >
      <PropertiesContent />
    </Suspense>
  );
}