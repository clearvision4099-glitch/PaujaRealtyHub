"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import PropertyCard from "./PropertyCard";
import dynamic from "next/dynamic";

import { supabase } from "@/lib/supabase";

type PropertyGridProps = {
  searchTerm?: string;
  selectedState?: string;
  selectedCity?: string;
  selectedType?: string;
  listingType?: string;
  minPrice?: string;
  maxPrice?: string;
  sortOption?: string;
};
const PropertyMap = dynamic(
  () => import("./PropertyMap"),
  {
    ssr: false,
    loading: () => (
      <div className="bg-white border border-gray-100 rounded-2xl p-12 text-center shadow-sm">
        <div className="w-10 h-10 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />
        <p className="text-gray-500 mt-4">
          Loading map...
        </p>
      </div>
    ),
  }
);

export default function PropertyGrid({
  searchTerm = "",
  selectedState = "",
  selectedCity = "",
  selectedType = "",
  listingType = "",
  minPrice = "",
  maxPrice = "",
  sortOption = "default",
}: PropertyGridProps) {
  const [
    properties,
    setProperties,
  ] = useState<any[]>([]);

  const [
    loading,
    setLoading,
  ] = useState(true);

  const [
    viewMode,
    setViewMode,
  ] = useState<
    "list" | "map"
  >("list");

  /*
  -----------------------------------
  LOAD PUBLISHED PROPERTIES
  -----------------------------------
  */

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      setLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from("properties")
        .select(`
          *,
          property_images (
            id,
            image_url,
            is_cover
          )
        `)
        .eq(
          "status",
          "Published"
        )
        .order(
          "created_at",
          {
            ascending:
              false,
          }
        );

      if (error) {
        throw error;
      }

      const formattedProperties =
        (data || []).map(
          (property) => ({
            ...property,

            property_images: [
              ...(
                property.property_images ||
                []
              ),
            ].sort(
              (
                a: any,
                b: any
              ) =>
                Number(
                  b.is_cover
                ) -
                Number(
                  a.is_cover
                )
            ),
          })
        );

      setProperties(
        formattedProperties
      );
    } catch (error) {
      console.error(
        "LOAD PROPERTIES ERROR:",
        error
      );

      setProperties([]);
    } finally {
      setLoading(false);
    }
  }

  /*
  -----------------------------------
  FILTER + SORT
  -----------------------------------
  */

  const filteredProperties =
    useMemo(() => {
      let filtered = [
        ...properties,
      ];

      const normalizedSearch =
        searchTerm
          .trim()
          .toLowerCase();

      const normalizedState =
        selectedState
          .trim()
          .toLowerCase();

      const normalizedCity =
        selectedCity
          .trim()
          .toLowerCase();

      if (
        normalizedSearch
      ) {
        filtered =
          filtered.filter(
            (property) => {
              return (
                property.title
                  ?.toLowerCase()
                  .includes(
                    normalizedSearch
                  ) ||
                property.description
                  ?.toLowerCase()
                  .includes(
                    normalizedSearch
                  ) ||
                property.city
                  ?.toLowerCase()
                  .includes(
                    normalizedSearch
                  ) ||
                property.state
                  ?.toLowerCase()
                  .includes(
                    normalizedSearch
                  ) ||
                property.property_type
                  ?.toLowerCase()
                  .includes(
                    normalizedSearch
                  ) ||
                property.listing_type
                  ?.toLowerCase()
                  .includes(
                    normalizedSearch
                  )
              );
            }
          );
      }

      if (
        normalizedState
      ) {
        filtered =
          filtered.filter(
            (property) =>
              property.state
                ?.toLowerCase()
                .includes(
                  normalizedState
                )
          );
      }

      if (
        normalizedCity
      ) {
        filtered =
          filtered.filter(
            (property) =>
              property.city
                ?.toLowerCase()
                .includes(
                  normalizedCity
                )
          );
      }

      if (
        selectedType
      ) {
        filtered =
          filtered.filter(
            (property) =>
              property.property_type ===
              selectedType
          );
      }

      if (
        listingType
      ) {
        filtered =
          filtered.filter(
            (property) =>
              property.listing_type ===
              listingType
          );
      }

      if (
        minPrice
      ) {
        filtered =
          filtered.filter(
            (property) =>
              Number(
                property.price ||
                  0
              ) >=
              Number(
                minPrice
              )
          );
      }

      if (
        maxPrice
      ) {
        filtered =
          filtered.filter(
            (property) =>
              Number(
                property.price ||
                  0
              ) <=
              Number(
                maxPrice
              )
          );
      }

      switch (
        sortOption
      ) {
        case "price-low":
          filtered.sort(
            (a, b) =>
              Number(
                a.price ||
                  0
              ) -
              Number(
                b.price ||
                  0
              )
          );
          break;

        case "price-high":
          filtered.sort(
            (a, b) =>
              Number(
                b.price ||
                  0
              ) -
              Number(
                a.price ||
                  0
              )
          );
          break;

        case "newest":
          filtered.sort(
            (a, b) =>
              new Date(
                b.created_at
              ).getTime() -
              new Date(
                a.created_at
              ).getTime()
          );
          break;

        default:
          break;
      }

      return filtered;
    }, [
      properties,
      searchTerm,
      selectedState,
      selectedCity,
      selectedType,
      listingType,
      minPrice,
      maxPrice,
      sortOption,
    ]);

  /*
  -----------------------------------
  MAP COUNT
  -----------------------------------
  */

  const mappedCount =
    filteredProperties.filter(
      (property) =>
        property.latitude !==
          null &&
        property.longitude !==
          null
    ).length;

  /*
  -----------------------------------
  PAGE
  -----------------------------------
  */

  return (
    <section className="bg-[#F7F7F3] py-16">

      <div className="max-w-7xl mx-auto px-6">

        {/* HEADER */}

        <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-10">

          <div>

            <span className="text-[#B8922E] font-semibold uppercase tracking-wider text-sm">
              Property Marketplace
            </span>

            <h2 className="text-4xl md:text-5xl font-bold text-[#0B1F3A] mt-2">
              Browse All Properties
            </h2>

            <p className="text-gray-600 mt-3">
              Explore available listings across the platform.
            </p>

          </div>

          <div className="flex flex-col sm:flex-row gap-3">

            {/* RESULT COUNT */}

            <div className="bg-white border border-gray-100 rounded-xl px-5 py-3 shadow-sm">

              <span className="text-2xl font-bold text-[#C9A227]">
                {
                  filteredProperties.length
                }
              </span>

              <span className="text-gray-500 ml-2">
                {filteredProperties.length ===
                1
                  ? "property found"
                  : "properties found"}
              </span>

            </div>

            {/* VIEW TOGGLE */}

            <div className="bg-white border border-gray-100 rounded-xl p-1 shadow-sm flex">

              <button
                type="button"
                onClick={() =>
                  setViewMode(
                    "list"
                  )
                }
                className={`px-5 py-2 rounded-lg font-semibold transition ${
                  viewMode ===
                  "list"
                    ? "bg-[#08192E] text-white"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                ▦ List
              </button>

              <button
                type="button"
                onClick={() =>
                  setViewMode(
                    "map"
                  )
                }
                className={`px-5 py-2 rounded-lg font-semibold transition ${
                  viewMode ===
                  "map"
                    ? "bg-[#C9A227] text-[#08192E]"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
              >
                📍 Map
              </button>

            </div>

          </div>

        </div>

        {/* LOADING */}

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20">

            <div className="w-10 h-10 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />

            <p className="text-gray-500 mt-5">
              Loading properties...
            </p>

          </div>
        ) : filteredProperties.length ===
          0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-20 px-6">

            <div className="text-5xl mb-5">
              🔎
            </div>

            <h2 className="text-3xl font-bold text-[#0B1F3A]">
              No properties found
            </h2>

            <p className="mt-4 text-gray-500">
              Try changing your search term, location or property filters.
            </p>

          </div>
        ) : viewMode ===
          "map" ? (
          /* MAP VIEW */

          <div>

            {mappedCount ===
            0 ? (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm text-center py-16 px-6">

                <div className="text-5xl mb-5">
                  🗺️
                </div>

                <h3 className="text-2xl font-bold text-[#0B1F3A]">
                  No mapped properties yet
                </h3>

                <p className="text-gray-500 mt-3 max-w-xl mx-auto">
                  Matching properties were found, but none of them have confirmed map coordinates yet.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    setViewMode(
                      "list"
                    )
                  }
                  className="mt-6 bg-[#08192E] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
                >
                  Return to List
                </button>

              </div>
            ) : (
              <PropertyMap
                properties={
                  filteredProperties
                }
              />
            )}

          </div>
        ) : (
          /* LIST VIEW */

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">

            {filteredProperties.map(
              (
                property
              ) => (
                <PropertyCard
                  key={
                    property.id
                  }
                  property={
                    property
                  }
                />
              )
            )}

          </div>
        )}

      </div>

    </section>
  );
}