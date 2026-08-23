import { supabase } from "@/lib/supabase";

export async function isFavourite(propertyId: number) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { data, error } = await supabase
    .from("favorites")
    .select("id")
    .eq("user_id", user.id)
    .eq("property_id", propertyId)
    .maybeSingle();

  if (error) {
    console.error("CHECK FAVOURITE ERROR:", error);
    return false;
  }

  return Boolean(data);
}

export async function toggleFavourite(
  propertyId: number,
  currentlyFavourite: boolean
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      loginRequired: true,
    };
  }

  if (currentlyFavourite) {
    const { error } = await supabase
      .from("favorites")
      .delete()
      .eq("user_id", user.id)
      .eq("property_id", propertyId);

    if (error) {
      console.error("REMOVE FAVOURITE ERROR:", error);

      return {
        success: false,
        loginRequired: false,
      };
    }

    return {
      success: true,
      loginRequired: false,
    };
  }

  const { error } = await supabase
    .from("favorites")
    .insert({
      user_id: user.id,
      property_id: propertyId,
    });

  if (error) {
   console.error("ADD FAVOURITE ERROR");
console.log("Message:", error.message);
console.log("Code:", error.code);
console.log("Details:", error.details);
console.log("Hint:", error.hint);
console.log(error);

    return {
      success: false,
      loginRequired: false,
    };
  }

  return {
    success: true,
    loginRequired: false,
  };
}