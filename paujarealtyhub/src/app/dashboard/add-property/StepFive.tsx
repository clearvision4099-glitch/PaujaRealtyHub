"use client";

type StepFiveProps = {
  images: File[];
  setImages: React.Dispatch<React.SetStateAction<File[]>>;
  video: File | null;
  setVideo: React.Dispatch<React.SetStateAction<File | null>>;
};

export default function StepFive({
  images,
  setImages,
  video,
  setVideo,
}: StepFiveProps) {
  return (
    <div className="space-y-8">

      <div>
        <span className="text-[#B8922E] text-xs font-semibold uppercase tracking-wider">
          Media
        </span>

        <h2 className="text-2xl font-bold text-[#0B1F3A] mt-1">
          Property Media
        </h2>

        <p className="text-gray-500 mt-2">
          Upload high-quality images and a property video.
        </p>
      </div>

      {/* IMAGE UPLOAD */}
      <label className="block border-2 border-dashed border-[#C9A227]/40 bg-[#FAFAF8] rounded-2xl p-10 text-center cursor-pointer hover:border-[#C9A227] hover:bg-white transition">

        <div className="w-16 h-16 rounded-2xl bg-[#08192E] text-[#C9A227] flex items-center justify-center text-3xl mx-auto mb-5">
          📷
        </div>

        <h3 className="text-lg font-bold text-[#0B1F3A]">
          Click to Upload Images
        </h3>

        <p className="text-gray-500 mt-2">
          JPG, PNG, WEBP
        </p>

        <input
          type="file"
          multiple
          accept="image/*"
          className="hidden"
          onChange={(e) => {
            if (e.target.files) {
              setImages(Array.from(e.target.files));
            }
          }}
        />
      </label>

      {/* IMAGE PREVIEW */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">

        {images.length === 0 ? (
          <div className="col-span-4 text-center text-gray-400 py-10 border border-gray-200 rounded-2xl bg-[#FAFAF8]">
            No images selected yet.
          </div>
        ) : (
          images.map((image, index) => (
            <div
              key={index}
              className="relative rounded-2xl overflow-hidden border border-gray-100 shadow-sm bg-white"
            >
              <img
                src={URL.createObjectURL(image)}
                alt={`Preview ${index + 1}`}
                className="w-full h-40 object-cover"
              />

              <button
                type="button"
                onClick={() =>
                  setImages(
                    images.filter(
                      (_, i) => i !== index
                    )
                  )
                }
                className="absolute top-2 right-2 bg-red-600 text-white rounded-full w-8 h-8 hover:bg-red-700 transition"
              >
                ×
              </button>

              {index === 0 && (
                <div className="absolute bottom-2 left-2 bg-[#C9A227] text-[#08192E] text-xs font-bold px-3 py-1 rounded-full">
                  Cover
                </div>
              )}
            </div>
          ))
        )}

      </div>

      {/* VIDEO */}
      <div className="border-t border-gray-100 pt-6">

        <label className="font-semibold text-[#0B1F3A] block mb-3">
          Property Video
        </label>

        <input
          type="file"
          accept="video/*"
          onChange={(e) => {
            if (e.target.files?.[0]) {
              setVideo(e.target.files[0]);
            }
          }}
          className="w-full border border-gray-200 rounded-xl p-3 bg-[#FAFAF8] focus:outline-none focus:ring-2 focus:ring-[#C9A227]"
        />

        {video && (
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mt-4 border border-gray-100 rounded-xl p-4 bg-white shadow-sm">

            <span className="text-[#0B1F3A] font-medium">
              🎥 {video.name}
            </span>

            <button
              type="button"
              onClick={() => setVideo(null)}
              className="border border-red-200 text-red-600 px-4 py-2 rounded-lg hover:bg-red-50 transition"
            >
              Remove
            </button>

          </div>
        )}

      </div>

    </div>
  );
}