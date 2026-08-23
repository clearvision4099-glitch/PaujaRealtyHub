"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import dynamic from "next/dynamic";

import { supabase } from "@/lib/supabase";
import { updateProperty } from "@/services/properties";

import {
  uploadImages,
  uploadVideo,
} from "@/services/storage";

/*
-----------------------------------
CLIENT-ONLY MAP
-----------------------------------
*/

const LocationPickerMap = dynamic(
  () =>
    import(
      "@/components/properties/LocationPickerMap"
    ),
  {
    ssr: false,

    loading: () => (
      <div className="h-[420px] bg-[#FAFAF8] border border-gray-200 rounded-2xl flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />

          <p className="text-gray-500 mt-4">
            Loading location map...
          </p>

        </div>

      </div>
    ),
  }
);

type PropertyImage = {
  id: number;
  image_url: string;
  is_cover: boolean;
};

export default function EditPropertyPage() {
  const params = useParams();
  const router = useRouter();

  const propertyId =
    Array.isArray(params.id)
      ? params.id[0]
      : params.id;

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  /*
  -----------------------------------
  BASIC PROPERTY DETAILS
  -----------------------------------
  */

  const [title, setTitle] =
    useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [price, setPrice] =
    useState("");

  const [
    propertyType,
    setPropertyType,
  ] = useState("");

  const [
    listingType,
    setListingType,
  ] = useState("");

  /*
  -----------------------------------
  FEATURES
  -----------------------------------
  */

  const [
    bedrooms,
    setBedrooms,
  ] = useState("");

  const [
    bathrooms,
    setBathrooms,
  ] = useState("");

  const [
    toilets,
    setToilets,
  ] = useState("");

  const [
    parking,
    setParking,
  ] = useState("");

  const [size, setSize] =
    useState("");

  const [
    furnishing,
    setFurnishing,
  ] = useState("");

  /*
  -----------------------------------
  LOCATION
  -----------------------------------
  */

  const [country, setCountry] =
    useState("");

  const [
    propertyState,
    setPropertyState,
  ] = useState("");

  const [city, setCity] =
    useState("");

  const [
    address,
    setAddress,
  ] = useState("");

  const [
    latitude,
    setLatitude,
  ] = useState<number | null>(
    null
  );

  const [
    longitude,
    setLongitude,
  ] = useState<number | null>(
    null
  );

  const [
    locating,
    setLocating,
  ] = useState(false);

  const [
    locationMessage,
    setLocationMessage,
  ] = useState("");

  /*
  -----------------------------------
  IMAGE STATES
  -----------------------------------
  */

  const [
    existingImages,
    setExistingImages,
  ] = useState<PropertyImage[]>(
    []
  );

  const [
    newImages,
    setNewImages,
  ] = useState<File[]>([]);

  const [
    uploadingImages,
    setUploadingImages,
  ] = useState(false);

  /*
  -----------------------------------
  VIDEO STATES
  -----------------------------------
  */

  const [
    videoUrl,
    setVideoUrl,
  ] = useState("");

  const [
    newVideo,
    setNewVideo,
  ] = useState<File | null>(
    null
  );

  const [
    uploadingVideo,
    setUploadingVideo,
  ] = useState(false);

  /*
  -----------------------------------
  LOAD PROPERTY
  -----------------------------------
  */

  useEffect(() => {
    if (propertyId) {
      loadProperty();
    }
  }, [propertyId]);

  async function loadProperty() {
    try {
      setLoading(true);

      const {
        data: { user },
      } =
        await supabase.auth.getUser();

      if (!user) {
        throw new Error(
          "User not authenticated"
        );
      }

      const {
        data,
        error,
      } = await supabase
        .from("properties")
        .select(`
          *,
          property_images (
            id,
            image_url,
            is_cover
          )
        `)
        .eq(
          "id",
          propertyId
        )
        .eq(
          "user_id",
          user.id
        )
        .single();

      if (error) {
        throw error;
      }

      /*
      PROPERTY DETAILS
      */

      setTitle(
        data.title || ""
      );

      setDescription(
        data.description || ""
      );

      setPrice(
        String(
          data.price || ""
        )
      );

      setPropertyType(
        data.property_type || ""
      );

      setListingType(
        data.listing_type || ""
      );

      /*
      FEATURES
      */

      setBedrooms(
        data.bedrooms !== null &&
          data.bedrooms !==
            undefined
          ? String(
              data.bedrooms
            )
          : ""
      );

      setBathrooms(
        data.bathrooms !== null &&
          data.bathrooms !==
            undefined
          ? String(
              data.bathrooms
            )
          : ""
      );

      setToilets(
        data.toilets !== null &&
          data.toilets !==
            undefined
          ? String(
              data.toilets
            )
          : ""
      );

      setParking(
        data.parking !== null &&
          data.parking !==
            undefined
          ? String(
              data.parking
            )
          : ""
      );

      setSize(
        data.size
          ? String(data.size)
          : ""
      );

      setFurnishing(
        data.furnishing || ""
      );

      /*
      LOCATION
      */

      setCountry(
        data.country ||
          "Nigeria"
      );

      setPropertyState(
        data.state || ""
      );

      setCity(
        data.city || ""
      );

      setAddress(
        data.address || ""
      );

      setLatitude(
        data.latitude ??
          null
      );

      setLongitude(
        data.longitude ??
          null
      );

      /*
      VIDEO
      */

      setVideoUrl(
        data.video_url || ""
      );

      /*
      IMAGES
      */

      const images = [
        ...(data.property_images ||
          []),
      ].sort(
        (
          a: PropertyImage,
          b: PropertyImage
        ) =>
          Number(
            b.is_cover
          ) -
          Number(
            a.is_cover
          )
      );

      setExistingImages(
        images
      );
    } catch (error: any) {
      console.error(
        "LOAD PROPERTY ERROR:",
        error
      );

      alert(
        error?.message ||
          "Unable to load property."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  -----------------------------------
  CAPTURE CURRENT LOCATION
  -----------------------------------
  */

  function captureLocation() {
    if (
      !navigator.geolocation
    ) {
      setLocationMessage(
        "Location services are not supported by this device."
      );

      return;
    }

    setLocating(true);

    setLocationMessage(
      "Finding your location..."
    );

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLatitude(
          position.coords.latitude
        );

        setLongitude(
          position.coords.longitude
        );

        setLocationMessage(
          "Exact property location captured successfully."
        );

        setLocating(false);
      },

      (error) => {
        console.error(
          "GEOLOCATION ERROR:",
          error
        );

        let message =
          "Unable to capture location.";

        if (
          error.code ===
          error.PERMISSION_DENIED
        ) {
          message =
            "Location permission was denied. Please allow location access and try again.";
        }

        if (
          error.code ===
          error.POSITION_UNAVAILABLE
        ) {
          message =
            "Your current location could not be determined.";
        }

        if (
          error.code ===
          error.TIMEOUT
        ) {
          message =
            "Location request timed out. Please try again.";
        }

        setLocationMessage(
          message
        );

        setLocating(false);
      },

      {
        enableHighAccuracy:
          true,

        timeout: 15000,

        maximumAge: 0,
      }
    );
  }

  /*
  -----------------------------------
  REMOVE EXACT LOCATION
  -----------------------------------
  */

  function clearExactLocation() {
    setLatitude(null);
    setLongitude(null);

    setLocationMessage(
      "Exact property location removed. Save changes to confirm."
    );
  }

  const hasCoordinates =
    latitude !== null &&
    longitude !== null;

  /*
  -----------------------------------
  SAVE PROPERTY DETAILS
  -----------------------------------
  */

  async function handleUpdate(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!propertyId) {
      return;
    }

    if (!title.trim()) {
      alert(
        "Property title is required."
      );
      return;
    }

    if (!price) {
      alert(
        "Property price is required."
      );
      return;
    }

    if (!city.trim()) {
      alert(
        "City or area is required."
      );
      return;
    }

    try {
      setSaving(true);

      await updateProperty(
        propertyId,
        {
          title:
            title.trim(),

          description:
            description.trim(),

          price:
            Number(price),

          property_type:
            propertyType,

          listing_type:
            listingType,

          bedrooms:
            bedrooms
              ? Number(
                  bedrooms
                )
              : null,

          bathrooms:
            bathrooms
              ? Number(
                  bathrooms
                )
              : null,

          toilets:
            toilets
              ? Number(
                  toilets
                )
              : null,

          parking:
            parking
              ? Number(
                  parking
                )
              : null,

          size,

          furnishing,

          country,

          state:
            propertyState,

          city:
            city.trim(),

          address:
            address.trim(),

          latitude,
          longitude,
        }
      );

      alert(
        "Property updated successfully!"
      );

      router.push(
        "/dashboard/my-properties"
      );

      router.refresh();
    } catch (error: any) {
      console.error(
        "UPDATE ERROR:",
        error
      );

      alert(
        error?.message ||
          "Unable to update property."
      );
    } finally {
      setSaving(false);
    }
  }

  /*
  -----------------------------------
  IMAGE SELECTION
  -----------------------------------
  */

  function handleImageSelection(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files =
      Array.from(
        e.target.files ||
          []
      );

    setNewImages(
      files
    );
  }

  /*
  -----------------------------------
  UPLOAD NEW IMAGES
  -----------------------------------
  */

  async function handleUploadNewImages() {
    if (
      !propertyId ||
      newImages.length ===
        0
    ) {
      return;
    }

    try {
      setUploadingImages(
        true
      );

      const urls =
        await uploadImages(
          newImages
        );

      if (!urls.length) {
        return;
      }

      const hasExistingCover =
        existingImages.some(
          (image) =>
            image.is_cover
        );

      const rows =
        urls.map(
          (
            url,
            index
          ) => ({
            property_id:
              Number(
                propertyId
              ),

            image_url:
              url,

            is_cover:
              !hasExistingCover &&
              existingImages.length ===
                0 &&
              index === 0,
          })
        );

      const {
        data,
        error,
      } = await supabase
        .from(
          "property_images"
        )
        .insert(rows)
        .select(`
          id,
          image_url,
          is_cover
        `);

      if (error) {
        throw error;
      }

      setExistingImages(
        (current) => [
          ...current,
          ...(data ||
            []),
        ]
      );

      setNewImages([]);

      alert(
        "New images added successfully."
      );
    } catch (error: any) {
      console.error(
        "UPLOAD NEW IMAGES ERROR:",
        error
      );

      alert(
        error?.message ||
          "Unable to upload images."
      );
    } finally {
      setUploadingImages(
        false
      );
    }
  }

  /*
  -----------------------------------
  MAKE COVER IMAGE
  -----------------------------------
  */

  async function makeCover(
    imageId: number
  ) {
    if (!propertyId) {
      return;
    }

    try {
      const {
        error:
          resetError,
      } = await supabase
        .from(
          "property_images"
        )
        .update({
          is_cover:
            false,
        })
        .eq(
          "property_id",
          Number(
            propertyId
          )
        );

      if (resetError) {
        throw resetError;
      }

      const {
        error:
          coverError,
      } = await supabase
        .from(
          "property_images"
        )
        .update({
          is_cover:
            true,
        })
        .eq(
          "id",
          imageId
        )
        .eq(
          "property_id",
          Number(
            propertyId
          )
        );

      if (coverError) {
        throw coverError;
      }

      setExistingImages(
        (images) =>
          images
            .map(
              (
                image
              ) => ({
                ...image,

                is_cover:
                  image.id ===
                  imageId,
              })
            )
            .sort(
              (
                a,
                b
              ) =>
                Number(
                  b.is_cover
                ) -
                Number(
                  a.is_cover
                )
            )
      );
    } catch (error: any) {
      console.error(
        "SET COVER ERROR:",
        error
      );

      alert(
        error?.message ||
          "Unable to change cover image."
      );
    }
  }

  /*
  -----------------------------------
  DELETE IMAGE
  -----------------------------------
  */

  async function deleteImage(
    image: PropertyImage
  ) {
    if (!propertyId) {
      return;
    }

    const confirmed =
      window.confirm(
        "Remove this image from the property?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const {
        error,
      } = await supabase
        .from(
          "property_images"
        )
        .delete()
        .eq(
          "id",
          image.id
        )
        .eq(
          "property_id",
          Number(
            propertyId
          )
        );

      if (error) {
        throw error;
      }

      const remainingImages =
        existingImages.filter(
          (item) =>
            item.id !==
            image.id
        );

      setExistingImages(
        remainingImages
      );

      if (
        image.is_cover &&
        remainingImages.length >
          0
      ) {
        await makeCover(
          remainingImages[0]
            .id
        );
      }
    } catch (error: any) {
      console.error(
        "DELETE IMAGE ERROR:",
        error
      );

      alert(
        error?.message ||
          "Unable to remove image."
      );
    }
  }

  /*
  -----------------------------------
  VIDEO UPLOAD / REPLACE
  -----------------------------------
  */

  async function handleUploadVideo() {
    if (
      !propertyId ||
      !newVideo
    ) {
      return;
    }

    try {
      setUploadingVideo(
        true
      );

      const url =
        await uploadVideo(
          newVideo
        );

      if (!url) {
        return;
      }

      const {
        error,
      } = await supabase
        .from(
          "properties"
        )
        .update({
          video_url:
            url,
        })
        .eq(
          "id",
          propertyId
        );

      if (error) {
        throw error;
      }

      setVideoUrl(
        url
      );

      setNewVideo(
        null
      );

      alert(
        "Video updated successfully."
      );
    } catch (error: any) {
      console.error(
        "VIDEO UPLOAD ERROR:",
        error
      );

      alert(
        error?.message ||
          "Unable to upload video."
      );
    } finally {
      setUploadingVideo(
        false
      );
    }
  }

  /*
  -----------------------------------
  REMOVE VIDEO
  -----------------------------------
  */

  async function removeVideo() {
    if (!propertyId) {
      return;
    }

    const confirmed =
      window.confirm(
        "Remove this video from the property?"
      );

    if (!confirmed) {
      return;
    }

    try {
      const {
        error,
      } = await supabase
        .from(
          "properties"
        )
        .update({
          video_url:
            null,
        })
        .eq(
          "id",
          propertyId
        );

      if (error) {
        throw error;
      }

      setVideoUrl("");

      setNewVideo(
        null
      );

      alert(
        "Video removed successfully."
      );
    } catch (error: any) {
      console.error(
        "REMOVE VIDEO ERROR:",
        error
      );

      alert(
        error?.message ||
          "Unable to remove video."
      );
    }
  }

  /*
  -----------------------------------
  LOADING
  -----------------------------------
  */

  if (loading) {
    return (
      <main className="p-8 min-h-screen">

        <div className="max-w-5xl mx-auto bg-white rounded-2xl border border-gray-100 shadow-sm py-20 text-center">

          <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />

          <p className="text-gray-500 mt-5">
            Loading property...
          </p>

        </div>

      </main>
    );
  }

  /*
  -----------------------------------
  PAGE
  -----------------------------------
  */

  const inputStyle =
    "w-full border border-gray-200 rounded-xl p-4 bg-[#FAFAF8] text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition";

  return (
    <main className="p-4 md:p-8">

      <div className="max-w-5xl mx-auto">

        {/* PAGE HEADER */}

        <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">

          <div>
            <span className="text-[#B8922E] text-sm font-semibold uppercase tracking-wider">
              Property Management
            </span>

            <h1 className="text-4xl font-bold text-[#0B1F3A] mt-2">
              Edit Property
            </h1>

            <p className="text-gray-500 mt-2">
              Update property information, images, video and exact location.
            </p>
          </div>

          <button
            type="button"
            onClick={() =>
              router.push(
                "/dashboard/my-properties"
              )
            }
            className="border border-gray-300 text-[#0B1F3A] px-5 py-3 rounded-xl font-semibold hover:bg-white transition"
          >
            ← My Properties
          </button>

        </div>

        {/* PROPERTY INFORMATION */}

        <form
          onSubmit={
            handleUpdate
          }
          className="bg-white rounded-2xl border border-gray-100 shadow-lg overflow-hidden"
        >

          <div className="h-1 bg-gradient-to-r from-[#C9A227] via-[#E4C45C] to-[#C9A227]" />

          <div className="p-6 md:p-8 space-y-8">

            <div>
              <span className="text-[#B8922E] text-xs font-semibold uppercase tracking-wider">
                Property Information
              </span>

              <h2 className="text-2xl font-bold text-[#0B1F3A] mt-1">
                Listing Details
              </h2>

              <p className="text-gray-500 mt-2">
                Update the main information shown to property seekers.
              </p>
            </div>

            {/* TITLE */}

            <div>
              <label className="block mb-2 font-semibold text-[#0B1F3A]">
                Property Title
              </label>

              <input
                value={title}
                onChange={(e) =>
                  setTitle(
                    e.target.value
                  )
                }
                className={
                  inputStyle
                }
                required
              />
            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="block mb-2 font-semibold text-[#0B1F3A]">
                Description
              </label>

              <textarea
                rows={7}
                value={
                  description
                }
                onChange={(e) =>
                  setDescription(
                    e.target.value
                  )
                }
                className={`${inputStyle} resize-none leading-7`}
              />
            </div>

            {/* PRICE / TYPES */}

            <div className="grid md:grid-cols-3 gap-6">

              <div>
                <label className="block mb-2 font-semibold text-[#0B1F3A]">
                  Price
                </label>

                <div className="relative">

                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#B8922E] font-bold">
                    ₦
                  </span>

                  <input
                    type="number"
                    value={price}
                    onChange={(e) =>
                      setPrice(
                        e.target.value
                      )
                    }
                    className={`${inputStyle} pl-10`}
                    min="0"
                    required
                  />

                </div>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-[#0B1F3A]">
                  Listing Type
                </label>

                <select
                  value={
                    listingType
                  }
                  onChange={(e) =>
                    setListingType(
                      e.target.value
                    )
                  }
                  className={
                    inputStyle
                  }
                >
                  <option value="Sale">
                    Sale
                  </option>

                  <option value="Rent">
                    Rent
                  </option>

                  <option value="Lease">
                    Lease
                  </option>

                  <option value="Short Let">
                    Short Let
                  </option>

                  <option value="Auction">
                    Auction
                  </option>

                  <option value="Joint Venture">
                    Joint Venture
                  </option>
                </select>
              </div>

              <div>
                <label className="block mb-2 font-semibold text-[#0B1F3A]">
                  Property Type
                </label>

                <select
                  value={
                    propertyType
                  }
                  onChange={(e) =>
                    setPropertyType(
                      e.target.value
                    )
                  }
                  className={
                    inputStyle
                  }
                >
                  <option>Apartment</option>
                  <option>House</option>
                  <option>Duplex</option>
                  <option>Villa</option>
                  <option>Bungalow</option>
                  <option>Terrace</option>
                  <option>Land</option>
                  <option>Commercial Property</option>
                  <option>Office Space</option>
                  <option>Warehouse</option>
                  <option>Shop</option>
                  <option>Hotel</option>
                  <option>Event Centre</option>
                </select>
              </div>

            </div>

            {/* FEATURES */}

            <div className="border-t border-gray-100 pt-8">

              <h2 className="text-2xl font-bold text-[#0B1F3A]">
                Property Features
              </h2>

              <p className="text-gray-500 mt-2 mb-6">
                Update the physical details of the property.
              </p>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">

                <NumberField
                  label="Bedrooms"
                  value={bedrooms}
                  setValue={
                    setBedrooms
                  }
                />

                <NumberField
                  label="Bathrooms"
                  value={bathrooms}
                  setValue={
                    setBathrooms
                  }
                />

                <NumberField
                  label="Toilets"
                  value={toilets}
                  setValue={
                    setToilets
                  }
                />

                <NumberField
                  label="Parking Spaces"
                  value={parking}
                  setValue={
                    setParking
                  }
                />

                <div>
                  <label className="block mb-2 font-semibold text-[#0B1F3A]">
                    Property Size
                  </label>

                  <div className="relative">

                    <input
                      type="text"
                      value={size}
                      onChange={(e) =>
                        setSize(
                          e.target.value.replace(
                            /\D/g,
                            ""
                          )
                        )
                      }
                      className={`${inputStyle} pr-20`}
                    />

                    <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[#B8922E] font-semibold">
                      sqm
                    </span>

                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-semibold text-[#0B1F3A]">
                    Furnishing
                  </label>

                  <select
                    value={
                      furnishing
                    }
                    onChange={(e) =>
                      setFurnishing(
                        e.target.value
                      )
                    }
                    className={
                      inputStyle
                    }
                  >
                    <option value="">
                      Select
                    </option>

                    <option>
                      Furnished
                    </option>

                    <option>
                      Semi Furnished
                    </option>

                    <option>
                      Unfurnished
                    </option>
                  </select>
                </div>

              </div>

            </div>

            {/* LOCATION */}

            <div className="border-t border-gray-100 pt-8">

              <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">

                <div>

                  <span className="text-[#B8922E] text-xs font-semibold uppercase tracking-widest">
                    Pauja Location Intelligence
                  </span>

                  <h2 className="text-2xl font-bold text-[#0B1F3A] mt-2">
                    Property Location
                  </h2>

                  <p className="text-gray-500 mt-2 mb-6">
                    Update the written address and confirm the exact property position.
                  </p>

                </div>

                <span
                  className={`self-start px-4 py-2 rounded-full text-sm font-bold ${
                    hasCoordinates
                      ? "bg-green-100 text-green-700"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {hasCoordinates
                    ? "✓ Location Confirmed"
                    : "Location Not Confirmed"}
                </span>

              </div>

              {/* TEXT LOCATION */}

              <div className="grid md:grid-cols-2 gap-6">

                <TextField
                  label="Country"
                  value={country}
                  setValue={
                    setCountry
                  }
                />

                <TextField
                  label="State"
                  value={
                    propertyState
                  }
                  setValue={
                    setPropertyState
                  }
                />

                <TextField
                  label="City / Area"
                  value={city}
                  setValue={
                    setCity
                  }
                />

                <TextField
                  label="Full Address"
                  value={address}
                  setValue={
                    setAddress
                  }
                />

              </div>

              {/* EXACT LOCATION */}

              <div className="mt-7 bg-[#08192E] rounded-2xl border border-[#C9A227]/30 p-6 text-white">

                <h3 className="text-xl font-bold">
                  Confirm Exact Location
                </h3>

                <p className="text-gray-300 mt-2 leading-6">
                  Use your device location when you are physically at the property, or select the exact point manually on the map.
                </p>

                <div className="flex flex-wrap gap-3 mt-5">

                  <button
                    type="button"
                    disabled={
                      locating
                    }
                    onClick={
                      captureLocation
                    }
                    className="bg-[#C9A227] text-[#08192E] px-6 py-3 rounded-xl font-bold hover:brightness-110 disabled:opacity-50 transition"
                  >
                    {locating
                      ? "Locating..."
                      : hasCoordinates
                      ? "Update Exact Location"
                      : "Capture Current Location"}
                  </button>

                  {hasCoordinates && (
                    <button
                      type="button"
                      onClick={
                        clearExactLocation
                      }
                      className="border border-white/30 px-6 py-3 rounded-xl font-semibold hover:bg-white/10 transition"
                    >
                      Remove Exact Location
                    </button>
                  )}

                </div>

                {locationMessage && (
                  <p className="text-sm text-gray-300 mt-4">
                    {
                      locationMessage
                    }
                  </p>
                )}

                {hasCoordinates && (
                  <div className="grid sm:grid-cols-2 gap-4 mt-5">

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">

                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        Latitude
                      </p>

                      <p className="font-semibold mt-1">
                        {latitude.toFixed(
                          6
                        )}
                      </p>

                    </div>

                    <div className="bg-white/5 border border-white/10 rounded-xl p-4">

                      <p className="text-xs text-gray-400 uppercase tracking-wider">
                        Longitude
                      </p>

                      <p className="font-semibold mt-1">
                        {longitude.toFixed(
                          6
                        )}
                      </p>

                    </div>

                  </div>
                )}

              </div>

              {/* MAP PICKER */}

              <div className="mt-6">

                <div className="mb-4">

                  <h3 className="font-bold text-lg text-[#0B1F3A]">
                    🗺️ Set Location on Map
                  </h3>

                  <p className="text-sm text-gray-500 mt-1">
                    Click the map to place the property marker or drag the existing marker to correct its position.
                  </p>

                </div>

                <LocationPickerMap
                  latitude={
                    latitude
                  }
                  longitude={
                    longitude
                  }
                  setLatitude={
                    setLatitude
                  }
                  setLongitude={
                    setLongitude
                  }
                />

              </div>

            </div>

            {/* SAVE */}

            <div className="border-t border-gray-100 pt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

              <p className="text-sm text-gray-500">
                Remember to save after changing the property location.
              </p>

              <button
                type="submit"
                disabled={
                  saving
                }
                className="bg-[#C9A227] text-[#08192E] px-8 py-3 rounded-xl font-bold hover:brightness-110 disabled:opacity-50 transition"
              >
                {saving
                  ? "Saving..."
                  : "Save Property Changes"}
              </button>

            </div>

          </div>

        </form>

        {/* IMAGE MANAGEMENT */}

        <section className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 md:p-8 mt-8">

          <div className="flex items-start gap-4 mb-7">

            <div className="w-12 h-12 rounded-xl bg-[#08192E] text-[#C9A227] flex items-center justify-center text-xl">
              📷
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0B1F3A]">
                Property Images
              </h2>

              <p className="text-gray-500 mt-1">
                Add, remove or change the cover image.
              </p>
            </div>

          </div>

          {existingImages.length ===
          0 ? (
            <div className="bg-[#FAFAF8] border border-dashed border-gray-200 rounded-2xl py-12 text-center text-gray-500 mb-7">
              This property currently has no gallery images.
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">

              {existingImages.map(
                (image) => (
                  <div
                    key={
                      image.id
                    }
                    className="border border-gray-100 rounded-2xl overflow-hidden shadow-sm"
                  >

                    <div className="relative h-48 w-full bg-gray-100">

                      <Image
                        src={
                          image.image_url
                        }
                        alt="Property"
                        fill
                        unoptimized
                        className="object-cover"
                      />

                      {image.is_cover && (
                        <span className="absolute top-3 left-3 bg-[#C9A227] text-[#08192E] text-xs font-bold px-3 py-1 rounded-full">
                          Cover
                        </span>
                      )}

                    </div>

                    <div className="p-4 flex flex-wrap gap-2">

                      {!image.is_cover && (
                        <button
                          type="button"
                          onClick={() =>
                            makeCover(
                              image.id
                            )
                          }
                          className="bg-[#08192E] text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
                        >
                          Make Cover
                        </button>
                      )}

                      <button
                        type="button"
                        onClick={() =>
                          deleteImage(
                            image
                          )
                        }
                        className="border border-red-200 text-red-600 px-4 py-2 rounded-xl text-sm font-semibold hover:bg-red-50 transition"
                      >
                        Remove
                      </button>

                    </div>

                  </div>
                )
              )}

            </div>
          )}

          <div className="border-t border-gray-100 pt-7">

            <label className="block font-semibold text-[#0B1F3A] mb-3">
              Add More Images
            </label>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={
                handleImageSelection
              }
              className="block w-full border border-gray-200 rounded-xl p-4 bg-[#FAFAF8]"
            />

            {newImages.length >
              0 && (
              <p className="text-sm text-gray-500 mt-3">
                {newImages.length} new{" "}
                {newImages.length ===
                1
                  ? "image"
                  : "images"}{" "}
                selected.
              </p>
            )}

            <button
              type="button"
              onClick={
                handleUploadNewImages
              }
              disabled={
                uploadingImages ||
                newImages.length ===
                  0
              }
              className="mt-5 bg-[#08192E] text-white px-6 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] disabled:opacity-50 transition"
            >
              {uploadingImages
                ? "Uploading..."
                : "Upload New Images"}
            </button>

          </div>

        </section>

        {/* VIDEO MANAGEMENT */}

        <section className="bg-white rounded-2xl border border-gray-100 shadow-lg p-6 md:p-8 mt-8">

          <div className="flex items-start gap-4 mb-7">

            <div className="w-12 h-12 rounded-xl bg-[#08192E] text-[#C9A227] flex items-center justify-center text-xl">
              🎥
            </div>

            <div>
              <h2 className="text-2xl font-bold text-[#0B1F3A]">
                Property Video
              </h2>

              <p className="text-gray-500 mt-1">
                Add, replace or remove the property's video.
              </p>
            </div>

          </div>

          {videoUrl ? (
            <div className="mb-7">

              <video
                src={
                  videoUrl
                }
                controls
                className="w-full max-w-3xl rounded-2xl bg-black"
              />

              <button
                type="button"
                onClick={
                  removeVideo
                }
                className="mt-4 border border-red-200 text-red-600 px-5 py-2.5 rounded-xl font-semibold hover:bg-red-50 transition"
              >
                Remove Current Video
              </button>

            </div>
          ) : (
            <div className="bg-[#FAFAF8] border border-dashed border-gray-200 rounded-xl p-6 text-gray-500 mb-6">
              No video currently added.
            </div>
          )}

          <input
            type="file"
            accept="video/*"
            onChange={(e) =>
              setNewVideo(
                e.target.files?.[0] ||
                  null
              )
            }
            className="block w-full border border-gray-200 rounded-xl p-4 bg-[#FAFAF8]"
          />

          {newVideo && (
            <div className="mt-4 bg-[#FAFAF8] rounded-xl border border-gray-100 p-4">

              <p className="text-sm text-gray-500">
                Selected video
              </p>

              <p className="font-semibold text-[#0B1F3A] mt-1 break-all">
                {newVideo.name}
              </p>

            </div>
          )}

          <button
            type="button"
            onClick={
              handleUploadVideo
            }
            disabled={
              !newVideo ||
              uploadingVideo
            }
            className="mt-5 bg-[#C9A227] text-[#08192E] px-6 py-3 rounded-xl font-bold hover:brightness-110 disabled:opacity-50 transition"
          >
            {uploadingVideo
              ? "Uploading Video..."
              : videoUrl
              ? "Replace Video"
              : "Upload Video"}
          </button>

        </section>

      </div>

    </main>
  );
}

/*
-----------------------------------
REUSABLE NUMBER FIELD
-----------------------------------
*/

function NumberField({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (
    value: string
  ) => void;
}) {
  return (
    <div>

      <label className="block mb-2 font-semibold text-[#0B1F3A]">
        {label}
      </label>

      <input
        type="number"
        min="0"
        value={value}
        onChange={(e) =>
          setValue(
            e.target.value
          )
        }
        className="w-full border border-gray-200 rounded-xl p-4 bg-[#FAFAF8] text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition"
      />

    </div>
  );
}

/*
-----------------------------------
REUSABLE TEXT FIELD
-----------------------------------
*/

function TextField({
  label,
  value,
  setValue,
}: {
  label: string;
  value: string;
  setValue: (
    value: string
  ) => void;
}) {
  return (
    <div>

      <label className="block mb-2 font-semibold text-[#0B1F3A]">
        {label}
      </label>

      <input
        type="text"
        value={value}
        onChange={(e) =>
          setValue(
            e.target.value
          )
        }
        className="w-full border border-gray-200 rounded-xl p-4 bg-[#FAFAF8] text-[#0B1F3A] focus:outline-none focus:ring-2 focus:ring-[#C9A227] focus:border-[#C9A227] transition"
      />

    </div>
  );
}