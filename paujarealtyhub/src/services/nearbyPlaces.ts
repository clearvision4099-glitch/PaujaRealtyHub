export type NearbyPlaceCategory =
  | "school"
  | "hospital"
  | "supermarket"
  | "bank"
  | "restaurant"
  | "fuel"
  | "transport";

export type NearbyPlace = {
  id: string;
  name: string;
  category: NearbyPlaceCategory;
  latitude: number;
  longitude: number;
  distanceKm: number;
};

type OverpassElement = {
  type: "node" | "way" | "relation";
  id: number;

  lat?: number;
  lon?: number;

  center?: {
    lat: number;
    lon: number;
  };

  tags?: Record<string, string>;
};

const OVERPASS_URL =
  "https://overpass-api.de/api/interpreter";

const DEFAULT_RADIUS_METRES = 3000;

/*
-----------------------------------
DISTANCE CALCULATION
HAVERSINE FORMULA
-----------------------------------
*/

function calculateDistanceKm(
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
) {
  const earthRadiusKm = 6371;

  const latitudeDifference =
    toRadians(
      latitude2 -
        latitude1
    );

  const longitudeDifference =
    toRadians(
      longitude2 -
        longitude1
    );

  const a =
    Math.sin(
      latitudeDifference / 2
    ) ** 2 +
    Math.cos(
      toRadians(
        latitude1
      )
    ) *
      Math.cos(
        toRadians(
          latitude2
        )
      ) *
      Math.sin(
        longitudeDifference / 2
      ) **
        2;

  const c =
    2 *
    Math.atan2(
      Math.sqrt(a),
      Math.sqrt(1 - a)
    );

  return earthRadiusKm * c;
}

function toRadians(
  degrees: number
) {
  return (
    degrees *
    (Math.PI / 180)
  );
}

/*
-----------------------------------
CATEGORY DETECTION
-----------------------------------
*/

function getCategory(
  tags:
    | Record<
        string,
        string
      >
    | undefined
):
  | NearbyPlaceCategory
  | null {
  if (!tags) {
    return null;
  }

  if (
    tags.amenity ===
      "school" ||
    tags.amenity ===
      "college" ||
    tags.amenity ===
      "university"
  ) {
    return "school";
  }

  if (
    tags.amenity ===
      "hospital" ||
    tags.amenity ===
      "clinic" ||
    tags.amenity ===
      "doctors"
  ) {
    return "hospital";
  }

  if (
    tags.shop ===
      "supermarket" ||
    tags.shop ===
      "convenience"
  ) {
    return "supermarket";
  }

  if (
    tags.amenity ===
      "bank" ||
    tags.amenity ===
      "atm"
  ) {
    return "bank";
  }

  if (
    tags.amenity ===
      "restaurant" ||
    tags.amenity ===
      "fast_food" ||
    tags.amenity ===
      "cafe"
  ) {
    return "restaurant";
  }

  if (
    tags.amenity ===
      "fuel"
  ) {
    return "fuel";
  }

  if (
    tags.highway ===
      "bus_stop" ||
    tags.amenity ===
      "bus_station" ||
    tags.railway ===
      "station"
  ) {
    return "transport";
  }

  return null;
}

/*
-----------------------------------
BUILD OVERPASS QUERY
-----------------------------------
*/

function buildNearbyPlacesQuery(
  latitude: number,
  longitude: number,
  radiusMetres: number
) {
  return `
[out:json][timeout:20];

(
  nwr(around:${radiusMetres},${latitude},${longitude})[amenity~"school|college|university|hospital|clinic|doctors|bank|atm|restaurant|fast_food|cafe|fuel|bus_station"];

  nwr(around:${radiusMetres},${latitude},${longitude})[shop~"supermarket|convenience"];

  nwr(around:${radiusMetres},${latitude},${longitude})[highway="bus_stop"];

  nwr(around:${radiusMetres},${latitude},${longitude})[railway="station"];
);

out center tags;
`;
}

/*
-----------------------------------
GET NEARBY PLACES
-----------------------------------
*/

export async function getNearbyPlaces(
  latitude: number,
  longitude: number,
  radiusMetres =
    DEFAULT_RADIUS_METRES
): Promise<NearbyPlace[]> {
  const query =
    buildNearbyPlacesQuery(
      latitude,
      longitude,
      radiusMetres
    );

  const response =
    await fetch(
      OVERPASS_URL,
      {
        method: "POST",

        headers: {
          "Content-Type":
            "application/x-www-form-urlencoded",
        },

        body:
          new URLSearchParams({
            data: query,
          }),
      }
    );

  if (!response.ok) {
    throw new Error(
      `Nearby places request failed: ${response.status}`
    );
  }

  const result =
    await response.json();

  const elements: OverpassElement[] =
    result.elements || [];

  const places =
    elements
      .map(
        (
          element
        ): NearbyPlace | null => {
          const category =
            getCategory(
              element.tags
            );

          if (!category) {
            return null;
          }

          const placeLatitude =
            element.lat ??
            element.center
              ?.lat;

          const placeLongitude =
            element.lon ??
            element.center
              ?.lon;

          if (
            placeLatitude ===
              undefined ||
            placeLongitude ===
              undefined
          ) {
            return null;
          }

          const name =
            element.tags
              ?.name ||
            element.tags
              ?.brand ||
            element.tags
              ?.operator ||
            categoryLabel(
              category
            );

          const distanceKm =
            calculateDistanceKm(
              latitude,
              longitude,
              placeLatitude,
              placeLongitude
            );

          return {
            id:
              `${element.type}-${element.id}`,

            name,

            category,

            latitude:
              placeLatitude,

            longitude:
              placeLongitude,

            distanceKm:
              Number(
                distanceKm.toFixed(
                  2
                )
              ),
          };
        }
      )
      .filter(
        (
          place
        ): place is NearbyPlace =>
          place !== null
      );

  /*
  -----------------------------------
  REMOVE DUPLICATES
  SORT NEAREST FIRST
  -----------------------------------
  */

  const unique =
    new Map<
      string,
      NearbyPlace
    >();

  for (const place of places) {
    const key =
      `${place.category}-${place.name.toLowerCase()}-${place.latitude.toFixed(
        5
      )}-${place.longitude.toFixed(
        5
      )}`;

    if (
      !unique.has(key)
    ) {
      unique.set(
        key,
        place
      );
    }
  }

  return Array.from(
    unique.values()
  )
    .sort(
      (a, b) =>
        a.distanceKm -
        b.distanceKm
    )
    .slice(0, 40);
}

/*
-----------------------------------
LABELS
-----------------------------------
*/

export function categoryLabel(
  category:
    NearbyPlaceCategory
) {
  switch (category) {
    case "school":
      return "School";

    case "hospital":
      return "Hospital";

    case "supermarket":
      return "Supermarket";

    case "bank":
      return "Bank / ATM";

    case "restaurant":
      return "Restaurant";

    case "fuel":
      return "Fuel Station";

    case "transport":
      return "Transport";

    default:
      return "Nearby Place";
  }
}

export function categoryIcon(
  category:
    NearbyPlaceCategory
) {
  switch (category) {
    case "school":
      return "🎓";

    case "hospital":
      return "🏥";

    case "supermarket":
      return "🛒";

    case "bank":
      return "🏦";

    case "restaurant":
      return "🍽️";

    case "fuel":
      return "⛽";

    case "transport":
      return "🚌";

    default:
      return "📍";
  }
}