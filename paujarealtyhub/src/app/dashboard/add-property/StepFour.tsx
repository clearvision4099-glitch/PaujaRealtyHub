"use client";

import {
  useState,
} from "react";

type StepFourProps = {
  country: string;
  setCountry: (
    value: string
  ) => void;

  propertyState: string;
  setPropertyState: (
    value: string
  ) => void;

  city: string;
  setCity: (
    value: string
  ) => void;

  address: string;
  setAddress: (
    value: string
  ) => void;

  latitude:
    | number
    | null;

  setLatitude: (
    value:
      | number
      | null
  ) => void;

  longitude:
    | number
    | null;

  setLongitude: (
    value:
      | number
      | null
  ) => void;
};

export default function StepFour({
  country,
  setCountry,

  propertyState,
  setPropertyState,

  city,
  setCity,

  address,
  setAddress,

  latitude,
  setLatitude,

  longitude,
  setLongitude,
}: StepFourProps) {
  const [
    locating,
    setLocating,
  ] = useState(false);

  const [
    locationMessage,
    setLocationMessage,
  ] = useState("");

  const inputStyle =
    "w-full border border-gray-200 rounded-xl p-4 bg-[#FAFAF8] text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition";

  /*
  -----------------------------------
  CAPTURE DEVICE LOCATION
  -----------------------------------
  */

  function captureLocation() {
    if (
      !navigator.geolocation
    ) {
      setLocationMessage(
        "Location services are not supported by this device."
      );

      return;
    }

    setLocating(true);

    setLocationMessage(
      "Finding your location..."
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat =
          position.coords
            .latitude;

        const lng =
          position.coords
            .longitude;

        setLatitude(lat);
        setLongitude(lng);

        setLocationMessage(
          "Exact location captured successfully."
        );

        setLocating(false);
      },

      (error) => {
        console.error(
          "GEOLOCATION ERROR:",
          error
        );

        let message =
          "Unable to capture location.";

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          message =
            "Location permission was denied. Please allow location access and try again.";
        }

        if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          message =
            "Your current location could not be determined.";
        }

        if (
          error.code ===
          error.TIMEOUT
        ) {
          message =
            "Location request timed out. Please try again.";
        }

        setLocationMessage(
          message
        );

        setLocating(false);
      },

      {
        enableHighAccuracy:
          true,

        timeout: 15000,

        maximumAge: 0,
      }
    );
  }

  /*
  -----------------------------------
  CLEAR COORDINATES
  -----------------------------------
  */

  function clearExactLocation() {
    setLatitude(null);
    setLongitude(null);

    setLocationMessage(
      "Exact location removed."
    );
  }

  const hasCoordinates =
    latitude !== null &&
    longitude !== null;

  return (
    <div className="space-y-7">

      {/* HEADING */}

      <div>

        <span className="text-[#B8922E] text-xs font-semibold uppercase tracking-wider">
          Step 4
        </span>

        <h2 className="text-2xl font-bold text-[#0B1F3A] mt-1">
          Property Location
        </h2>

        <p className="text-gray-500 mt-2">
          Tell buyers and renters where the property is located.
        </p>

      </div>

      {/* COUNTRY + STATE */}

      <div className="grid md:grid-cols-2 gap-6">

        <div>

          <label className="block mb-2 font-semibold text-[#0B1F3A]">
            Country
          </label>

          <select
            value={country}
            onChange={(e) =>
              setCountry(
                e.target.value
              )
            }
            className={
              inputStyle
            }
          >
            <option>
              Nigeria
            </option>
          </select>

        </div>

        <div>

          <label className="block mb-2 font-semibold text-[#0B1F3A]">
            State
          </label>

          <select
            value={
              propertyState
            }
            onChange={(e) =>
              setPropertyState(
                e.target.value
              )
            }
            className={
              inputStyle
            }
          >
            <option value="">
              Select State
            </option>

            <option>
              Lagos
            </option>

            <option>
              Abuja
            </option>

            <option>
              Ogun
            </option>

            <option>
              Oyo
            </option>

            <option>
              Rivers
            </option>

            <option>
              Delta
            </option>

            <option>
              Anambra
            </option>

          </select>

        </div>

      </div>

      {/* CITY + ADDRESS */}

      <div className="grid md:grid-cols-2 gap-6">

        <div>

          <label className="block mb-2 font-semibold text-[#0B1F3A]">
            City / Area
          </label>

          <input
            type="text"
            value={city}
            onChange={(e) =>
              setCity(
                e.target.value
              )
            }
            placeholder="e.g. Lekki"
            className={
              inputStyle
            }
          />

          <p className="text-xs text-gray-400 mt-2">
            Enter the city, town or property area.
          </p>

        </div>

        <div>

          <label className="block mb-2 font-semibold text-[#0B1F3A]">
            Full Address
          </label>

          <input
            type="text"
            value={address}
            onChange={(e) =>
              setAddress(
                e.target.value
              )
            }
            placeholder="e.g. 23 Admiralty Way"
            className={
              inputStyle
            }
          />

          <p className="text-xs text-gray-400 mt-2">
            Enter the property's street or full address.
          </p>

        </div>

      </div>

      {/* PAUJA LOCATION INTELLIGENCE */}

      <div className="rounded-2xl border border-[#C9A227]/30 bg-[#08192E] text-white overflow-hidden">

        <div className="p-6 md:p-7">

          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

            <div className="max-w-xl">

              <span className="text-[#C9A227] text-xs font-bold uppercase tracking-widest">
                Pauja Location Intelligence
              </span>

              <h3 className="text-2xl font-bold mt-2">
                Confirm Exact Property Location
              </h3>

              <p className="text-gray-300 mt-3 leading-7">
                Exact coordinates will power map discovery,
                nearby services, distance information and
                future Pauja Location Scores.
              </p>

            </div>

            <div
              className={`shrink-0 px-4 py-2 rounded-full text-sm font-bold ${
                hasCoordinates
                  ? "bg-green-100 text-green-700"
                  : "bg-white/10 text-gray-300"
              }`}
            >
              {hasCoordinates
                ? "✓ Location Captured"
                : "Location Not Confirmed"}
            </div>

          </div>

          <div className="mt-6 bg-white/5 border border-white/10 rounded-xl p-5">

            <p className="font-semibold text-[#C9A227]">
              📍 Are you currently at the property?
            </p>

            <p className="text-sm text-gray-300 leading-6 mt-2">
              If yes, use your device location to record the
              property's exact position. Do not use this button
              when you are somewhere else.
            </p>

            <div className="flex flex-wrap gap-3 mt-5">

              <button
                type="button"
                disabled={
                  locating
                }
                onClick={
                  captureLocation
                }
                className="bg-[#C9A227] text-[#08192E] px-6 py-3 rounded-xl font-bold hover:brightness-110 transition disabled:opacity-50"
              >
                {locating
                  ? "Locating..."
                  : hasCoordinates
                  ? "Update Exact Location"
                  : "Capture Exact Location"}
              </button>

              {hasCoordinates && (
                <button
                  type="button"
                  onClick={
                    clearExactLocation
                  }
                  className="border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
                >
                  Remove Location
                </button>
              )}

            </div>

            {locationMessage && (
              <p className="text-sm mt-4 text-gray-200">
                {
                  locationMessage
                }
              </p>
            )}

          </div>

          {/* COORDINATE CONFIRMATION */}

          {hasCoordinates && (
            <div className="grid sm:grid-cols-2 gap-4 mt-5">

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">

                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Latitude
                </p>

                <p className="font-semibold mt-2">
                  {latitude?.toFixed(
                    6
                  )}
                </p>

              </div>

              <div className="bg-white/5 border border-white/10 rounded-xl p-4">

                <p className="text-xs uppercase tracking-wider text-gray-400">
                  Longitude
                </p>

                <p className="font-semibold mt-2">
                  {longitude?.toFixed(
                    6
                  )}
                </p>

              </div>

            </div>
          )}

          <p className="text-xs text-gray-400 mt-5 leading-5">
            Next phase: Pauja will allow agents to confirm or
            correct the position directly on an interactive map.
          </p>

        </div>

      </div>

      {/* LOCATION TIP */}

      <div className="bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-xl p-4">

        <p className="text-sm text-[#0B1F3A]">

          <span className="font-bold">
            📍 Location tip:
          </span>{" "}

          Accurate location information improves search,
          navigation and the quality of Pauja's local
          intelligence around your property.

        </p>

      </div>

    </div>
  );
}