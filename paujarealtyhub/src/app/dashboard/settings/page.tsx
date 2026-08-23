"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";

export default function SettingsPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [loading, setLoading] = useState(true);
  const [savingPassword, setSavingPassword] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  useEffect(() => {
    loadAccount();
  }, []);

  async function loadAccount() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      setEmail(user?.email || "");
    } catch (error) {
      console.error("LOAD ACCOUNT ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  async function handlePasswordChange(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!newPassword) {
      alert("Enter a new password.");
      return;
    }

    if (newPassword.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }

    try {
      setSavingPassword(true);

      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setNewPassword("");
      setConfirmPassword("");

      alert("Password updated successfully.");
    } catch (error: any) {
      console.error("PASSWORD UPDATE ERROR:", error);

      alert(
        error?.message ||
          "Unable to update password."
      );
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleLogout() {
    try {
      setLoggingOut(true);

      const { error } = await supabase.auth.signOut({
        scope: "local",
      });

      if (error) throw error;

      router.push("/");
      router.refresh();
    } catch (error: any) {
      console.error("LOGOUT ERROR:", error);

      alert(
        error?.message ||
          "Unable to log out."
      );
    } finally {
      setLoggingOut(false);
    }
  }

  if (loading) {
    return (
      <main className="p-8">
        <p>Loading settings...</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="max-w-3xl">

        <div className="mb-10">
          <h1 className="text-4xl font-bold">
            Settings
          </h1>

          <p className="text-gray-500 mt-2">
            Manage your account and security settings.
          </p>
        </div>

        {/* ACCOUNT */}

        <section className="bg-white rounded-xl shadow p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            Account
          </h2>

          <div>
            <label className="block font-semibold mb-2">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              readOnly
              className="w-full border rounded-lg p-3 bg-gray-100 text-gray-600"
            />

            <p className="text-sm text-gray-500 mt-2">
              Your login email is managed through your account.
            </p>
          </div>
        </section>

        {/* PASSWORD */}

        <section className="bg-white rounded-xl shadow p-8 mb-8">
          <h2 className="text-2xl font-bold mb-6">
            Change Password
          </h2>

          <form
            onSubmit={handlePasswordChange}
            className="space-y-5"
          >
            <div>
              <label className="block font-semibold mb-2">
                New Password
              </label>

              <input
                type="password"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                className="w-full border rounded-lg p-3"
                placeholder="Enter new password"
              />
            </div>

            <div>
              <label className="block font-semibold mb-2">
                Confirm New Password
              </label>

              <input
                type="password"
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
                className="w-full border rounded-lg p-3"
                placeholder="Confirm new password"
              />
            </div>

            <button
              type="submit"
              disabled={savingPassword}
              className="bg-blue-700 text-white px-6 py-3 rounded-lg hover:bg-blue-800 disabled:opacity-50"
            >
              {savingPassword
                ? "Updating..."
                : "Update Password"}
            </button>
          </form>
        </section>

        {/* SESSION */}

        <section className="bg-white rounded-xl shadow p-8">
          <h2 className="text-2xl font-bold mb-3">
            Session
          </h2>

          <p className="text-gray-500 mb-6">
            Sign out of this device.
          </p>

          <button
            type="button"
            onClick={handleLogout}
            disabled={loggingOut}
            className="border border-red-600 text-red-600 px-6 py-3 rounded-lg hover:bg-red-50 disabled:opacity-50"
          >
            {loggingOut
              ? "Logging Out..."
              : "Log Out"}
          </button>
        </section>

      </div>
    </main>
  );
}