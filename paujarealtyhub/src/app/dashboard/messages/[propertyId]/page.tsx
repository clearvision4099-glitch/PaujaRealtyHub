"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import Link from "next/link";

import { supabase } from "@/lib/supabase";
import {
  getConversation,
  sendMessage,
  markConversationAsRead,
} from "@/services/messages";

export default function ConversationPage() {
  const params = useParams();
  const searchParams = useSearchParams();

  const propertyId = Number(params.propertyId);
  const otherUserId = searchParams.get("user") || "";

  const [messages, setMessages] = useState<any[]>([]);
  const [property, setProperty] = useState<any>(null);
  const [otherUser, setOtherUser] = useState<any>(null);
  const [currentUserId, setCurrentUserId] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (propertyId && otherUserId) {
      loadConversation();
    }
  }, [propertyId, otherUserId]);

  async function loadConversation() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        setLoading(false);
        return;
      }

      setCurrentUserId(user.id);

      const [conversation, propertyResult, profileResult] =
        await Promise.all([
          getConversation(propertyId, otherUserId),

          supabase
            .from("properties")
            .select("id, title, city, state")
            .eq("id", propertyId)
            .maybeSingle(),

          supabase
            .from("profiles")
            .select("id, full_name, email")
            .eq("id", otherUserId)
            .maybeSingle(),
        ]);

      setMessages(conversation);

      if (propertyResult.error) {
        console.error(
          "LOAD PROPERTY ERROR:",
          propertyResult.error
        );
      } else {
        setProperty(propertyResult.data);
      }

      if (profileResult.error) {
        console.error(
          "LOAD USER ERROR:",
          profileResult.error
        );
      } else {
        setOtherUser(profileResult.data);
      }

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

  async function handleSend() {
    const cleanMessage = message.trim();

    if (!cleanMessage || sending) return;

    setSending(true);

    const result = await sendMessage({
      receiverId: otherUserId,
      propertyId,
      message: cleanMessage,
    });

    if (result.success) {
      setMessage("");

      const updatedConversation =
        await getConversation(
          propertyId,
          otherUserId
        );

      setMessages(updatedConversation);
    }

    setSending(false);
  }

  if (loading) {
    return (
      <main className="p-8">
        <p>Loading conversation...</p>
      </main>
    );
  }

  return (
    <main className="p-8 max-w-5xl mx-auto">

      <Link
        href="/dashboard/messages"
        className="text-blue-700 font-semibold"
      >
        ← Back to Messages
      </Link>

      <div className="bg-white rounded-2xl shadow mt-6 overflow-hidden">

        {/* Conversation header */}
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
                {property.city}, {property.state}
              </p>
            </div>
          )}

        </div>

        {/* Messages */}
        <div className="p-6 min-h-[420px] max-h-[550px] overflow-y-auto bg-gray-50">

          {messages.length === 0 ? (
            <div className="text-center text-gray-500 py-20">
              No messages in this conversation yet.
            </div>
          ) : (
            <div className="space-y-4">

              {messages.map((item: any) => {
                const mine =
                  item.sender_id === currentUserId;

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
                        {item.message}
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
              })}

            </div>
          )}

        </div>

        {/* Reply box */}
        <div className="border-t p-5">

          <div className="flex gap-3">

            <textarea
              value={message}
              onChange={(e) =>
                setMessage(e.target.value)
              }
              placeholder="Type your message..."
              rows={2}
              className="flex-1 border rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            />

            <button
              type="button"
              onClick={handleSend}
              disabled={
                sending || !message.trim()
              }
              className="bg-blue-700 text-white px-7 rounded-xl hover:bg-blue-800 disabled:bg-gray-400"
            >
              {sending ? "Sending..." : "Send"}
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}