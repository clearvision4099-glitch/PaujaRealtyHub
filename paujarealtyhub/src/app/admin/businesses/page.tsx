"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type AdminBusiness = {
  id: number;
  business_name: string | null;
  category: string | null;
  city: string | null;
  state: string | null;
  address: string | null;
  created_at: string | null;
  status: string | null;
};

export default function AdminBusinessesPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [businesses, setBusinesses] = useState<AdminBusiness[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);

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
      await loadBusinesses();
    } catch (error) {
      console.error("ADMIN BUSINESSES INIT ERROR:", error);
      router.replace("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function loadBusinesses() {
    const { data, error } = await supabase
      .from("businesses")
      .select(`
        id,
        business_name,
        category,
        city,
        state,
        address,
        created_at,
        status
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("LOAD BUSINESSES ERROR:", error);
      throw error;
    }

    setBusinesses(data || []);
  }

  async function updateBusinessStatus(
    businessId: number,
    newStatus: "Active" | "Rejected"
  ) {
    try {
      setUpdatingId(businessId);

      const { error } = await supabase
        .from("businesses")
        .update({ status: newStatus })
        .eq("id", businessId);

      if (error) throw error;

      setBusinesses((current) =>
        current.map((business) =>
          business.id === businessId
            ? { ...business, status: newStatus }
            : business
        )
      );
    } catch (error: any) {
      console.error("UPDATE BUSINESS STATUS ERROR:", error);

      alert(
        error?.message ||
          "Unable to update business status."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function getStatusStyle(status: string | null) {
    if (status === "Active") {
      return "bg-green-100 text-green-700";
    }

    if (status === "Pending") {
      return "bg-yellow-100 text-yellow-800";
    }

    if (status === "Rejected") {
      return "bg-red-100 text-red-700";
    }

    return "bg-gray-100 text-gray-600";
  }

  const pendingCount = businesses.filter(
    (business) => business.status === "Pending"
  ).length;

  const activeCount = businesses.filter(
    (business) => business.status === "Active"
  ).length;

  const rejectedCount = businesses.filter(
    (business) => business.status === "Rejected"
  ).length;

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
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <span className="text-[#C9A227] text-xs font-bold uppercase tracking-widest">
              Pauja Global Administration
            </span>

            <h1 className="text-3xl font-bold mt-2">
              Business Approvals
            </h1>

            <p className="text-gray-300 mt-2">
              Review and manage businesses registered on
              PaujaRealtyHub.
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

        {/* COUNTS */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm text-gray-500">
              Total Businesses
            </p>

            <p className="text-3xl font-bold text-[#0B1F3A] mt-1">
              {businesses.length}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm text-gray-500">
              Pending Review
            </p>

            <p className="text-3xl font-bold text-yellow-700 mt-1">
              {pendingCount}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm text-gray-500">
              Active
            </p>

            <p className="text-3xl font-bold text-green-700 mt-1">
              {activeCount}
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
            <p className="text-sm text-gray-500">
              Rejected
            </p>

            <p className="text-3xl font-bold text-red-700 mt-1">
              {rejectedCount}
            </p>
          </div>

        </div>

        {/* EMPTY STATE */}

        {businesses.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-14 text-center">

            <div className="text-6xl mb-5">
              🏢
            </div>

            <h2 className="text-2xl font-bold text-[#0B1F3A]">
              No Businesses Yet
            </h2>

            <p className="text-gray-500 mt-3">
              New business registrations will appear here
              for review.
            </p>

          </div>
        ) : (

          /* BUSINESS LIST */

          <div className="space-y-4">

            {businesses.map((business) => {
              const isUpdating =
                updatingId === business.id;

              const isActive =
                business.status === "Active";

              const isRejected =
                business.status === "Rejected";

              return (
                <div
                  key={business.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6"
                >

                  <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">

                    {/* DETAILS */}

                    <div className="min-w-0">

                      <div className="flex flex-wrap items-center gap-2">

                        {business.category && (
                          <span className="bg-[#F4F1E8] text-[#8B6C16] px-3 py-1 rounded-full text-xs font-semibold">
                            {business.category}
                          </span>
                        )}

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusStyle(
                            business.status
                          )}`}
                        >
                          {business.status || "Unknown"}
                        </span>

                      </div>

                      <h2 className="text-xl font-bold text-[#0B1F3A] mt-3">
                        {business.business_name ||
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

                      {business.created_at && (
                        <p className="text-xs text-gray-400 mt-1">
                          Registered:{" "}
                          {new Date(
                            business.created_at
                          ).toLocaleDateString()}
                        </p>
                      )}

                    </div>

                    {/* ADMIN ACTIONS */}

                    <div className="flex flex-wrap gap-3">

                      <Link
                        href={`/businesses/${business.id}`}
                        className="px-4 py-2.5 border border-gray-300 rounded-xl text-sm font-semibold text-[#0B1F3A] hover:border-[#C9A227] hover:text-[#8B6C16] transition"
                      >
                        View Business
                      </Link>

                      <button
                        type="button"
                        disabled={
                          isUpdating ||
                          isActive
                        }
                        onClick={() =>
                          updateBusinessStatus(
                            business.id,
                            "Active"
                          )
                        }
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                          isActive
                            ? "bg-green-100 text-green-700 cursor-default"
                            : "bg-green-600 text-white hover:bg-green-700"
                        } disabled:opacity-70`}
                      >
                        {isActive
                          ? "✓ Approved"
                          : isUpdating
                          ? "Updating..."
                          : "Approve"}
                      </button>

                      <button
                        type="button"
                        disabled={
                          isUpdating ||
                          isRejected
                        }
                        onClick={() =>
                          updateBusinessStatus(
                            business.id,
                            "Rejected"
                          )
                        }
                        className={`px-4 py-2.5 rounded-xl text-sm font-semibold transition ${
                          isRejected
                            ? "bg-red-100 text-red-700 cursor-default"
                            : "bg-red-50 border border-red-200 text-red-700 hover:bg-red-100"
                        } disabled:opacity-70`}
                      >
                        {isRejected
                          ? "✕ Rejected"
                          : "Reject"}
                      </button>

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