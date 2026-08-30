"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { supabase } from "@/lib/supabase";
import { BUSINESS_CATEGORIES } from "@/lib/businessCategories";

export default function RegisterBusinessPage() {
  const router = useRouter();

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

  const [locating, setLocating] = useState(false);
  const [locationMessage, setLocationMessage] = useState("");

  // BUSINESS MEDIA

const [logoFile, setLogoFile] = useState<File | null>(null);
const [coverFile, setCoverFile] = useState<File | null>(null);
const [galleryFiles, setGalleryFiles] = useState<File[]>([]);
const [videoFile, setVideoFile] = useState<File | null>(null);

const [logoPreview, setLogoPreview] = useState("");
const [coverPreview, setCoverPreview] = useState("");
const [galleryPreviews, setGalleryPreviews] = useState<string[]>([]);
const [videoPreview, setVideoPreview] = useState("");

const [videoDuration, setVideoDuration] = useState<number | null>(null);
const [mediaMessage, setMediaMessage] = useState("");
  const [saving, setSaving] = useState(false);

  const inputClass =
    "w-full border border-gray-200 rounded-xl px-4 py-3 bg-[#FAFAF8] text-[#0B1F3A] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-transparent transition";

 

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

        let message = "Unable to capture business location.";

        if (error.code === error.PERMISSION_DENIED) {
          message =
            "Location permission was denied. Please allow location access and try again.";
        }

        if (error.code === error.POSITION_UNAVAILABLE) {
          message =
            "Your current location could not be determined.";
        }

        if (error.code === error.TIMEOUT) {
          message =
            "Location request timed out. Please try again.";
        }

        setLocationMessage(message);
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

  function handleLogoSelection(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const file = e.target.files?.[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file.");
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert("Logo image must be 10 MB or less.");
    return;
  }

  setLogoFile(file);
  setLogoPreview(URL.createObjectURL(file));
}


function handleCoverSelection(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const file = e.target.files?.[0];

  if (!file) {
    return;
  }

  if (!file.type.startsWith("image/")) {
    alert("Please select a valid image file.");
    return;
  }

  if (file.size > 10 * 1024 * 1024) {
    alert("Cover image must be 10 MB or less.");
    return;
  }

  setCoverFile(file);
  setCoverPreview(URL.createObjectURL(file));
}


function handleGallerySelection(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const files = Array.from(
    e.target.files || []
  );

  if (files.length === 0) {
    return;
  }

  if (files.length > 8) {
    alert(
      "You can upload a maximum of 8 gallery images."
    );

    e.target.value = "";
    return;
  }

  const invalidFile =
    files.find(
      (file) =>
        !file.type.startsWith("image/")
    );

  if (invalidFile) {
    alert(
      "All gallery files must be images."
    );

    e.target.value = "";
    return;
  }

  const oversizedFile =
    files.find(
      (file) =>
        file.size >
        10 * 1024 * 1024
    );

  if (oversizedFile) {
    alert(
      "Each gallery image must be 10 MB or less."
    );

    e.target.value = "";
    return;
  }

  setGalleryFiles(files);

  setGalleryPreviews(
    files.map((file) =>
      URL.createObjectURL(file)
    )
  );
}


function handleVideoSelection(
  e: React.ChangeEvent<HTMLInputElement>
) {
  const file = e.target.files?.[0];

  if (!file) {
    return;
  }

  setMediaMessage("");

  if (!file.type.startsWith("video/")) {
    alert(
      "Please select a valid video file."
    );

    e.target.value = "";
    return;
  }

  if (
    file.size >
    100 * 1024 * 1024
  ) {
    alert(
      "Promo video must be 100 MB or less."
    );

    e.target.value = "";
    return;
  }

  const objectUrl =
    URL.createObjectURL(file);

  const video =
    document.createElement(
      "video"
    );

  video.preload = "metadata";

  video.onloadedmetadata = () => {
    const duration =
      video.duration;

    URL.revokeObjectURL(
      video.src
    );

    if (
      !Number.isFinite(
        duration
      )
    ) {
      alert(
        "Unable to read the video duration."
      );

      e.target.value = "";
      return;
    }

    if (duration > 60) {
      alert(
        "Promo video must be 60 seconds or less."
      );

      setVideoFile(null);
      setVideoPreview("");
      setVideoDuration(null);

      e.target.value = "";
      return;
    }

    setVideoFile(file);

    setVideoPreview(
      URL.createObjectURL(file)
    );

    setVideoDuration(
      Math.ceil(duration)
    );

    setMediaMessage(
      `Video ready: ${Math.ceil(
        duration
      )} seconds.`
    );
  };

  video.onerror = () => {
    URL.revokeObjectURL(
      objectUrl
    );

    alert(
      "Unable to read this video file."
    );

    e.target.value = "";
  };

  video.src = objectUrl;
}

 async function handleSubmit() {
  if (saving) return;

  if (!businessName.trim()) {
    alert("Please enter the business name.");
    return;
  }

  if (!category) {
    alert("Please select a business category.");
    return;
  }

  if (
    !phone.trim() &&
    !whatsapp.trim() &&
    !email.trim()
  ) {
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

  if (
    videoFile &&
    (videoDuration === null ||
      videoDuration > 60)
  ) {
    alert(
      "Promo video must be 60 seconds or less."
    );
    return;
  }

  try {
    setSaving(true);
    setMediaMessage(
      "Registering business..."
    );

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      alert(
        "You must be logged in to register a business."
      );

      router.push("/login");
      return;
    }

    /*
    -----------------------------------
    CREATE BUSINESS FIRST
    -----------------------------------
    */

    const {
      data: business,
      error: businessError,
    } = await supabase
      .from("businesses")
      .insert([
        {
          user_id: user.id,

          business_name:
            businessName.trim(),

          category,

          description:
            description.trim() ||
            null,

          phone:
            phone.trim() ||
            null,

          whatsapp:
            whatsapp.trim() ||
            null,

          email:
            email.trim() ||
            null,

          website:
            website.trim() ||
            null,

          country,

          state:
            businessState,

          city:
            city.trim(),

          address:
            address.trim(),

          latitude,
          longitude,

          status: "Active",
        },
      ])
      .select()
      .single();

    if (businessError) {
      console.error(
        "CREATE BUSINESS ERROR:",
        businessError
      );

      throw businessError;
    }

    const businessId =
      business.id;

    /*
    -----------------------------------
    MEDIA URLS
    -----------------------------------
    */

    let logoUrl:
      string | null = null;

    let coverUrl:
      string | null = null;

    let promoVideoUrl:
      string | null = null;

    /*
    -----------------------------------
    UPLOAD LOGO
    -----------------------------------
    */

    if (logoFile) {
      setMediaMessage(
        "Uploading business logo..."
      );

      const extension =
        logoFile.name
          .split(".")
          .pop() ||
        "jpg";

      const path =
        `${user.id}/${businessId}/logo/` +
        `${crypto.randomUUID()}.${extension}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("business-images")
        .upload(
          path,
          logoFile,
          {
            cacheControl: "3600",
            upsert: false,
          }
        );

      if (uploadError) {
        console.error(
          "LOGO UPLOAD ERROR:",
          uploadError
        );

        throw uploadError;
      }

      const {
        data: publicData,
      } = supabase.storage
        .from("business-images")
        .getPublicUrl(path);

      logoUrl =
        publicData.publicUrl;
    }

    /*
    -----------------------------------
    UPLOAD COVER
    -----------------------------------
    */

    if (coverFile) {
      setMediaMessage(
        "Uploading cover image..."
      );

      const extension =
        coverFile.name
          .split(".")
          .pop() ||
        "jpg";

      const path =
        `${user.id}/${businessId}/cover/` +
        `${crypto.randomUUID()}.${extension}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("business-images")
        .upload(
          path,
          coverFile,
          {
            cacheControl: "3600",
            upsert: false,
          }
        );

      if (uploadError) {
        console.error(
          "COVER UPLOAD ERROR:",
          uploadError
        );

        throw uploadError;
      }

      const {
        data: publicData,
      } = supabase.storage
        .from("business-images")
        .getPublicUrl(path);

      coverUrl =
        publicData.publicUrl;
    }

    /*
    -----------------------------------
    UPLOAD GALLERY
    -----------------------------------
    */

    if (
      galleryFiles.length >
      0
    ) {
      setMediaMessage(
        "Uploading gallery images..."
      );

      const galleryRows: {
        business_id: number;
        image_url: string;
        sort_order: number;
      }[] = [];

      for (
        let index = 0;
        index <
        galleryFiles.length;
        index++
      ) {
        const file =
          galleryFiles[index];

        const extension =
          file.name
            .split(".")
            .pop() ||
          "jpg";

        const path =
          `${user.id}/${businessId}/gallery/` +
          `${crypto.randomUUID()}.${extension}`;

        const {
          error: uploadError,
        } = await supabase.storage
          .from(
            "business-images"
          )
          .upload(
            path,
            file,
            {
              cacheControl:
                "3600",

              upsert: false,
            }
          );

        if (uploadError) {
          console.error(
            "GALLERY UPLOAD ERROR:",
            uploadError
          );

          throw uploadError;
        }

        const {
          data: publicData,
        } = supabase.storage
          .from(
            "business-images"
          )
          .getPublicUrl(path);

        galleryRows.push({
          business_id:
            businessId,

          image_url:
            publicData.publicUrl,

          sort_order:
            index,
        });
      }

      const {
        error:
          galleryInsertError,
      } = await supabase
        .from(
          "business_images"
        )
        .insert(
          galleryRows
        );

      if (
        galleryInsertError
      ) {
        console.error(
          "GALLERY DATABASE ERROR:",
          galleryInsertError
        );

        throw galleryInsertError;
      }
    }

    /*
    -----------------------------------
    UPLOAD PROMO VIDEO
    -----------------------------------
    */

    if (videoFile) {
      setMediaMessage(
        "Uploading promotional video..."
      );

      const extension =
        videoFile.name
          .split(".")
          .pop() ||
        "mp4";

      const path =
        `${user.id}/${businessId}/promo/` +
        `${crypto.randomUUID()}.${extension}`;

      const {
        error: uploadError,
      } = await supabase.storage
        .from("business-videos")
        .upload(
          path,
          videoFile,
          {
            cacheControl: "3600",
            upsert: false,
          }
        );

      if (uploadError) {
        console.error(
          "VIDEO UPLOAD ERROR:",
          uploadError
        );

        throw uploadError;
      }

      const {
        data: publicData,
      } = supabase.storage
        .from("business-videos")
        .getPublicUrl(path);

      promoVideoUrl =
        publicData.publicUrl;
    }

    /*
    -----------------------------------
    SAVE MEDIA URLS
    -----------------------------------
    */

    setMediaMessage(
      "Saving business media..."
    );

    const {
      error: mediaUpdateError,
    } = await supabase
      .from("businesses")
      .update({
        logo_url:
          logoUrl,

        cover_image_url:
          coverUrl,

        promo_video_url:
          promoVideoUrl,

        promo_video_duration:
          videoFile
            ? videoDuration
            : null,
      })
      .eq(
        "id",
        businessId
      )
      .eq(
        "user_id",
        user.id
      );

    if (mediaUpdateError) {
      console.error(
        "BUSINESS MEDIA UPDATE ERROR:",
        mediaUpdateError
      );

      throw mediaUpdateError;
    }

    /*
    -----------------------------------
    COMPLETE
    -----------------------------------
    */

    setMediaMessage(
      "Business registered successfully."
    );

    alert(
      "Business registered successfully."
    );

    router.push(
      `/dashboard/businesses`
    );
  } catch (error: any) {
    console.error(
      "REGISTER BUSINESS ERROR:",
      error
    );

    setMediaMessage("");

    alert(
      error?.message ||
        "Unable to register business."
    );
  } finally {
    setSaving(false);
  }
}

  const hasCoordinates =
    latitude !== null &&
    longitude !== null;

  return (
    <main className="p-4 md:p-8">

      <div className="max-w-4xl mx-auto">

        {/* HEADER */}

        <div className="mb-10">

          <span className="text-[#B8922E] text-sm font-semibold uppercase tracking-wider">
            Pauja Business Ecosystem
          </span>

          <h1 className="text-4xl font-bold text-[#0B1F3A] mt-2">
            Register Your Business
          </h1>

          <p className="text-gray-500 mt-3 max-w-2xl">
            Create a business profile so customers can discover your services
            around properties and locations across PaujaRealtyHub.
          </p>

        </div>

        <div className="bg-white border border-gray-100 rounded-2xl shadow-lg p-6 md:p-8 space-y-8">

          {/* BUSINESS DETAILS */}

          <section>

            <h2 className="text-2xl font-bold text-[#0B1F3A]">
              Business Details
            </h2>

            <p className="text-gray-500 mt-2">
              Tell customers what your business does.
            </p>

            <div className="grid md:grid-cols-2 gap-5 mt-6">

              <div>
                <label className="block mb-2 font-semibold text-[#0B1F3A]">
                  Business Name
                </label>

                <input
                  type="text"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  placeholder="e.g. Prime Interiors Ltd"
                  className={inputClass}
                />
              </div>

              <div>
                <label className="block mb-2 font-semibold text-[#0B1F3A]">
                  Category
                </label>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className={inputClass}
                >
                  <option value="">
                    Select Category
                  </option>
{BUSINESS_CATEGORIES.map((item) => (
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
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Describe your services, experience and what makes your business useful to Pauja customers."
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
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +234..."
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
                  onChange={(e) => setWhatsapp(e.target.value)}
                  placeholder="WhatsApp number"
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
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="business@example.com"
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
                  onChange={(e) => setWebsite(e.target.value)}
                  placeholder="https://..."
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

            <p className="text-gray-500 mt-2">
              This location will later power nearby discovery and Pauja Location Intelligence.
            </p>

            <div className="grid md:grid-cols-2 gap-5 mt-6">

              <div>
                <label className="block mb-2 font-semibold text-[#0B1F3A]">
                  Country
                </label>

                <select
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className={inputClass}
                >
                  <option>
                    Nigeria
                  </option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-[#0B1F3A]">
                  State
                </label>

                <select
                  value={businessState}
                  onChange={(e) => setBusinessState(e.target.value)}
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
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="e.g. Lekki"
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
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Street / office address"
                  className={inputClass}
                />
              </div>

            </div>

            {/* LOCATION INTELLIGENCE */}

            <div className="mt-6 rounded-2xl bg-[#08192E] text-white border border-[#C9A227]/30 p-6">

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-5">

                <div>

                  <span className="text-[#C9A227] text-xs uppercase tracking-widest font-bold">
                    Pauja Location Intelligence
                  </span>

                  <h3 className="text-xl font-bold mt-2">
                    Confirm Business Location
                  </h3>

                  <p className="text-gray-300 mt-2 max-w-xl">
                    Accurate coordinates will help Pauja show your business to relevant customers nearby.
                  </p>

                </div>

                <span
                  className={`self-start px-4 py-2 rounded-full text-sm font-bold ${
                    hasCoordinates
                      ? "bg-green-100 text-green-700"
                      : "bg-white/10 text-gray-300"
                  }`}
                >
                  {hasCoordinates
                    ? "✓ Location Captured"
                    : "Location Not Confirmed"}
                </span>

              </div>

              <div className="flex flex-wrap gap-3 mt-6">

                <button
                  type="button"
                  disabled={locating}
                  onClick={captureLocation}
                  className="bg-[#C9A227] text-[#08192E] px-6 py-3 rounded-xl font-bold hover:brightness-110 transition disabled:opacity-50"
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
                    className="border border-white/30 text-white px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
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
                <div className="grid sm:grid-cols-2 gap-4 mt-5">

                  <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                    <p className="text-xs text-gray-400 uppercase">
                      Latitude
                    </p>

                    <p className="font-semibold mt-1">
                      {latitude?.toFixed(6)}
                    </p>
                  </div>

                  <div className="bg-white/5 rounded-xl border border-white/10 p-4">
                    <p className="text-xs text-gray-400 uppercase">
                      Longitude
                    </p>

                    <p className="font-semibold mt-1">
                      {longitude?.toFixed(6)}
                    </p>
                  </div>

                </div>
              )}

            </div>

          </section>

{/* BUSINESS MEDIA */}

<section className="border-t border-gray-100 pt-8">

  <h2 className="text-2xl font-bold text-[#0B1F3A]">
    Business Media
  </h2>

  <p className="text-gray-500 mt-2">
    Add your logo, cover image, gallery photos and one short promotional video.
  </p>

  {/* LOGO + COVER */}

  <div className="grid md:grid-cols-2 gap-6 mt-6">

    <div>
      <label className="block mb-2 font-semibold text-[#0B1F3A]">
        Business Logo
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleLogoSelection}
        className={inputClass}
      />

      <p className="text-xs text-gray-400 mt-2">
        Maximum 10 MB.
      </p>

      {logoPreview && (
        <div className="mt-4 w-32 h-32 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={logoPreview}
            alt="Business logo preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>

    <div>
      <label className="block mb-2 font-semibold text-[#0B1F3A]">
        Cover Image
      </label>

      <input
        type="file"
        accept="image/*"
        onChange={handleCoverSelection}
        className={inputClass}
      />

      <p className="text-xs text-gray-400 mt-2">
        Maximum 10 MB.
      </p>

      {coverPreview && (
        <div className="mt-4 w-full h-40 rounded-2xl overflow-hidden border border-gray-200 bg-gray-50">
          <img
            src={coverPreview}
            alt="Business cover preview"
            className="w-full h-full object-cover"
          />
        </div>
      )}
    </div>

  </div>

  {/* GALLERY */}

  <div className="mt-8">

    <label className="block mb-2 font-semibold text-[#0B1F3A]">
      Gallery Images
    </label>

    <input
      type="file"
      accept="image/*"
      multiple
      onChange={handleGallerySelection}
      className={inputClass}
    />

    <p className="text-xs text-gray-400 mt-2">
      Maximum 8 images. Each image must be 10 MB or less.
    </p>

    {galleryPreviews.length > 0 && (
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
        {galleryPreviews.map((preview, index) => (
          <div
            key={preview}
            className="relative h-28 rounded-xl overflow-hidden border border-gray-200 bg-gray-50"
          >
            <img
              src={preview}
              alt={`Gallery preview ${index + 1}`}
              className="w-full h-full object-cover"
            />
          </div>
        ))}
      </div>
    )}

  </div>

  {/* PROMO VIDEO */}

  <div className="mt-8">

    <label className="block mb-2 font-semibold text-[#0B1F3A]">
      Promotional Video
    </label>

    <input
      type="file"
      accept="video/*"
      onChange={handleVideoSelection}
      className={inputClass}
    />

    <p className="text-xs text-gray-400 mt-2">
      One video only. Maximum 60 seconds and 100 MB.
    </p>

    {mediaMessage && (
      <p className="text-sm text-green-700 font-semibold mt-3">
        {mediaMessage}
      </p>
    )}

    {videoPreview && (
      <div className="mt-4">
        <video
          src={videoPreview}
          controls
          className="w-full max-w-2xl rounded-2xl bg-black"
        />

        {videoDuration !== null && (
          <p className="text-sm text-gray-500 mt-2">
            Duration: {videoDuration} seconds
          </p>
        )}
      </div>
    )}

  </div>

</section>

          {/* PLATFORM NOTE */}

          <div className="bg-[#C9A227]/10 border border-[#C9A227]/20 rounded-xl p-5">

            <p className="text-sm text-[#0B1F3A] leading-6">
              <strong>Verification and Sponsored placement are controlled by PaujaRealtyHub.</strong>{" "}
              Registering a business does not automatically make it verified or sponsored.
            </p>

          </div>

          {/* SUBMIT */}

          <div className="border-t border-gray-100 pt-7 flex flex-col sm:flex-row gap-3 sm:justify-end">

            <button
              type="button"
              onClick={() =>
                router.push("/dashboard/businesses")
              }
              className="border border-gray-300 text-gray-600 px-6 py-3 rounded-xl font-semibold hover:bg-gray-50 transition"
            >
              Cancel
            </button>

            <button
              type="button"
              disabled={saving}
              onClick={handleSubmit}
              className="bg-[#08192E] text-white px-7 py-3 rounded-xl font-bold hover:bg-[#C9A227] hover:text-[#08192E] transition disabled:opacity-50"
            >
              {saving
                ? "Registering..."
                : "Register Business"}
            </button>

          </div>

        </div>

      </div>

    </main>
  );
}