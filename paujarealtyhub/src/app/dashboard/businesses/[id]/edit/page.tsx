"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";

export default function EditBusinessPage() {
  const params = useParams();
  const router = useRouter();

  const businessId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [businessName, setBusinessName] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");

  const [phone, setPhone] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [email, setEmail] = useState("");
  const [website, setWebsite] = useState("");

  const [country, setCountry] = useState("Nigeria");
  const [businessState, setBusinessState] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");

  const [latitude, setLatitude] = useState<number | null>(null);
  const [longitude, setLongitude] = useState<number | null>(null);

  const [locationMessage, setLocationMessage] = useState("");
  const [locating, setLocating] = useState(false);

  const categories = [
    "Architect",
    "Law Firm",
    "Construction Company",
    "Interior Designer",
    "Furniture",
    "Cleaning Service",
    "Insurance",
    "Mortgage",
    "Hotel",
    "Event Centre",
    "Property Management",
    "Surveyor",
    "Valuer",
    "Security Service",
    "Moving Service",
    "Building Materials",
    "Other",
  ];

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 bg-[#FAFAF8] text-[#0B1F3A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition";

  useEffect(() => {
    async function loadBusiness() {
      try {
        setLoading(true);

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (!user) {
          router.push("/login");
          return;
        }

        const { data, error } = await supabase
          .from("businesses")
          .select("*")
          .eq("id", businessId)
          .eq("user_id", user.id)
          .maybeSingle();

        if (error) {
          console.error("LOAD BUSINESS ERROR:", error);
          alert("Unable to load business.");
          return;
        }

        if (!data) {
          alert("Business not found or you do not have permission to edit it.");
          router.push("/dashboard/businesses");
          return;
        }

        setBusinessName(data.business_name || "");
        setCategory(data.category || "");
        setDescription(data.description || "");

        setPhone(data.phone || "");
        setWhatsapp(data.whatsapp || "");
        setEmail(data.email || "");
        setWebsite(data.website || "");

        setCountry(data.country || "Nigeria");
        setBusinessState(data.state || "");
        setCity(data.city || "");
        setAddress(data.address || "");

        setLatitude(data.latitude ?? null);
        setLongitude(data.longitude ?? null);
      } catch (error) {
        console.error("LOAD BUSINESS ERROR:", error);
        alert("Unable to load business.");
      } finally {
        setLoading(false);
      }
    }

    if (businessId) {
      loadBusiness();
    }
  }, [businessId, router]);

  function captureLocation() {
    if (!navigator.geolocation) {
      setLocationMessage(
        "Location services are not supported by this device."
      );
      return;
    }

    setLocating(true);
    setLocationMessage("Finding your business location...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(position.coords.latitude);
        setLongitude(position.coords.longitude);

        setLocationMessage(
          "Business location captured successfully."
        );

        setLocating(false);
      },
      (error) => {
        console.error("BUSINESS GEOLOCATION ERROR:", error);

        setLocationMessage(
          "Unable to capture business location."
        );

        setLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 0,
      }
    );
  }

  function clearLocation() {
    setLatitude(null);
    setLongitude(null);
    setLocationMessage("Business location removed.");
  }

  async function handleSave() {
    if (saving) return;

    if (!businessName.trim()) {
      alert("Please enter the business name.");
      return;
    }

    if (!category) {
      alert("Please select a business category.");
      return;
    }

    if (!phone.trim() && !whatsapp.trim() && !email.trim()) {
      alert(
        "Please provide at least one contact method: phone, WhatsApp or email."
      );
      return;
    }

    if (!businessState.trim()) {
      alert("Please select a state.");
      return;
    }

    if (!city.trim()) {
      alert("Please enter the city or area.");
      return;
    }

    if (!address.trim()) {
      alert("Please enter the business address.");
      return;
    }

    try {
      setSaving(true);

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        alert("You must be logged in.");
        router.push("/login");
        return;
      }

      const { error } = await supabase
        .from("businesses")
        .update({
          business_name: businessName.trim(),
          category,
          description: description.trim() || null,

          phone: phone.trim() || null,
          whatsapp: whatsapp.trim() || null,
          email: email.trim() || null,
          website: website.trim() || null,

          country,
          state: businessState,
          city: city.trim(),
          address: address.trim(),

          latitude,
          longitude,
        })
        .eq("id", businessId)
        .eq("user_id", user.id);

      if (error) {
        console.error("UPDATE BUSINESS ERROR:", error);
        throw error;
      }

      alert("Business updated successfully.");

      router.push(`/dashboard/businesses/${businessId}`);
    } catch (error: any) {
      console.error("UPDATE BUSINESS ERROR:", error);

      alert(
        error?.message ||
          "Unable to update business."
      );
    } finally {
      setSaving(false);
    }
  }

  const hasCoordinates =
    latitude !== null &&
    longitude !== null;

  if (loading) {
    return (
      <main className="p-6 md:p-8">
        <div className="max-w-4xl mx-auto">
          <p className="text-gray-500">
            Loading business...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="p-4 md:p-8">
      <div className="max-w-4xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">
          <span className="text-[#B8922E] text-sm font-semibold uppercase tracking-wider">
            Pauja Business Ecosystem
          </span>

          <h1 className="text-4xl font-bold text-[#0B1F3A] mt-2">
            Edit Business
          </h1>

          <p className="text-gray-500 mt-3">
            Update your business information and location.
          </p>
        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6 md:p-8 space-y-8">

          {/* BUSINESS DETAILS */}

          <section>
            <h2 className="text-2xl font-bold text-[#0B1F3A]">
              Business Details
            </h2>

            <div className="grid md:grid-cols-2 gap-5 mt-6">

              <div>
                <label className="block mb-2 font-semibold text-[#0B1F3A]">
                  Business Name
                </label>

                <input
                  type="text"
                  value={businessName}
                  onChange={(e) =>
                    setBusinessName(e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-[#0B1F3A]">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) =>
                    setCategory(e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">
                    Select Category
                  </option>

                  {categories.map((item) => (
                    <option
                      key={item}
                      value={item}
                    >
                      {item}
                    </option>
                  ))}
                </select>
              </div>

            </div>

            <div className="mt-5">
              <label className="block mb-2 font-semibold text-[#0B1F3A]">
                Description
              </label>

              <textarea
                rows={5}
                value={description}
                onChange={(e) =>
                  setDescription(e.target.value)
                }
                className={inputClass}
              />
            </div>
          </section>

          {/* CONTACT */}

          <section className="border-t border-gray-100 pt-8">

            <h2 className="text-2xl font-bold text-[#0B1F3A]">
              Contact Information
            </h2>

            <div className="grid md:grid-cols-2 gap-5 mt-6">

              <div>
                <label className="block mb-2 font-semibold text-[#0B1F3A]">
                  Phone
                </label>

                <input
                  type="tel"
                  value={phone}
                  onChange={(e) =>
                    setPhone(e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-[#0B1F3A]">
                  WhatsApp
                </label>

                <input
                  type="tel"
                  value={whatsapp}
                  onChange={(e) =>
                    setWhatsapp(e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-[#0B1F3A]">
                  Email
                </label>

                <input
                  type="email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-[#0B1F3A]">
                  Website
                </label>

                <input
                  type="url"
                  value={website}
                  onChange={(e) =>
                    setWebsite(e.target.value)
                  }
                  className={inputClass}
                />
              </div>

            </div>
          </section>

          {/* LOCATION */}

          <section className="border-t border-gray-100 pt-8">

            <h2 className="text-2xl font-bold text-[#0B1F3A]">
              Business Location
            </h2>

            <div className="grid md:grid-cols-2 gap-5 mt-6">

              <div>
                <label className="block mb-2 font-semibold text-[#0B1F3A]">
                  Country
                </label>

                <select
                  value={country}
                  onChange={(e) =>
                    setCountry(e.target.value)
                  }
                  className={inputClass}
                >
                  <option>Nigeria</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-[#0B1F3A]">
                  State
                </label>

                <select
                  value={businessState}
                  onChange={(e) =>
                    setBusinessState(e.target.value)
                  }
                  className={inputClass}
                >
                  <option value="">
                    Select State
                  </option>
                  <option>Lagos</option>
                  <option>Abuja</option>
                  <option>Ogun</option>
                  <option>Oyo</option>
                  <option>Rivers</option>
                  <option>Delta</option>
                  <option>Anambra</option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-[#0B1F3A]">
                  City / Area
                </label>

                <input
                  type="text"
                  value={city}
                  onChange={(e) =>
                    setCity(e.target.value)
                  }
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-[#0B1F3A]">
                  Full Address
                </label>

                <input
                  type="text"
                  value={address}
                  onChange={(e) =>
                    setAddress(e.target.value)
                  }
                  className={inputClass}
                />
              </div>

            </div>

            {/* LOCATION INTELLIGENCE */}

            <div className="mt-6 rounded-2xl bg-[#08192E] text-white border border-[#C9A227]/30 p-6">

              <p className="text-[#C9A227] text-xs uppercase tracking-widest font-bold">
                Pauja Location Intelligence
              </p>

              <h3 className="text-xl font-bold mt-2">
                Update Business Location
              </h3>

              <div className="flex flex-wrap gap-3 mt-5">

                <button
                  type="button"
                  disabled={locating}
                  onClick={captureLocation}
                  className="bg-[#C9A227] text-[#08192E] px-6 py-3 rounded-xl font-bold disabled:opacity-50"
                >
                  {locating
                    ? "Locating..."
                    : hasCoordinates
                    ? "Update Location"
                    : "Capture Current Location"}
                </button>

                {hasCoordinates && (
                  <button
                    type="button"
                    onClick={clearLocation}
                    className="border border-white/30 text-white px-6 py-3 rounded-xl font-semibold"
                  >
                    Remove Location
                  </button>
                )}

              </div>

              {locationMessage && (
                <p className="text-sm text-gray-300 mt-4">
                  {locationMessage}
                </p>
              )}

              {hasCoordinates && (
                <p className="text-sm text-green-300 mt-4">
                  ✓ Exact business location confirmed
                </p>
              )}

            </div>

          </section>

          {/* ACTIONS */}

          <div className="border-t border-gray-100 pt-7 flex flex-col sm:flex-row gap-3 sm:justify-end">

            <button
              type="button"
              onClick={() =>
                router.push(
                  `/dashboard/businesses/${businessId}`
                )
              }
              className="border border-gray-300 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={handleSave}
              className="bg-[#08192E] text-white px-7 py-3 rounded-xl font-bold hover:bg-[#C9A227] hover:text-[#08192E] transition disabled:opacity-50"
            >
              {saving
                ? "Saving..."
                : "Save Changes"}
            </button>

          </div>

        </div>
      </div>
    </main>
  );
}