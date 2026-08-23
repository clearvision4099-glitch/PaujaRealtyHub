import { supabase } from "@/lib/supabase";

export async function getFeaturedProperties() {
  const { data, error } = await supabase
    .from("properties")
    .select(`
      *,
      property_images (
        id,
        image_url,
        is_cover
      )
    `)
    .eq("status", "Published")
    .order("created_at", { ascending: false })
    .limit(6);

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}