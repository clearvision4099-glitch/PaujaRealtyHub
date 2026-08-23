"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import {
  isFavourite,
  toggleFavourite,
} from "@/services/favorites";

type PropertyCardProps = {
  property: any;
};

export default function PropertyCard({
  property,
}: PropertyCardProps) {
  const [favourite, setFavourite] =
    useState(false);

  const [loadingFavourite, setLoadingFavourite] =
    useState(false);

  const images =
    property.property_images?.length > 0
      ? [...property.property_images].sort(
          (a: any, b: any) =>
            Number(b.is_cover) -
            Number(a.is_cover)
        )
      : [
          {
            image_url:
              property.image_url ||
              "/images/properties/no-image.jpg",
          },
        ];

  const [currentImage, setCurrentImage] =
    useState(0);

  useEffect(() => {
    async function checkFavourite() {
      const saved =
        await isFavourite(property.id);

      setFavourite(saved);
    }

    checkFavourite();
  }, [property.id]);

  async function handleFavourite() {
    if (loadingFavourite) return;

    setLoadingFavourite(true);

    const success =
      await toggleFavourite(
        property.id,
        favourite
      );

    if (success) {
      setFavourite(!favourite);
    }

    setLoadingFavourite(false);
  }

  function nextImage() {
    setCurrentImage((prev) =>
      prev === images.length - 1
        ? 0
        : prev + 1
    );
  }

  function prevImage() {
    setCurrentImage((prev) =>
      prev === 0
        ? images.length - 1
        : prev - 1
    );
  }

  return (
    <div className="group bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300">

      {/* IMAGE */}
      <div className="relative w-full h-60 overflow-hidden bg-gray-100">

        <Image
          src={images[currentImage].image_url}
          alt={property.title}
          fill
          unoptimized
          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
        />

        {/* IMAGE OVERLAY */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" />

        {/* FAVOURITE */}
        <button
          type="button"
          onClick={handleFavourite}
          disabled={loadingFavourite}
          aria-label={
            favourite
              ? "Remove from favorites"
              : "Save property"
          }
          className="absolute top-4 right-4 w-11 h-11 rounded-full bg-white/95 shadow-lg flex items-center justify-center hover:scale-105 transition disabled:opacity-60"
        >
          <span className="text-2xl">
            {favourite ? "❤️" : "🤍"}
          </span>
        </button>

        {/* IMAGE NAVIGATION */}
        {images.length > 1 && (
          <>
            <button
              type="button"
              onClick={prevImage}
              aria-label="Previous image"
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#08192E] w-10 h-10 rounded-full shadow flex items-center justify-center font-bold"
            >
              ←
            </button>

            <button
              type="button"
              onClick={nextImage}
              aria-label="Next image"
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white text-[#08192E] w-10 h-10 rounded-full shadow flex items-center justify-center font-bold"
            >
              →
            </button>

            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-2">
              {images.map(
                (_: any, index: number) => (
                  <div
                    key={index}
                    className={`w-2 h-2 rounded-full ${
                      currentImage === index
                        ? "bg-[#C9A227]"
                        : "bg-white/70"
                    }`}
                  />
                )
              )}
            </div>
          </>
        )}

      </div>

      {/* CONTENT */}
      <div className="p-6">

        <div className="flex flex-wrap gap-2 mb-4">

          <span className="bg-[#08192E]/5 text-[#08192E] border border-[#08192E]/10 text-xs font-semibold px-3 py-1 rounded-full">
            {property.property_type ||
              "Property"}
          </span>

          <span className="bg-[#C9A227]/10 text-[#9A7720] border border-[#C9A227]/20 text-xs font-semibold px-3 py-1 rounded-full">
            {property.listing_type ||
              "Listing"}
          </span>

        </div>

        <h2 className="text-2xl font-bold text-[#0B1F3A] leading-snug line-clamp-2">
          {property.title}
        </h2>

        <p className="text-gray-500 mt-2">
          📍{" "}
          {[property.city, property.state]
            .filter(Boolean)
            .join(", ") || "Location unavailable"}
        </p>

        <p className="text-[#B8922E] text-2xl font-bold mt-5">
          ₦
          {Number(
            property.price || 0
          ).toLocaleString()}
        </p>

        <div className="grid grid-cols-3 gap-3 mt-6 text-sm text-gray-600 border-t border-gray-100 pt-5">

          <div>
            <p className="font-semibold text-[#0B1F3A]">
              🛏 {property.bedrooms || "-"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Bedrooms
            </p>
          </div>

          <div>
            <p className="font-semibold text-[#0B1F3A]">
              🚿 {property.bathrooms || "-"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              Bathrooms
            </p>
          </div>

          <div>
            <p className="font-semibold text-[#0B1F3A]">
              📐 {property.size || "-"}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              sqm
            </p>
          </div>

        </div>

        <Link
          href={`/properties/${property.id}`}
          className="block w-full mt-7 bg-[#08192E] text-white py-3 rounded-xl text-center font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
        >
          View Details
        </Link>

      </div>

    </div>
  );
}