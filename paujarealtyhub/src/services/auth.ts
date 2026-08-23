import { supabase } from "@/lib/supabase";

export async function registerUser(
  email: string,
  password: string
) {
  const result = await supabase.auth.signUp({
    email,
    password,
  });

  if (result.data.user) {
    const user = result.data.user;

    await supabase.from("profiles").upsert({
      id: user.id,
      email: user.email,
      created_at: new Date().toISOString(),
      verified: false,
    });
  }

  return result;
}

export async function loginUser(
  email: string,
  password: string
) {
  const result =
    await supabase.auth.signInWithPassword({
      email,
      password,
    });

  if (result.data.user) {
    const user = result.data.user;

    const { data: profile } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", user.id)
      .single();

    if (!profile) {
      await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        created_at: new Date().toISOString(),
        verified: false,
      });
    }
  }

  return result;
}

export async function logoutUser() {
  return await supabase.auth.signOut();
}