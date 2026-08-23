"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";

import { getFeaturedAgents } from "@/services/publicAgents";

export default function FeaturedAgents() {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAgents() {
      const data = await getFeaturedAgents();

      setAgents(data);
      setLoading(false);
    }

    loadAgents();
  }, []);

  return (
    <section className="bg-[#F7F7F3] py-20">
      <div className="max-w-7xl mx-auto px-6">

        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-[#B8922E] font-semibold uppercase tracking-wider text-sm">
            Property Professionals
          </span>

          <h2 className="text-4xl md:text-5xl font-bold text-[#0B1F3A] mt-3">
            Featured Agents
          </h2>

          <p className="text-gray-600 mt-4 text-lg">
            Connect with real property professionals active on PaujaRealtyHub.
          </p>
        </div>

        {loading ? (
          <div className="text-center py-16 text-gray-500">
            Loading agents...
          </div>
        ) : agents.length === 0 ? (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
            <h3 className="text-2xl font-bold text-[#0B1F3A]">
              No featured agents yet
            </h3>

            <p className="text-gray-500 mt-3">
              Agents with published properties will appear here.
            </p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

            {agents.map((agent) => (
              <div
                key={agent.id}
                className="group bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >

                {agent.avatar_url ? (
                  <div className="relative w-24 h-24 mx-auto mb-6">
                    <Image
                      src={agent.avatar_url}
                      alt={agent.full_name || "Agent"}
                      fill
                      unoptimized
                      className="rounded-full object-cover border-4 border-[#C9A227]"
                    />
                  </div>
                ) : (
                  <div className="w-24 h-24 rounded-full bg-[#08192E] border-4 border-[#C9A227] text-[#C9A227] flex items-center justify-center text-3xl font-bold mx-auto mb-6">
                    {(agent.full_name || "A")
                      .charAt(0)
                      .toUpperCase()}
                  </div>
                )}

                <h3 className="text-2xl font-bold text-[#0B1F3A]">
                  {agent.full_name || "Property Professional"}
                </h3>

                {agent.agency_name && (
                  <p className="text-[#B8922E] font-semibold mt-2">
                    {agent.agency_name}
                  </p>
                )}

                {(agent.city || agent.state) && (
                  <p className="text-gray-500 mt-2">
                    📍 {[agent.city, agent.state]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}

                {agent.verified && (
                  <div className="mt-4">
                    <span className="inline-flex px-3 py-1 rounded-full bg-green-100 text-green-700 text-sm font-semibold">
                      ✓ Verified
                    </span>
                  </div>
                )}

                <div className="mt-5 pt-5 border-t border-gray-100">
                  <p className="font-semibold text-[#0B1F3A]">
                    {agent.listings} Active{" "}
                    {agent.listings === 1
                      ? "Listing"
                      : "Listings"}
                  </p>
                </div>

                <Link
                  href={`/agents/${agent.id}`}
                  className="inline-block mt-6 bg-[#08192E] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
                >
                  View Profile
                </Link>

              </div>
            ))}

          </div>
        )}

      </div>
    </section>
  );
}