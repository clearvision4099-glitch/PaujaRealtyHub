"use client";

import dynamic from "next/dynamic";

type PropertyMapProps = {
  properties?: any[];
  property?: any;
  mode?: "marketplace" | "single";
  height?: string;
};

const PropertyMapClient = dynamic(
  () =>
    import(
      "./PropertyMapClient"
    ),
  {
    ssr: false,

    loading: () => (
      <div className="h-[420px] bg-[#FAFAF8] border border-gray-200 rounded-2xl flex items-center justify-center">

        <div className="text-center">

          <div className="w-10 h-10 border-4 border-gray-200 border-t-[#C9A227] rounded-full animate-spin mx-auto" />

          <p className="text-gray-500 mt-4">
            Loading map...
          </p>

        </div>

      </div>
    ),
  }
);

export default function PropertyMap(
  props: PropertyMapProps
) {
  return (
    <PropertyMapClient
      {...props}
    />
  );
}