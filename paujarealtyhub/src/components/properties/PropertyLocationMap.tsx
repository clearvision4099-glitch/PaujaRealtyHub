"use client";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

type PropertyLocationMapProps = {
  latitude: number;
  longitude: number;

  title: string;

  city?: string | null;
  state?: string | null;
};

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

export default function PropertyLocationMap({
  latitude,
  longitude,
  title,
  city,
  state,
}: PropertyLocationMapProps) {
  const position: [
    number,
    number
  ] = [
    Number(latitude),
    Number(longitude),
  ];

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">

      <MapContainer
        center={position}
        zoom={16}
        scrollWheelZoom={false}
        style={{
          height: "420px",
          width: "100%",
        }}
      >

        <TileLayer
          attribution="&copy; OpenStreetMap contributors"
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <Marker
          position={position}
          icon={markerIcon}
        >
          <Popup>
            <strong>{title}</strong>

            {(city || state) && (
              <>
                <br />

                {[city, state]
                  .filter(Boolean)
                  .join(", ")}
              </>
            )}
          </Popup>
        </Marker>

      </MapContainer>

    </div>
  );
}