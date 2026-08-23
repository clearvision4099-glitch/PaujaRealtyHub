"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type AdminUser = {
  id: string;
  full_name: string | null;
  phone: string | null;
  city: string | null;
  state: string | null;
  verified: boolean | null;
  is_admin: boolean | null;
  created_at: string | null;
};

export default function AdminUsersPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [workingId, setWorkingId] = useState<string | null>(null);

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

      await loadUsers();
    } catch (error) {
      console.error("ADMIN USERS INIT ERROR:", error);

      router.replace("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function loadUsers() {
    const { data, error } = await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        phone,
        city,
        state,
        verified,
        is_admin,
        created_at
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("LOAD ADMIN USERS ERROR:", error);
      throw error;
    }

    setUsers(data || []);
  }

  async function changeVerification(
    userId: string,
    verified: boolean
  ) {
    try {
      setWorkingId(userId);

      const { error } = await supabase
        .from("profiles")
        .update({
          verified,
        })
        .eq("id", userId);

      if (error) throw error;

      setUsers((current) =>
        current.map((user) =>
          user.id === userId
            ? {
                ...user,
                verified,
              }
            : user
        )
      );
    } catch (error: any) {
      console.error("ADMIN VERIFY USER ERROR:", error);

      alert(
        error?.message ||
          "Unable to update verification status."
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
            Loading users...
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
              Users & Agents
            </h1>

            <p className="text-gray-300 mt-2">
              Review registered users and control verification status.
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
            Registered profiles
          </p>

          <p className="text-3xl font-bold text-[#0B1F3A] mt-1">
            {users.length}
          </p>

        </div>

        <div className="space-y-4">

          {users.map((user) => (
            <div
              key={user.id}
              className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5 md:p-6"
            >

              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">

                <div className="min-w-0">

                  <div className="flex flex-wrap items-center gap-2">

                    {user.is_admin && (
                      <span className="bg-[#08192E] text-[#C9A227] px-3 py-1 rounded-full text-xs font-bold">
                        Admin
                      </span>
                    )}

                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold ${
                        user.verified
                          ? "bg-green-100 text-green-700"
                          : "bg-gray-100 text-gray-600"
                      }`}
                    >
                      {user.verified
                        ? "Verified"
                        : "Unverified"}
                    </span>

                  </div>

                  <h2 className="text-xl font-bold text-[#0B1F3A] mt-3">
                    {user.full_name || "Unnamed User"}
                  </h2>

                  <p className="text-gray-500 mt-1">
                    {[user.city, user.state]
                      .filter(Boolean)
                      .join(", ") || "Location not supplied"}
                  </p>

                  {user.phone && (
                    <p className="text-gray-500 mt-1">
                      {user.phone}
                    </p>
                  )}

                  <p className="text-xs text-gray-400 mt-3 break-all">
                    User ID: {user.id}
                  </p>

                </div>

                {!user.is_admin && (
                  <div className="flex flex-wrap gap-3">

                    {user.verified ? (
                      <button
                        type="button"
                        onClick={() =>
                          changeVerification(
                            user.id,
                            false
                          )
                        }
                        disabled={workingId === user.id}
                        className="border border-red-200 text-red-600 px-4 py-2.5 rounded-xl font-semibold hover:bg-red-50 disabled:opacity-50 transition"
                      >
                        {workingId === user.id
                          ? "Updating..."
                          : "Remove Verification"}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          changeVerification(
                            user.id,
                            true
                          )
                        }
                        disabled={workingId === user.id}
                        className="bg-[#C9A227] text-[#08192E] px-4 py-2.5 rounded-xl font-bold hover:brightness-110 disabled:opacity-50 transition"
                      >
                        {workingId === user.id
                          ? "Updating..."
                          : "Verify User"}
                      </button>
                    )}

                  </div>
                )}

              </div>

            </div>
          ))}

        </div>

      </div>

    </main>
  );
}