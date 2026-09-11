import { supabase } from "@/lib/supabase";
import {
  MONETIZATION,
  type AgentPlan,
  type BusinessPlan,
  type BillingPeriod,
} from "@/config/monetization";

export type SubscriptionAccountType =
  | "agent"
  | "business";

export type SubscriptionStatus =
  | "active"
  | "expired"
  | "cancelled";

export type SubscriptionRecord = {
  id: string;
  user_id: string;
  account_type: SubscriptionAccountType;
  plan: string;
  billing_period: BillingPeriod;
  amount_paid: number;
  status: SubscriptionStatus;
  payment_reference: string | null;
  starts_at: string;
  expires_at: string;
  created_at: string;
};

export async function getActiveSubscription(
  userId: string,
  accountType: SubscriptionAccountType
): Promise<SubscriptionRecord | null> {
  const now = new Date().toISOString();

  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .eq("account_type", accountType)
    .eq("status", "active")
    .gt("expires_at", now)
    .order("expires_at", {
      ascending: false,
    })
    .limit(1)
    .maybeSingle();

  if (error) {
    console.error(
      "GET ACTIVE SUBSCRIPTION ERROR:",
      error
    );

    return null;
  }

  return data;
}

export async function getAgentPlan(
  userId: string
): Promise<AgentPlan> {
  const subscription =
    await getActiveSubscription(
      userId,
      "agent"
    );

  if (!subscription) {
    return "free";
  }

  if (
    subscription.plan === "professional" ||
    subscription.plan === "premium"
  ) {
    return subscription.plan;
  }

  return "free";
}

export async function getBusinessPlan(
  userId: string
): Promise<BusinessPlan> {
  const subscription =
    await getActiveSubscription(
      userId,
      "business"
    );

  if (!subscription) {
    return "free";
  }

  if (
    subscription.plan === "featured" ||
    subscription.plan === "premium"
  ) {
    return subscription.plan;
  }

  return "free";
}

export async function getAgentPropertyLimit(
  userId: string
) {
  const plan =
    await getAgentPlan(userId);

  return MONETIZATION.agentPlans[plan]
    .activePropertyLimit;
}

export async function getBusinessServiceAreaLimit(
  userId: string
) {
  const plan =
    await getBusinessPlan(userId);

  return MONETIZATION.businessPlans[plan]
    .serviceAreaLimit;
}
export async function getAgentVideoUsage(
  userId: string
) {
  const plan =
    await getAgentPlan(userId);

  const planConfig =
    MONETIZATION.agentPlans[plan];

  const { data, error } =
    await supabase
      .from("properties")
      .select(
        "video_duration_seconds"
      )
      .eq("user_id", userId)
      .not(
        "video_duration_seconds",
        "is",
        null
      );

  if (error) {
    console.error(
      "GET VIDEO USAGE ERROR:",
      error
    );

    throw error;
  }

  const usedSeconds = (
    data || []
  ).reduce(
    (total, property) =>
      total +
      Number(
        property.video_duration_seconds ||
          0
      ),
    0
  );

  const allowanceSeconds =
    planConfig.videoAllowanceSeconds;

  const remainingSeconds =
    Math.max(
      allowanceSeconds -
        usedSeconds,
      0
    );

  return {
    plan,
    usedSeconds,
    allowanceSeconds,
    remainingSeconds,
    maxSingleVideoSeconds:
      planConfig.maxSingleVideoSeconds,
  };
}