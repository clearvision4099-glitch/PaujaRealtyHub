"use client";

import { useEffect, useState } from "react";
import {
  useParams,
  useSearchParams,
  useRouter,
} from "next/navigation";
import Link from "next/link";

import { supabase } from "@/lib/supabase";
import {
  getConversation,
  sendMessage,
  markConversationAsRead,
} from "@/services/messages";

type ConversationNavigation = {
  propertyId: number;
  otherUserId: string;
};

export default function ConversationPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();

  const propertyId = Number(params.propertyId);
  const otherUserId =
    searchParams.get("user") || "";

  const [messages, setMessages] =
    useState<any[]>([]);

  const [property, setProperty] =
    useState<any>(null);

  const [otherUser, setOtherUser] =
    useState<any>(null);

  const [currentUserId, setCurrentUserId] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [sending, setSending] =
    useState(false);

  const [conversations, setConversations] =
    useState<ConversationNavigation[]>([]);

  /*
  -----------------------------------
  LOAD CONVERSATION
  -----------------------------------
  */

  useEffect(() => {
    if (propertyId && otherUserId) {
      loadConversation();
    }
  }, [propertyId, otherUserId]);

  async function loadConversation() {
    try {
      setLoading(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setCurrentUserId(user.id);

      const [
        conversation,
        propertyResult,
        profileResult,
        messagesResult,
      ] = await Promise.all([
        getConversation(
          propertyId,
          otherUserId
        ),

        supabase
          .from("properties")
          .select(
            "id, title, city, state"
          )
          .eq("id", propertyId)
          .maybeSingle(),

        supabase
          .from("profiles")
          .select(
            "id, full_name, email"
          )
          .eq("id", otherUserId)
          .maybeSingle(),

        supabase
          .from("messages")
          .select(`
            id,
            property_id,
            sender_id,
            receiver_id,
            created_at
          `)
          .or(
            `sender_id.eq.${user.id},receiver_id.eq.${user.id}`
          )
          .order("created_at", {
            ascending: false,
          }),
      ]);

      /*
      CURRENT CONVERSATION
      */

      setMessages(conversation);

      /*
      PROPERTY
      */

      if (propertyResult.error) {
        console.error(
          "LOAD PROPERTY ERROR:",
          propertyResult.error
        );
      } else {
        setProperty(
          propertyResult.data
        );
      }

      /*
      OTHER USER
      */

      if (profileResult.error) {
        console.error(
          "LOAD USER ERROR:",
          profileResult.error
        );
      } else {
        setOtherUser(
          profileResult.data
        );
      }

      /*
      BUILD CONVERSATION NAVIGATION
      */

      if (messagesResult.error) {
        console.error(
          "LOAD MESSAGE NAVIGATION ERROR:",
          messagesResult.error
        );

        setConversations([]);
      } else {
        const seen =
          new Set<string>();

        const navigation:
          ConversationNavigation[] = [];

        for (
          const item of
            messagesResult.data || []
        ) {
          const otherId =
            item.sender_id === user.id
              ? item.receiver_id
              : item.sender_id;

          const key =
            `${item.property_id}-${otherId}`;

          if (seen.has(key)) {
            continue;
          }

          seen.add(key);

          navigation.push({
            propertyId: Number(
              item.property_id
            ),
            otherUserId: otherId,
          });
        }

        setConversations(
          navigation
        );
      }

      /*
      MARK CURRENT CONVERSATION READ
      */

      await markConversationAsRead(
        propertyId,
        otherUserId
      );
    } catch (error) {
      console.error(
        "LOAD CONVERSATION ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  -----------------------------------
  SEND MESSAGE
  -----------------------------------
  */

  async function handleSend() {
    const cleanMessage =
      message.trim();

    if (
      !cleanMessage ||
      sending
    ) {
      return;
    }

    setSending(true);

    const result =
      await sendMessage({
        receiverId:
          otherUserId,
        propertyId,
        message:
          cleanMessage,
      });

    if (result.success) {
      setMessage("");

      const updatedConversation =
        await getConversation(
          propertyId,
          otherUserId
        );

      setMessages(
        updatedConversation
      );
    }

    setSending(false);
  }

  /*
  -----------------------------------
  PREVIOUS / NEXT
  -----------------------------------
  */

  const currentConversationIndex =
    conversations.findIndex(
      (item) =>
        item.propertyId ===
          propertyId &&
        item.otherUserId ===
          otherUserId
    );

  const previousConversation =
    currentConversationIndex > 0
      ? conversations[
          currentConversationIndex - 1
        ]
      : null;

  const nextConversation =
    currentConversationIndex >= 0 &&
    currentConversationIndex <
      conversations.length - 1
      ? conversations[
          currentConversationIndex + 1
        ]
      : null;

  function openConversation(
    conversation:
      ConversationNavigation
  ) {
    router.push(
      `/dashboard/messages/${conversation.propertyId}?user=${conversation.otherUserId}`
    );
  }

  /*
  -----------------------------------
  LOADING
  -----------------------------------
  */

  if (loading) {
    return (
      <main className="p-8">
        <p>
          Loading conversation...
        </p>
      </main>
    );
  }

  /*
  -----------------------------------
  PAGE
  -----------------------------------
  */

  return (
    <main className="p-8 max-w-5xl mx-auto">

      {/* CONVERSATION NAVIGATION */}

      <div className="flex items-center justify-between gap-3">

        <button
          type="button"
          disabled={
            !previousConversation
          }
          onClick={() => {
            if (
              previousConversation
            ) {
              openConversation(
                previousConversation
              );
            }
          }}
          className="px-4 py-2 rounded-lg border font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          ← Previous
        </button>

        <Link
          href="/dashboard/messages"
          className="text-blue-700 font-semibold hover:underline"
        >
          ← Inbox
        </Link>

        <button
          type="button"
          disabled={
            !nextConversation
          }
          onClick={() => {
            if (
              nextConversation
            ) {
              openConversation(
                nextConversation
              );
            }
          }}
          className="px-4 py-2 rounded-lg border font-semibold text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
        >
          Next →
        </button>

      </div>

      <div className="bg-white rounded-2xl shadow mt-6 overflow-hidden">

        {/* CONVERSATION HEADER */}

        <div className="border-b p-6">

          <h1 className="text-2xl font-bold">
            {otherUser?.full_name ||
              otherUser?.email ||
              "PaujaRealtyHub User"}
          </h1>

          {property && (
            <div className="mt-2">

              <Link
                href={`/properties/${property.id}`}
                className="text-blue-700 font-semibold hover:underline"
              >
                {property.title}
              </Link>

              <p className="text-sm text-gray-500 mt-1">
                {property.city},{" "}
                {property.state}
              </p>

            </div>
          )}

        </div>

        {/* MESSAGES */}

        <div className="p-6 min-h-[420px] max-h-[550px] overflow-y-auto bg-gray-50">

          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              No messages in this
              conversation yet.
            </div>
          ) : (
            <div className="space-y-4">

              {messages.map(
                (item: any) => {
                  const mine =
                    item.sender_id ===
                    currentUserId;

                  return (
                    <div
                      key={item.id}
                      className={`flex ${
                        mine
                          ? "justify-end"
                          : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-5 py-3 ${
                          mine
                            ? "bg-blue-700 text-white"
                            : "bg-white border text-gray-800"
                        }`}
                      >
                        <p className="whitespace-pre-wrap">
                          {
                            item.message
                          }
                        </p>

                        <p
                          className={`text-xs mt-2 ${
                            mine
                              ? "text-blue-100"
                              : "text-gray-400"
                          }`}
                        >
                          {new Date(
                            item.created_at
                          ).toLocaleString()}
                        </p>

                      </div>
                    </div>
                  );
                }
              )}

            </div>
          )}

        </div>

        {/* REPLY BOX */}

        <div className="border-t p-3 sm:p-5">

          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(
                  e.target.value
                )
              }
              placeholder="Type your message..."
              rows={2}
              className="w-full sm:flex-1 border rounded-xl px-3 sm:px-4 py-2.5 sm:py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={
                sending ||
                !message.trim()
              }
              className="w-full sm:w-auto bg-blue-700 text-white px-5 sm:px-7 py-2.5 sm:py-0 rounded-xl font-semibold hover:bg-blue-800 disabled:bg-gray-400"
            >
              {sending
                ? "Sending..."
                : "Send"}
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}