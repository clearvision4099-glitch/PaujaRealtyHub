"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import AdminNav from "@/components/admin/AdminNav";

type Announcement = {
  id: number;
  title: string;
  message: string;
  audience: string;
  is_active: boolean;
  created_at: string;
};

export default function AdminAnnouncementsPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const [publishing, setPublishing] = useState(false);

  useEffect(() => {
    loadAnnouncements();
  }, []);

  async function loadAnnouncements() {
    const { data, error } = await supabase
      .from("announcements")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("LOAD ANNOUNCEMENTS ERROR:", error);
    } else {
      setAnnouncements(data || []);
    }

    setLoading(false);
  }

  async function publishAnnouncement() {
    const cleanTitle = title.trim();
    const cleanMessage = message.trim();

    if (!cleanTitle || !cleanMessage) {
      alert("Please enter a title and message.");
      return;
    }

    setPublishing(true);

    const { error } = await supabase
      .from("announcements")
      .insert({
        title: cleanTitle,
        message: cleanMessage,
        audience: "everyone",
        is_active: true,
      });

    setPublishing(false);

    if (error) {
      console.error("PUBLISH ANNOUNCEMENT ERROR:", error);
      alert("Could not publish announcement.");
      return;
    }

    setTitle("");
    setMessage("");

    await loadAnnouncements();

    alert("Announcement published successfully.");
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <section className="bg-[#08192E] text-white">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
          <p className="text-[#C9A227] text-sm font-semibold">
            PAUJA GLOBAL ADMINISTRATION
          </p>

          <h1 className="text-3xl font-bold mt-2">
            Announcements
          </h1>

          <p className="text-gray-300 mt-2">
            Publish important messages to PaujaRealtyHub users.
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">
        <AdminNav />

        <div className="mt-8 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
          <h2 className="text-xl font-bold text-[#08192E]">
            Create Announcement
          </h2>

          <div className="mt-6">
            <label className="block text-sm font-semibold mb-2">
              Title
            </label>

            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Example: Platform Maintenance"
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none"
            />
          </div>

          <div className="mt-5">
            <label className="block text-sm font-semibold mb-2">
              Message
            </label>

            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write your announcement..."
              rows={5}
              className="w-full border border-gray-300 rounded-xl px-4 py-3 outline-none resize-none"
            />
          </div>

          <button
            onClick={publishAnnouncement}
            disabled={publishing}
            className="mt-5 bg-[#C9A227] text-[#08192E] font-bold px-6 py-3 rounded-xl disabled:opacity-50"
          >
            {publishing ? "Publishing..." : "Publish Announcement"}
          </button>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-[#08192E] mb-4">
            Published Announcements
          </h2>

          {loading ? (
            <p>Loading announcements...</p>
          ) : announcements.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-2xl p-6">
              <p>No announcements published yet.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {announcements.map((announcement) => (
                <div
                  key={announcement.id}
                  className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6"
                >
                  <div className="flex justify-between gap-4">
                    <div>
                      <h3 className="text-lg font-bold text-[#08192E]">
                        {announcement.title}
                      </h3>

                      <p className="mt-2 text-gray-700">
                        {announcement.message}
                      </p>
                    </div>

                    <span className="text-sm font-semibold text-green-600">
                      {announcement.is_active ? "Active" : "Inactive"}
                    </span>
                  </div>

                  <p className="text-xs text-gray-500 mt-4">
                    {new Date(announcement.created_at).toLocaleString()}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}