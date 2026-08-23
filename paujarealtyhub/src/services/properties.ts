import { supabase } from "@/lib/supabase";

export async function addProperty(property: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  console.log("Logged in user:", user);

  if (!user) {
    throw new Error("User not authenticated");
  }

  const {
    images,
    video,
    image_url,
    video_url,
    ...rest
  } = property;

  console.log("Object being inserted:", {
    ...rest,
    image_url: image_url || null,
    video_url: video_url || null,
    user_id: user.id,
  });

  const { data, error } = await supabase
    .from("properties")
    .insert([
      {
        ...rest,
        image_url: image_url || null,
        video_url: video_url || null,
        user_id: user.id,
        status: "Published",
        created_at: new Date().toISOString(),
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("SUPABASE ERROR:", error);
    throw error;
  }

  return data;
}

export async function getMyProperties() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

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
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(
      "GET MY PROPERTIES ERROR:",
      error
    );

    return [];
  }

  return (data || []).map((property) => ({
    ...property,

    property_images: [
      ...(property.property_images || []),
    ].sort(
      (a: any, b: any) =>
        Number(b.is_cover) -
        Number(a.is_cover)
    ),
  }));
}
export async function updateProperty(
  id: string,
  updates: any
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error(
      "User not authenticated"
    );
  }

  console.log(
    "UPDATING PROPERTY:",
    {
      id,
      user_id: user.id,
      updates,
    }
  );

  const {
    data,
    error,
  } = await supabase
    .from("properties")
    .update(updates)
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error(
      "UPDATE PROPERTY ERROR:",
      error
    );

    throw error;
  }

  console.log(
    "PROPERTY UPDATED:",
    data
  );

  return data;
}

export async function deleteProperty(
  id: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("properties")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error(
      "DELETE PROPERTY ERROR:",
      error
    );

    throw error;
  }

  return true;
}

export async function addPropertyImages(
  propertyId: number,
  imageUrls: string[]
) {
  if (!imageUrls.length) {
    return;
  }

  const rows = imageUrls.map(
    (url, index) => ({
      property_id: propertyId,
      image_url: url,
      is_cover: index === 0,
    })
  );

  const { error } = await supabase
    .from("property_images")
    .insert(rows);

  if (error) {
    console.error(
      "ADD PROPERTY IMAGES ERROR:",
      error
    );

    throw error;
  }
}