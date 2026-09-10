import type { Metadata } from "next";

import { supabase } from "@/lib/supabase";

type PropertyLayoutProps = {
  children: React.ReactNode;
  params: Promise<{
    id: string;
  }>;
};

export async function generateMetadata({
  params,
}: PropertyLayoutProps): Promise<Metadata> {
  const { id } = await params;

  try {
    const { data: property, error } = await supabase
      .from("properties")
      .select(`
        id,
        title,
        price,
        city,
        state,
        property_type,
        listing_type,
        description,
        image_url,
        status,
        property_images (
          image_url,
          is_cover
        )
      `)
      .eq("id", id)
      .eq("status", "Published")
      .maybeSingle();

    if (error || !property) {
      return {
        title: "Property",
        description:
          "Discover properties across Nigeria on PaujaRealtyHub.",
      };
    }

    const images = Array.isArray(property.property_images)
      ? property.property_images
      : [];

    const coverImage =
      images.find((image: any) => image.is_cover)?.image_url ||
      images[0]?.image_url ||
      property.image_url ||
      "https://pauja-realty-hub.vercel.app/opengraph-image";

    const location = [property.city, property.state]
      .filter(Boolean)
      .join(", ");

    const formattedPrice = Number(
      property.price || 0
    ).toLocaleString("en-NG");

    const descriptionParts = [
      `₦${formattedPrice}`,
      property.property_type,
      property.listing_type,
      location,
    ].filter(Boolean);

    const shareDescription =
      descriptionParts.join(" • ");

    const propertyUrl =
      `https://pauja-realty-hub.vercel.app/properties/${property.id}`;

    return {
      title: property.title,

      description:
        shareDescription ||
        property.description ||
        "View this property on PaujaRealtyHub.",

      alternates: {
        canonical: propertyUrl,
      },

      openGraph: {
        title: property.title,
        description:
          shareDescription ||
          "View this property on PaujaRealtyHub.",
        url: propertyUrl,
        siteName: "PaujaRealtyHub",
        type: "website",
        locale: "en_NG",

        images: [
          {
            url: coverImage,
            width: 1200,
            height: 630,
            alt: property.title,
          },
        ],
      },

      twitter: {
        card: "summary_large_image",
        title: property.title,
        description:
          shareDescription ||
          "View this property on PaujaRealtyHub.",
        images: [coverImage],
      },
    };
  } catch (error) {
    console.error(
      "PROPERTY METADATA ERROR:",
      error
    );

    return {
      title: "Property",
      description:
        "Discover properties across Nigeria on PaujaRealtyHub.",
    };
  }
}

export default function PropertyLayout({
  children,
}: PropertyLayoutProps) {
  return children;
}