"use client";

import {
  Suspense,
  useEffect,
  useState,
} from "react";

import {
  useSearchParams,
} from "next/navigation";

import ProfileCompletionGuard from "@/components/ProfileCompletionGuard";

import {
  addProperty,
  addPropertyImages,
} from "@/services/properties";

import {
  uploadImages,
  uploadVideo,
} from "@/services/storage";

import {
  autoSave,
} from "@/services/autosave";

import {
  createDraft,
  getDraft,
  getMyDrafts,
  deleteDraft,
} from "@/services/draft";

import ListingHeader from "./ListingHeader";
import ProgressBar from "./ProgressBar";
import WizardNavigation from "./WizardNavigation";

import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import StepFour from "./StepFour";
import StepFive from "./StepFive";
import StepSix from "./StepSix";

function AddPropertyContent() {
  
  const searchParams =
    useSearchParams();

  const requestedDraftId =
    searchParams.get(
      "draft"
    );

  const [
    currentStep,
    setCurrentStep,
  ] = useState(1);

  const [
    title,
    setTitle,
  ] = useState("");

  const [
    description,
    setDescription,
  ] = useState("");

  const [
    country,
    setCountry,
  ] = useState(
    "Nigeria"
  );

  const [
    propertyState,
    setPropertyState,
  ] = useState("");

  const [
    city,
    setCity,
  ] = useState("");

  const [
    address,
    setAddress,
  ] = useState("");

  const [
    latitude,
    setLatitude,
  ] = useState<
    number | null
  >(null);

  const [
    longitude,
    setLongitude,
  ] = useState<
    number | null
  >(null);

  const [
    price,
    setPrice,
  ] = useState("");

  const [
    propertyType,
    setPropertyType,
  ] = useState(
    "House"
  );

  const [
    listingType,
    setListingType,
  ] = useState(
    "Sale"
  );

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

  const [
    size,
    setSize,
  ] = useState("");

  const [
    furnishing,
    setFurnishing,
  ] = useState("");

  const [
    images,
    setImages,
  ] = useState<
    File[]
  >([]);

  const [
    video,
    setVideo,
  ] = useState<
    File | null
  >(null);

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    draftId,
    setDraftId,
  ] = useState<
    string | null
  >(null);

  const [
    draftInitialized,
    setDraftInitialized,
  ] = useState(false);

  
  /*
  -----------------------------------
  LOAD DRAFT INTO FORM
  -----------------------------------
  */

  function applyDraft(
    draft: any
  ) {
    setDraftId(
      draft.id
    );

    setTitle(
      draft.title ||
        ""
    );

    setDescription(
      draft.description ||
        ""
    );

    setPropertyType(
      draft.property_type ||
        "House"
    );

    setListingType(
      draft.listing_type ||
        "Sale"
    );

    setPrice(
      draft.price ||
        ""
    );

    setBedrooms(
      draft.bedrooms ||
        ""
    );

    setBathrooms(
      draft.bathrooms ||
        ""
    );

    setToilets(
      draft.toilets ||
        ""
    );

    setParking(
      draft.parking ||
        ""
    );

    setSize(
      draft.size ||
        ""
    );

    setFurnishing(
      draft.furnishing ||
        ""
    );

    setCountry(
      draft.country ||
        "Nigeria"
    );

    setPropertyState(
      draft.state ||
        ""
    );

    setCity(
      draft.city ||
        ""
    );

    setAddress(
      draft.address ||
        ""
    );

    setLatitude(
      draft.latitude ??
        null
    );

    setLongitude(
      draft.longitude ??
        null
    );

    setCurrentStep(
      draft.current_step ||
        1
    );
  }

  /*
  -----------------------------------
  INITIALIZE / RESUME DRAFT
  -----------------------------------
  */

  useEffect(() => {
    async function initializeDraft() {
      try {
        setDraftInitialized(
          false
        );

        /*
        SPECIFIC DRAFT REQUESTED
        */

        if (
          requestedDraftId
        ) {
          const draft =
            await getDraft(
              requestedDraftId
            );

          applyDraft(
            draft
          );

          console.log(
            "Specific draft loaded:",
            draft.id
          );

          return;
        }

        /*
        RESUME MOST RECENT DRAFT
        */

        const drafts =
          await getMyDrafts();

        if (
          drafts.length >
          0
        ) {
          const draft =
            drafts[0];

          applyDraft(
            draft
          );

          console.log(
            "Existing draft loaded:",
            draft.id
          );

          return;
        }

        /*
        CREATE NEW DRAFT
        */

        const draft =
          await createDraft();

        setDraftId(
          draft.id
        );

        console.log(
          "New draft created:",
          draft.id
        );
      } catch (error) {
        console.error(
          "INITIALIZE DRAFT ERROR:",
          error
        );
      } finally {
        setDraftInitialized(
          true
        );
      }
    }

    initializeDraft();
  }, [
    requestedDraftId,
  ]);

  /*
  -----------------------------------
  AUTOSAVE DRAFT
  -----------------------------------
  */

  useEffect(() => {
    if (
      !draftInitialized ||
      !draftId
    ) {
      return;
    }

    const draftData = {
      title,
      description,

      country,

      state:
        propertyState,

      city,
      address,

      latitude,
      longitude,

      price,

      property_type:
        propertyType,

      listing_type:
        listingType,

      bedrooms,
      bathrooms,
      toilets,
      parking,
      size,
      furnishing,

      current_step:
        currentStep,
    };

    autoSave(
      draftId,
      draftData
    );
  }, [
    draftInitialized,
    draftId,

    title,
    description,

    country,
    propertyState,
    city,
    address,

    latitude,
    longitude,

    price,

    propertyType,
    listingType,

    bedrooms,
    bathrooms,
    toilets,
    parking,
    size,
    furnishing,

    currentStep,
  ]);

  /*
  -----------------------------------
  PUBLISH PROPERTY
  -----------------------------------
  */

  async function handlePublish() {
    if (loading) {
      return;
    }

    if (
      !title.trim()
    ) {
      alert(
        "Please enter a listing title."
      );

      setCurrentStep(1);

      return;
    }

    if (
      !price.trim()
    ) {
      alert(
        "Please enter the property price."
      );

      setCurrentStep(2);

      return;
    }

    if (
      !propertyState.trim()
    ) {
      alert(
        "Please select the property state."
      );

      setCurrentStep(4);

      return;
    }

    if (
      !city.trim()
    ) {
      alert(
        "Please enter the city or area."
      );

      setCurrentStep(4);

      return;
    }

    if (
      !address.trim()
    ) {
      alert(
        "Please enter the property address."
      );

      setCurrentStep(4);

      return;
    }

    if (
      images.length ===
      0
    ) {
      alert(
        "Please upload at least one property image."
      );

      setCurrentStep(5);

      return;
    }

    try {
      setLoading(true);

      console.time(
        "TOTAL PUBLISH TIME"
      );

      /*
      UPLOAD IMAGES
      */

      console.time(
        "UPLOAD IMAGES"
      );

      const imageUrls =
        await uploadImages(
          images
        );

      console.timeEnd(
        "UPLOAD IMAGES"
      );

      /*
      UPLOAD VIDEO
      */

      console.time(
        "UPLOAD VIDEO"
      );

      const videoUrl =
        await uploadVideo(
          video
        );

      console.timeEnd(
        "UPLOAD VIDEO"
      );

      /*
      PROPERTY DATA
      */

      const property = {
        title:
          title.trim(),

        description:
          description.trim(),

        listing_type:
          listingType,

        property_type:
          propertyType,

        price:
          Number(
            price.replace(
              /,/g,
              ""
            )
          ),

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

        image_url:
          imageUrls[0] ||
          null,

        video_url:
          videoUrl ||
          null,
      };

      /*
      SAVE PROPERTY
      */

      console.time(
        "SAVE PROPERTY"
      );

      const savedProperty =
        await addProperty(
          property
        );

      console.timeEnd(
        "SAVE PROPERTY"
      );

      /*
      SAVE IMAGE RECORDS
      */

      console.time(
        "SAVE IMAGE RECORDS"
      );

      await addPropertyImages(
        savedProperty.id,
        imageUrls
      );

      console.timeEnd(
        "SAVE IMAGE RECORDS"
      );

      /*
      DELETE COMPLETED DRAFT
      */

      if (
        draftId
      ) {
        await deleteDraft(
          draftId
        );
      }

      console.timeEnd(
        "TOTAL PUBLISH TIME"
      );

      alert(
        "Property Published Successfully!"
      );

      window.location.href =
        "/dashboard/my-properties";
    } catch (
      err: any
    ) {
      console.error(
        "PUBLISH PROPERTY ERROR:",
        err
      );

      console.log(
        "MESSAGE:",
        err?.message
      );

      console.log(
        "CODE:",
        err?.code
      );

      console.log(
        "DETAILS:",
        err?.details
      );

      console.log(
        "HINT:",
        err?.hint
      );

      alert(
        err?.message ||
          "Unable to publish property."
      );
    } finally {
      setLoading(false);
    }
  }

  /*
  -----------------------------------
  PAGE
  -----------------------------------
  */

  return (
    <ProfileCompletionGuard>

      <main className="p-4 md:p-8">

        <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg p-5 md:p-8">

          <ListingHeader />

          <ProgressBar
            currentStep={
              currentStep
            }
          />

          <form
            onSubmit={(e) =>
              e.preventDefault()
            }
            className="space-y-6 mt-8"
          >

            {currentStep ===
              1 && (
              <StepOne
                title={
                  title
                }
                setTitle={
                  setTitle
                }
                propertyType={
                  propertyType
                }
                setPropertyType={
                  setPropertyType
                }
                listingType={
                  listingType
                }
                setListingType={
                  setListingType
                }
              />
            )}

            {currentStep ===
              2 && (
              <StepTwo
                description={
                  description
                }
                setDescription={
                  setDescription
                }
                price={
                  price
                }
                setPrice={
                  setPrice
                }
              />
            )}

            {currentStep ===
              3 && (
              <StepThree
                bedrooms={
                  bedrooms
                }
                setBedrooms={
                  setBedrooms
                }
                bathrooms={
                  bathrooms
                }
                setBathrooms={
                  setBathrooms
                }
                toilets={
                  toilets
                }
                setToilets={
                  setToilets
                }
                parking={
                  parking
                }
                setParking={
                  setParking
                }
                size={
                  size
                }
                setSize={
                  setSize
                }
                furnishing={
                  furnishing
                }
                setFurnishing={
                  setFurnishing
                }
              />
            )}

            {currentStep ===
              4 && (
              <StepFour
                country={
                  country
                }
                setCountry={
                  setCountry
                }
                propertyState={
                  propertyState
                }
                setPropertyState={
                  setPropertyState
                }
                city={
                  city
                }
                setCity={
                  setCity
                }
                address={
                  address
                }
                setAddress={
                  setAddress
                }
                latitude={
                  latitude
                }
                setLatitude={
                  setLatitude
                }
                longitude={
                  longitude
                }
                setLongitude={
                  setLongitude
                }
              />
            )}

            {currentStep ===
              5 && (
              <StepFive
                images={
                  images
                }
                setImages={
                  setImages
                }
                video={
                  video
                }
                setVideo={
                  setVideo
                }
              />
            )}

            {currentStep ===
              6 && (
              <StepSix
                title={
                  title
                }
                propertyType={
                  propertyType
                }
                listingType={
                  listingType
                }
                price={
                  price
                }
                country={
                  country
                }
                propertyState={
                  propertyState
                }
                city={
                  city
                }
                address={
                  address
                }
                bedrooms={
                  bedrooms
                }
                bathrooms={
                  bathrooms
                }
                toilets={
                  toilets
                }
                parking={
                  parking
                }
                size={
                  size
                }
                furnishing={
                  furnishing
                }
                images={
                  images
                }
                video={
                  video
                }
              />
            )}

            <div className="pt-4 border-t border-gray-100">

              <WizardNavigation
                currentStep={
                  currentStep
                }
                setCurrentStep={
                  setCurrentStep
                }
                loading={
                  loading
                }
                onPublish={
                  handlePublish
                }
              />

            </div>

          </form>

        </div>

      </main>

    </ProfileCompletionGuard>
  );
}

export default function AddPropertyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />

            <p className="text-gray-500 mt-4">
              Loading property form...
            </p>
          </div>
        </div>
      }
    >
      <AddPropertyContent />
    </Suspense>
  );
}
