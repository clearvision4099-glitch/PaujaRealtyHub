import { supabase } from "@/lib/supabase";

export async function createDraft(data: any = {}) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: draft, error } = await supabase
    .from("property_drafts")
    .insert([
      {
        ...data,
        user_id: user.id,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("CREATE DRAFT ERROR:", error);
    throw error;
  }

  return draft;
}

export async function updateDraft(
  id: string,
  data: any
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data: draft, error } = await supabase
    .from("property_drafts")
    .update({
      ...data,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id)
    .eq("user_id", user.id)
    .select()
    .single();

  if (error) {
    console.error("UPDATE DRAFT ERROR:", error);
    throw error;
  }

  return draft;
}

export async function getDraft(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { data, error } = await supabase
    .from("property_drafts")
    .select("*")
    .eq("id", id)
    .eq("user_id", user.id)
    .single();

  if (error) {
    console.error("GET DRAFT ERROR:", error);
    throw error;
  }

  return data;
}

export async function getMyDrafts() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return [];
  }

  const { data, error } = await supabase
    .from("property_drafts")
    .select("*")
    .eq("user_id", user.id)
    .order("updated_at", {
      ascending: false,
    });

  if (error) {
    console.error("GET MY DRAFTS ERROR:", error);
    throw error;
  }

  return data || [];
}

export async function deleteDraft(id: string) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated");
  }

  const { error } = await supabase
    .from("property_drafts")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) {
    console.error("DELETE DRAFT ERROR:", error);
    throw error;
  }

  return true;
}