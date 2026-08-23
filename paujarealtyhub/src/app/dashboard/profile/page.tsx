"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getMyProfile,
  updateMyProfile,
} from "@/services/profile";

export default function ProfilePage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [profile, setProfile] = useState({
    full_name: "",
    phone: "",
    email: "",
    bio: "",
    city: "",
    state: "",
  });

  useEffect(() => {
    loadProfile();
  }, []);

  async function loadProfile() {
    try {
      const data = await getMyProfile();

      if (data) {
        setProfile({
          full_name: data.full_name || "",
          phone: data.phone || "",
          email: data.email || "",
          bio: data.bio || "",
          city: data.city || "",
          state: data.state || "",
        });
      }
    } catch (error) {
      console.error("LOAD PROFILE ERROR:", error);
    } finally {
      setLoading(false);
    }
  }

  async function saveProfile() {
    try {
      setSaving(true);
await updateMyProfile(profile);

alert("Profile updated successfully.");

router.push("/dashboard/add-property");
router.refresh();
    } catch (error: any) {
      console.error("SAVE PROFILE ERROR:", error);

      alert(
        error?.message ||
          "Unable to update profile."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="p-8">
        <p>Loading profile...</p>
      </main>
    );
  }

  return (
    <main className="p-8">
      <div className="max-w-3xl">

        <h1 className="text-4xl font-bold mb-10">
          My Profile
        </h1>

        <div className="grid gap-6">

          <div>
            <label className="font-semibold">
              Full Name
            </label>

            <input
              type="text"
              value={profile.full_name}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  full_name: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">
              Phone
            </label>

            <input
              type="text"
              value={profile.phone}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  phone: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">
              Email
            </label>

            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  email: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">
              City
            </label>

            <input
              type="text"
              value={profile.city}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  city: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">
              State
            </label>

            <input
              type="text"
              value={profile.state}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  state: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          <div>
            <label className="font-semibold">
              Bio
            </label>

            <textarea
              rows={5}
              value={profile.bio}
              onChange={(e) =>
                setProfile({
                  ...profile,
                  bio: e.target.value,
                })
              }
              className="w-full border rounded-lg p-3 mt-2"
            />
          </div>

          <button
            type="button"
            onClick={saveProfile}
            disabled={saving}
            className="bg-blue-700 text-white py-4 rounded-lg hover:bg-blue-800 transition disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Profile"}
          </button>

        </div>

      </div>
    </main>
  );
}