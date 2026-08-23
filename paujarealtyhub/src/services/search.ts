import { supabase } from "@/lib/supabase";

export async function searchProperties(filters: any) {

  let query = supabase
    .from("properties")
    .select("*")
    .eq("status", "Published");

  if (filters.keyword) {
    query = query.ilike("title", `%${filters.keyword}%`);
  }

  if (filters.state) {
    query = query.eq("state", filters.state);
  }

  if (filters.city) {
    query = query.eq("city", filters.city);
  }

  if (filters.type) {
    query = query.eq("property_type", filters.type);
  }

  if (filters.listing) {
    query = query.eq("listing_type", filters.listing);
  }

  const { data, error } = await query;

  if (error) throw error;

  return data;
}