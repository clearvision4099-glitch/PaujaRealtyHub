"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

type SupportMessage = {
  id: number;
  user_id: string | null;
  full_name: string;
  email: string;
  subject: string;
  message: string;
  status: string;
  created_at: string;
};

export default function AdminSupportPage() {
  const router = useRouter();

  const [authorized, setAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<SupportMessage[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    initialize();
  }, []);

  async function initialize() {
    try {
      setLoading(true);
      setErrorMessage("");

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile, error: profileError } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        throw profileError;
      }

      if (!profile?.is_admin) {
        router.replace("/dashboard");
        return;
      }

      setAuthorized(true);
      await loadMessages();
    } catch (error) {
      console.error("ADMIN SUPPORT INIT ERROR:", error);
      setErrorMessage("Unable to load support messages.");
    } finally {
      setLoading(false);
    }
  }

  async function loadMessages() {
    const { data, error } = await supabase
      .from("support_messages")
      .select(`
        id,
        user_id,
        full_name,
        email,
        subject,
        message,
        status,
        created_at
      `)
      .order("created_at", {
        ascending: false,
      });

    if (error) {
      throw error;
    }

    setMessages(data || []);
  }

  async function updateStatus(
    messageId: number,
    status: "New" | "Read" | "Resolved"
  ) {
    try {
      setUpdatingId(messageId);

      const { error } = await supabase
        .from("support_messages")
        .update({ status })
        .eq("id", messageId);

      if (error) {
        throw error;
      }

      setMessages((current) =>
        current.map((message) =>
          message.id === messageId
            ? {
                ...message,
                status,
              }
            : message
        )
      );
    } catch (error: any) {
      console.error("UPDATE SUPPORT STATUS ERROR:", error);

      alert(
        error?.message ||
          "Unable to update support message."
      );
    } finally {
      setUpdatingId(null);
    }
  }

  function statusStyle(status: string) {
    if (status === "New") {
      return "bg-yellow-100 text-yellow-800";
    }

    if (status === "Read") {
      return "bg-blue-100 text-blue-700";
    }

    if (status === "Resolved") {
      return "bg-green-100 text-green-700";
    }

    return "bg-gray-100 text-gray-600";
  }

  const newCount = messages.filter(
    (message) => message.status === "New"
  ).length;

  const readCount = messages.filter(
    (message) => message.status === "Read"
  ).length;

  const resolvedCount = messages.filter(
    (message) => message.status === "Resolved"
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-[#F5F6F8] flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />

          <p className="text-gray-500 mt-5">
            Loading support messages...
          </p>
        </div>
      </main>
    );
  }

  if (!authorized) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[#F5F6F8]">

      <section className="bg-[#08192E] text-white border-b border-[#C9A227]/30">
        <div className="max-w-7xl mx-auto px-4 md:px-6 py-7 flex flex-col md:flex-row md:items-center md:justify-between gap-4">

          <div>
            <span className="text-[#C9A227] text-xs font-bold uppercase tracking-widest">
              Pauja Global Administration
            </span>

            <h1 className="text-3xl font-bold mt-2">
              Support Inbox
            </h1>

            <p className="text-gray-300 mt-2">
              Review messages sent to PaujaRealtyHub management.
            </p>
          </div>

          <Link
            href="/admin"
            className="self-start md:self-auto border border-[#C9A227] text-[#C9A227] px-5 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
          >
            ← Admin Dashboard
          </Link>

        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 md:px-6 py-8">

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <p className="text-sm text-gray-500">
              Total Messages
            </p>

            <p className="text-3xl font-bold text-[#0B1F3A] mt-1">
              {messages.length}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <p className="text-sm text-gray-500">
              New
            </p>

            <p className="text-3xl font-bold text-yellow-700 mt-1">
              {newCount}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <p className="text-sm text-gray-500">
              Read
            </p>

            <p className="text-3xl font-bold text-blue-700 mt-1">
              {readCount}
            </p>
          </div>

          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-5">
            <p className="text-sm text-gray-500">
              Resolved
            </p>

            <p className="text-3xl font-bold text-green-700 mt-1">
              {resolvedCount}
            </p>
          </div>

        </div>

        {errorMessage && (
          <div className="mb-6 bg-red-50 border border-red-200 text-red-700 rounded-2xl p-6">
            {errorMessage}
          </div>
        )}

        {messages.length === 0 ? (
          <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-12 text-center">

            <div className="text-5xl">
              📬
            </div>

            <h2 className="text-2xl font-bold text-[#0B1F3A] mt-4">
              No Support Messages
            </h2>

            <p className="text-gray-500 mt-3">
              Messages sent through Contact Management will appear here.
            </p>

          </div>
        ) : (
          <div className="space-y-5">

            {messages.map((message) => {
              const isUpdating =
                updatingId === message.id;

              return (
                <article
                  key={message.id}
                  className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6"
                >

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">

                    <div className="min-w-0 flex-1">

                      <div className="flex flex-wrap gap-2 items-center">

                        <span
                          className={`px-3 py-1 rounded-full text-xs font-bold ${statusStyle(
                            message.status
                          )}`}
                        >
                          {message.status}
                        </span>

                        <span className="text-xs text-gray-400">
                          {new Date(
                            message.created_at
                          ).toLocaleString()}
                        </span>

                      </div>

                      <h2 className="text-xl font-bold text-[#0B1F3A] mt-4">
                        {message.subject}
                      </h2>

                      <p className="text-sm text-gray-500 mt-2">
                        From:{" "}
                        <strong className="text-[#0B1F3A]">
                          {message.full_name}
                        </strong>
                      </p>

                      <p className="text-sm text-gray-500 mt-1">
                        {message.email}
                      </p>

                      <div className="mt-5 bg-[#F7F7F3] rounded-xl p-5">

                        <p className="text-gray-700 whitespace-pre-line leading-7">
                          {message.message}
                        </p>

                      </div>

                      {message.user_id && (
                        <p className="text-xs text-gray-400 mt-4">
                          Registered user message
                        </p>
                      )}

                    </div>

                    <div className="flex flex-wrap gap-3">

                      {message.status !== "Read" && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            updateStatus(
                              message.id,
                              "Read"
                            )
                          }
                          className="px-4 py-2.5 rounded-xl bg-blue-50 border border-blue-200 text-blue-700 font-semibold hover:bg-blue-100 disabled:opacity-50 transition"
                        >
                          Mark Read
                        </button>
                      )}

                      {message.status !== "Resolved" && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            updateStatus(
                              message.id,
                              "Resolved"
                            )
                          }
                          className="px-4 py-2.5 rounded-xl bg-green-600 text-white font-semibold hover:bg-green-700 disabled:opacity-50 transition"
                        >
                          Resolve
                        </button>
                      )}

                      {message.status === "Resolved" && (
                        <button
                          type="button"
                          disabled={isUpdating}
                          onClick={() =>
                            updateStatus(
                              message.id,
                              "New"
                            )
                          }
                          className="px-4 py-2.5 rounded-xl border border-gray-300 text-[#0B1F3A] font-semibold hover:bg-gray-50 disabled:opacity-50 transition"
                        >
                          Reopen
                        </button>
                      )}

                    </div>

                  </div>

                </article>
              );
            })}

          </div>
        )}

      </div>

    </main>
  );
}