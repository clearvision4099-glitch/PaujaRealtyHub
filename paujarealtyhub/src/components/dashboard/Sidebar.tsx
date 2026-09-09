"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

export default function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [unreadAnnouncements, setUnreadAnnouncements] = useState(0);

  useEffect(() => {
    loadSidebar();
  }, []);

  async function loadSidebar() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setIsAdmin(false);
        return;
      }

      // CHECK ADMIN

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error("SIDEBAR ADMIN CHECK ERROR:", profileError);
      } else {
        setIsAdmin(Boolean(profile?.is_admin));
      }

      // GET ACTIVE ANNOUNCEMENTS

      const { data: announcements, error: announcementError } =
        await supabase
          .from("announcements")
          .select("id")
          .eq("is_active", true);

      if (announcementError) {
        console.error(
          "SIDEBAR ANNOUNCEMENTS ERROR:",
          announcementError
        );
        return;
      }

      if (!announcements || announcements.length === 0) {
        setUnreadAnnouncements(0);
        return;
      }

      // GET ANNOUNCEMENTS THIS USER HAS READ

      const { data: reads, error: readsError } = await supabase
        .from("announcement_reads")
        .select("announcement_id")
        .eq("user_id", user.id);

      if (readsError) {
        console.error(
          "SIDEBAR ANNOUNCEMENT READS ERROR:",
          readsError
        );
        return;
      }

      const readIds = new Set(
        (reads || []).map((item) => item.announcement_id)
      );

      const unreadCount = announcements.filter(
        (announcement) => !readIds.has(announcement.id)
      ).length;

      setUnreadAnnouncements(unreadCount);
    } catch (error) {
      console.error("SIDEBAR ERROR:", error);
    }
  }

  return (
    <aside className="w-72 min-h-screen bg-[#08192E] text-white px-5 py-8 shadow-2xl">

      {/* BRAND */}

      <div className="mb-10">
        <div className="flex items-center gap-3">

          <div className="w-11 h-11 rounded-xl bg-[#C9A227] flex items-center justify-center font-black text-[#08192E] text-lg">
            P
          </div>

          <div>
            <h1 className="text-xl font-bold">
              PaujaRealtyHub
            </h1>

            <p className="text-xs text-gray-400 mt-1">
              Property Intelligence Platform
            </p>
          </div>

        </div>
      </div>

      {/* NAVIGATION */}

      <nav className="space-y-2">

        <Link
          href="/dashboard"
          className="block px-4 py-3 rounded-xl hover:bg-white/10 transition"
        >
          📊 Dashboard
        </Link>

        <Link
          href="/dashboard/my-properties"
          className="block px-4 py-3 rounded-xl hover:bg-white/10 transition"
        >
          🏠 My Properties
        </Link>

        <Link
          href="/dashboard/add-property"
          className="block px-4 py-3 rounded-xl hover:bg-white/10 transition"
        >
          ➕ Add Property
        </Link>

        <Link
          href="/dashboard/favorites"
          className="block px-4 py-3 rounded-xl hover:bg-white/10 transition"
        >
          ❤️ Favorites
        </Link>

        <Link
          href="/dashboard/messages"
          className="block px-4 py-3 rounded-xl hover:bg-white/10 transition"
        >
          💬 Messages
        </Link>

        <Link
          href="/dashboard/announcements"
          className="flex items-center justify-between px-4 py-3 rounded-xl hover:bg-white/10 transition"
        >
          <span>
            📢 Announcements
          </span>

          {unreadAnnouncements > 0 && (
            <span className="min-w-6 h-6 px-2 rounded-full bg-red-600 text-white text-xs font-bold flex items-center justify-center animate-pulse">
              {unreadAnnouncements}
            </span>
          )}
        </Link>

        <Link
          href="/dashboard/profile"
          className="block px-4 py-3 rounded-xl hover:bg-white/10 transition"
        >
          👤 Profile
        </Link>

        <Link
          href="/dashboard/settings"
          className="block px-4 py-3 rounded-xl hover:bg-white/10 transition"
        >
          ⚙️ Settings
        </Link>

        {/* ADMIN ONLY */}

        {isAdmin && (
          <>
            <div className="border-t border-white/10 my-4" />

            <Link
              href="/admin"
              className="block px-4 py-3 rounded-xl bg-[#C9A227]/10 border border-[#C9A227]/30 text-[#C9A227] font-bold hover:bg-[#C9A227] hover:text-[#08192E] transition"
            >
              🛡️ Admin Panel
            </Link>
          </>
        )}

      </nav>

      {/* PUBLIC PROPERTY LINK */}

      <div className="mt-10 border-t border-white/10 pt-6">
        <Link
          href="/properties"
          className="block bg-[#C9A227] text-[#08192E] text-center px-4 py-3 rounded-xl font-semibold hover:brightness-110 transition"
        >
          Find Properties
        </Link>
      </div>

    </aside>
  );
}