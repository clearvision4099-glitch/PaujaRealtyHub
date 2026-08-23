import { supabase } from "@/lib/supabase";

export async function uploadImages(images: File[]) {
  if (!images.length) return [];

  const uploadTasks = images.map(async (image) => {
    const safeName = image.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const fileName = `${crypto.randomUUID()}-${safeName}`;

    const { error } = await supabase.storage
      .from("property-images")
      .upload(fileName, image, {
        cacheControl: "3600",
        upsert: false,
        contentType: image.type,
      });

    if (error) {
      console.error("Image Upload Error:", error);
      throw error;
    }

    const { data } = supabase.storage
      .from("property-images")
      .getPublicUrl(fileName);

    return data.publicUrl;
  });

  return await Promise.all(uploadTasks);
}

export async function uploadVideo(video: File | null) {
  if (!video) return null;

  const safeName = video.name.replace(/[^a-zA-Z0-9._-]/g, "-");
  const fileName = `${crypto.randomUUID()}-${safeName}`;

  const { error } = await supabase.storage
    .from("property-videos")
    .upload(fileName, video, {
      cacheControl: "3600",
      upsert: false,
      contentType: video.type,
    });

  if (error) {
    console.error("Video Upload Error:", error);
    throw error;
  }

  const { data } = supabase.storage
    .from("property-videos")
    .getPublicUrl(fileName);

  return data.publicUrl;
}