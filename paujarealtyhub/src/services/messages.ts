import { supabase } from "@/lib/supabase";

export type SendMessageInput = {
  receiverId: string;
  propertyId: number;
  message: string;
};

export async function sendMessage({
  receiverId,
  propertyId,
  message,
}: SendMessageInput) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return {
      success: false,
      loginRequired: true,
      error: null,
    };
  }

  const cleanMessage = message.trim();

  if (!cleanMessage) {
    return {
      success: false,
      loginRequired: false,
      error: new Error("Message cannot be empty."),
    };
  }

  const { data, error } = await supabase
    .from("messages")
    .insert({
      sender_id: user.id,
      receiver_id: receiverId,
      property_id: propertyId,
      message: cleanMessage,
      is_read: false,
    })
    .select()
    .single();

  if (error) {
    console.error("SEND MESSAGE ERROR:", {
      message: error.message,
      code: error.code,
      details: error.details,
      hint: error.hint,
    });

    return {
      success: false,
      loginRequired: false,
      error,
    };
  }

  return {
    success: true,
    loginRequired: false,
    data,
    error: null,
  };
}

export async function getConversation(
  propertyId: number,
  otherUserId: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return [];

  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .eq("property_id", propertyId)
    .or(
      `and(sender_id.eq.${user.id},receiver_id.eq.${otherUserId}),and(sender_id.eq.${otherUserId},receiver_id.eq.${user.id})`
    )
    .order("created_at", { ascending: true });

  if (error) {
    console.error("GET CONVERSATION ERROR:", error);
    return [];
  }

  return data || [];
}

export async function markConversationAsRead(
  propertyId: number,
  senderId: string
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return false;

  const { error } = await supabase
    .from("messages")
    .update({ is_read: true })
    .eq("property_id", propertyId)
    .eq("sender_id", senderId)
    .eq("receiver_id", user.id)
    .eq("is_read", false);

  if (error) {
    console.error("MARK MESSAGE READ ERROR:", error);
    return false;
  }

  return true;
}

export async function getUnreadMessageCount() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return 0;

  const { count, error } = await supabase
    .from("messages")
    .select("id", {
      count: "exact",
      head: true,
    })
    .eq("receiver_id", user.id)
    .eq("is_read", false);

  if (error) {
    console.error("UNREAD MESSAGE COUNT ERROR:", error);
    return 0;
  }

  return count || 0;
}