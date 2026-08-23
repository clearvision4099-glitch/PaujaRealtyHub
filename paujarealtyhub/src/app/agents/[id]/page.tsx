"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

import { supabase } from "@/lib/supabase";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import PropertyCard from "@/components/properties/PropertyCard";

export default function AgentProfilePage() {
  const params = useParams();

  const agentId = Array.isArray(params.id)
    ? params.id[0]
    : params.id;

  const [agent, setAgent] = useState<any>(null);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (agentId) {
      loadAgent();
    }
  }, [agentId]);

  async function loadAgent() {
    try {
      setLoading(true);

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select(`
          id,
          full_name,
          agency_name,
          phone,
          email,
          city,
          state,
          bio,
          avatar_url,
          verified
        `)
        .eq("id", agentId)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (!profile) {
        setAgent(null);
        return;
      }

      setAgent(profile);

      const {
        data: propertyList,
        error: propertyError,
      } = await supabase
        .from("properties")
        .select(`
          *,
          property_images (
            id,
            image_url,
            is_cover
          )
        `)
        .eq("user_id", agentId)
        .eq("status", "Published")
        .order("created_at", {
          ascending: false,
        });

      if (propertyError) {
        throw propertyError;
      }

      const formattedProperties =
        (propertyList || []).map((property) => ({
          ...property,

          property_images: [
            ...(property.property_images || []),
          ].sort(
            (a: any, b: any) =>
              Number(b.is_cover) -
              Number(a.is_cover)
          ),
        }));

      setProperties(formattedProperties);
    } catch (error: any) {
      console.error(
        "LOAD AGENT PROFILE ERROR:",
        error
      );

      setAgent(null);
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }

  const callNumber = agent?.phone
    ? agent.phone.replace(/[^\d+]/g, "")
    : "";

  const whatsappNumber = agent?.phone
    ? agent.phone.replace(/\D/g, "")
    : "";

  if (loading) {
    return (
      <>
        <Navbar />

        <main className="min-h-[70vh] bg-[#F7F7F3] flex items-center justify-center">

          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />

            <p className="text-gray-500 mt-5">
              Loading agent...
            </p>
          </div>

        </main>

        <Footer />
      </>
    );
  }

  if (!agent) {
    return (
      <>
        <Navbar />

        <main className="min-h-[70vh] bg-[#F7F7F3] flex items-center justify-center px-6">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center max-w-xl w-full">

            <h1 className="text-3xl font-bold text-[#0B1F3A]">
              Agent Not Found
            </h1>

            <p className="text-gray-500 mt-3">
              This profile may no longer be available.
            </p>

            <Link
              href="/agents"
              className="inline-block mt-7 bg-[#08192E] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
            >
              Browse Agents
            </Link>

          </div>

        </main>

        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />

      <main className="bg-[#F7F7F3] min-h-screen">

        {/* HERO */}
        <section className="bg-[#08192E] text-white">

          <div className="max-w-7xl mx-auto px-6 py-16">

            <Link
              href="/agents"
              className="text-[#C9A227] font-semibold hover:text-white transition"
            >
              ← Back to Agents
            </Link>

            <div className="mt-10 flex flex-col md:flex-row gap-8 items-start md:items-center">

              {/* AVATAR */}
              {agent.avatar_url ? (
                <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#C9A227] shrink-0">

                  <Image
                    src={agent.avatar_url}
                    alt={
                      agent.full_name ||
                      "Property Professional"
                    }
                    fill
                    unoptimized
                    className="object-cover"
                  />

                </div>
              ) : (
                <div className="w-32 h-32 rounded-full bg-white/10 border-4 border-[#C9A227] text-[#C9A227] flex items-center justify-center text-5xl font-bold shrink-0">
                  {(agent.full_name || "A")
                    .charAt(0)
                    .toUpperCase()}
                </div>
              )}

              {/* DETAILS */}
              <div className="flex-1">

                <div className="flex flex-wrap items-center gap-3">

                  <h1 className="text-4xl md:text-5xl font-bold">
                    {agent.full_name ||
                      "Property Professional"}
                  </h1>

                  {agent.verified && (
                    <span className="bg-green-100 text-green-700 text-sm px-3 py-1 rounded-full font-semibold">
                      ✓ Verified
                    </span>
                  )}

                </div>

                {agent.agency_name && (
                  <p className="text-[#C9A227] font-semibold text-lg mt-3">
                    {agent.agency_name}
                  </p>
                )}

                {(agent.city || agent.state) && (
                  <p className="text-gray-300 mt-3">
                    📍{" "}
                    {[agent.city, agent.state]
                      .filter(Boolean)
                      .join(", ")}
                  </p>
                )}

                <div className="flex flex-wrap gap-8 mt-6">

                  <div>
                    <p className="text-3xl font-bold text-[#C9A227]">
                      {properties.length}
                    </p>

                    <p className="text-sm text-gray-400 mt-1">
                      {properties.length === 1
                        ? "Published Property"
                        : "Published Properties"}
                    </p>
                  </div>

                </div>

                {agent.bio && (
                  <p className="mt-6 text-gray-300 leading-8 max-w-3xl">
                    {agent.bio}
                  </p>
                )}

                {/* CONTACT */}
                <div className="flex flex-wrap gap-3 mt-8">

                  {agent.phone && (
                    <a
                      href={`tel:${callNumber}`}
                      className="bg-[#C9A227] text-[#08192E] px-6 py-3 rounded-xl font-bold hover:brightness-110 transition"
                    >
                      📞 Call Agent
                    </a>
                  )}

                  {agent.phone && (
                    <a
                      href={`https://wa.me/${whatsappNumber}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="bg-green-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-green-700 transition"
                    >
                      💬 WhatsApp
                    </a>
                  )}

                  {agent.email && (
                    <a
                      href={`mailto:${agent.email}`}
                      className="border border-[#C9A227] text-[#C9A227] px-6 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
                    >
                      ✉ Email
                    </a>
                  )}

                </div>

              </div>

            </div>

          </div>

        </section>

        {/* AGENT PROPERTIES */}
        <section className="max-w-7xl mx-auto px-6 py-16">

          <div className="mb-10">

            <span className="text-[#B8922E] font-semibold uppercase tracking-wider text-sm">
              Published Listings
            </span>

            <h2 className="text-4xl font-bold text-[#0B1F3A] mt-2">
              Properties by{" "}
              {agent.full_name ||
                "this agent"}
            </h2>

            <p className="text-gray-500 mt-3">
              Browse currently published properties from this property professional.
            </p>

          </div>

          {properties.length === 0 ? (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm py-16 text-center px-6">

              <div className="text-5xl mb-5">
                🏠
              </div>

              <h3 className="text-2xl font-bold text-[#0B1F3A]">
                No Published Properties
              </h3>

              <p className="text-gray-500 mt-3">
                This agent does not currently have any published listings.
              </p>

            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">

              {properties.map((property) => (
                <PropertyCard
                  key={property.id}
                  property={property}
                />
              ))}

            </div>
          )}

        </section>

      </main>

      <Footer />
    </>
  );
}