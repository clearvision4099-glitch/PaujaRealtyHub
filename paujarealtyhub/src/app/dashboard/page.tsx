"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import DashboardCard from "@/components/dashboard/DashboardCard";
import { getDashboardStats } from "@/services/dashboard";

export default function DashboardPage() {
  const [stats, setStats] = useState({
    properties: 0,
    favorites: 0,
    messages: 0,
  verified: "Active",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboard();
  }, []);

  async function loadDashboard() {
    try {
      const data = await getDashboardStats();

      if (data) {
        setStats(data);
      }
    } catch (error) {
      console.error("DASHBOARD ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-8">
        Dashboard
      </h1>

      {loading ? (
        <p>Loading Dashboard...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">

          <Link
            href="/dashboard/my-properties"
            className="block"
          >
            <DashboardCard
              title="Properties"
              value={stats.properties}
              color="bg-blue-700"
            />
          </Link>

          <Link
            href="/dashboard/favorites"
            className="block"
          >
            <DashboardCard
              title="Favorites"
              value={stats.favorites}
              color="bg-red-600"
            />
          </Link>

          <DashboardCard
            title="Messages"
            value={stats.messages}
            color="bg-green-600"
          />

          <Link
            href="/dashboard/profile"
            className="block"
          >
         <DashboardCard
  title="Account Status"
  value="Active"
  color="bg-purple-600"
/>
          </Link>

        </div>
      )}
    </main>
  );
}