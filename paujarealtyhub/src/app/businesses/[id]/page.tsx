"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useRouter,
} from "next/navigation";
import Link from "next/link";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

type Business = {
  id: number;
  business_name: string;
  category: string | null;
  description: string | null;

  phone: string | null;
  whatsapp: string | null;
  email: string | null;
  website: string | null;

  country: string | null;
  state: string | null;
  city: string | null;
  address: string | null;

  latitude: number | null;
  longitude: number | null;

  logo_url: string | null;
  cover_image_url: string | null;
  promo_video_url: string | null;
  promo_video_duration: number | null;

  status: string | null;
};

type BusinessImage = {
  id: number;
  business_id: number;
  image_url: string;
  sort_order: number;
};

export default function PublicBusinessPage() {
  const params = useParams();
  const router = useRouter();

  const businessId = params?.id as string;

  const [business, setBusiness] =
    useState<Business | null>(null);

  const [gallery, setGallery] =
    useState<BusinessImage[]>([]);

  const [user, setUser] =
    useState<any>(null);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    async function checkUser() {
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      setUser(user);
    }

    checkUser();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(
            session?.user ?? null
          );
        }
      );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  useEffect(() => {
    async function loadBusiness() {
      try {
        setLoading(true);
        setErrorMessage("");

        const {
          data,
          error,
        } = await supabase
          .from("businesses")
          .select("*")
          .eq("id", businessId)
          .eq("status", "Active")
          .maybeSingle();

        if (error) {
          console.error(
            "LOAD PUBLIC BUSINESS ERROR:",
            error
          );

          setErrorMessage(
            "Unable to load this business."
          );

          return;
        }

        if (!data) {
          setErrorMessage(
            "Business not found."
          );

          return;
        }

        setBusiness(data);

        const {
          data: imageData,
          error: imageError,
        } = await supabase
          .from("business_images")
          .select("*")
          .eq(
            "business_id",
            data.id
          )
          .order("sort_order", {
            ascending: true,
          });

        if (imageError) {
          console.error(
            "LOAD BUSINESS GALLERY ERROR:",
            imageError
          );
        } else {
          setGallery(
            imageData || []
          );
        }
      } catch (error) {
        console.error(
          "PUBLIC BUSINESS ERROR:",
          error
        );

        setErrorMessage(
          "Unable to load this business."
        );
      } finally {
        setLoading(false);
      }
    }

    if (businessId) {
      loadBusiness();
    }
  }, [businessId]);

  function requireLogin(
    action: () => void
  ) {
    if (!user) {
      router.push(
        `/login?next=${encodeURIComponent(
          `/businesses/${businessId}`
        )}`
      );

      return;
    }

    action();
  }

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#F7F7F3] flex items-center justify-center">
          <p className="text-gray-500">
            Loading business...
          </p>
        </main>

        <Footer />
      </>
    );
  }

  if (
    errorMessage ||
    !business
  ) {
    return (
      <>
        <Navbar />

        <main className="min-h-screen bg-[#F7F7F3] py-16 px-4">
          <div className="max-w-3xl mx-auto bg-white border border-gray-100 rounded-2xl p-10 text-center">

            <h1 className="text-3xl font-bold text-[#0B1F3A]">
              Business Unavailable
            </h1>

            <p className="text-gray-500 mt-3">
              {errorMessage ||
                "Business not found."}
            </p>

            <Link
              href="/businesses"
              className="inline-block mt-6 bg-[#08192E] text-white px-6 py-3 rounded-xl font-semibold"
            >
              Browse Businesses
            </Link>

          </div>
        </main>

        <Footer />
      </>
    );
  }

  const whatsappLink =
    business.whatsapp
      ? `https://wa.me/${business.whatsapp.replace(
          /\D/g,
          ""
        )}`
      : "";

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F7F7F3]">

        {/* COVER */}

        <section className="bg-[#08192E]">

          <div className="max-w-7xl mx-auto">

            {business.cover_image_url ? (
              <div className="h-72 md:h-[420px] overflow-hidden">

                <img
                  src={
                    business.cover_image_url
                  }
                  alt={
                    business.business_name
                  }
                  className="w-full h-full object-cover"
                />

              </div>
            ) : (
              <div className="h-64 flex items-center justify-center text-gray-400">
                Business Cover
              </div>
            )}

          </div>

        </section>

        <section className="max-w-7xl mx-auto px-4 md:px-6 py-8">

          {/* HEADER */}

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">

            <div className="flex flex-col md:flex-row md:items-start gap-6">

              {business.logo_url ? (
                <img
                  src={
                    business.logo_url
                  }
                  alt={`${business.business_name} logo`}
                  className="w-28 h-28 rounded-2xl object-cover border border-gray-200"
                />
              ) : (
                <div className="w-28 h-28 rounded-2xl bg-[#F4F1E8] flex items-center justify-center text-[#8B6C16] text-3xl font-black">
                  B
                </div>
              )}

              <div className="flex-1">

                <p className="text-[#B8922E] text-sm font-bold uppercase tracking-wider">
                  {business.category ||
                    "Business"}
                </p>

                <h1 className="text-4xl font-bold text-[#0B1F3A] mt-2">
                  {
                    business.business_name
                  }
                </h1>

                <p className="text-gray-500 mt-2">
                  {[
                    business.city,
                    business.state,
                  ]
                    .filter(Boolean)
                    .join(", ") ||
                    "Location not supplied"}
                </p>

                <span className="inline-block mt-4 bg-green-100 text-green-700 px-4 py-2 rounded-full text-sm font-bold">
                  {business.status ||
                    "Active"}
                </span>

              </div>

            </div>

          </div>

          <div className="grid lg:grid-cols-3 gap-7 mt-7">

            {/* LEFT */}

            <div className="lg:col-span-2 space-y-7">

              {business.description && (
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">

                  <h2 className="text-2xl font-bold text-[#0B1F3A]">
                    About This Business
                  </h2>

                  <p className="text-gray-600 mt-4 whitespace-pre-line leading-7">
                    {
                      business.description
                    }
                  </p>

                </section>
              )}

              {gallery.length > 0 && (
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">

                  <h2 className="text-2xl font-bold text-[#0B1F3A]">
                    Gallery
                  </h2>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">

                    {gallery.map(
                      (image) => (
                        <div
                          key={
                            image.id
                          }
                          className="h-44 md:h-52 rounded-xl overflow-hidden bg-gray-100"
                        >

                          <img
                            src={
                              image.image_url
                            }
                            alt={
                              business.business_name
                            }
                            className="w-full h-full object-cover"
                          />

                        </div>
                      )
                    )}

                  </div>

                </section>
              )}

              {business.promo_video_url && (
                <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8">

                  <h2 className="text-2xl font-bold text-[#0B1F3A]">
                    Promotional Video
                  </h2>

                  <video
                    src={
                      business.promo_video_url
                    }
                    controls
                    className="w-full rounded-2xl bg-black mt-5"
                  />

                  {business.promo_video_duration !==
                    null && (
                    <p className="text-sm text-gray-500 mt-2">
                      Duration:{" "}
                      {
                        business.promo_video_duration
                      }{" "}
                      seconds
                    </p>
                  )}

                </section>
              )}

            </div>

            {/* RIGHT */}

            <div className="space-y-7">

              {/* CONTACT */}

              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                <h2 className="text-xl font-bold text-[#0B1F3A]">
                  Contact Business
                </h2>

                {!user && (
                  <p className="text-sm text-gray-500 mt-2">
                    Sign in to contact
                    this business.
                  </p>
                )}

                <div className="space-y-3 mt-5">

                  {business.phone && (
                    <button
                      type="button"
                      onClick={() =>
                        requireLogin(
                          () => {
                            window.location.href =
                              `tel:${business.phone}`;
                          }
                        )
                      }
                      className="w-full bg-[#08192E] text-white text-center px-5 py-3 rounded-xl font-semibold"
                    >
                      📞 Call Business
                    </button>
                  )}

                  {business.whatsapp && (
                    <button
                      type="button"
                      onClick={() =>
                        requireLogin(
                          () => {
                            window.open(
                              whatsappLink,
                              "_blank",
                              "noopener,noreferrer"
                            );
                          }
                        )
                      }
                      className="w-full bg-green-600 text-white text-center px-5 py-3 rounded-xl font-semibold"
                    >
                      💬 WhatsApp
                    </button>
                  )}

                  {business.email && (
                    <button
                      type="button"
                      onClick={() =>
                        requireLogin(
                          () => {
                            window.location.href =
                              `mailto:${business.email}`;
                          }
                        )
                      }
                      className="w-full border border-gray-300 text-[#0B1F3A] text-center px-5 py-3 rounded-xl font-semibold"
                    >
                      ✉️ Email
                    </button>
                  )}

                  {business.website && (
                    <a
                      href={
                        business.website
                      }
                      target="_blank"
                      rel="noreferrer"
                      className="block border border-[#C9A227] text-[#8B6C16] text-center px-5 py-3 rounded-xl font-semibold"
                    >
                      🌐 Visit Website
                    </a>
                  )}

                </div>

              </section>

              {/* LOCATION */}

              <section className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">

                <h2 className="text-xl font-bold text-[#0B1F3A]">
                  Business Location
                </h2>

                <div className="text-gray-600 mt-4 space-y-1">

                  {business.address && (
                    <p>
                      {
                        business.address
                      }
                    </p>
                  )}

                  <p>
                    {[
                      business.city,
                      business.state,
                    ]
                      .filter(Boolean)
                      .join(", ")}
                  </p>

                  {business.country && (
                    <p>
                      {
                        business.country
                      }
                    </p>
                  )}

                </div>

                {business.latitude !==
                  null &&
                  business.longitude !==
                    null && (
                    <div className="mt-5 rounded-xl bg-[#08192E] text-white p-5">

                      <p className="text-[#C9A227] text-xs font-bold uppercase tracking-wider">
                        Pauja Location
                        Intelligence
                      </p>

                      <p className="text-sm mt-2">
                        ✓ Exact business
                        location confirmed
                      </p>

                    </div>
                  )}

              </section>

            </div>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}