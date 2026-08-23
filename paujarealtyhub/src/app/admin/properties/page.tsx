"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type AdminProperty = {
  id: number;
  title: string | null;
  city: string | null;
  state: string | null;
  price: number | null;
  status: string | null;
  property_type: string | null;
  listing_type: string | null;
  created_at: string | null;
  user_id: string | null;
};

export default function AdminPropertiesPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [properties, setProperties] = useState<AdminProperty[]>([]);
  const [workingId, setWorkingId] = useState<number | null>(null);

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

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;

      if (!profile?.is_admin) {
        router.replace("/dashboard");
        return;
      }

      setAuthorized(true);
      await loadProperties();
    } catch (error) {
      console.error("ADMIN PROPERTIES INIT ERROR:", error);
      router.replace("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function loadProperties() {
    const { data, error } = await supabase
      .from("properties")
      .select(`
        id,
        title,
        city,
        state,
        price,
        status,
        property_type,
        listing_type,
        created_at,
        user_id
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("LOAD ADMIN PROPERTIES ERROR:", error);
      throw error;
    }

    setProperties(data || []);
  }

  async function changeStatus(
    propertyId: number,
    newStatus: "Published" | "Unpublished"
  ) {
    try {
      setWorkingId(propertyId);

      const { error } = await supabase
        .from("properties")
        .update({
          status: newStatus,
        })
        .eq("id", propertyId);

      if (error) throw error;

      setProperties((current) =>
        current.map((property) =>
          property.id === propertyId
            ? {
                ...property,
                status: newStatus,
              }
            : property
        )
      );
    } catch (error: any) {
      console.error("ADMIN STATUS ERROR:", error);

      alert(
        error?.message ||
          "Unable to update property status."
      );
    } finally {
      setWorkingId(null);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F6F8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />

          <p className="text-gray-500 mt-5">
            Loading properties...
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

      <section className="bg-[#08192E] text-white border-b border-[#C9A227]/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <span className="text-[#C9A227] text-xs font-bold uppercase tracking-widest">
              Pauja Global Administration
            </span>

            <h1 className="text-3xl font-bold mt-2">
              Property Management
            </h1>

            <p className="text-gray-300 mt-2">
              Review and control property listings across PaujaRealtyHub.
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

        <div className="mb-6 bg-white border border-gray-100 rounded-2xl shadow-sm p-5">

          <p className="text-sm text-gray-500">
            Total listings
          </p>

          <p className="text-3xl font-bold text-[#0B1F3A] mt-1">
            {properties.length}
          </p>

        </div>

        {properties.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 text-center">

            <h2 className="text-2xl font-bold text-[#0B1F3A]">
              No Properties
            </h2>

            <p className="text-gray-500 mt-3">
              No property listings are currently available.
            </p>

          </div>
        ) : (
          <div className="space-y-4">

            {properties.map((property) => {
              const published =
                property.status === "Published";

              return (
                <div
                  key={property.id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 md:p-6"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${
                            published
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-600"
                          }`}
                        >
                          {property.status || "Unknown"}
                        </span>

                        {property.property_type && (
                          <span className="bg-[#F4F1E8] text-[#8B6C16] px-3 py-1 rounded-full text-xs font-semibold">
                            {property.property_type}
                          </span>
                        )}

                        {property.listing_type && (
                          <span className="bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-semibold">
                            {property.listing_type}
                          </span>
                        )}

                      </div>

                      <h2 className="text-xl font-bold text-[#0B1F3A] mt-3">
                        {property.title || `Property #${property.id}`}
                      </h2>

                      <p className="text-gray-500 mt-1">
                        {[property.city, property.state]
                          .filter(Boolean)
                          .join(", ") || "Location not supplied"}
                      </p>

                      {property.price !== null && (
                        <p className="text-[#B8922E] font-bold mt-2">
                          ₦{Number(property.price).toLocaleString()}
                        </p>
                      )}

                      <p className="text-xs text-gray-400 mt-3">
                        Property ID: {property.id}
                      </p>

                    </div>

                    <div className="flex flex-wrap gap-3">

                      <Link
                        href={`/properties/${property.id}`}
                        className="border border-gray-300 text-[#0B1F3A] px-4 py-2.5 rounded-xl font-semibold hover:bg-gray-50 transition"
                      >
                        View
                      </Link>

                      {published ? (
                        <button
                          type="button"
                          onClick={() =>
                            changeStatus(
                              property.id,
                              "Unpublished"
                            )
                          }
                          disabled={workingId === property.id}
                          className="border border-red-200 text-red-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-red-50 disabled:opacity-50 transition"
                        >
                          {workingId === property.id
                            ? "Updating..."
                            : "Unpublish"}
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() =>
                            changeStatus(
                              property.id,
                              "Published"
                            )
                          }
                          disabled={workingId === property.id}
                          className="bg-[#C9A227] text-[#08192E] px-4 py-2.5 rounded-xl font-bold hover:brightness-110 disabled:opacity-50 transition"
                        >
                          {workingId === property.id
                            ? "Updating..."
                            : "Publish"}
                        </button>
                      )}

                    </div>

                  </div>

                </div>
              );
            })}

          </div>
        )}

      </div>

    </main>
  );
}