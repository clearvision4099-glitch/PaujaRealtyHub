"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

type InboxItem = {
  id: number;
  sender_id: string;
  receiver_id: string;
  property_id: number;
  message: string;
  is_read: boolean;
  created_at: string;

  otherUser?: {
    id?: string;
    full_name?: string | null;
    email?: string | null;
  } | null;

  property?: {
    id: number;
    title?: string | null;
  } | null;
};

export default function MessagesPage() {
  const [messages, setMessages] = useState<InboxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState("");

  useEffect(() => {
    loadInbox();
  }, []);

  async function loadInbox() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessages([]);
        return;
      }

      setUserId(user.id);

      const { data, error } = await supabase
        .from("messages")
        .select(`
          id,
          sender_id,
          receiver_id,
          property_id,
          message,
          is_read,
          created_at
        `)
        .or(
          `sender_id.eq.${user.id},receiver_id.eq.${user.id}`
        )
        .order("created_at", { ascending: false });

      if (error) throw error;

      const rawMessages = data || [];

      const enriched = await Promise.all(
        rawMessages.map(async (item: any) => {
          const otherUserId =
            item.sender_id === user.id
              ? item.receiver_id
              : item.sender_id;

          const [{ data: profile }, { data: property }] =
            await Promise.all([
              supabase
                .from("profiles")
                .select("id, full_name, email")
                .eq("id", otherUserId)
                .maybeSingle(),

              supabase
                .from("properties")
                .select("id, title")
                .eq("id", item.property_id)
                .maybeSingle(),
            ]);

          return {
            ...item,
            otherUser: profile,
            property,
          };
        })
      );

      setMessages(enriched);
    } catch (error) {
      console.error("LOAD INBOX ERROR:", error);
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="p-8">
        <p>Loading conversations...</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-blue-700">
          Messages
        </h1>

        <p className="text-gray-500 mt-2">
          Your property conversations appear here.
        </p>
      </div>

      {messages.length === 0 ? (
        <div className="bg-white rounded-xl shadow p-10 text-center">
          <h2 className="text-2xl font-bold">
            No conversations yet
          </h2>

          <p className="text-gray-500 mt-3">
            When buyers and property owners start messaging,
            their conversations will appear here.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {messages.map((item) => {
            const otherUserId =
              item.sender_id === userId
                ? item.receiver_id
                : item.sender_id;

            const name =
              item.otherUser?.full_name ||
              item.otherUser?.email ||
              "PaujaRealtyHub User";

            return (
              <Link
                key={item.id}
                href={`/dashboard/messages/${item.property_id}?user=${otherUserId}`}
                className="block bg-white rounded-xl shadow p-5 hover:shadow-md transition"
              >
                <div className="flex justify-between gap-4">
                  <div className="min-w-0">
                    <div className="flex items-center gap-3">
                      <h2 className="font-bold text-lg truncate">
                        {name}
                      </h2>

                      {!item.is_read &&
                        item.receiver_id === userId && (
                          <span className="bg-blue-700 text-white text-xs px-2 py-1 rounded-full">
                            Unread
                          </span>
                        )}
                    </div>

                    <p className="text-sm text-blue-700 mt-1">
                      {item.property?.title ||
                        `Property #${item.property_id}`}
                    </p>

                    <p className="text-gray-600 mt-2 line-clamp-2">
                      {item.message}
                    </p>
                  </div>

                  <div className="text-sm text-gray-400 whitespace-nowrap">
                    {new Date(
                      item.created_at
                    ).toLocaleDateString()}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </main>
  );
}