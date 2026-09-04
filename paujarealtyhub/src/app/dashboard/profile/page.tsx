"use client";

import {
  useEffect,
  useState,
} from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

import {
  getMyProfile,
  updateMyProfile,
} from "@/services/profile";

import { supabase } from "@/lib/supabase";

export default function ProfilePage() {
  const router = useRouter();

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [userId, setUserId] =
    useState("");

  const [avatarUrl, setAvatarUrl] =
    useState("");

  const [profile, setProfile] =
    useState({
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
      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        router.replace("/login");
        return;
      }

      setUserId(user.id);

      const data =
        await getMyProfile();

      if (data) {
        setProfile({
          full_name:
            data.full_name || "",
          phone:
            data.phone || "",
          email:
            data.email ||
            user.email ||
            "",
          bio:
            data.bio || "",
          city:
            data.city || "",
          state:
            data.state || "",
        });

        setAvatarUrl(
          data.avatar_url ||
            data.profile_photo ||
            ""
        );
      }
    } catch (error) {
      console.error(
        "LOAD PROFILE ERROR:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  async function uploadProfilePicture(
    file: File
  ) {
    try {
      if (!userId) {
        alert(
          "User session not found."
        );
        return;
      }

      if (
        !file.type.startsWith(
          "image/"
        )
      ) {
        alert(
          "Please select an image file."
        );
        return;
      }

      if (
        file.size >
        5 * 1024 * 1024
      ) {
        alert(
          "Profile picture must be 5 MB or less."
        );
        return;
      }

      setUploading(true);

      const extension =
        file.name
          .split(".")
          .pop() || "jpg";

      const filePath =
        `${userId}/avatar-${Date.now()}.${extension}`;

      const {
        error: uploadError,
      } =
        await supabase.storage
          .from(
            "profile-images"
          )
          .upload(
            filePath,
            file,
            {
              cacheControl:
                "3600",
              upsert: true,
            }
          );

      if (uploadError) {
        throw uploadError;
      }

      const {
        data: publicData,
      } =
        supabase.storage
          .from(
            "profile-images"
          )
          .getPublicUrl(
            filePath
          );

      const newAvatarUrl =
        publicData.publicUrl;

      const {
        error: updateError,
      } =
        await supabase
          .from("profiles")
          .update({
            avatar_url:
              newAvatarUrl,
          })
          .eq(
            "id",
            userId
          );

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(
        newAvatarUrl
      );

      alert(
        "Profile picture updated successfully."
      );
    } catch (error: any) {
      console.error(
        "PROFILE IMAGE UPLOAD ERROR:",
        error
      );

      alert(
        error?.message ||
          "Unable to upload profile picture."
      );
    } finally {
      setUploading(false);
    }
  }

  async function saveProfile() {
    try {
      setSaving(true);

      await updateMyProfile({
        ...profile,
        avatar_url:
          avatarUrl ||
          null,
      });

      alert(
        "Profile updated successfully."
      );

      router.refresh();
    } catch (error: any) {
      console.error(
        "SAVE PROFILE ERROR:",
        error
      );

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
        <p>
          Loading profile...
        </p>
      </main>
    );
  }

  const displayInitial =
    profile.full_name
      .charAt(0)
      .toUpperCase() || "P";

  return (
    <main className="min-h-screen bg-[#F7F7F3] p-6 md:p-10">

      <div className="max-w-4xl mx-auto">

        <div className="mb-10">

          <p className="text-[#B8922E] text-sm font-bold uppercase tracking-widest">
            PaujaRealtyHub Profile
          </p>

          <h1 className="text-4xl font-bold text-[#0B1F3A] mt-2">
            My Profile
          </h1>

          <p className="text-gray-500 mt-2">
            Keep your identity and professional information up to date.
          </p>

        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm p-6 md:p-8">

          {/* PROFILE PICTURE */}

          <div className="flex flex-col sm:flex-row sm:items-center gap-6 pb-8 border-b border-gray-100">

            {avatarUrl ? (
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#C9A227]">

                <Image
                  src={
                    avatarUrl
                  }
                  alt={
                    profile.full_name ||
                    "Profile picture"
                  }
                  fill
                  unoptimized
                  className="object-cover"
                />

              </div>
            ) : (
              <div className="w-32 h-32 rounded-full bg-[#08192E] border-4 border-[#C9A227] flex items-center justify-center">

                <span className="text-[#C9A227] text-5xl font-bold">
                  {
                    displayInitial
                  }
                </span>

              </div>
            )}

            <div>

              <h2 className="text-xl font-bold text-[#0B1F3A]">
                Profile Picture
              </h2>

              <p className="text-gray-500 text-sm mt-2">
                This photo may appear on your public agent profile and listings.
              </p>

              <label className="inline-flex mt-4 bg-[#C9A227] text-[#08192E] px-5 py-3 rounded-xl font-bold cursor-pointer hover:brightness-110 transition">

                {uploading
                  ? "Uploading..."
                  : "Upload Photo"}

                <input
                  type="file"
                  accept="image/*"
                  disabled={
                    uploading
                  }
                  onChange={(
                    event
                  ) => {
                    const file =
                      event
                        .target
                        .files?.[0];

                    if (file) {
                      uploadProfilePicture(
                        file
                      );
                    }
                  }}
                  className="hidden"
                />

              </label>

              <p className="text-xs text-gray-400 mt-2">
                JPG, PNG or WEBP. Maximum 5 MB.
              </p>

            </div>

          </div>

          {/* PROFILE FORM */}

          <div className="grid md:grid-cols-2 gap-6 mt-8">

            <div>

              <label className="font-semibold text-[#0B1F3A]">
                Full Name
              </label>

              <input
                type="text"
                value={
                  profile.full_name
                }
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    full_name:
                      e.target
                        .value,
                  })
                }
                className="w-full border border-gray-200 rounded-xl p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              />

            </div>

            <div>

              <label className="font-semibold text-[#0B1F3A]">
                Phone
              </label>

              <input
                type="text"
                value={
                  profile.phone
                }
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    phone:
                      e.target
                        .value,
                  })
                }
                className="w-full border border-gray-200 rounded-xl p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              />

            </div>

            <div>

              <label className="font-semibold text-[#0B1F3A]">
                Email
              </label>

              <input
                type="email"
                value={
                  profile.email
                }
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    email:
                      e.target
                        .value,
                  })
                }
                className="w-full border border-gray-200 rounded-xl p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              />

            </div>

            <div>

              <label className="font-semibold text-[#0B1F3A]">
                City
              </label>

              <input
                type="text"
                value={
                  profile.city
                }
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    city:
                      e.target
                        .value,
                  })
                }
                className="w-full border border-gray-200 rounded-xl p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              />

            </div>

            <div>

              <label className="font-semibold text-[#0B1F3A]">
                State
              </label>

              <input
                type="text"
                value={
                  profile.state
                }
                onChange={(e) =>
                  setProfile({
                    ...profile,
                    state:
                      e.target
                        .value,
                  })
                }
                className="w-full border border-gray-200 rounded-xl p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
              />

            </div>

          </div>

          <div className="mt-6">

            <label className="font-semibold text-[#0B1F3A]">
              Bio
            </label>

            <textarea
              rows={5}
              value={
                profile.bio
              }
              onChange={(e) =>
                setProfile({
                  ...profile,
                  bio:
                    e.target.value,
                })
              }
              placeholder="Tell people about yourself, your experience or professional services..."
              className="w-full border border-gray-200 rounded-xl p-3 mt-2 focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
            />

          </div>

          <button
            type="button"
            onClick={
              saveProfile
            }
            disabled={
              saving ||
              uploading
            }
            className="mt-8 bg-[#08192E] text-white px-8 py-4 rounded-xl font-bold hover:bg-[#C9A227] hover:text-[#08192E] transition disabled:opacity-50"
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