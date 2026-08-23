"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function ResetPasswordPage() {
  const router = useRouter();

  const [password, setPassword] =
    useState("");

  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [saving, setSaving] =
    useState(false);

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (password.length < 6) {
      alert(
        "Password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      const { error } =
        await supabase.auth.updateUser({
          password,
        });

      if (error) throw error;

      alert(
        "Password reset successfully."
      );

      router.push("/login");
    } catch (error: any) {
      console.error(
        "RESET PASSWORD ERROR:",
        error
      );

      alert(
        error?.message ||
          "Unable to reset password."
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F6F8] flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">

        <h1 className="text-3xl font-bold text-[#0B1F3A]">
          Reset Password
        </h1>

        <p className="text-gray-500 mt-2 mb-8">
          Choose a new password for your PaujaRealtyHub account.
        </p>

        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div>
            <label className="block font-semibold mb-2">
              New Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border rounded-xl px-4 py-3"
              required
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) =>
                setConfirmPassword(
                  e.target.value
                )
              }
              className="w-full border rounded-xl px-4 py-3"
              required
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#0B1F3A] text-white py-3 rounded-xl hover:bg-[#163A5F] disabled:opacity-50"
          >
            {saving
              ? "Resetting..."
              : "Reset Password"}
          </button>
        </form>

      </div>

    </main>
  );
}