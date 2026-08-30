"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

type Business = {
  id: number;
  user_id: string;
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
  created_at: string | null;
};

type BusinessImage = {
  id: number;
  business_id: number;
  image_url: string;
  sort_order: number;
};

export default function BusinessViewPage() {
  const params = useParams();
  const router = useRouter();

  const businessId = params?.id as string;

  const [business, setBusiness] = useState<Business | null>(null);
  const [gallery, setGallery] = useState<BusinessImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    async function loadBusiness() {
      try {
        setLoading(true);
        setErrorMessage("");

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { data, error } = await supabase
          .from("businesses")
          .select("*")
          .eq("id", businessId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("LOAD BUSINESS ERROR:", error);
          setErrorMessage("Unable to load this business.");
          return;
        }

        if (!data) {
          setErrorMessage(
            "Business not found or you do not have permission to view it."
          );
          return;
        }

        setBusiness(data);

        const { data: imageData, error: imageError } = await supabase
          .from("business_images")
          .select("*")
          .eq("business_id", data.id)
          .order("sort_order", { ascending: true });

        if (imageError) {
          console.error("LOAD BUSINESS IMAGES ERROR:", imageError);
        } else {
          setGallery(imageData || []);
        }
      } catch (error) {
        console.error("BUSINESS VIEW ERROR:", error);
        setErrorMessage("Unable to load this business.");
      } finally {
        setLoading(false);
      }
    }

    if (businessId) {
      loadBusiness();
    }
  }, [businessId, router]);

  if (loading) {
    return (
      <main className="p-6 md:p-8">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-500">Loading business...</p>
        </div>
      </main>
    );
  }

  if (errorMessage || !business) {
    return (
      <main className="p-6 md:p-8">
        <div className="max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl p-8">
          <h1 className="text-2xl font-bold text-[#0B1F3A]">
            Business unavailable
          </h1>

          <p className="text-gray-500 mt-3">
            {errorMessage || "Business not found."}
          </p>

          <Link
            href="/dashboard/businesses"
            className="inline-block mt-6 bg-[#08192E] text-white px-5 py-3 rounded-xl font-semibold"
          >
            Back to My Businesses
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <div>
            <p className="text-[#B8922E] text-sm font-bold uppercase tracking-wider">
              Pauja Business Ecosystem
            </p>

            <h1 className="text-4xl font-bold text-[#0B1F3A] mt-2">
              {business.business_name}
            </h1>
          </div>

          <div className="flex gap-3">
            <Link
              href="/dashboard/businesses"
              className="border border-gray-300 px-5 py-3 rounded-xl font-semibold"
            >
              ← My Businesses
            </Link>

            <Link
              href={`/dashboard/businesses/${business.id}/edit`}
              className="bg-[#C9A227] text-[#08192E] px-5 py-3 rounded-xl font-bold"
            >
              Edit Business
            </Link>
          </div>
        </div>

        {business.cover_image_url && (
          <div className="w-full h-64 md:h-96 rounded-2xl overflow-hidden bg-gray-100 mb-6">
            <img
              src={business.cover_image_url}
              alt={business.business_name}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="grid lg:grid-cols-3 gap-6">

          <div className="lg:col-span-2 space-y-6">

            <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <div className="flex items-start gap-5">

                {business.logo_url && (
                  <img
                    src={business.logo_url}
                    alt={`${business.business_name} logo`}
                    className="w-24 h-24 rounded-2xl object-cover border border-gray-200"
                  />
                )}

                <div>
                  <p className="text-[#B8922E] font-bold">
                    {business.category || "Business"}
                  </p>

                  <h2 className="text-2xl font-bold text-[#0B1F3A] mt-1">
                    {business.business_name}
                  </h2>

                  <span className="inline-block mt-3 bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold">
                    {business.status || "Active"}
                  </span>
                </div>

              </div>

              {business.description && (
                <div className="mt-6 border-t border-gray-100 pt-6">
                  <h3 className="text-xl font-bold text-[#0B1F3A]">
                    About
                  </h3>

                  <p className="text-gray-600 mt-3 whitespace-pre-line">
                    {business.description}
                  </p>
                </div>
              )}
            </section>

            {gallery.length > 0 && (
              <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-[#0B1F3A]">
                  Gallery
                </h2>

                <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mt-5">
                  {gallery.map((image) => (
                    <div
                      key={image.id}
                      className="h-44 rounded-xl overflow-hidden bg-gray-100"
                    >
                      <img
                        src={image.image_url}
                        alt="Business gallery"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  ))}
                </div>
              </section>
            )}

            {business.promo_video_url && (
              <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
                <h2 className="text-2xl font-bold text-[#0B1F3A]">
                  Promotional Video
                </h2>

                <video
                  src={business.promo_video_url}
                  controls
                  className="w-full rounded-2xl bg-black mt-5"
                />

                {business.promo_video_duration !== null && (
                  <p className="text-sm text-gray-500 mt-2">
                    Duration: {business.promo_video_duration} seconds
                  </p>
                )}
              </section>
            )}

          </div>

          <div className="space-y-6">

            <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0B1F3A]">
                Contact Information
              </h2>

              <div className="space-y-3 mt-5 text-gray-600">
                {business.phone && <p>📞 {business.phone}</p>}
                {business.whatsapp && <p>💬 {business.whatsapp}</p>}
                {business.email && <p>✉️ {business.email}</p>}

                {business.website && (
                  <p>
                    🌐{" "}
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 underline"
                    >
                      Website
                    </a>
                  </p>
                )}
              </div>
            </section>

            <section className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">
              <h2 className="text-xl font-bold text-[#0B1F3A]">
                Business Location
              </h2>

              <div className="mt-5 text-gray-600 space-y-1">
                {business.address && <p>{business.address}</p>}

                <p>
                  {[business.city, business.state]
                    .filter(Boolean)
                    .join(", ")}
                </p>

                {business.country && <p>{business.country}</p>}
              </div>

              {business.latitude !== null &&
                business.longitude !== null && (
                  <div className="mt-5 bg-[#08192E] text-white rounded-xl p-4">
                    <p className="text-[#C9A227] text-xs uppercase font-bold">
                      Pauja Location Intelligence
                    </p>

                    <p className="text-sm mt-2">
                      ✓ Exact business location confirmed
                    </p>
                  </div>
                )}
            </section>

          </div>

        </div>
      </div>
    </main>
  );
}