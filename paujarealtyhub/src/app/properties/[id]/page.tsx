"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

import ContactAgentModal from "@/components/messages/ContactAgentModal";
import dynamic from "next/dynamic";
import NearbyPlaces from "@/components/properties/NearbyPlaces";

import {
  getNearbyPlaces,
  type NearbyPlace,
} from "@/services/nearbyPlaces";

const PropertyMap = dynamic(
  () =>
    import(
      "@/components/properties/PropertyMap"
    ),
  {
    ssr: false,

    loading: () => (
      <div className="h-[420px] bg-[#FAFAF8] border border-gray-200 rounded-2xl flex items-center justify-center">
        <div className="text-center">
          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />

          <p className="text-gray-500 mt-4">
            Loading property map...
          </p>
        </div>
      </div>
    ),
  }
);

export default function PublicPropertyPage() {
  const { id } = useParams();

  const [property, setProperty] = useState<any>(null);
  const [agent, setAgent] = useState<any>(null);

  const [selectedImage, setSelectedImage] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  const [loading, setLoading] = useState(true);

  const [contactModalOpen, setContactModalOpen] =
    useState(false);

  const [nearbyPlaces, setNearbyPlaces] =
    useState<NearbyPlace[]>([]);

  const [nearbyLoading, setNearbyLoading] =
    useState(false);

  const [nearbyError, setNearbyError] =
    useState("");

  /*
  -----------------------------------
  LOAD PUBLIC PROPERTY
  -----------------------------------
  */

  useEffect(() => {
    if (id) {
      loadProperty();
    }
  }, [id]);

  async function loadProperty() {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("properties")
        .select(`
          *,
          property_images (
            id,
            image_url,
            is_cover
          )
        `)
        .eq("id", id)
        .eq("status", "Published")
        .single();

      if (error) {
        throw error;
      }

      const sortedImages = [
        ...(data.property_images || []),
      ].sort(
        (a: any, b: any) =>
          Number(b.is_cover) -
          Number(a.is_cover)
      );

      const formattedProperty = {
        ...data,
        property_images: sortedImages,
      };

      setProperty(formattedProperty);

      /*
      LOAD LISTING AGENT
      */

      const {
        data: agentProfile,
        error: agentError,
      } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          agency_name,
          phone,
          email,
          city,
          state,
          bio,
          avatar_url,
          verified
        `)
        .eq("id", data.user_id)
        .maybeSingle();

      if (agentError) {
        console.error(
          "LOAD AGENT ERROR:",
          agentError
        );
      } else {
        setAgent(agentProfile);
      }

      /*
      SELECT COVER / FIRST IMAGE
      */

      if (sortedImages.length > 0) {
        setSelectedImage(
          sortedImages[0].image_url
        );

        setCurrentIndex(0);
      } else {
        setSelectedImage(
          data.image_url || ""
        );
      }
    } catch (error) {
      console.error(
        "LOAD PROPERTY ERROR:",
        error
      );

      setProperty(null);
      setAgent(null);
    } finally {
      setLoading(false);
    }
  }

  /*
  -----------------------------------
  LOAD NEARBY PLACES
  -----------------------------------
  */

  useEffect(() => {
    async function loadNearbyPlaces() {
      if (
        !property ||
        property.latitude == null ||
        property.longitude == null
      ) {
        setNearbyPlaces([]);
        return;
      }

      try {
        setNearbyLoading(true);
        setNearbyError("");

        const places =
          await getNearbyPlaces(
            Number(property.latitude),
            Number(property.longitude)
          );

        setNearbyPlaces(places);
      } catch (error) {
        console.error(
          "LOAD NEARBY PLACES ERROR:",
          error
        );

        setNearbyPlaces([]);

        setNearbyError(
          "Unable to load nearby places."
        );
      } finally {
        setNearbyLoading(false);
      }
    }

    loadNearbyPlaces();
  }, [
    property?.latitude,
    property?.longitude,
  ]);

  /*
  -----------------------------------
  IMAGE GALLERY
  -----------------------------------
  */

  function previousImage() {
    if (
      !property?.property_images?.length
    ) {
      return;
    }

    const newIndex =
      currentIndex === 0
        ? property.property_images.length - 1
        : currentIndex - 1;

    setCurrentIndex(newIndex);

    setSelectedImage(
      property.property_images[newIndex]
        .image_url
    );
  }

  function nextImage() {
    if (
      !property?.property_images?.length
    ) {
      return;
    }

    const newIndex =
      currentIndex ===
      property.property_images.length - 1
        ? 0
        : currentIndex + 1;

    setCurrentIndex(newIndex);

    setSelectedImage(
      property.property_images[newIndex]
        .image_url
    );
  }

  /*
  -----------------------------------
  COPY LINK
  -----------------------------------
  */

  async function copyPropertyLink() {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      alert(
        "Property link copied."
      );
    } catch (error) {
      console.error(
        "COPY LINK ERROR:",
        error
      );

      alert(
        "Unable to copy property link."
      );
    }
  }

  /*
  -----------------------------------
  SHARE PROPERTY
  -----------------------------------
  */

  async function shareProperty() {
    const shareData = {
      title:
        property?.title ||
        "PaujaRealtyHub Property",

      text:
        `View this property on PaujaRealtyHub: ${
          property?.title || ""
        }`,

      url: window.location.href,
    };

    try {
      if (navigator.share) {
        await navigator.share(
          shareData
        );
      } else {
        await copyPropertyLink();
      }
    } catch (error: any) {
      if (
        error?.name !== "AbortError"
      ) {
        console.error(
          "SHARE ERROR:",
          error
        );

        alert(
          "Unable to share this property."
        );
      }
    }
  }

  /*
  -----------------------------------
  CONTACT DETAILS
  -----------------------------------
  */

  const callNumber =
    agent?.phone
      ? agent.phone.replace(
          /[^\d+]/g,
          ""
        )
      : "";

  const whatsappNumber =
    agent?.phone
      ? agent.phone.replace(
          /\D/g,
          ""
        )
      : "";

  /*
  -----------------------------------
  LOADING
  -----------------------------------
  */

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F7F7F3] flex items-center justify-center">

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
  PROPERTY NOT AVAILABLE
  -----------------------------------
  */

  if (!property) {
    return (
      <main className="min-h-screen bg-[#F7F7F3] flex items-center justify-center px-6">

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-12 text-center max-w-xl w-full">

          <div className="text-5xl mb-5">
            🏠
          </div>

          <h1 className="text-3xl font-bold text-[#0B1F3A]">
            Property Not Found
          </h1>

          <p className="text-gray-500 mt-3">
            This property may no longer be available.
          </p>

          <Link
            href="/properties"
            className="inline-block mt-7 bg-[#08192E] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
          >
            Browse Properties
          </Link>

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
    <main className="bg-[#F7F7F3] min-h-screen">

      {/* TOP STRIP */}

      <section className="bg-[#08192E] border-b border-[#C9A227]/30">

        <div className="max-w-7xl mx-auto px-6 py-5">

          <Link
            href="/properties"
            className="text-[#C9A227] font-semibold hover:text-white transition"
          >
            ← Back to Properties
          </Link>

        </div>

      </section>

      <div className="max-w-7xl mx-auto px-6 py-10">

        <div className="grid lg:grid-cols-2 gap-12">

          {/* GALLERY */}

          <div>

            <div className="relative h-[500px] rounded-2xl overflow-hidden bg-gray-200 shadow-lg">

              {selectedImage ? (
                <>
                  <Image
                    src={selectedImage}
                    alt={property.title}
                    fill
                    unoptimized
                    className="object-cover"
                  />

                  {property
                    .property_images
                    ?.length > 1 && (
                    <>
                      <button
                        type="button"
                        onClick={
                          previousImage
                        }
                        aria-label="Previous image"
                        className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/95 text-[#08192E] w-12 h-12 rounded-full shadow-lg text-2xl hover:bg-[#C9A227] transition z-10"
                      >
                        ‹
                      </button>

                      <button
                        type="button"
                        onClick={
                          nextImage
                        }
                        aria-label="Next image"
                        className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/95 text-[#08192E] w-12 h-12 rounded-full shadow-lg text-2xl hover:bg-[#C9A227] transition z-10"
                      >
                        ›
                      </button>
                    </>
                  )}
                </>
              ) : (
                <div className="h-full flex items-center justify-center text-gray-500">
                  No Image Available
                </div>
              )}

            </div>

            {/* THUMBNAILS */}

            {property
              .property_images
              ?.length > 0 && (
              <div className="flex gap-3 mt-4 overflow-x-auto pb-2">

                {property.property_images.map(
                  (
                    image: any,
                    index: number
                  ) => (
                    <Image
                      key={image.id}
                      src={
                        image.image_url
                      }
                      alt={`${property.title} image ${
                        index + 1
                      }`}
                      width={100}
                      height={80}
                      unoptimized
                      onClick={() => {
                        setSelectedImage(
                          image.image_url
                        );

                        setCurrentIndex(
                          index
                        );
                      }}
                      className={`w-24 h-20 object-cover rounded-xl cursor-pointer border-2 transition ${
                        currentIndex ===
                        index
                          ? "border-[#C9A227]"
                          : "border-transparent hover:border-gray-300"
                      }`}
                    />
                  )
                )}

              </div>
            )}

            {/* VIDEO */}

            {property.video_url && (
              <div className="mt-8 bg-white rounded-2xl border border-gray-100 shadow-sm p-5">

                <h2 className="text-xl font-bold text-[#0B1F3A] mb-4">
                  Property Video
                </h2>

                <video
                  src={
                    property.video_url
                  }
                  controls
                  className="w-full rounded-xl bg-black"
                />

              </div>
            )}

          </div>

          {/* PROPERTY DETAILS */}

          <div>

            <div className="flex flex-wrap gap-2 mb-5">

              <span className="bg-[#08192E]/5 border border-[#08192E]/10 text-[#08192E] text-sm font-semibold px-4 py-2 rounded-full">
                {property.property_type ||
                  "Property"}
              </span>

              <span className="bg-[#C9A227]/10 border border-[#C9A227]/20 text-[#9A7720] text-sm font-semibold px-4 py-2 rounded-full">
                {property.listing_type ||
                  "Listing"}
              </span>

            </div>

            <p className="text-4xl md:text-5xl font-extrabold text-[#B8922E]">
              ₦
              {Number(
                property.price || 0
              ).toLocaleString()}
            </p>

            <h1 className="text-4xl font-bold text-[#0B1F3A] mt-5 leading-tight">
              {property.title}
            </h1>

            <p className="text-gray-500 mt-3 text-lg">
              📍{" "}
              {[
                property.city,
                property.state,
              ]
                .filter(Boolean)
                .join(", ")}
            </p>

            {/* SHARE */}

            <div className="flex flex-wrap gap-3 mt-7">

              <button
                type="button"
                onClick={
                  shareProperty
                }
                className="bg-[#08192E] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
              >
                Share Property
              </button>

              <button
                type="button"
                onClick={
                  copyPropertyLink
                }
                className="border border-[#C9A227] text-[#9A7720] px-5 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
              >
                Copy Link
              </button>

            </div>

            {/* PROPERTY INFO */}

            <div className="grid grid-cols-2 gap-4 mt-10">

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

            <section className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-7">

              <div className="w-12 h-1 bg-[#C9A227] rounded-full mb-5" />

              <h2 className="text-2xl font-bold text-[#0B1F3A]">
                Description
              </h2>

              <p className="text-gray-600 leading-8 mt-4 whitespace-pre-wrap">
                {property.description ||
                  "No description provided."}
              </p>

            </section>

{/* PROPERTY SERVICES */}

<section className="mt-10 bg-[#08192E] text-white rounded-2xl shadow-lg p-7">

  <span className="text-[#C9A227] text-xs font-bold uppercase tracking-widest">
    Pauja Property Services
  </span>

  <h2 className="text-2xl font-bold mt-2">
    Need a Professional for This Property?
  </h2>

  <p className="text-gray-300 mt-3 leading-7">
    Find registered professionals and businesses that can help
    you inspect, secure, build, improve or manage this property.
  </p>

  <div className="grid sm:grid-cols-2 gap-3 mt-6">

    <Link
      href={`/businesses?category=Land%20Surveyor&location=${encodeURIComponent(
        property.city || property.state || ""
      )}`}
      className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
    >
      📐 Find a Surveyor
    </Link>

    <Link
      href={`/businesses?category=Property Lawyer&location=${encodeURIComponent(
        property.city || property.state || ""
      )}`}
      className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
    >
      ⚖️ Find a Property Lawyer
    </Link>

    <Link
      href={`/businesses?category=Builder%20%2F%20Contractor&location=${encodeURIComponent(
        property.city || property.state || ""
      )}`}
      className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
    >
      🏗️ Find a Builder
    </Link>

    <Link
      href={`/businesses?category=Interior Designer&location=${encodeURIComponent(
        property.city || property.state || ""
      )}`}
      className="bg-white/10 border border-white/10 rounded-xl px-4 py-3 font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
    >
      🛋️ Find an Interior Designer
    </Link>

  </div>

  <Link
    href={`/businesses?location=${encodeURIComponent(
      property.city || property.state || ""
    )}`}
    className="inline-flex mt-6 text-[#C9A227] font-bold hover:text-white transition"
  >
    Browse All Services in This Area →
  </Link>

</section>

            {/* AGENT */}

            {agent && (
              <section className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-lg p-7">

                <div className="flex items-center justify-between gap-4 mb-6">

                  <h2 className="text-2xl font-bold text-[#0B1F3A]">
                    Listed By
                  </h2>

                  {agent.verified && (
                    <span className="bg-green-100 text-green-700 text-sm font-semibold px-3 py-1 rounded-full">
                      ✓ Verified
                    </span>
                  )}

                </div>

                <div className="flex flex-col sm:flex-row items-start gap-5">

                  {agent.avatar_url ? (
                    <div className="relative w-20 h-20 rounded-full overflow-hidden border-4 border-[#C9A227] shrink-0">

                      <Image
                        src={
                          agent.avatar_url
                        }
                        alt={
                          agent.full_name ||
                          "Agent"
                        }
                        fill
                        unoptimized
                        className="object-cover"
                      />

                    </div>
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-[#08192E] border-4 border-[#C9A227] text-[#C9A227] flex items-center justify-center text-3xl font-bold shrink-0">

                      {(
                        agent.full_name ||
                        "A"
                      )
                        .charAt(0)
                        .toUpperCase()}

                    </div>
                  )}

                  <div className="flex-1">

                    <h3 className="text-2xl font-bold text-[#0B1F3A]">
                      {agent.full_name ||
                        "Property Professional"}
                    </h3>

                    {agent.agency_name && (
                      <p className="text-[#B8922E] font-semibold mt-1">
                        {agent.agency_name}
                      </p>
                    )}

                    {(agent.city ||
                      agent.state) && (
                      <p className="text-gray-500 mt-2">
                        📍{" "}
                        {[
                          agent.city,
                          agent.state,
                        ]
                          .filter(Boolean)
                          .join(", ")}
                      </p>
                    )}

                    {agent.bio && (
                      <p className="mt-4 text-gray-600 leading-7">
                        {agent.bio}
                      </p>
                    )}

                    <div className="flex flex-wrap gap-3 mt-6">

                      <button
                        type="button"
                        onClick={() =>
                          setContactModalOpen(
                            true
                          )
                        }
                        className="bg-[#08192E] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
                      >
                        💬 Contact Agent
                      </button>

                      {agent.phone && (
                        <a
                          href={`tel:${callNumber}`}
                          className="border border-[#08192E] text-[#08192E] px-5 py-3 rounded-xl font-semibold hover:bg-[#08192E] hover:text-white transition"
                        >
                          📞 Call
                        </a>
                      )}

                      {agent.phone && (
                        <a
                          href={`https://wa.me/${whatsappNumber}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="bg-green-600 text-white px-5 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                        >
                          💬 WhatsApp
                        </a>
                      )}

                      {agent.email && (
                        <a
                          href={`mailto:${agent.email}`}
                          className="border border-[#C9A227] text-[#9A7720] px-5 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
                        >
                          ✉ Email
                        </a>
                      )}

                      <Link
                        href={`/agents/${agent.id}`}
                        className="border border-gray-300 text-gray-700 px-5 py-3 rounded-xl font-semibold hover:bg-gray-100 transition"
                      >
                        View Agent Profile
                      </Link>

                    </div>

                  </div>

                </div>

              </section>
            )}

            {/* LOCATION */}

            <section className="mt-10 bg-white rounded-2xl border border-gray-100 shadow-sm p-7">

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                <div>

                  <span className="text-[#B8922E] text-xs font-bold uppercase tracking-widest">
                    Pauja Location Intelligence
                  </span>

                  <h2 className="text-2xl font-bold text-[#0B1F3A] mt-2">
                    Property Location
                  </h2>

                  <p className="text-gray-500 mt-2">
                    Explore the location attached to this property listing.
                  </p>

                </div>

                {property.latitude !== null &&
                  property.longitude !== null && (
                    <span className="self-start bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                      ✓ Location Confirmed
                    </span>
                  )}

              </div>

              {/* ADDRESS */}

              <div className="mt-6 bg-[#FAFAF8] border border-gray-100 rounded-xl p-5">

                <p className="font-semibold text-[#0B1F3A]">
                  📍 Address
                </p>

                <div className="mt-3 space-y-1 text-gray-600">

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
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}

                  {property.country && (
                    <p>
                      {property.country}
                    </p>
                  )}

                </div>

              </div>

              {/* MAP */}

              {property.latitude !== null &&
              property.longitude !== null ? (
                <div className="mt-6">

                  <PropertyMap
                    property={property}
                    mode="single"
                    height="420px"
                  />

                </div>
              ) : (
                <div className="mt-6 border border-dashed border-gray-300 rounded-2xl p-8 text-center bg-[#FAFAF8]">

                  <div className="text-4xl">
                    🗺️
                  </div>

                  <h3 className="font-bold text-[#0B1F3A] mt-3">
                    Map Location Not Available
                  </h3>

                  <p className="text-gray-500 mt-2">
                    The exact map location has not been confirmed for this property.
                  </p>

                </div>
              )}

            </section>

            {/* PAUJA AREA INTELLIGENCE */}

            {property.latitude != null &&
              property.longitude != null && (
                <NearbyPlaces
                  places={nearbyPlaces}
                  loading={nearbyLoading}
                  error={nearbyError}
                />
              )}

          </div>

        </div>

      </div>

      {/* CONTACT AGENT MODAL */}

      {agent && (
        <ContactAgentModal
          open={
            contactModalOpen
          }
          onClose={() =>
            setContactModalOpen(
              false
            )
          }
          propertyId={
            Number(
              property.id
            )
          }
          propertyTitle={
            property.title
          }
          receiverId={
            agent.id
          }
          phone={
            agent.phone
          }
          email={
            agent.email
          }
        />
      )}

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
    <div className="bg-white border border-gray-100 rounded-xl p-5 shadow-sm">

      <p className="text-xs uppercase tracking-wide font-semibold text-gray-400">
        {title}
      </p>

      <p className="font-bold text-lg text-[#0B1F3A] mt-2">
        {value || "-"}
      </p>

    </div>
  );
}