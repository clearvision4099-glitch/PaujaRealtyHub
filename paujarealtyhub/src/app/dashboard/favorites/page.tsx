"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";
import PropertyCard from "@/components/properties/PropertyCard";

export default function FavoritesPage() {
  const [properties, setProperties] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  /*
  -----------------------------------
  LOAD FAVORITES
  -----------------------------------
  */

  useEffect(() => {
    loadFavorites();
  }, []);

  async function loadFavorites() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setProperties([]);
        return;
      }

      const {
        data,
        error,
      } = await supabase
        .from("favorites")
        .select(`
          id,
          property_id,
          created_at,
          properties (
            *,
            property_images (
              id,
              image_url,
              is_cover
            )
          )
        `)
        .eq(
          "user_id",
          user.id
        )
        .order(
          "created_at",
          {
            ascending: false,
          }
        );

      if (error) {
        throw error;
      }

      /*
      ONLY SHOW PROPERTIES THAT
      ARE STILL PUBLICLY PUBLISHED
      */

      const savedProperties =
        data
          ?.map(
            (item: any) =>
              item.properties
          )
          .filter(
            (property: any) =>
              property &&
              property.status ===
                "Published"
          )
          .map(
            (property: any) => ({
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
          ) || [];

      setProperties(
        savedProperties
      );
    } catch (error) {
      console.error(
        "LOAD FAVORITES ERROR:",
        error
      );

      setProperties([]);
    } finally {
      setLoading(false);
    }
  }

  /*
  -----------------------------------
  LOADING
  -----------------------------------
  */

  if (loading) {
    return (
      <main className="p-4 md:p-8">

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm py-20 text-center">

          <div className="w-11 h-11 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />

          <p className="text-gray-500 mt-5">
            Loading saved properties...
          </p>

        </div>

      </main>
    );
  }

  /*
  -----------------------------------
  PAGE
  -----------------------------------
  */

  return (
    <main className="p-4 md:p-8">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">

        <div>

          <span className="text-[#B8922E] text-sm font-semibold uppercase tracking-wider">
            Marketplace
          </span>

          <h1 className="text-4xl font-bold text-[#0B1F3A] mt-2">
            Saved Properties
          </h1>

          <p className="text-gray-500 mt-2">
            Keep track of properties you are interested in.
          </p>

        </div>

        <Link
          href="/properties"
          className="self-start md:self-auto bg-[#C9A227] text-[#08192E] px-6 py-3 rounded-xl font-bold hover:brightness-110 transition shadow-sm"
        >
          Find More Properties
        </Link>

      </div>

      {/* EMPTY STATE */}

      {properties.length ===
      0 ? (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 md:p-16 text-center">

          <div className="text-6xl mb-5">
            ❤️
          </div>

          <h2 className="text-2xl font-bold text-[#0B1F3A]">
            No Saved Properties
          </h2>

          <p className="text-gray-500 mt-3 max-w-lg mx-auto">
            Properties you save from the marketplace will appear here while they remain available.
          </p>

          <Link
            href="/properties"
            className="inline-block mt-7 bg-[#08192E] text-white px-8 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
          >
            Find Properties
          </Link>

        </div>
      ) : (
        <>

          {/* COUNT */}

          <div className="mb-7">

            <span className="bg-white border border-gray-100 shadow-sm rounded-xl px-5 py-3 inline-flex items-center gap-2">

              <strong className="text-[#C9A227] text-xl">
                {
                  properties.length
                }
              </strong>

              <span className="text-gray-500">
                saved{" "}
                {properties.length ===
                1
                  ? "property"
                  : "properties"}
              </span>

            </span>

          </div>

          {/* PROPERTY GRID */}

          <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">

            {properties.map(
              (property) => (
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

        </>
      )}

    </main>
  );
}