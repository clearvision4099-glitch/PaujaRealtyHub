"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

export default function AgentsPage() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    loadAgents();
  }, []);

  async function loadAgents() {
    try {
      setLoading(true);
      setErrorMessage("");

      // Get all published properties
      const {
        data: properties,
        error: propertiesError,
      } = await supabase
        .from("properties")
        .select("id, user_id")
        .eq("status", "Published");

      if (propertiesError) {
        throw propertiesError;
      }

      // Count published properties belonging to each user
      const listingCounts: Record<string, number> = {};

      (properties || []).forEach((property) => {
        if (!property.user_id) return;

        listingCounts[property.user_id] =
          (listingCounts[property.user_id] || 0) + 1;
      });

      const agentIds = Object.keys(listingCounts);

      if (agentIds.length === 0) {
        setAgents([]);
        return;
      }

      // Load profiles belonging to users with published listings
      const {
        data: profiles,
        error: profilesError,
      } = await supabase
        .from("profiles")
        .select("*")
        .in("id", agentIds);

      if (profilesError) {
        throw profilesError;
      }

      const formattedAgents = (profiles || [])
        .map((profile) => ({
          ...profile,
          activeListings:
            listingCounts[profile.id] || 0,
        }))
        .sort(
          (a, b) =>
            b.activeListings - a.activeListings
        );

      setAgents(formattedAgents);
    } catch (error: any) {
      console.error(
        "LOAD AGENTS ERROR:",
        error
      );

      setErrorMessage(
        error?.message ||
          "Unable to load agents."
      );

      setAgents([]);
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F7F7F3]">

        {/* HERO */}
        <section className="bg-[#08192E] text-white py-16">

          <div className="max-w-7xl mx-auto px-6 text-center">

            <p className="text-[#C9A227] text-sm font-bold uppercase tracking-[0.2em]">
              Property Professionals
            </p>

            <h1 className="text-4xl md:text-5xl font-bold mt-4">
              Find Trusted Property Agents
            </h1>

            <p className="text-gray-300 text-lg mt-5 max-w-2xl mx-auto">
              Connect with property professionals
              with active listings on
              PaujaRealtyHub.
            </p>

          </div>

        </section>

        {/* CONTENT */}
        <section className="max-w-7xl mx-auto px-6 py-16">

          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-10">

            <div>

              <p className="text-[#B8922E] font-semibold uppercase tracking-wider text-sm">
                Our Professionals
              </p>

              <h2 className="text-3xl md:text-4xl font-bold text-[#0B1F3A] mt-2">
                Browse Agents
              </h2>

              <p className="text-gray-500 mt-3">
                View profiles and active property
                listings from professionals on the
                platform.
              </p>

            </div>

            {!loading && (
              <div className="bg-white border border-gray-100 rounded-xl shadow-sm px-5 py-3">

                <span className="text-[#C9A227] text-xl font-bold">
                  {agents.length}
                </span>

                <span className="text-gray-500 ml-2">
                  {agents.length === 1
                    ? "professional"
                    : "professionals"}
                </span>

              </div>
            )}

          </div>

          {/* LOADING */}
          {loading && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">

              <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />

              <p className="text-gray-500 mt-5">
                Loading property professionals...
              </p>

            </div>
          )}

          {/* ERROR */}
          {!loading && errorMessage && (
            <div className="bg-red-50 border border-red-200 rounded-2xl p-8 text-center">

              <h3 className="text-red-700 text-xl font-bold">
                Unable to Load Agents
              </h3>

              <p className="text-red-600 mt-2">
                {errorMessage}
              </p>

              <button
                type="button"
                onClick={loadAgents}
                className="mt-5 bg-[#08192E] text-white px-6 py-3 rounded-xl font-semibold"
              >
                Try Again
              </button>

            </div>
          )}

          {/* EMPTY */}
          {!loading &&
            !errorMessage &&
            agents.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 px-6 text-center">

                <div className="text-5xl">
                  🏢
                </div>

                <h3 className="text-2xl font-bold text-[#0B1F3A] mt-5">
                  No Active Agents Yet
                </h3>

                <p className="text-gray-500 mt-3">
                  Property professionals with
                  published listings will appear
                  here.
                </p>

              </div>
            )}

          {/* AGENT GRID */}
          {!loading &&
            !errorMessage &&
            agents.length > 0 && (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

                {agents.map((agent) => {

                  const displayName =
                    agent.agent_name ||
                    agent.full_name ||
                    "Property Professional";

                  const avatar =
                    agent.avatar_url ||
                    agent.profile_photo ||
                    "";

                  return (
                    <div
                      key={agent.id}
                      className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >

                      <div className="h-2 bg-[#C9A227]" />

                      <div className="p-8 text-center">

                        {/* AVATAR */}
                        {avatar ? (
                          <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-[#C9A227]">

                            <Image
                              src={avatar}
                              alt={displayName}
                              fill
                              unoptimized
                              className="object-cover"
                            />

                          </div>
                        ) : (
                          <div className="w-28 h-28 mx-auto rounded-full bg-[#08192E] border-4 border-[#C9A227] flex items-center justify-center">

                            <span className="text-[#C9A227] text-4xl font-bold">
                              {displayName
                                .charAt(0)
                                .toUpperCase()}
                            </span>

                          </div>
                        )}

                        {/* NAME */}
                        <div className="mt-6 flex items-center justify-center gap-2">

                          <h3 className="text-2xl font-bold text-[#0B1F3A]">
                            {displayName}
                          </h3>

                          {agent.verified === true && (
                            <span
                              title="Verified"
                              className="bg-green-100 text-green-700 rounded-full w-7 h-7 flex items-center justify-center text-sm font-bold"
                            >
                              ✓
                            </span>
                          )}

                        </div>

                        {/* AGENCY */}
                        {agent.agency_name && (
                          <p className="text-[#B8922E] font-semibold mt-2">
                            {agent.agency_name}
                          </p>
                        )}

                        {/* LOCATION */}
                        {(agent.city ||
                          agent.state) && (
                          <p className="text-gray-500 mt-3">
                            📍{" "}
                            {[
                              agent.city,
                              agent.state,
                            ]
                              .filter(Boolean)
                              .join(", ")}
                          </p>
                        )}

                        {/* LISTINGS */}
                        <div className="mt-7 py-5 border-y border-gray-100">

                          <p className="text-3xl font-bold text-[#C9A227]">
                            {agent.activeListings}
                          </p>

                          <p className="text-sm text-gray-500 mt-1">
                            {agent.activeListings === 1
                              ? "Active Listing"
                              : "Active Listings"}
                          </p>

                        </div>

                        {/* PROFILE */}
                        <Link
                          href={`/agents/${agent.id}`}
                          className="block mt-7 bg-[#08192E] text-white py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
                        >
                          View Profile
                        </Link>

                      </div>

                    </div>
                  );
                })}

              </div>
            )}

        </section>

      </main>

      <Footer />
    </>
  );
}