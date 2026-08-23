"use client";

import {
  useEffect,
  useMemo,
  useRef,
} from "react";

import {
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
  useMapEvents,
} from "react-leaflet";

import L from "leaflet";

import "leaflet/dist/leaflet.css";

type LocationPickerMapProps = {
  latitude: number | null;
  longitude: number | null;

  setLatitude: (
    value: number
  ) => void;

  setLongitude: (
    value: number
  ) => void;
};

/*
-----------------------------------
DEFAULT MAP POSITION
NIGERIA / LAGOS REGION
-----------------------------------
*/

const DEFAULT_POSITION: [
  number,
  number
] = [
  6.5244,
  3.3792,
];

/*
-----------------------------------
FIX LEAFLET DEFAULT MARKER ICON
FOR NEXT.JS
-----------------------------------
*/

const markerIcon = L.icon({
  iconUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",

  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",

  shadowUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",

  iconSize: [
    25,
    41,
  ],

  iconAnchor: [
    12,
    41,
  ],

  popupAnchor: [
    1,
    -34,
  ],

  shadowSize: [
    41,
    41,
  ],
});

/*
-----------------------------------
MOVE MAP WHEN COORDINATES CHANGE
-----------------------------------
*/

function MapRecenter({
  latitude,
  longitude,
}: {
  latitude: number | null;
  longitude: number | null;
}) {
  const map = useMap();

  useEffect(() => {
    if (
      latitude === null ||
      longitude === null
    ) {
      return;
    }

    map.setView(
      [
        latitude,
        longitude,
      ],
      17
    );
  }, [
    latitude,
    longitude,
    map,
  ]);

  return null;
}

/*
-----------------------------------
CLICK MAP TO SET LOCATION
-----------------------------------
*/

function MapClickHandler({
  setLatitude,
  setLongitude,
}: {
  setLatitude: (
    value: number
  ) => void;

  setLongitude: (
    value: number
  ) => void;
}) {
  useMapEvents({
    click(event) {
      setLatitude(
        event.latlng.lat
      );

      setLongitude(
        event.latlng.lng
      );
    },
  });

  return null;
}

/*
-----------------------------------
DRAGGABLE PROPERTY MARKER
-----------------------------------
*/

function PropertyMarker({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}: {
  latitude: number;
  longitude: number;

  setLatitude: (
    value: number
  ) => void;

  setLongitude: (
    value: number
  ) => void;
}) {
  const markerRef =
    useRef<L.Marker | null>(
      null
    );

  const eventHandlers =
    useMemo(
      () => ({
        dragend() {
          const marker =
            markerRef.current;

          if (!marker) {
            return;
          }

          const position =
            marker.getLatLng();

          setLatitude(
            position.lat
          );

          setLongitude(
            position.lng
          );
        },
      }),
      [
        setLatitude,
        setLongitude,
      ]
    );

  return (
    <Marker
      draggable
      position={[
        latitude,
        longitude,
      ]}
      icon={markerIcon}
      eventHandlers={
        eventHandlers
      }
      ref={markerRef}
    >
      <Popup>
        Property location
        <br />
        Drag the pin to
        correct the position.
      </Popup>
    </Marker>
  );
}

/*
-----------------------------------
MAIN COMPONENT
-----------------------------------
*/

export default function LocationPickerMap({
  latitude,
  longitude,
  setLatitude,
  setLongitude,
}: LocationPickerMapProps) {
  const hasCoordinates =
    latitude !== null &&
    longitude !== null;

  const mapCenter: [
    number,
    number
  ] = hasCoordinates
    ? [
        latitude,
        longitude,
      ]
    : DEFAULT_POSITION;

  return (
    <div className="space-y-4">

      <div className="rounded-2xl overflow-hidden border border-gray-200 shadow-sm">

        <MapContainer
          center={
            mapCenter
          }
          zoom={
            hasCoordinates
              ? 17
              : 10
          }
          scrollWheelZoom
          style={{
            height:
              "420px",

            width:
              "100%",
          }}
        >

          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          <MapClickHandler
            setLatitude={
              setLatitude
            }
            setLongitude={
              setLongitude
            }
          />

          <MapRecenter
            latitude={
              latitude
            }
            longitude={
              longitude
            }
          />

          {hasCoordinates && (
            <PropertyMarker
              latitude={
                latitude
              }
              longitude={
                longitude
              }
              setLatitude={
                setLatitude
              }
              setLongitude={
                setLongitude
              }
            />
          )}

        </MapContainer>

      </div>

      <div className="bg-[#FAFAF8] border border-gray-200 rounded-xl p-4">

        <p className="font-semibold text-[#0B1F3A]">
          📍 Map Location
        </p>

        <p className="text-sm text-gray-500 mt-2">
          Click anywhere on the
          map to place the property
          pin. You can also drag the
          marker to fine-tune the
          exact position.
        </p>

        {hasCoordinates && (
          <div className="grid sm:grid-cols-2 gap-3 mt-4">

            <div className="bg-white border border-gray-100 rounded-lg p-3">

              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Latitude
              </p>

              <p className="font-semibold text-[#0B1F3A] mt-1">
                {latitude.toFixed(
                  6
                )}
              </p>

            </div>

            <div className="bg-white border border-gray-100 rounded-lg p-3">

              <p className="text-xs text-gray-400 uppercase tracking-wide">
                Longitude
              </p>

              <p className="font-semibold text-[#0B1F3A] mt-1">
                {longitude.toFixed(
                  6
                )}
              </p>

            </div>

          </div>
        )}

      </div>

    </div>
  );
}