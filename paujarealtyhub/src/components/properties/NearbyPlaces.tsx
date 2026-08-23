"use client";

import {
  NearbyPlace,
  NearbyPlaceCategory,
  categoryIcon,
  categoryLabel,
} from "@/services/nearbyPlaces";

type NearbyPlacesProps = {
  places: NearbyPlace[];
  loading?: boolean;
  error?: string;
};

const categories: NearbyPlaceCategory[] = [
  "school",
  "hospital",
  "supermarket",
  "bank",
  "restaurant",
  "fuel",
  "transport",
];

export default function NearbyPlaces({
  places,
  loading = false,
  error = "",
}: NearbyPlacesProps) {
  /*
  -----------------------------------
  LOADING
  -----------------------------------
  */

  if (loading) {
    return (
      <section className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-7">

        <span className="text-[#B8922E] text-xs font-bold uppercase tracking-widest">
          Pauja Area Intelligence
        </span>

        <h2 className="text-2xl font-bold text-[#0B1F3A] mt-2">
          Around This Property
        </h2>

        <div className="py-12 text-center">

          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />

          <p className="text-gray-500 mt-4">
            Exploring the surrounding area...
          </p>

        </div>

      </section>
    );
  }

  /*
  -----------------------------------
  ERROR
  -----------------------------------
  */

  if (error) {
    return (
      <section className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-7">

        <span className="text-[#B8922E] text-xs font-bold uppercase tracking-widest">
          Pauja Area Intelligence
        </span>

        <h2 className="text-2xl font-bold text-[#0B1F3A] mt-2">
          Around This Property
        </h2>

        <div className="mt-6 bg-[#FAFAF8] border border-gray-100 rounded-xl p-6">

          <p className="font-semibold text-[#0B1F3A]">
            Area information is temporarily unavailable.
          </p>

          <p className="text-sm text-gray-500 mt-2">
            Nearby places could not be loaded at this time.
          </p>

        </div>

      </section>
    );
  }

  /*
  -----------------------------------
  EMPTY
  -----------------------------------
  */

  if (places.length === 0) {
    return (
      <section className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-7">

        <span className="text-[#B8922E] text-xs font-bold uppercase tracking-widest">
          Pauja Area Intelligence
        </span>

        <h2 className="text-2xl font-bold text-[#0B1F3A] mt-2">
          Around This Property
        </h2>

        <div className="mt-6 border border-dashed border-gray-300 rounded-xl p-8 text-center bg-[#FAFAF8]">

          <div className="text-4xl">
            📍
          </div>

          <h3 className="font-bold text-[#0B1F3A] mt-3">
            Limited Area Data
          </h3>

          <p className="text-gray-500 mt-2">
            No nearby places were returned for this location.
          </p>

        </div>

      </section>
    );
  }

  /*
  -----------------------------------
  CATEGORY SUMMARY
  -----------------------------------
  */

  const availableCategories =
    categories
      .map((category) => {
        const categoryPlaces =
          places
            .filter(
              (place) =>
                place.category === category
            )
            .sort(
              (a, b) =>
                a.distanceKm -
                b.distanceKm
            );

        return {
          category,
          places: categoryPlaces,
        };
      })
      .filter(
        (group) =>
          group.places.length > 0
      );

  return (
    <section className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-7">

      {/* HEADER */}

      <div>

        <span className="text-[#B8922E] text-xs font-bold uppercase tracking-widest">
          Pauja Area Intelligence
        </span>

        <h2 className="text-2xl font-bold text-[#0B1F3A] mt-2">
          Around This Property
        </h2>

        <p className="text-gray-500 mt-2 max-w-2xl">
          Explore useful places found around this property and see how close they are.
        </p>

      </div>

      {/* QUICK SUMMARY */}

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3 mt-7">

        {availableCategories.map(
          ({ category, places }) => (
            <div
              key={category}
              className="bg-[#FAFAF8] border border-gray-100 rounded-xl p-4 text-center"
            >

              <div className="text-2xl">
                {categoryIcon(category)}
              </div>

              <p className="font-bold text-[#0B1F3A] mt-2">
                {places.length}
              </p>

              <p className="text-xs text-gray-500 mt-1">
                {categoryLabel(category)}
              </p>

            </div>
          )
        )}

      </div>

      {/* CATEGORY LISTS */}

      <div className="grid md:grid-cols-2 gap-5 mt-8">

        {availableCategories.map(
          ({ category, places }) => (
            <div
              key={category}
              className="border border-gray-100 rounded-2xl overflow-hidden"
            >

              {/* CATEGORY HEADER */}

              <div className="bg-[#08192E] text-white px-5 py-4 flex items-center justify-between">

                <div className="flex items-center gap-3">

                  <span className="text-xl">
                    {categoryIcon(category)}
                  </span>

                  <h3 className="font-bold">
                    {categoryLabel(category)}
                  </h3>

                </div>

                <span className="text-xs bg-white/10 px-3 py-1 rounded-full">
                  {places.length} found
                </span>

              </div>

              {/* NEAREST RESULTS */}

              <div className="divide-y divide-gray-100">

                {places
                  .slice(0, 5)
                  .map((place) => (
                    <div
                      key={place.id}
                      className="p-4 flex items-center justify-between gap-4"
                    >

                      <div className="min-w-0">

                        <p className="font-semibold text-[#0B1F3A] truncate">
                          {place.name}
                        </p>

                        <p className="text-xs text-gray-400 mt-1">
                          Nearby {categoryLabel(category).toLowerCase()}
                        </p>

                      </div>

                      <div className="shrink-0 bg-[#C9A227]/10 text-[#9A7720] px-3 py-2 rounded-lg text-sm font-bold">
                        {place.distanceKm < 1
                          ? `${Math.round(
                              place.distanceKm * 1000
                            )} m`
                          : `${place.distanceKm.toFixed(
                              1
                            )} km`}
                      </div>

                    </div>
                  ))}

              </div>

            </div>
          )
        )}

      </div>

      {/* DISCLAIMER */}

      <div className="mt-7 bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-xl p-4">

        <p className="text-sm text-[#0B1F3A] leading-6">
          <strong>
            Area information:
          </strong>{" "}
          Nearby-place information is based on available map data and may not include every business or service in the area. Distances shown are approximate straight-line distances from the property.
        </p>

      </div>

    </section>
  );
}