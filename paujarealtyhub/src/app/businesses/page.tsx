"use client";
import {
  Suspense,
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";
import { BUSINESS_CATEGORIES } from "@/lib/businessCategories";

type Business = {
  id: number;
  business_name: string;
  category: string | null;
  description: string | null;
  city: string | null;
  state: string | null;
  status: string | null;
  logo_url: string | null;
  cover_image_url: string | null;
};

function BusinessesContent() {
  const searchParams = useSearchParams();

  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [locationTerm, setLocationTerm] = useState("");

  useEffect(() => {
    const category =
      searchParams.get("category") || "";

    const location =
      searchParams.get("location") || "";

    setSelectedCategory(category);
    setLocationTerm(location);
  }, [searchParams]);

  useEffect(() => {
    async function loadBusinesses() {
      try {
        setLoading(true);
        setErrorMessage("");

        const { data, error } = await supabase
          .from("businesses")
          .select(`
            id,
            business_name,
            category,
            description,
            city,
            state,
            status,
            logo_url,
            cover_image_url
          `)
          .eq("status", "Active")
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          console.error(
            "LOAD PUBLIC BUSINESSES ERROR:",
            error
          );

          setErrorMessage(
            "Unable to load businesses."
          );

          return;
        }

        setBusinesses(data || []);
      } catch (error) {
        console.error(
          "LOAD PUBLIC BUSINESSES ERROR:",
          error
        );

        setErrorMessage(
          "Unable to load businesses."
        );
      } finally {
        setLoading(false);
      }
    }

    loadBusinesses();
  }, []);

  const filteredBusinesses = useMemo(() => {
    const keyword =
      searchTerm.trim().toLowerCase();

    const location =
      locationTerm.trim().toLowerCase();

    return businesses.filter((business) => {
      const matchesKeyword =
        !keyword ||
        business.business_name
          .toLowerCase()
          .includes(keyword) ||
        (business.category || "")
          .toLowerCase()
          .includes(keyword) ||
        (business.description || "")
          .toLowerCase()
          .includes(keyword);

      const matchesCategory =
        !selectedCategory ||
        (business.category || "")
          .toLowerCase() ===
          selectedCategory.toLowerCase();

      const matchesLocation =
        !location ||
        (business.city || "")
          .toLowerCase()
          .includes(location) ||
        (business.state || "")
          .toLowerCase()
          .includes(location);

      return (
        matchesKeyword &&
        matchesCategory &&
        matchesLocation
      );
    });
  }, [
    businesses,
    searchTerm,
    selectedCategory,
    locationTerm,
  ]);

  function clearFilters() {
    setSearchTerm("");
    setSelectedCategory("");
    setLocationTerm("");
  }

  const hasFilters =
    searchTerm.trim() ||
    selectedCategory ||
    locationTerm.trim();

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F7F7F3]">

        {/* HERO */}

        <section className="bg-[#08192E] text-white">
          <div className="max-w-7xl mx-auto px-4 md:px-6 py-14 md:py-20">

            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8">

              <div>
                <span className="text-[#C9A227] text-sm font-bold uppercase tracking-widest">
                  Pauja Business Ecosystem
                </span>

                <h1 className="text-4xl md:text-5xl font-bold mt-3">
                  Discover Trusted Businesses
                </h1>

                <p className="text-gray-300 mt-4 max-w-2xl">
                  Find professionals and businesses that support
                  property, construction, hospitality and everyday
                  services across Nigeria.
                </p>
              </div>

              <Link
                href="/dashboard/businesses/register"
                className="inline-flex self-start lg:self-auto items-center justify-center bg-[#C9A227] text-[#08192E] px-6 py-3.5 rounded-xl font-bold hover:brightness-110 transition whitespace-nowrap"
              >
                + Register Your Business
              </Link>

            </div>

          </div>
        </section>

        {/* SEARCH */}

        <section className="max-w-7xl mx-auto px-4 md:px-6">

          <div className="bg-white border border-gray-100 shadow-lg rounded-2xl p-5 md:p-6 -mt-7 relative z-10">

            <div className="grid md:grid-cols-3 gap-4">

              {/* KEYWORD */}

              <div>
                <label className="block text-sm font-bold text-[#0B1F3A] mb-2">
                  What do you need?
                </label>

                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) =>
                    setSearchTerm(e.target.value)
                  }
                  placeholder="e.g. Surveyor, builder, hotel..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[#0B1F3A] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label className="block text-sm font-bold text-[#0B1F3A] mb-2">
                  Service Category
                </label>

                <select
                  value={selectedCategory}
                  onChange={(e) =>
                    setSelectedCategory(
                      e.target.value
                    )
                  }
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[#0B1F3A] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                >
                  <option value="">
                    All Services
                  </option>

                  {BUSINESS_CATEGORIES.map(
                    (category) => (
                      <option
                        key={category}
                        value={category}
                      >
                        {category}
                      </option>
                    )
                  )}

                </select>
              </div>

              {/* LOCATION */}

              <div>
                <label className="block text-sm font-bold text-[#0B1F3A] mb-2">
                  Where?
                </label>

                <input
                  type="text"
                  value={locationTerm}
                  onChange={(e) =>
                    setLocationTerm(
                      e.target.value
                    )
                  }
                  placeholder="e.g. Lagos, Ikeja, Abuja..."
                  className="w-full border border-gray-200 rounded-xl px-4 py-3 text-[#0B1F3A] bg-[#FAFAF8] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />
              </div>

            </div>

            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-5">

              <p className="text-sm text-gray-500">
                {!loading && (
                  <>
                    Showing{" "}

                    <strong className="text-[#0B1F3A]">
                      {
                        filteredBusinesses.length
                      }
                    </strong>{" "}

                    {filteredBusinesses.length === 1
                      ? "business"
                      : "businesses"}
                  </>
                )}
              </p>

              {hasFilters && (
                <button
                  type="button"
                  onClick={clearFilters}
                  className="self-start sm:self-auto text-sm font-semibold text-[#8B6C16] hover:text-[#0B1F3A] transition"
                >
                  Clear Filters
                </button>
              )}

            </div>

          </div>

        </section>

        {/* RESULTS */}

        <section className="max-w-7xl mx-auto px-4 md:px-6 py-10">

          {loading && (
            <div className="bg-white rounded-2xl border border-gray-100 p-10 text-center">
              <p className="text-gray-500">
                Loading businesses...
              </p>
            </div>
          )}

          {!loading && errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
              {errorMessage}
            </div>
          )}

          {!loading &&
            !errorMessage &&
            businesses.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">

                <h2 className="text-2xl font-bold text-[#0B1F3A]">
                  No Businesses Yet
                </h2>

                <p className="text-gray-500 mt-3">
                  Registered businesses will appear here.
                </p>

                <Link
                  href="/dashboard/businesses/register"
                  className="inline-flex mt-6 bg-[#C9A227] text-[#08192E] px-6 py-3 rounded-xl font-bold hover:brightness-110 transition"
                >
                  Register Your Business
                </Link>

              </div>
            )}

          {!loading &&
            !errorMessage &&
            businesses.length > 0 &&
            filteredBusinesses.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 p-12 text-center">

                <div className="text-4xl">
                  🔎
                </div>

                <h2 className="text-2xl font-bold text-[#0B1F3A] mt-4">
                  No Matching Businesses
                </h2>

                <p className="text-gray-500 mt-3">
                  No registered business currently matches
                  this service and location.
                </p>

                <p className="text-gray-400 text-sm mt-2">
                  Try another service, location, or browse
                  all registered businesses.
                </p>

                <button
                  type="button"
                  onClick={clearFilters}
                  className="mt-6 bg-[#08192E] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#C9A227] hover:text-[#08192E] transition"
                >
                  Browse All Businesses
                </button>

              </div>
            )}

          {!loading &&
            !errorMessage &&
            filteredBusinesses.length > 0 && (
              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-7">

                {filteredBusinesses.map(
                  (business) => (
                    <article
                      key={business.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition"
                    >

                      <div className="h-48 bg-gray-100 overflow-hidden">

                        {business.cover_image_url ? (
                          <img
                            src={
                              business.cover_image_url
                            }
                            alt={
                              business.business_name
                            }
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-gray-400">
                            Business Cover
                          </div>
                        )}

                      </div>

                      <div className="p-6">

                        <div className="flex items-start gap-4">

                          {business.logo_url ? (
                            <img
                              src={
                                business.logo_url
                              }
                              alt={`${business.business_name} logo`}
                              className="w-16 h-16 rounded-xl object-cover border border-gray-200"
                            />
                          ) : (
                            <div className="w-16 h-16 rounded-xl bg-[#F4F1E8] flex items-center justify-center font-bold text-[#8B6C16]">
                              B
                            </div>
                          )}

                          <div className="min-w-0">

                            <p className="text-xs uppercase tracking-wider font-bold text-[#B8922E]">
                              {
                                business.category ||
                                "Business"
                              }
                            </p>

                            <h2 className="text-xl font-bold text-[#0B1F3A] mt-1">
                              {
                                business.business_name
                              }
                            </h2>

                            <p className="text-sm text-gray-500 mt-1">
                              {[
                                business.city,
                                business.state,
                              ]
                                .filter(Boolean)
                                .join(", ") ||
                                "Location not supplied"}
                            </p>

                          </div>

                        </div>

                        {business.description && (
                          <p className="text-gray-500 mt-5 line-clamp-3">
                            {
                              business.description
                            }
                          </p>
                        )}

                        <Link
                          href={`/businesses/${business.id}`}
                          className="inline-flex mt-6 bg-[#08192E] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
                        >
                          View Business
                        </Link>

                      </div>

                    </article>
                  )
                )}

              </div>
            )}

        </section>

      </main>

      <Footer />
    </>
  );
}
export default function PublicBusinessesPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-[#F7F7F3] flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />

            <p className="text-gray-500 mt-5">
              Loading businesses...
            </p>
          </div>
        </main>
      }
    >
      <BusinessesContent />
    </Suspense>
  );
}