"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

type AdminStats = {
  users: number;
  properties: number;
  publishedProperties: number;
  businesses: number;
};

export default function AdminPage() {
  const router = useRouter();

  const [authorized, setAuthorized] =
    useState(false);

  const [loading, setLoading] =
    useState(true);

  const [stats, setStats] =
    useState<AdminStats>({
      users: 0,
      properties: 0,
      publishedProperties: 0,
      businesses: 0,
    });

  useEffect(() => {
    initializeAdmin();
  }, []);

  async function initializeAdmin() {
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

      await loadStats();
    } catch (error) {
      console.error(
        "ADMIN INITIALIZATION ERROR:",
        error
      );

      router.replace("/dashboard");
    } finally {
      setLoading(false);
    }
  }

  async function loadStats() {
    const [
      usersResult,
      propertiesResult,
      publishedResult,
      businessesResult,
    ] = await Promise.all([
      supabase
        .from("profiles")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("properties")
        .select("*", {
          count: "exact",
          head: true,
        }),

      supabase
        .from("properties")
        .select("*", {
          count: "exact",
          head: true,
        })
        .eq("status", "Published"),

      supabase
        .from("businesses")
        .select("*", {
          count: "exact",
          head: true,
        }),
    ]);

    setStats({
      users:
        usersResult.count || 0,

      properties:
        propertiesResult.count || 0,

      publishedProperties:
        publishedResult.count || 0,

      businesses:
        businessesResult.count || 0,
    });
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F6F8] flex items-center justify-center">

        <div className="text-center">

          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />

          <p className="text-gray-500 mt-5">
            Loading Admin Dashboard...
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

        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>

            <span className="text-[#C9A227] text-xs font-bold uppercase tracking-widest">
              Pauja Global Administration
            </span>

            <h1 className="text-3xl font-bold mt-2">
              PaujaRealtyHub Admin
            </h1>

            <p className="text-gray-300 mt-2">
              Manage the platform, users, listings and businesses.
            </p>

          </div>

          <Link
            href="/dashboard"
            className="self-start md:self-auto border border-[#C9A227] text-[#C9A227] px-5 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
          >
            Back to Dashboard
          </Link>

        </div>

      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8 md:py-10">

        {/* STATS */}

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">

          <StatCard
            title="Users / Agents"
            value={stats.users}
            icon="👥"
          />

          <StatCard
            title="Total Properties"
            value={stats.properties}
            icon="🏠"
          />

          <StatCard
            title="Published"
            value={
              stats.publishedProperties
            }
            icon="✅"
          />

          <StatCard
            title="Businesses"
            value={
              stats.businesses
            }
            icon="🏢"
          />

        </div>

        {/* ADMIN TOOLS */}

        <section className="mt-10">

          <div className="mb-6">

            <span className="text-[#B8922E] text-xs font-bold uppercase tracking-widest">
              Administration
            </span>

            <h2 className="text-2xl font-bold text-[#0B1F3A] mt-2">
              Platform Management
            </h2>

          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">

            <AdminCard
              title="Users & Agents"
              description="Review registered users, agents and their profiles."
              href="/admin/users"
              icon="👥"
            />

            <AdminCard
              title="Properties"
              description="Review every property listing and control publication status."
              href="/admin/properties"
              icon="🏠"
            />

            <AdminCard
              title="Businesses"
              description="Manage hotels and other businesses registered on Pauja."
              href="/admin/businesses"
              icon="🏢"
            />

          </div>

        </section>

        {/* V1 NOTE */}

        <div className="mt-10 bg-white border border-gray-100 rounded-2xl shadow-sm p-6">

          <p className="font-semibold text-[#0B1F3A]">
            Admin V1
          </p>

          <p className="text-gray-500 mt-2 leading-6">
            This first admin version focuses on platform oversight, users, properties and businesses. More advanced moderation, verification and revenue tools can be added after launch.
          </p>

        </div>

      </div>

    </main>
  );
}

function StatCard({
  title,
  value,
  icon,
}: {
  title: string;
  value: number;
  icon: string;
}) {
  return (
    <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6">

      <div className="w-12 h-12 rounded-xl bg-[#08192E] text-[#C9A227] flex items-center justify-center text-xl">
        {icon}
      </div>

      <p className="text-gray-500 mt-5">
        {title}
      </p>

      <p className="text-3xl font-bold text-[#0B1F3A] mt-1">
        {value}
      </p>

    </div>
  );
}

function AdminCard({
  title,
  description,
  href,
  icon,
}: {
  title: string;
  description: string;
  href: string;
  icon: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 hover:shadow-lg hover:-translate-y-1 transition"
    >

      <div className="w-12 h-12 rounded-xl bg-[#C9A227]/15 text-2xl flex items-center justify-center">
        {icon}
      </div>

      <h3 className="text-xl font-bold text-[#0B1F3A] mt-5">
        {title}
      </h3>

      <p className="text-gray-500 mt-2 leading-6">
        {description}
      </p>

      <p className="text-[#B8922E] font-semibold mt-5">
        Manage →
      </p>

    </Link>
  );
}