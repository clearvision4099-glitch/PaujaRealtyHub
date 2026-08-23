"use client";

import { useState } from "react";

import Sidebar from "@/components/dashboard/Sidebar";
import Topbar from "@/components/dashboard/Topbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false);

  return (
    <div className="flex min-h-screen bg-[#F5F6F8]">

      {/* MOBILE OVERLAY */}

      {sidebarOpen && (
        <button
          type="button"
          aria-label="Close menu"
          onClick={() =>
            setSidebarOpen(false)
          }
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      {/* SIDEBAR */}

      <div
        className={`
          fixed inset-y-0 left-0 z-50
          w-[280px]
          transform transition-transform duration-300
          lg:static lg:translate-x-0 lg:shrink-0
          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >
        <Sidebar />
      </div>

      {/* MAIN DASHBOARD AREA */}

      <div className="flex-1 min-w-0">

        {/* MOBILE HEADER */}

        <div className="lg:hidden sticky top-0 z-30 bg-white border-b border-gray-200 px-4 py-3 flex items-center gap-3">

          <button
            type="button"
            onClick={() =>
              setSidebarOpen(true)
            }
            className="w-10 h-10 rounded-xl bg-[#08192E] text-white flex items-center justify-center text-xl"
            aria-label="Open dashboard menu"
          >
            ☰
          </button>

          <div>
            <p className="font-bold text-[#0B1F3A]">
              PaujaRealtyHub
            </p>

            <p className="text-xs text-gray-500">
              Dashboard
            </p>
          </div>

        </div>

        {/* DESKTOP TOPBAR */}

        <div className="hidden lg:block">
          <Topbar />
        </div>

        {/* PAGE CONTENT */}

        <main className="min-h-[calc(100vh-64px)] bg-gradient-to-br from-[#F8F9FB] via-white to-[#F4F1E8]">
          {children}
        </main>

      </div>

    </div>
  );
}