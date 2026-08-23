"use client";
import PropertyMap from "@/components/properties/PropertyMap";
import {
  useEffect,
  useState,
} from "react";

import {
  useParams,
  useRouter,
} from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function ViewPropertyPage() {
  const params = useParams();
  const router = useRouter();

  const propertyId = Array.isArray(
    params.id
  )
    ? params.id[0]
    : params.id;

  const [
    property,
    setProperty,
  ] = useState<any>(null);

  const [
    selectedImage,
    setSelectedImage,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(true);

  /*
  -----------------------------------
  LOAD OWNER PROPERTY
  -----------------------------------
  */

  useEffect(() => {
    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  async function loadProperty() {
    try {
      setLoading(true);

      /*
      GET LOGGED IN USER
      */

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      /*
      LOAD PROPERTY
      OWNERSHIP REQUIRED
      */

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
          "id",
          propertyId
        )
        .eq(
          "user_id",
          user.id
        )
        .single();

      if (error) {
        throw error;
      }

      /*
      SORT COVER IMAGE FIRST
      */

      const images = [
        ...(data.property_images ||
          []),
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
      );

      const propertyData = {
        ...data,
        property_images:
          images,
      };

      setProperty(
        propertyData
      );

      if (
        images.length > 0
      ) {
        setSelectedImage(
          images[0]
            .image_url
        );
      } else {
        setSelectedImage(
          data.image_url ||
            ""
        );
      }
    } catch (error) {
      console.error(
        "OWNER PROPERTY LOAD ERROR:",
        error
      );

      setProperty(null);
    } finally {
      setLoading(false);
    }
  }

  /*
  -----------------------------------
  PUBLIC PROPERTY LINK
  -----------------------------------
  */

  function getPublicUrl() {
    return `${window.location.origin}/properties/${property.id}`;
  }

  /*
  -----------------------------------
  COPY PUBLIC LINK
  PUBLISHED ONLY
  -----------------------------------
  */

  async function copyPropertyLink() {
    if (
      property.status !==
      "Published"
    ) {
      alert(
        "Only published properties have a public link."
      );

      return;
    }

    try {
      await navigator.clipboard.writeText(
        getPublicUrl()
      );

      alert(
        "Public property link copied."
      );
    } catch (error) {
      console.error(
        "COPY LINK ERROR:",
        error
      );

      alert(
        "Unable to copy link."
      );
    }
  }

  /*
  -----------------------------------
  SHARE PUBLIC PROPERTY
  PUBLISHED ONLY
  -----------------------------------
  */

  async function shareProperty() {
    if (
      property.status !==
      "Published"
    ) {
      alert(
        "Publish this property before sharing it publicly."
      );

      return;
    }

    const shareData = {
      title:
        property.title,

      text:
        `View this property on PaujaRealtyHub: ${property.title}`,

      url:
        getPublicUrl(),
    };

    try {
      if (
        navigator.share
      ) {
        await navigator.share(
          shareData
        );
      } else {
        await copyPropertyLink();
      }
    } catch (error: any) {
      if (
        error?.name !==
        "AbortError"
      ) {
        console.error(
          "SHARE PROPERTY ERROR:",
          error
        );

        alert(
          "Unable to share property."
        );
      }
    }
  }

  /*
  -----------------------------------
  STATUS STYLE
  -----------------------------------
  */

  function getStatusStyle(
    status: string
  ) {
    if (
      status ===
      "Published"
    ) {
      return (
        "bg-green-100 " +
        "text-green-700"
      );
    }

    if (
      status ===
      "Unpublished"
    ) {
      return (
        "bg-yellow-100 " +
        "text-yellow-700"
      );
    }

    if (
      status ===
      "Archived"
    ) {
      return (
        "bg-gray-200 " +
        "text-gray-600"
      );
    }

    return (
      "bg-orange-100 " +
      "text-orange-700"
    );
  }

  /*
  -----------------------------------
  LOADING
  -----------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />

          <p className="text-gray-500 mt-5">
            Loading property...
          </p>

        </div>

      </main>
    );
  }

  /*
  -----------------------------------
  NOT FOUND / NOT OWNER
  -----------------------------------
  */

  if (!property) {
    return (
      <main className="min-h-screen p-8 flex items-center justify-center">

        <div className="bg-white border border-gray-100 shadow-sm rounded-2xl p-12 text-center max-w-lg w-full">

          <h2 className="text-3xl font-bold text-[#0B1F3A]">
            Property Not Available
          </h2>

          <p className="text-gray-500 mt-3">
            This property could not be found in your account.
          </p>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard/my-properties"
              )
            }
            className="mt-7 bg-[#08192E] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
          >
            Back to My Properties
          </button>

        </div>

      </main>
    );
  }

  const status =
    property.status ||
    "Draft";

  const isPublished =
    status ===
    "Published";

  /*
  -----------------------------------
  PAGE
  -----------------------------------
  */

  return (
    <main className="max-w-6xl mx-auto p-4 md:p-8">

      {/* HEADER */}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">

        <button
          type="button"
          onClick={() =>
            router.push(
              "/dashboard/my-properties"
            )
          }
          className="self-start px-4 py-2 rounded-xl bg-gray-100 text-[#0B1F3A] font-semibold hover:bg-gray-200 transition"
        >
          ← Back to My Properties
        </button>

        <span
          className={`self-start sm:self-auto px-4 py-2 rounded-full text-sm font-bold ${getStatusStyle(
            status
          )}`}
        >
          {status}
        </span>

      </div>

      {/* TITLE */}

      <h1 className="text-4xl font-bold text-[#0B1F3A] mb-6">
        {property.title}
      </h1>

      {/* OWNER ACTIONS */}

      <div className="flex flex-wrap gap-3 mb-8">

        <button
          type="button"
          onClick={() =>
            router.push(
              `/dashboard/edit-property/${property.id}`
            )
          }
          className="bg-[#08192E] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
        >
          Edit Property
        </button>

        {isPublished && (
          <>
            <button
              type="button"
              onClick={() =>
                router.push(
                  `/properties/${property.id}`
                )
              }
              className="bg-[#C9A227] text-[#08192E] px-5 py-3 rounded-xl font-bold hover:brightness-110 transition"
            >
              Open Public Listing
            </button>

            <button
              type="button"
              onClick={
                shareProperty
              }
              className="border border-[#08192E] text-[#08192E] px-5 py-3 rounded-xl font-semibold hover:bg-[#08192E] hover:text-white transition"
            >
              Share
            </button>

            <button
              type="button"
              onClick={
                copyPropertyLink
              }
              className="border border-[#C9A227] text-[#9A7720] px-5 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
            >
              Copy Public Link
            </button>
          </>
        )}

      </div>

      {!isPublished && (
        <div className="mb-8 bg-yellow-50 border border-yellow-200 text-yellow-800 rounded-xl p-4">
          This is a private owner preview. The property is currently{" "}
          <strong>
            {status}
          </strong>{" "}
          and cannot be viewed publicly.
        </div>
      )}

      <div className="grid lg:grid-cols-2 gap-10">

        {/* MEDIA */}

        <div>

          {selectedImage ? (
            <>
              <img
                src={
                  selectedImage
                }
                alt={
                  property.title
                }
                className="w-full h-[450px] rounded-2xl object-cover shadow-sm"
              />

              {property
                .property_images
                ?.length > 0 && (
                <div className="flex gap-3 mt-4 overflow-x-auto pb-2">

                  {property.property_images.map(
                    (
                      image: any
                    ) => (
                      <img
                        key={
                          image.id
                        }
                        src={
                          image.image_url
                        }
                        alt=""
                        onClick={() =>
                          setSelectedImage(
                            image.image_url
                          )
                        }
                        className={`w-24 h-20 rounded-xl object-cover cursor-pointer border-2 ${
                          selectedImage ===
                          image.image_url
                            ? "border-[#C9A227]"
                            : "border-gray-200"
                        }`}
                      />
                    )
                  )}

                </div>
              )}
            </>
          ) : (
            <div className="w-full h-[450px] rounded-2xl bg-gray-200 flex items-center justify-center text-gray-500">
              No Image Available
            </div>
          )}

          {/* VIDEO */}

          {property.video_url && (
            <video
              src={
                property.video_url
              }
              controls
              className="w-full rounded-2xl mt-6 bg-black"
            />
          )}

        </div>

        {/* DETAILS */}

        <div className="space-y-7">

          <p className="text-4xl font-bold text-[#B8922E]">
            ₦
            {Number(
              property.price ||
                0
            ).toLocaleString()}
          </p>

          <div className="grid grid-cols-2 gap-4">

            <Info
              title="Property Type"
              value={
                property.property_type
              }
            />

            <Info
              title="Listing Type"
              value={
                property.listing_type
              }
            />

            <Info
              title="Bedrooms"
              value={
                property.bedrooms
              }
            />

            <Info
              title="Bathrooms"
              value={
                property.bathrooms
              }
            />

            <Info
              title="Toilets"
              value={
                property.toilets
              }
            />

            <Info
              title="Parking"
              value={
                property.parking
              }
            />

            <Info
              title="Size"
              value={
                property.size
                  ? `${property.size} sqm`
                  : "-"
              }
            />

            <Info
              title="Furnishing"
              value={
                property.furnishing
              }
            />

          </div>

          {/* DESCRIPTION */}

          <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">

            <h2 className="font-bold text-2xl text-[#0B1F3A]">
              Description
            </h2>

            <p className="text-gray-600 leading-8 mt-3 whitespace-pre-wrap">
              {property.description ||
                "No description provided."}
            </p>

          </section>

          {/* LOCATION */}

          <section className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">

            <h2 className="font-bold text-2xl text-[#0B1F3A]">
              Location
            </h2>

            <div className="text-gray-600 mt-3 space-y-1">

              {property.address && (
                <p>
                  {property.address}
                </p>
              )}

              {(property.city ||
                property.state) && (
                <p>
                  {[
                    property.city,
                    property.state,
                  ]
                    .filter(
                      Boolean
                    )
                    .join(
                      ", "
                    )}
                </p>
              )}

              {property.country && (
                <p>
                  {
                    property.country
                  }
                </p>
              )}

            </div>

          </section>
{property.latitude != null &&
property.longitude != null ? (
  <div className="mt-6">

    <PropertyMap
      property={property}
      mode="single"
      height="380px"
    />

  </div>
) : (
  <div className="mt-6 bg-gray-50 border border-dashed border-gray-300 rounded-xl p-6 text-center">

    <p className="font-semibold text-[#0B1F3A]">
      Map location not confirmed
    </p>

    <p className="text-sm text-gray-500 mt-2">
      Edit this property to capture or set its exact location.
    </p>

  </div>
)}
          {/* RECORD INFO */}

          <div className="pt-5 border-t border-gray-200">

            <p className="text-gray-400">
              Created{" "}
              {property.created_at
                ? new Date(
                    property.created_at
                  ).toLocaleDateString()
                : "-"}
            </p>

          </div>

        </div>

      </div>

    </main>
  );
}

/*
-----------------------------------
INFO CARD
-----------------------------------
*/

function Info({
  title,
  value,
}: {
  title: string;
  value: any;
}) {
  return (
    <div className="bg-[#FAFAF8] border border-gray-100 rounded-xl p-4">

      <p className="text-gray-400 text-sm">
        {title}
      </p>

      <p className="font-semibold text-lg text-[#0B1F3A] mt-1">
        {value ?? "-"}
      </p>

    </div>
  );
}