"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import {
  getMyProperties,
  deleteProperty,
  updateProperty,
} from "@/services/properties";

import {
  createDraft,
} from "@/services/draft";

export default function MyPropertiesPage() {
  const router = useRouter();

  const [properties, setProperties] =
    useState<any[]>([]);

  const [loading, setLoading] =
    useState(true);

  const [
    changingStatusId,
    setChangingStatusId,
  ] = useState<string | null>(null);

  const [
    duplicatingId,
    setDuplicatingId,
  ] = useState<string | null>(null);

  /*
  -----------------------------------
  LOAD PROPERTIES
  -----------------------------------
  */

  useEffect(() => {
    loadProperties();
  }, []);

  async function loadProperties() {
    try {
      setLoading(true);

      const data =
        await getMyProperties();

      setProperties(data || []);
    } catch (error) {
      console.error(
        "Error loading properties:",
        error
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  -----------------------------------
  DELETE PROPERTY
  -----------------------------------
  */

  async function handleDelete(
    id: string
  ) {
    const confirmed =
      confirm(
        "Are you sure you want to permanently delete this property?"
      );

    if (!confirmed) {
      return;
    }

    try {
      await deleteProperty(id);

      setProperties((prev) =>
        prev.filter(
          (property) =>
            String(
              property.id
            ) !== String(id)
        )
      );

      alert(
        "Property deleted successfully."
      );
    } catch (error) {
      console.error(
        "DELETE PROPERTY ERROR:",
        error
      );

      alert(
        "Unable to delete property."
      );
    }
  }

  /*
  -----------------------------------
  DUPLICATE PROPERTY TO DRAFT
  -----------------------------------
  */

  async function handleDuplicate(
    property: any
  ) {
    const propertyId =
      String(property.id);

    const confirmed =
      confirm(
        "Create a draft copy of this property?"
      );

    if (!confirmed) {
      return;
    }

    try {
      setDuplicatingId(
        propertyId
      );

      const duplicateData = {
        title:
          property.title
            ? `${property.title} - Copy`
            : "Property Copy",

        description:
          property.description ||
          "",

        property_type:
          property.property_type ||
          "House",

        listing_type:
          property.listing_type ||
          "Sale",

        price:
          property.price !==
            null &&
          property.price !==
            undefined
            ? String(
                property.price
              )
            : "",

        bedrooms:
          property.bedrooms !==
            null &&
          property.bedrooms !==
            undefined
            ? String(
                property.bedrooms
              )
            : "",

        bathrooms:
          property.bathrooms !==
            null &&
          property.bathrooms !==
            undefined
            ? String(
                property.bathrooms
              )
            : "",

        toilets:
          property.toilets !==
            null &&
          property.toilets !==
            undefined
            ? String(
                property.toilets
              )
            : "",

        parking:
          property.parking !==
            null &&
          property.parking !==
            undefined
            ? String(
                property.parking
              )
            : "",

        size:
          property.size !==
            null &&
          property.size !==
            undefined
            ? String(
                property.size
              )
            : "",

        furnishing:
          property.furnishing ||
          "",

        country:
          property.country ||
          "Nigeria",

        state:
          property.state ||
          "",

        city:
          property.city ||
          "",

        address:
          property.address ||
          "",

        current_step: 1,
      };

      const draft =
        await createDraft(
          duplicateData
        );

      alert(
        "Draft copy created. Review it before publishing."
      );

      router.push(
        `/dashboard/add-property?draft=${draft.id}`
      );
    } catch (error) {
      console.error(
        "DUPLICATE PROPERTY ERROR:",
        error
      );

      alert(
        "Unable to duplicate property."
      );
    } finally {
      setDuplicatingId(
        null
      );
    }
  }

  /*
  -----------------------------------
  PUBLISH / UNPUBLISH
  -----------------------------------
  */

  async function handleTogglePublish(
    property: any
  ) {
    if (
      property.status ===
      "Archived"
    ) {
      return;
    }

    const propertyId =
      String(property.id);

    const isPublished =
      property.status ===
      "Published";

    const newStatus =
      isPublished
        ? "Unpublished"
        : "Published";

    const action =
      isPublished
        ? "unpublish"
        : "publish";

    const confirmed =
      confirm(
        `Are you sure you want to ${action} this property?`
      );

    if (!confirmed) {
      return;
    }

    try {
      setChangingStatusId(
        propertyId
      );

      await updateProperty(
        propertyId,
        {
          status:
            newStatus,
        }
      );

      setProperties((prev) =>
        prev.map((item) =>
          String(item.id) ===
          propertyId
            ? {
                ...item,
                status:
                  newStatus,
              }
            : item
        )
      );

      alert(
        newStatus ===
          "Published"
          ? "Property published successfully."
          : "Property unpublished successfully."
      );
    } catch (error) {
      console.error(
        "CHANGE PROPERTY STATUS ERROR:",
        error
      );

      alert(
        "Unable to change property status."
      );
    } finally {
      setChangingStatusId(
        null
      );
    }
  }

  /*
  -----------------------------------
  ARCHIVE PROPERTY
  -----------------------------------
  */

  async function handleArchive(
    property: any
  ) {
    const propertyId =
      String(property.id);

    const confirmed =
      confirm(
        "Archive this property? It will be removed from active/public listings but kept in your account."
      );

    if (!confirmed) {
      return;
    }

    try {
      setChangingStatusId(
        propertyId
      );

      await updateProperty(
        propertyId,
        {
          status:
            "Archived",
        }
      );

      setProperties((prev) =>
        prev.map((item) =>
          String(item.id) ===
          propertyId
            ? {
                ...item,
                status:
                  "Archived",
              }
            : item
        )
      );

      alert(
        "Property archived successfully."
      );
    } catch (error) {
      console.error(
        "ARCHIVE PROPERTY ERROR:",
        error
      );

      alert(
        "Unable to archive property."
      );
    } finally {
      setChangingStatusId(
        null
      );
    }
  }

  /*
  -----------------------------------
  RESTORE PROPERTY
  -----------------------------------
  */

  async function handleRestore(
    property: any
  ) {
    const propertyId =
      String(property.id);

    const confirmed =
      confirm(
        "Restore this property? It will return as Unpublished so you can review it before publishing again."
      );

    if (!confirmed) {
      return;
    }

    try {
      setChangingStatusId(
        propertyId
      );

      await updateProperty(
        propertyId,
        {
          status:
            "Unpublished",
        }
      );

      setProperties((prev) =>
        prev.map((item) =>
          String(item.id) ===
          propertyId
            ? {
                ...item,
                status:
                  "Unpublished",
              }
            : item
        )
      );

      alert(
        "Property restored successfully. It is currently unpublished."
      );
    } catch (error) {
      console.error(
        "RESTORE PROPERTY ERROR:",
        error
      );

      alert(
        "Unable to restore property."
      );
    } finally {
      setChangingStatusId(
        null
      );
    }
  }

  /*
  -----------------------------------
  COPY PROPERTY LINK
  -----------------------------------
  */

  async function copyPropertyLink(
    property: any
  ) {
    if (
      property.status !==
      "Published"
    ) {
      alert(
        "Only published properties have a public link."
      );

      return;
    }

    try {
      const url =
        `${window.location.origin}/properties/${property.id}`;

      await navigator.clipboard.writeText(
        url
      );

      alert(
        "Public property link copied."
      );
    } catch (error) {
      console.error(
        "COPY PROPERTY LINK ERROR:",
        error
      );

      alert(
        "Unable to copy property link."
      );
    }
  }

  /*
  -----------------------------------
  SHARE PROPERTY
  -----------------------------------
  */

  async function shareProperty(
    property: any
  ) {
    if (
      property.status !==
      "Published"
    ) {
      alert(
        "Publish this property before sharing it publicly."
      );

      return;
    }

    const url =
      `${window.location.origin}/properties/${property.id}`;

    const shareData = {
      title:
        property.title ||
        "PaujaRealtyHub Property",

      text:
        `View this property on PaujaRealtyHub: ${
          property.title || ""
        }`,

      url,
    };

    try {
      if (
        navigator.share
      ) {
        await navigator.share(
          shareData
        );
      } else {
        await navigator.clipboard.writeText(
          url
        );

        alert(
          "Sharing is not available on this device. Property link copied instead."
        );
      }
    } catch (error: any) {
      if (
        error?.name !==
        "AbortError"
      ) {
        console.error(
          "SHARE PROPERTY ERROR:",
          error
        );

        alert(
          "Unable to share property."
        );
      }
    }
  }

  /*
  -----------------------------------
  STATUS STYLE
  -----------------------------------
  */

  function getStatusStyle(
    status: string
  ) {
    if (
      status ===
      "Published"
    ) {
      return (
        "bg-green-100 " +
        "text-green-700"
      );
    }

    if (
      status ===
      "Unpublished"
    ) {
      return (
        "bg-yellow-100 " +
        "text-yellow-700"
      );
    }

    if (
      status ===
      "Archived"
    ) {
      return (
        "bg-gray-200 " +
        "text-gray-600"
      );
    }

    return (
      "bg-orange-100 " +
      "text-orange-700"
    );
  }

  /*
  -----------------------------------
  PAGE
  -----------------------------------
  */

  return (
    <main className="p-4 md:p-8">

      {/* HEADER */}

      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-5 mb-10">

        <div>

          <span className="text-[#B8922E] text-sm font-semibold uppercase tracking-wider">
            Property Management
          </span>

          <h1 className="text-4xl font-bold text-[#0B1F3A] mt-2">
            My Properties
          </h1>

          <p className="text-gray-500 mt-2">
            Manage, share and update your property listings.
          </p>

        </div>

        <button
          type="button"
          onClick={() =>
            router.push(
              "/dashboard/add-property"
            )
          }
          className="bg-[#C9A227] text-[#08192E] px-6 py-3 rounded-xl font-bold hover:brightness-110 transition shadow-sm"
        >
          + Add Property
        </button>

      </div>

      {/* LOADING */}

      {loading && (
        <div className="bg-white border border-gray-100 rounded-2xl shadow-sm py-20 text-center">

          <div className="w-11 h-11 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />

          <p className="text-gray-500 mt-5">
            Loading properties...
          </p>

        </div>
      )}

      {/* EMPTY */}

      {!loading &&
        properties.length ===
          0 && (
          <div className="bg-white border border-gray-100 rounded-2xl p-16 text-center shadow-sm">

            <div className="text-6xl mb-5">
              🏠
            </div>

            <h2 className="text-2xl font-bold text-[#0B1F3A]">
              No Properties Yet
            </h2>

            <p className="text-gray-500 mt-3">
              Your property listings will appear here.
            </p>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/dashboard/add-property"
                )
              }
              className="mt-7 bg-[#08192E] text-white px-7 py-3 rounded-xl font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
            >
              List Your First Property
            </button>

          </div>
        )}

      {/* GRID */}

      {!loading &&
        properties.length >
          0 && (
          <>

            <div className="mb-6">

              <span className="bg-white border border-gray-100 shadow-sm rounded-xl px-5 py-3 inline-flex items-center gap-2">

                <strong className="text-[#C9A227] text-xl">
                  {
                    properties.length
                  }
                </strong>

                <span className="text-gray-500">
                  {properties.length ===
                  1
                    ? "property"
                    : "properties"}
                </span>

              </span>

            </div>

            <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-8">

              {properties.map(
                (property) => {
                  const coverImage =
                    property
                      .property_images?.[0]
                      ?.image_url ||
                    property.image_url ||
                    "";

                  const status =
                    property.status ||
                    "Draft";

                  const isPublished =
                    status ===
                    "Published";

                  const isArchived =
                    status ===
                    "Archived";

                  const isChanging =
                    changingStatusId ===
                    String(
                      property.id
                    );

                  const isDuplicating =
                    duplicatingId ===
                    String(
                      property.id
                    );

                  return (
                    <div
                      key={
                        property.id
                      }
                      className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                    >

                      {/* IMAGE */}

                      <div className="relative h-56 bg-gray-100 overflow-hidden">

                        {coverImage ? (
                          <img
                            src={
                              coverImage
                            }
                            alt={
                              property.title ||
                              "Property"
                            }
                            className={`w-full h-full object-cover transition-transform duration-500 ${
                              isArchived
                                ? "opacity-60"
                                : "group-hover:scale-[1.02]"
                            }`}
                          />
                        ) : (
                          <div className="flex h-full items-center justify-center text-gray-400">
                            No Image Available
                          </div>
                        )}

                        <div className="absolute inset-x-0 bottom-0 h-20 bg-gradient-to-t from-black/40 to-transparent pointer-events-none" />

                        <div className="absolute top-4 left-4">

                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold shadow-sm ${getStatusStyle(
                              status
                            )}`}
                          >
                            {
                              status
                            }
                          </span>

                        </div>

                      </div>

                      {/* DETAILS */}

                      <div className="p-6">

                        <div className="flex flex-wrap gap-2 mb-3">

                          {property.property_type && (
                            <span className="bg-[#08192E]/5 text-[#08192E] text-xs font-semibold px-3 py-1 rounded-full">
                              {
                                property.property_type
                              }
                            </span>
                          )}

                          {property.listing_type && (
                            <span className="bg-[#C9A227]/10 text-[#9A7720] text-xs font-semibold px-3 py-1 rounded-full">
                              {
                                property.listing_type
                              }
                            </span>
                          )}

                        </div>

                        <h2 className="text-xl font-bold text-[#0B1F3A] line-clamp-2">
                          {
                            property.title
                          }
                        </h2>

                        <p className="text-[#B8922E] text-2xl font-bold mt-4">
                          ₦
                          {Number(
                            property.price ||
                              0
                          ).toLocaleString()}
                        </p>

                        <p className="text-gray-500 mt-2">
                          📍{" "}
                          {[
                            property.city,
                            property.state,
                          ]
                            .filter(
                              Boolean
                            )
                            .join(
                              ", "
                            ) ||
                            "Location unavailable"}
                        </p>

                        {/* FEATURES */}

                        <div className="grid grid-cols-3 gap-3 mt-5 text-sm">

                          <div className="bg-[#FAFAF8] rounded-xl p-3">

                            <p className="font-bold text-[#0B1F3A]">
                              {property.bedrooms ??
                                "-"}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              Bedrooms
                            </p>

                          </div>

                          <div className="bg-[#FAFAF8] rounded-xl p-3">

                            <p className="font-bold text-[#0B1F3A]">
                              {property.bathrooms ??
                                "-"}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              Bathrooms
                            </p>

                          </div>

                          <div className="bg-[#FAFAF8] rounded-xl p-3">

                            <p className="font-bold text-[#0B1F3A]">
                              {property.size ||
                                "-"}
                            </p>

                            <p className="text-xs text-gray-400 mt-1">
                              sqm
                            </p>

                          </div>

                        </div>

                        {/* DATE */}

                        <div className="border-t border-gray-100 mt-5 pt-4 flex items-center justify-between">

                          <span className="text-xs text-gray-400">
                            Listed
                          </span>

                          <span className="text-sm text-gray-500">
                            {property.created_at
                              ? new Date(
                                  property.created_at
                                ).toLocaleDateString()
                              : "-"}
                          </span>

                        </div>

                        {/* PRIMARY ACTIONS */}

                        <div className="grid grid-cols-3 gap-3 mt-6">

                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/dashboard/view-property/${property.id}`
                              )
                            }
                            className="border border-gray-200 text-[#0B1F3A] rounded-xl py-2.5 font-semibold hover:bg-gray-50 transition"
                          >
                            View
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              router.push(
                                `/dashboard/edit-property/${property.id}`
                              )
                            }
                            className="bg-[#08192E] text-white rounded-xl py-2.5 font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() =>
                              handleDelete(
                                String(
                                  property.id
                                )
                              )
                            }
                            className="border border-red-200 text-red-600 rounded-xl py-2.5 font-semibold hover:bg-red-50 transition"
                          >
                            Delete
                          </button>

                        </div>

                        {/* DUPLICATE */}

                        <button
                          type="button"
                          disabled={
                            isDuplicating
                          }
                          onClick={() =>
                            handleDuplicate(
                              property
                            )
                          }
                          className="w-full mt-3 border border-[#08192E] text-[#08192E] rounded-xl py-2.5 font-semibold hover:bg-[#08192E] hover:text-white transition disabled:opacity-50"
                        >
                          {isDuplicating
                            ? "Creating Draft Copy..."
                            : "Duplicate"}
                        </button>

                        {/* STATUS MANAGEMENT */}

                        {!isArchived ? (
                          <div className="grid grid-cols-2 gap-3 mt-3">

                            <button
                              type="button"
                              disabled={
                                isChanging
                              }
                              onClick={() =>
                                handleTogglePublish(
                                  property
                                )
                              }
                              className={`rounded-xl py-2.5 font-semibold transition disabled:opacity-50 ${
                                isPublished
                                  ? "border border-yellow-300 text-yellow-700 hover:bg-yellow-50"
                                  : "bg-green-600 text-white hover:bg-green-700"
                              }`}
                            >
                              {isChanging
                                ? "Updating..."
                                : isPublished
                                ? "Unpublish"
                                : "Publish"}
                            </button>

                            <button
                              type="button"
                              disabled={
                                isChanging
                              }
                              onClick={() =>
                                handleArchive(
                                  property
                                )
                              }
                              className="border border-gray-300 text-gray-600 rounded-xl py-2.5 font-semibold hover:bg-gray-100 transition disabled:opacity-50"
                            >
                              Archive
                            </button>

                          </div>
                        ) : (
                          <button
                            type="button"
                            disabled={
                              isChanging
                            }
                            onClick={() =>
                              handleRestore(
                                property
                              )
                            }
                            className="w-full mt-3 bg-[#C9A227] text-[#08192E] rounded-xl py-2.5 font-bold hover:brightness-110 transition disabled:opacity-50"
                          >
                            {isChanging
                              ? "Restoring..."
                              : "Restore Property"}
                          </button>
                        )}

                        {/* SHARE */}

                        <div className="grid grid-cols-2 gap-3 mt-3">

                          <button
                            type="button"
                            disabled={
                              !isPublished
                            }
                            onClick={() =>
                              shareProperty(
                                property
                              )
                            }
                            className="border border-[#C9A227] text-[#9A7720] rounded-xl py-2.5 font-semibold hover:bg-[#C9A227] hover:text-[#08192E] transition disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Share
                          </button>

                          <button
                            type="button"
                            disabled={
                              !isPublished
                            }
                            onClick={() =>
                              copyPropertyLink(
                                property
                              )
                            }
                            className="border border-gray-200 text-gray-600 rounded-xl py-2.5 font-semibold hover:bg-gray-50 transition disabled:opacity-40 disabled:cursor-not-allowed"
                          >
                            Copy Link
                          </button>

                        </div>

                      </div>

                    </div>
                  );
                }
              )}

            </div>

          </>
        )}

    </main>
  );
}