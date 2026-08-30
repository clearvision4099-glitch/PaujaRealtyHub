"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type Business = {
  id: string;
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
  status: string | null;
  created_at?: string | null;
};

export default function BusinessesPage() {
  const router = useRouter();

  const [businesses, setBusinesses] =
    useState<Business[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    async function loadBusinesses() {
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
          .eq("user_id", user.id)
          .order("created_at", {
            ascending: false,
          });

        if (error) {
          console.error(
            "LOAD BUSINESSES ERROR:",
            error
          );

          setErrorMessage(
            "Unable to load your businesses."
          );

          return;
        }

        setBusinesses(data || []);
      } catch (error) {
        console.error(
          "LOAD BUSINESSES ERROR:",
          error
        );

        setErrorMessage(
          "Unable to load your businesses."
        );
      } finally {
        setLoading(false);
      }
    }

    loadBusinesses();
  }, [router]);

  return (
    <main className="p-4 md:p-8">

      <div className="max-w-6xl mx-auto">

        {/* HEADER */}

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>

            <span className="text-[#B8922E] text-sm font-semibold uppercase tracking-wider">
              Pauja Business Ecosystem
            </span>

            <h1 className="text-4xl font-bold text-[#0B1F3A] mt-2">
              My Businesses
            </h1>

            <p className="text-gray-500 mt-2">
              Manage the businesses you have registered
              on PaujaRealtyHub.
            </p>

          </div>

          <Link
            href="/dashboard/businesses/register"
            className="inline-flex items-center justify-center bg-[#C9A227] text-[#08192E] px-6 py-3 rounded-xl font-bold hover:brightness-110 transition"
          >
            + Register Business
          </Link>

        </div>

        {/* LOADING */}

        {loading && (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-8">
            <p className="text-gray-500">
              Loading your businesses...
            </p>
          </div>
        )}

        {/* ERROR */}

        {!loading &&
          errorMessage && (
            <div className="bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
              {errorMessage}
            </div>
          )}

        {/* EMPTY */}

        {!loading &&
          !errorMessage &&
          businesses.length === 0 && (
            <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-10 text-center">

              <h2 className="text-2xl font-bold text-[#0B1F3A]">
                No businesses yet
              </h2>

              <p className="text-gray-500 mt-2">
                Register your first business to make it
                available within the Pauja Business
                Ecosystem.
              </p>

              <Link
                href="/dashboard/businesses/register"
                className="inline-block mt-6 bg-[#08192E] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#C9A227] hover:text-[#08192E] transition"
              >
                Register Your First Business
              </Link>

            </div>
          )}

        {/* BUSINESS CARDS */}

        {!loading &&
          !errorMessage &&
          businesses.length > 0 && (
            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

              {businesses.map(
                (business) => (
                  <div
                    key={business.id}
                    className="bg-white border border-gray-100 rounded-2xl shadow-md p-6"
                  >

                    <div className="flex items-start justify-between gap-4">

                      <div>

                        <p className="text-xs uppercase tracking-wider font-semibold text-[#B8922E]">
                          {business.category ||
                            "Business"}
                        </p>

                        <h2 className="text-2xl font-bold text-[#0B1F3A] mt-2">
                          {business.business_name}
                        </h2>

                      </div>

                      <span
                        className={`px-3 py-1 rounded-full text-xs font-bold ${
                          business.status ===
                          "Active"
                            ? "bg-green-100 text-green-700"
                            : business.status ===
                              "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : business.status ===
                              "Rejected"
                            ? "bg-red-100 text-red-700"
                            : "bg-gray-100 text-gray-600"
                        }`}
                      >
                        {business.status ||
                          "Unknown"}
                      </span>

                    </div>

                    {business.description && (
                      <p className="text-gray-500 mt-4 line-clamp-3">
                        {business.description}
                      </p>
                    )}

                    <div className="mt-5 space-y-2 text-sm text-gray-600">

                      {(business.city ||
                        business.state) && (
                        <p>
                          📍{" "}
                          {business.city || ""}
                          {business.city &&
                          business.state
                            ? ", "
                            : ""}
                          {business.state || ""}
                        </p>
                      )}

                      {business.phone && (
                        <p>
                          📞 {business.phone}
                        </p>
                      )}

                      {business.email && (
                        <p>
                          ✉️ {business.email}
                        </p>
                      )}

                    </div>

                    <div className="mt-6 pt-5 border-t border-gray-100 flex flex-wrap gap-3">

                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/dashboard/businesses/${business.id}`
                          )
                        }
                        className="px-4 py-2 rounded-xl bg-[#08192E] text-white font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
                      >
                        View
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          router.push(
                            `/dashboard/businesses/${business.id}/edit`
                          )
                        }
                        className="px-4 py-2 rounded-xl border border-gray-300 text-[#0B1F3A] font-semibold hover:bg-gray-50 transition"
                      >
                        Edit
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

      </div>

    </main>
  );
}