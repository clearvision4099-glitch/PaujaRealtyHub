"use client";

import Image from "next/image";
import Link from "next/link";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

type PropertyMapClientProps = {
  properties?: any[];
  property?: any;
  mode?: "marketplace" | "single";
  height?: string;
};

const DEFAULT_CENTER: [number, number] = [
  9.082,
  8.6753,
];

const markerIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

export default function PropertyMapClient({
  properties = [],
  property,
  mode = "marketplace",
  height,
}: PropertyMapClientProps) {
  const sourceProperties =
    mode === "single" && property
      ? [property]
      : properties;

  const mappedProperties =
    sourceProperties.filter(
      (item) =>
        item &&
        item.status === "Published" &&
        item.latitude !== null &&
        item.latitude !== undefined &&
        item.longitude !== null &&
        item.longitude !== undefined
    );

  const center: [number, number] =
    mappedProperties.length > 0
      ? [
          Number(
            mappedProperties[0].latitude
          ),
          Number(
            mappedProperties[0].longitude
          ),
        ]
      : DEFAULT_CENTER;

  const zoom =
    mode === "single"
      ? 16
      : mappedProperties.length > 0
      ? 12
      : 6;

  const mapHeight =
    height ||
    (mode === "single"
      ? "420px"
      : "650px");

  if (
    mode === "single" &&
    mappedProperties.length === 0
  ) {
    return (
      <div className="bg-white border border-gray-100 rounded-2xl p-8 text-center shadow-sm">

        <div className="text-4xl mb-4">
          📍
        </div>

        <h3 className="text-xl font-bold text-[#0B1F3A]">
          Exact Location Not Available
        </h3>

        <p className="text-gray-500 mt-2">
          This listing does not yet have a confirmed map location.
        </p>

      </div>
    );
  }

  return (
    <div className="space-y-4">

      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-lg">

        <MapContainer
          center={center}
          zoom={zoom}
          scrollWheelZoom={
            mode === "marketplace"
          }
          style={{
            height: mapHeight,
            width: "100%",
          }}
        >

          <TileLayer
            attribution="&copy; OpenStreetMap contributors"
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {mappedProperties.map(
            (item) => {
              const coverImage =
                item.property_images?.[0]
                  ?.image_url ||
                item.image_url ||
                "";

              return (
                <Marker
                  key={item.id}
                  position={[
                    Number(
                      item.latitude
                    ),
                    Number(
                      item.longitude
                    ),
                  ]}
                  icon={markerIcon}
                >
                  <Popup
                    minWidth={
                      mode === "single"
                        ? 220
                        : 250
                    }
                  >

                    {mode ===
                    "single" ? (
                      <div className="w-[200px]">

                        <h3 className="font-bold text-[#0B1F3A]">
                          {item.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          📍{" "}
                          {[
                            item.city,
                            item.state,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>

                        <p className="text-xs text-gray-400 mt-2">
                          Confirmed property location
                        </p>

                      </div>
                    ) : (
                      <div className="w-[230px]">

                        {coverImage && (
                          <div className="relative w-full h-32 rounded-lg overflow-hidden mb-3">

                            <Image
                              src={coverImage}
                              alt={
                                item.title ||
                                "Property"
                              }
                              fill
                              unoptimized
                              className="object-cover"
                            />

                          </div>
                        )}

                        <p className="text-lg font-bold text-[#0B1F3A]">
                          ₦
                          {Number(
                            item.price || 0
                          ).toLocaleString()}
                        </p>

                        <h3 className="font-semibold text-[#0B1F3A] mt-1">
                          {item.title}
                        </h3>

                        <p className="text-sm text-gray-500 mt-1">
                          📍{" "}
                          {[
                            item.city,
                            item.state,
                          ]
                            .filter(Boolean)
                            .join(", ")}
                        </p>

                        <Link
                          href={`/properties/${item.id}`}
                          className="block mt-3 bg-[#08192E] text-white text-center px-4 py-2 rounded-lg font-semibold"
                        >
                          View Property
                        </Link>

                      </div>
                    )}

                  </Popup>
                </Marker>
              );
            }
          )}

        </MapContainer>

      </div>

      {mode === "marketplace" && (
        <div className="bg-white border border-gray-100 rounded-xl p-4 shadow-sm">

          <p className="font-semibold text-[#0B1F3A]">
            {mappedProperties.length}{" "}
            {mappedProperties.length === 1
              ? "property"
              : "properties"}{" "}
            available on map
          </p>

          <p className="text-sm text-gray-500 mt-1">
            Only published listings with confirmed coordinates appear on the map.
          </p>

        </div>
      )}

      {mode === "single" && (
        <div className="bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-xl p-4">

          <p className="text-sm text-[#0B1F3A]">
            <strong>
              Pauja Location Intelligence:
            </strong>{" "}
            This pin represents the confirmed location attached to this listing.
          </p>

        </div>
      )}

    </div>
  );
}