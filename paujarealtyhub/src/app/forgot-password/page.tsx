"use client";

import { useState } from "react";
import Link from "next/link";

import { supabase } from "@/lib/supabase";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!email.trim()) {
      alert("Enter your email address.");
      return;
    }

    try {
      setSending(true);

      const redirectTo =
        `${window.location.origin}/reset-password`;

      const { error } =
        await supabase.auth.resetPasswordForEmail(
          email.trim(),
          {
            redirectTo,
          }
        );

      if (error) throw error;

      alert(
        "Password reset link sent. Check your email."
      );

      setEmail("");
    } catch (error: any) {
      console.error(
        "PASSWORD RESET EMAIL ERROR:",
        error
      );

      alert(
        error?.message ||
          "Unable to send password reset email."
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F6F8] flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-[#0B1F3A]">
          Forgot Password
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Enter your account email and we’ll send you a password reset link.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block font-semibold mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              placeholder="Enter your email"
              className="w-full border rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              required
            />
          </div>

          <button
            type="submit"
            disabled={sending}
            className="w-full bg-[#0B1F3A] text-white py-3 rounded-xl hover:bg-[#163A5F] disabled:opacity-50 transition"
          >
            {sending
              ? "Sending..."
              : "Send Reset Link"}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link
            href="/login"
            className="text-blue-700 font-semibold hover:underline"
          >
            ← Back to Log In
          </Link>
        </div>

      </div>

    </main>
  );
}