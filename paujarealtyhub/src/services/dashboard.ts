import { supabase } from "@/lib/supabase";

export async function getDashboardStats() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return null;

  // Total Properties
  const { count: propertyCount } = await supabase
    .from("properties")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Total Favorites
  const { count: favoriteCount } = await supabase
    .from("favorites")
    .select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  // Total Messages
  const { count: messageCount } = await supabase
    .from("messages")
    .select("*", { count: "exact", head: true })
    .eq("receiver_id", user.id);

  // Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("verified")
    .eq("id", user.id)
    .single();

  return {
    properties: propertyCount || 0,
    favorites: favoriteCount || 0,
    messages: messageCount || 0,
    verified: profile?.verified ? "Verified" : "Pending",
  };
}