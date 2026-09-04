"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { loginUser } from "@/services/auth";
import { supabase } from "@/lib/supabase";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    try {
      setLoading(true);

      const { error } = await loginUser(
        email,
        password
      );

      if (error) {
        alert(error.message);
        return;
      }

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError) {
        console.error(
          "LOGIN USER ERROR:",
          userError
        );
      }

      if (!user) {
        alert(
          "Login succeeded, but your account could not be loaded."
        );

        return;
      }

      const {
        data: profile,
        error: profileError,
      } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .maybeSingle();

      if (profileError) {
        console.error(
          "LOGIN PROFILE ERROR:",
          profileError
        );
      }

      alert("Login successful!");

      if (profile?.is_admin) {
        router.push("/admin");
        router.refresh();
        return;
      }

      router.push("/dashboard");
      router.refresh();
    } catch (error: any) {
      console.error(
        "LOGIN ERROR:",
        error
      );

      alert(
        error?.message ||
          "Unable to log in."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-700 to-blue-900 flex items-center justify-center px-6">

      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8">

        <div className="text-center mb-8">

          <h1 className="text-4xl font-bold text-blue-700">
            PaujaRealtyHub
          </h1>

          <p className="text-gray-500 mt-3">
            Sign in to continue
          </p>

        </div>

        <form
          onSubmit={handleLogin}
          className="space-y-5"
        >

          <div>

            <label className="block mb-2 font-medium">
              Email Address
            </label>

            <input
              type="email"
              required
              placeholder="Enter your email address"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

          </div>

          <div>

            <label className="block mb-2 font-medium">
              Password
            </label>

            <input
              type="password"
              required
              placeholder="Enter your password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
              className="w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-600"
            />

          </div>

         <div className="flex justify-end text-sm">

  <Link
    href="/forgot-password"
    className="text-blue-700 hover:underline"
  >
    Forgot Password?
  </Link>

</div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-700 hover:bg-blue-800 transition text-white py-3 rounded-lg font-semibold disabled:opacity-50"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}

          <Link
            href="/register"
            className="text-blue-700 font-semibold hover:underline"
          >
            sign up
          </Link>
        </p>

      </div>

    </main>
  );
}