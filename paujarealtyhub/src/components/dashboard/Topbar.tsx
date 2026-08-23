"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { useAuth } from "@/context/AuthContext";
import { supabase } from "@/lib/supabase";
import { logoutUser } from "@/services/auth";

export default function Topbar() {
  const auth = useAuth();
  const user = auth?.user ?? null;

  const [profileComplete, setProfileComplete] =
    useState(false);

  const [loggingOut, setLoggingOut] =
    useState(false);

  useEffect(() => {
    async function checkProfile() {
      if (!user) return;

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (error) {
        console.error(
          "PROFILE CHECK ERROR:",
          error
        );

        return;
      }

      setProfileComplete(
        Boolean(data?.full_name)
      );
    }

    checkProfile();
  }, [user]);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      const { error } =
        await logoutUser();

      if (error) throw error;

      window.location.href = "/login";
    } catch (error: any) {
      console.error(
        "LOGOUT ERROR:",
        error
      );

      alert(
        error?.message ||
          "Unable to log out."
      );

      setLoggingOut(false);
    }
  }

  return (
    <header className="bg-white/95 backdrop-blur border-b border-gray-100 px-8 py-5 flex items-center justify-between gap-6 shadow-sm sticky top-0 z-30">

      <div>
        <div className="flex items-center gap-3">

          <div className="w-1.5 h-10 bg-[#C9A227] rounded-full" />

          <div>
            <h1 className="text-2xl font-bold text-[#0B1F3A]">
              Dashboard
            </h1>

            <p className="text-sm text-gray-500 mt-1">
              {profileComplete
                ? `Welcome back, ${
                    user?.email || "User"
                  }`
                : "Welcome to PaujaRealtyHub! Let's get you started."}
            </p>
          </div>

        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap">

        <Link
          href="/properties"
          className="border border-[#0B1F3A] text-[#0B1F3A] px-4 py-2 rounded-xl hover:bg-[#0B1F3A] hover:text-white transition"
        >
          View Properties
        </Link>

        <div className="w-11 h-11 rounded-full bg-[#0B1F3A] text-[#C9A227] border-2 border-[#C9A227] flex items-center justify-center font-bold shadow-sm">
          {user?.email
            ?.charAt(0)
            .toUpperCase() ?? "U"}
        </div>

        <button
          type="button"
          onClick={handleLogout}
          disabled={loggingOut}
          className="border border-red-300 text-red-600 px-4 py-2 rounded-xl hover:bg-red-50 transition disabled:opacity-50"
        >
          {loggingOut
            ? "Logging out..."
            : "Logout"}
        </button>

      </div>
    </header>
  );
}