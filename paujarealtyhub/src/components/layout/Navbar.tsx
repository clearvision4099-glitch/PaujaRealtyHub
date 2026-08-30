"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type { User } from "@supabase/supabase-js";

import { supabase } from "@/lib/supabase";

export default function Navbar() {
  const router = useRouter();

  const [user, setUser] =
    useState<User | null>(null);

  const [checkingAuth, setCheckingAuth] =
    useState(true);

  const [loggingOut, setLoggingOut] =
    useState(false);

  const [
    mobileMenuOpen,
    setMobileMenuOpen,
  ] = useState(false);

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setUser(user);
      setCheckingAuth(false);
    }

    loadUser();

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(
            session?.user ?? null
          );

          setCheckingAuth(false);
        }
      );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  async function handleLogout() {
    try {
      setLoggingOut(true);

      const { error } =
        await supabase.auth.signOut({
          scope: "local",
        });

      if (error) throw error;

      setUser(null);
      setMobileMenuOpen(false);

      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error(
        "LOGOUT ERROR:",
        error
      );

      alert(
        error?.message ||
          "Unable to log out."
      );
    } finally {
      setLoggingOut(false);
    }
  }

  function closeMobileMenu() {
    setMobileMenuOpen(false);
  }

  return (
    <nav className="sticky top-0 z-50 bg-[#08192E] text-white border-b border-[#C9A227]/30 shadow-md">

      {/* MAIN BAR */}

      <div className="max-w-7xl mx-auto px-3 sm:px-5 md:px-6 py-2.5 sm:py-4 flex items-center justify-between gap-2">

        {/* BRAND */}

        <Link
          href="/"
          onClick={closeMobileMenu}
          className="flex items-center gap-2 min-w-0"
        >
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-[#C9A227] text-[#08192E] flex items-center justify-center font-black text-sm sm:text-lg shrink-0">
            P
          </div>

          <div className="min-w-0">

            <p className="text-[15px] sm:text-xl font-bold leading-none whitespace-nowrap">
              PaujaRealtyHub
            </p>

            <p className="hidden sm:block text-[10px] text-gray-400 mt-1 tracking-wide whitespace-nowrap">
              PROPERTY • TRUST • INTELLIGENCE
            </p>

          </div>
        </Link>

        {/* DESKTOP NAVIGATION */}

        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-200">

          <Link
            href="/"
            className="hover:text-[#C9A227] transition"
          >
            Home
          </Link>

          <Link
            href="/properties"
            className="hover:text-[#C9A227] transition"
          >
            Properties
          </Link>

          <Link
            href="/businesses"
            className="hover:text-[#C9A227] transition"
          >
            Property Services
          </Link>

          <Link
            href="/agents"
            className="hover:text-[#C9A227] transition"
          >
            Agents
          </Link>

          <Link
            href="/contact"
            className="hover:text-[#C9A227] transition"
          >
            Contact
          </Link>

        </div>

        {/* ACCOUNT ACTIONS */}

        <div className="flex items-center gap-2 shrink-0">

          {checkingAuth ? (
            <div className="w-14 sm:w-24 h-8 sm:h-10 bg-white/10 rounded-lg animate-pulse" />
          ) : user ? (
            <>
              <Link
                href="/dashboard"
                className="hidden sm:inline-flex px-3 py-2 border border-[#C9A227] text-[#C9A227] rounded-xl text-sm hover:bg-[#C9A227] hover:text-[#08192E] transition"
              >
                Dashboard
              </Link>

              <Link
                href="/dashboard/add-property"
                className="px-2.5 py-1.5 sm:px-4 sm:py-2 bg-[#C9A227] text-[#08192E] font-bold rounded-lg sm:rounded-xl hover:brightness-110 transition whitespace-nowrap text-xs sm:text-base"
              >
                <span className="sm:hidden">
                  + List
                </span>

                <span className="hidden sm:inline">
                  + List Property
                </span>
              </Link>

              <button
                type="button"
                onClick={handleLogout}
                disabled={loggingOut}
                className="hidden lg:inline-flex px-4 py-2 text-gray-300 hover:text-white transition disabled:opacity-50"
              >
                {loggingOut
                  ? "Logging out..."
                  : "Log Out"}
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="hidden sm:inline-flex px-3 py-2 border border-white/40 text-white rounded-xl text-sm hover:border-[#C9A227] hover:text-[#C9A227] transition"
              >
                Log In
              </Link>

              <Link
                href="/register"
                className="px-2.5 py-1.5 sm:px-4 sm:py-2 bg-[#C9A227] text-[#08192E] font-bold rounded-lg sm:rounded-xl hover:brightness-110 transition whitespace-nowrap text-xs sm:text-base"
              >
                <span className="sm:hidden">
                  Join
                </span>

                <span className="hidden sm:inline">
                  Sign Up
                </span>
              </Link>

              <Link
                href="/login?next=/dashboard/add-property"
                className="hidden xl:inline-flex px-4 py-2 border border-[#C9A227] text-[#C9A227] rounded-xl hover:bg-[#C9A227] hover:text-[#08192E] transition"
              >
                + List Property
              </Link>
            </>
          )}

          {/* MOBILE MENU BUTTON */}

          <button
            type="button"
            onClick={() =>
              setMobileMenuOpen(
                (open) => !open
              )
            }
            className="md:hidden w-9 h-9 rounded-lg border border-white/20 flex items-center justify-center text-xl hover:border-[#C9A227] hover:text-[#C9A227] transition"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen
              ? "✕"
              : "☰"}
          </button>

        </div>

      </div>

      {/* MOBILE NAVIGATION */}

      {mobileMenuOpen && (
        <div className="md:hidden border-t border-white/10 bg-[#08192E]">

          <div className="px-4 py-4 space-y-2">

            <Link
              href="/"
              onClick={closeMobileMenu}
              className="block px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              Home
            </Link>

            <Link
              href="/properties"
              onClick={closeMobileMenu}
              className="block px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              Properties
            </Link>

            <Link
              href="/businesses"
              onClick={closeMobileMenu}
              className="block px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              Property Services
            </Link>

            <Link
              href="/agents"
              onClick={closeMobileMenu}
              className="block px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              Agents
            </Link>

            <Link
              href="/contact"
              onClick={closeMobileMenu}
              className="block px-4 py-3 rounded-xl hover:bg-white/10 transition"
            >
              Contact
            </Link>

            {user && (
              <>
                <div className="border-t border-white/10 my-3" />

                <Link
                  href="/dashboard"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl text-[#C9A227] hover:bg-white/10 transition"
                >
                  Dashboard
                </Link>

                <button
                  type="button"
                  onClick={handleLogout}
                  disabled={loggingOut}
                  className="w-full text-left px-4 py-3 rounded-xl text-gray-300 hover:bg-white/10 hover:text-white transition disabled:opacity-50"
                >
                  {loggingOut
                    ? "Logging out..."
                    : "Log Out"}
                </button>
              </>
            )}

            {!user && (
              <>
                <div className="border-t border-white/10 my-3" />

                <Link
                  href="/login"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl hover:bg-white/10 transition"
                >
                  Log In
                </Link>

                <Link
                  href="/register"
                  onClick={closeMobileMenu}
                  className="block px-4 py-3 rounded-xl text-[#C9A227] hover:bg-white/10 transition"
                >
                  Sign Up
                </Link>
              </>
            )}

          </div>

        </div>
      )}

    </nav>
  );
}