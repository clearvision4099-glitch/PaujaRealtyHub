"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="w-72 min-h-screen bg-[#08192E] text-white px-5 py-8 shadow-2xl">
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

      </nav>

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