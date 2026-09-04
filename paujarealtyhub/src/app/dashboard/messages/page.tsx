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
    avatar_url?: string | null;
  } | null;

  property?: {
    id: number;
    title?: string | null;
  } | null;
};

export default function MessagesPage() {
  const [messages, setMessages] =
    useState<InboxItem[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [userId, setUserId] =
    useState("");

  useEffect(() => {
    loadInbox();
  }, []);

  async function loadInbox() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setMessages([]);
        return;
      }

      setUserId(user.id);

      const { data, error } =
        await supabase
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
          .order("created_at", {
            ascending: false,
          });

      if (error) {
        throw error;
      }

      const rawMessages =
        data || [];

      /*
      --------------------------------
      GROUP INTO CONVERSATIONS
      --------------------------------
      */

      const conversationMap =
        new Map<string, any>();

      for (const item of rawMessages) {
        const otherUserId =
          item.sender_id === user.id
            ? item.receiver_id
            : item.sender_id;

        const conversationKey =
          `${item.property_id}-${otherUserId}`;

        /*
        Because messages are already sorted
        newest first, the first message found
        is the latest message in the thread.
        */

        if (
          !conversationMap.has(
            conversationKey
          )
        ) {
          conversationMap.set(
            conversationKey,
            item
          );
        }
      }

      const conversationMessages =
        Array.from(
          conversationMap.values()
        );

      /*
      --------------------------------
      LOAD USER + PROPERTY DETAILS
      --------------------------------
      */

      const enriched =
        await Promise.all(
          conversationMessages.map(
            async (item: any) => {
              const otherUserId =
                item.sender_id ===
                user.id
                  ? item.receiver_id
                  : item.sender_id;

              const [
                {
                  data: profile,
                },
                {
                  data: property,
                },
              ] =
                await Promise.all([
                  supabase
                    .from(
                      "profiles"
                    )
                    .select(`
                      id,
                      full_name,
                      email,
                      avatar_url
                    `)
                    .eq(
                      "id",
                      otherUserId
                    )
                    .maybeSingle(),

                  supabase
                    .from(
                      "properties"
                    )
                    .select(
                      "id, title"
                    )
                    .eq(
                      "id",
                      item.property_id
                    )
                    .maybeSingle(),
                ]);

              return {
                ...item,
                otherUser:
                  profile,
                property,
              };
            }
          )
        );

      setMessages(enriched);
    } catch (error) {
      console.error(
        "LOAD INBOX ERROR:",
        error
      );

      setMessages([]);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <main className="p-8">
        <p>
          Loading conversations...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F7F7F3] p-6 md:p-8">

      <div className="max-w-5xl mx-auto">

        <div className="mb-8">

          <p className="text-[#B8922E] text-xs uppercase tracking-widest font-bold">
            Property Communication
          </p>

          <h1 className="text-4xl font-bold text-[#0B1F3A] mt-2">
            Messages
          </h1>

          <p className="text-gray-500 mt-2">
            Your property conversations appear here.
          </p>

        </div>

        {messages.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">

            <div className="text-5xl">
              💬
            </div>

            <h2 className="text-2xl font-bold text-[#0B1F3A] mt-5">
              No Conversations Yet
            </h2>

            <p className="text-gray-500 mt-3">
              When buyers and property owners start messaging,
              their conversations will appear here.
            </p>

            <Link
              href="/properties"
              className="inline-flex mt-6 bg-[#C9A227] text-[#08192E] px-6 py-3 rounded-xl font-bold"
            >
              Browse Properties
            </Link>

          </div>
        ) : (
          <div className="space-y-4">

            {messages.map(
              (item) => {
                const otherUserId =
                  item.sender_id ===
                  userId
                    ? item.receiver_id
                    : item.sender_id;

                const name =
                  item.otherUser
                    ?.full_name ||
                  item.otherUser
                    ?.email ||
                  "PaujaRealtyHub User";

                const avatar =
                  item.otherUser
                    ?.avatar_url ||
                  "";

                const initial =
                  name
                    .charAt(0)
                    .toUpperCase();

                return (
                  <Link
                    key={`${item.property_id}-${otherUserId}`}
                    href={`/dashboard/messages/${item.property_id}?user=${otherUserId}`}
                    className="block bg-white border border-gray-100 rounded-2xl shadow-sm p-5 hover:shadow-md transition"
                  >

                    <div className="flex gap-4 items-start">

                      {/* AVATAR */}

                      {avatar ? (
                        <img
                          src={avatar}
                          alt={name}
                          className="w-14 h-14 rounded-full object-cover border-2 border-[#C9A227]"
                        />
                      ) : (
                        <div className="w-14 h-14 rounded-full bg-[#08192E] text-[#C9A227] flex items-center justify-center text-xl font-bold border-2 border-[#C9A227]">
                          {initial}
                        </div>
                      )}

                      <div className="flex-1 min-w-0">

                        <div className="flex justify-between gap-4">

                          <div className="min-w-0">

                            <div className="flex items-center gap-3">

                              <h2 className="font-bold text-lg text-[#0B1F3A] truncate">
                                {name}
                              </h2>

                              {!item.is_read &&
                                item.receiver_id ===
                                  userId && (
                                  <span className="bg-red-600 text-white text-xs px-2 py-1 rounded-full">
                                    New
                                  </span>
                                )}

                            </div>

                            <p className="text-sm text-[#B8922E] font-semibold mt-1">
                              {item.property
                                ?.title ||
                                `Property #${item.property_id}`}
                            </p>

                          </div>

                          <div className="text-sm text-gray-400 whitespace-nowrap">
                            {new Date(
                              item.created_at
                            ).toLocaleDateString()}
                          </div>

                        </div>

                        <p className="text-gray-600 mt-3 line-clamp-2">
                          {item.message}
                        </p>

                        <p className="text-sm text-[#0B1F3A] font-semibold mt-4">
                          Open Conversation →
                        </p>

                      </div>

                    </div>

                  </Link>
                );
              }
            )}

          </div>
        )}

      </div>

    </main>
  );
}