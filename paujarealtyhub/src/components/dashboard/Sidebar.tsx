"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

export default function Sidebar() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [checkingAdmin, setCheckingAdmin] = useState(true);

  useEffect(() => {
    let mounted = true;

    async function loadAdminStatus(userId?: string) {
      try {
        setCheckingAdmin(true);

        let resolvedUserId = userId;

        if (!resolvedUserId) {
          const {
            data: { user },
          } = await supabase.auth.getUser();

          resolvedUserId = user?.id;
        }

        if (!resolvedUserId) {
          if (mounted) {
            setIsAdmin(false);
          }

          return;
        }

        const { data, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", resolvedUserId)
          .maybeSingle();

        if (error) {
          console.error(
            "SIDEBAR ADMIN CHECK ERROR:",
            error
          );

          if (mounted) {
            setIsAdmin(false);
          }

          return;
        }

        if (mounted) {
          setIsAdmin(
            data?.is_admin === true
          );
        }
      } catch (error) {
        console.error(
          "SIDEBAR ADMIN STATUS ERROR:",
          error
        );

        if (mounted) {
          setIsAdmin(false);
        }
      } finally {
        if (mounted) {
          setCheckingAdmin(false);
        }
      }
    }

    /*
    -----------------------------------
    INITIAL ADMIN CHECK
    -----------------------------------
    */

    loadAdminStatus();

    /*
    -----------------------------------
    WATCH AUTH SESSION CHANGES
    -----------------------------------
    */

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          if (!session?.user) {
            if (mounted) {
              setIsAdmin(false);
              setCheckingAdmin(false);
            }

            return;
          }

          loadAdminStatus(
            session.user.id
          );
        }
      );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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

        {/* ADMIN */}

        {!checkingAdmin &&
          isAdmin && (
            <Link
              href="/admin"
              className="block px-4 py-3 rounded-xl bg-[#C9A227]/20 text-[#E7C95C] border border-[#C9A227]/40 hover:bg-[#C9A227]/30 transition"
            >
              🛡️ Admin
            </Link>
          )}

      </nav>

      {/* MARKETPLACE */}

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