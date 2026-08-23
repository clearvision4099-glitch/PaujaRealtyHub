import { supabase } from "@/lib/supabase";

export async function getMyProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) {
    console.error("GET PROFILE ERROR:", error);
    return null;
  }

  return data;
}

export async function updateMyProfile(profile: any) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("User not logged in");

  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: profile.full_name,
      agency_name: profile.agency_name,
      phone: profile.phone,
      email: profile.email,
      bio: profile.bio,
      city: profile.city,
      state: profile.state,
    })
    .eq("id", user.id)
    .select()
    .single();

  if (error) {
    console.error("UPDATE PROFILE ERROR:", error);
    throw error;
  }

  return data;
}