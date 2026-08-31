"use client";

import { useEffect, useState } from "react";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { supabase } from "@/lib/supabase";

export default function ContactPage() {
  const [fullName, setFullName] =
    useState("");

  const [email, setEmail] =
    useState("");

  const [subject, setSubject] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [userId, setUserId] =
    useState<string | null>(null);

  const [sending, setSending] =
    useState(false);

  const [successMessage, setSuccessMessage] =
    useState("");

  const [errorMessage, setErrorMessage] =
    useState("");

  useEffect(() => {
    async function loadUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        return;
      }

      setUserId(user.id);

      if (user.email) {
        setEmail(user.email);
      }

      const {
        data: profile,
      } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .maybeSingle();

      if (profile?.full_name) {
        setFullName(profile.full_name);
      }
    }

    loadUser();
  }, []);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (
      !fullName.trim() ||
      !email.trim() ||
      !subject.trim() ||
      !message.trim()
    ) {
      setErrorMessage(
        "Please complete all fields."
      );

      return;
    }

    try {
      setSending(true);
      setErrorMessage("");
      setSuccessMessage("");

      const { error } = await supabase
        .from("support_messages")
        .insert([
          {
            user_id: userId,
            full_name: fullName.trim(),
            email: email.trim(),
            subject: subject.trim(),
            message: message.trim(),
            status: "New",
          },
        ]);

      if (error) {
        throw error;
      }

      setSuccessMessage(
        "Your message has been sent to PaujaRealtyHub management."
      );

      setSubject("");
      setMessage("");
    } catch (error: any) {
      console.error(
        "SEND SUPPORT MESSAGE ERROR:",
        error
      );

      setErrorMessage(
        error?.message ||
          "Unable to send your message."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <>
      <Navbar />

      <main className="min-h-screen bg-[#F7F7F3]">

        {/* HERO */}

        <section className="bg-[#08192E] text-white">

          <div className="max-w-5xl mx-auto px-4 md:px-6 py-14 md:py-20 text-center">

            <span className="text-[#C9A227] text-sm font-bold uppercase tracking-widest">
              PaujaRealtyHub Support
            </span>

            <h1 className="text-4xl md:text-5xl font-bold mt-3">
              Contact Management
            </h1>

            <p className="text-gray-300 mt-4 max-w-2xl mx-auto">
              Send a message to PaujaRealtyHub management
              for account support, verification questions,
              complaints, partnerships, payments or general
              enquiries.
            </p>

          </div>

        </section>

        {/* FORM */}

        <section className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14">

          <div className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 md:p-10">

            <div className="mb-8">

              <p className="text-[#B8922E] text-xs font-bold uppercase tracking-widest">
                Management Support
              </p>

              <h2 className="text-3xl font-bold text-[#0B1F3A] mt-2">
                Send Us a Message
              </h2>

              <p className="text-gray-500 mt-2">
                Our management team will review your message
                and respond as appropriate.
              </p>

            </div>

            {successMessage && (
              <div className="mb-6 rounded-xl border border-green-200 bg-green-50 text-green-700 p-4">
                {successMessage}
              </div>
            )}

            {errorMessage && (
              <div className="mb-6 rounded-xl border border-red-200 bg-red-50 text-red-700 p-4">
                {errorMessage}
              </div>
            )}

            <form
              onSubmit={handleSubmit}
              className="space-y-6"
            >

              <div>

                <label className="block text-sm font-bold text-[#0B1F3A] mb-2">
                  Full Name
                </label>

                <input
                  type="text"
                  value={fullName}
                  onChange={(e) =>
                    setFullName(
                      e.target.value
                    )
                  }
                  placeholder="Enter your full name"
                  className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />

              </div>

              <div>

                <label className="block text-sm font-bold text-[#0B1F3A] mb-2">
                  Email Address
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(
                      e.target.value
                    )
                  }
                  placeholder="Enter your email address"
                  className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />

              </div>

              <div>

                <label className="block text-sm font-bold text-[#0B1F3A] mb-2">
                  Subject
                </label>

                <input
                  type="text"
                  value={subject}
                  onChange={(e) =>
                    setSubject(
                      e.target.value
                    )
                  }
                  placeholder="What is your message about?"
                  className="w-full border border-gray-200 rounded-xl p-4 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />

              </div>

              <div>

                <label className="block text-sm font-bold text-[#0B1F3A] mb-2">
                  Your Message
                </label>

                <textarea
                  value={message}
                  onChange={(e) =>
                    setMessage(
                      e.target.value
                    )
                  }
                  placeholder="Write your message to PaujaRealtyHub management..."
                  rows={7}
                  className="w-full border border-gray-200 rounded-xl p-4 resize-y focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
                />

              </div>

              <button
                type="submit"
                disabled={sending}
                className="w-full md:w-auto bg-[#C9A227] text-[#08192E] px-8 py-3.5 rounded-xl font-bold hover:brightness-110 transition disabled:opacity-60"
              >
                {sending
                  ? "Sending..."
                  : "Send Message"}
              </button>

            </form>

          </div>

        </section>

      </main>

      <Footer />
    </>
  );
}