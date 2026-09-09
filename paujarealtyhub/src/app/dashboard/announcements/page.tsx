"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";

type Announcement = {
  id: number;
  title: string;
  message: string;
  created_at: string;
};

export default function AnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      // GET ACTIVE ANNOUNCEMENTS

      const { data, error } = await supabase
        .from("announcements")
        .select("id, title, message, created_at")
        .eq("is_active", true)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("LOAD ANNOUNCEMENTS ERROR:", error);
        setLoading(false);
        return;
      }

      const activeAnnouncements = data || [];

      setAnnouncements(activeAnnouncements);

      // MARK ANNOUNCEMENTS AS READ

      if (activeAnnouncements.length > 0) {
        const readRecords = activeAnnouncements.map((announcement) => ({
          announcement_id: announcement.id,
          user_id: user.id,
        }));

        const { error: readError } = await supabase
          .from("announcement_reads")
          .upsert(readRecords, {
            onConflict: "announcement_id,user_id",
            ignoreDuplicates: true,
          });

        if (readError) {
          console.error(
            "MARK ANNOUNCEMENTS READ ERROR:",
            readError
          );
        }
      }
    } catch (error) {
      console.error("ANNOUNCEMENTS PAGE ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="p-8">
      <h1 className="text-3xl font-bold text-blue-700 mb-2">
        Announcements
      </h1>

      <p className="text-gray-600 mb-8">
        Important updates and messages from PaujaRealtyHub.
      </p>

      {loading ? (
        <p>Loading announcements...</p>
      ) : announcements.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-2xl p-6">
          <p>No announcements available.</p>
        </div>
      ) : (
        <div className="space-y-5">
          {announcements.map((announcement) => (
            <div
              key={announcement.id}
              className="bg-yellow-50 border border-yellow-300 rounded-2xl p-6"
            >
              <p className="text-sm font-semibold text-yellow-700">
                PLATFORM ANNOUNCEMENT
              </p>

              <h2 className="text-xl font-bold text-[#08192E] mt-2">
                {announcement.title}
              </h2>

              <p className="text-gray-700 mt-3">
                {announcement.message}
              </p>

              <p className="text-xs text-gray-500 mt-4">
                {new Date(
                  announcement.created_at
                ).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}