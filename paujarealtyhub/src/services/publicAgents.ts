import { supabase } from "@/lib/supabase";

export async function getFeaturedAgents() {
  const { data: properties, error: propertyError } =
    await supabase
      .from("properties")
      .select("user_id, id")
      .eq("status", "Published");

  if (propertyError) {
    console.error(
      "LOAD FEATURED AGENTS PROPERTY ERROR:",
      propertyError
    );

    return [];
  }

  const counts = new Map<string, number>();

  for (const property of properties || []) {
    if (!property.user_id) continue;

    counts.set(
      property.user_id,
      (counts.get(property.user_id) || 0) + 1
    );
  }

  const userIds = Array.from(counts.keys());

  if (userIds.length === 0) {
    return [];
  }

  const { data: profiles, error: profileError } =
    await supabase
      .from("profiles")
      .select(`
        id,
        full_name,
        agency_name,
        city,
        state,
        avatar_url,
        verified
      `)
      .in("id", userIds);

  if (profileError) {
    console.error(
      "LOAD FEATURED AGENTS PROFILE ERROR:",
      profileError
    );

    return [];
  }

  return (profiles || [])
    .map((profile) => ({
      ...profile,
      listings: counts.get(profile.id) || 0,
    }))
    .sort(
      (a, b) =>
        b.listings - a.listings
    )
    .slice(0, 3);
}