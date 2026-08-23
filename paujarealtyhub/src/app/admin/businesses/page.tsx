"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type AdminBusiness = {
  id: number;
  name: string | null;
  category: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  created_at: string | null;
};

export default function AdminBusinessesPage() {
  const router = useRouter();

  const [authorized, setAuthorized] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [businesses, setBusinesses] =
    useState<AdminBusiness[]>([]);

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (profileError) {
        throw profileError;
      }

      if (!profile?.is_admin) {
        router.replace("/dashboard");
        return;
      }

      setAuthorized(true);

      await loadBusinesses();
    } catch (error) {
      console.error(
        "ADMIN BUSINESSES INIT ERROR:",
        error
      );

      router.replace("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function loadBusinesses() {
    const {
      data,
      error,
    } = await supabase
      .from("businesses")
      .select(`
        id,
        name,
        category,
        city,
        state,
        address,
        created_at
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      console.error(
        "LOAD BUSINESSES ERROR:",
        error
      );

      throw error;
    }

    setBusinesses(data || []);
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F6F8] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />

          <p className="text-gray-500 mt-5">
            Loading businesses...
          </p>

        </div>

      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F5F6F8]">

      {/* HEADER */}

      <section className="bg-[#08192E] text-white border-b border-[#C9A227]/30">

        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <span className="text-[#C9A227] text-xs font-bold uppercase tracking-widest">
              Pauja Global Administration
            </span>

            <h1 className="text-3xl font-bold mt-2">
              Businesses
            </h1>

            <p className="text-gray-300 mt-2">
              Review businesses registered on PaujaRealtyHub.
            </p>

          </div>

          <Link
            href="/admin"
            className="self-start md:self-auto border border-[#C9A227] text-[#C9A227] px-5 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
          >
            ← Admin Dashboard
          </Link>

        </div>

      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        {/* COUNT */}

        <div className="mb-6 bg-white border border-gray-100 rounded-2xl shadow-sm p-5">

          <p className="text-sm text-gray-500">
            Registered businesses
          </p>

          <p className="text-3xl font-bold text-[#0B1F3A] mt-1">
            {businesses.length}
          </p>

        </div>

        {/* EMPTY */}

        {businesses.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 md:p-16 text-center">

            <div className="text-6xl mb-5">
              🏢
            </div>

            <h2 className="text-2xl font-bold text-[#0B1F3A]">
              No Businesses Yet
            </h2>

            <p className="text-gray-500 mt-3 max-w-xl mx-auto">
              Businesses such as hotels and other commercial partners will appear here once they are registered on the platform.
            </p>

          </div>
        ) : (
          <div className="space-y-4">

            {businesses.map(
              (business) => (
                <div
                  key={business.id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 md:p-6"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        {business.category && (
                          <span className="bg-[#F4F1E8] text-[#8B6C16] px-3 py-1 rounded-full text-xs font-semibold">
                            {business.category}
                          </span>
                        )}

                      </div>

                      <h2 className="text-xl font-bold text-[#0B1F3A] mt-3">
                        {business.name ||
                          `Business #${business.id}`}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        {[
                          business.city,
                          business.state,
                        ]
                          .filter(Boolean)
                          .join(", ") ||
                          "Location not supplied"}
                      </p>

                      {business.address && (
                        <p className="text-gray-500 mt-1">
                          {business.address}
                        </p>
                      )}

                      <p className="text-xs text-gray-400 mt-3">
                        Business ID: {business.id}
                      </p>

                    </div>

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