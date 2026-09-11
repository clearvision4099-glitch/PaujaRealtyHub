export const MONETIZATION = {
  featuredProperty: {
    price: 4000,
    durationDays: 30,
  },

  agentPlans: {
    free: {
      name: "Free Agent",
      quarterlyPrice: 0,
      annualPrice: 0,
      activePropertyLimit: 5,
      
      maxImagesPerProperty: 4,
      videoAllowanceSeconds: 60,
      maxSingleVideoSeconds: 60,
        includedFeaturedPerQuarter: 0,
    },

    professional: {
      name: "Professional Agent",
      quarterlyPrice: 10000,
      annualPrice: 35000,
      activePropertyLimit: 30,
      maxImagesPerProperty: 10,
      videoAllowanceSeconds: 300,
      maxSingleVideoSeconds: 60,
      includedFeaturedPerQuarter: 1,
    },

    premium: {
      name: "Premium Agent",
      quarterlyPrice: 20000,
      annualPrice: 70000,
      activePropertyLimit: 100,
      maxImagesPerProperty: 15,
      videoAllowanceSeconds: 900,
      maxSingleVideoSeconds: 60,
      includedFeaturedPerQuarter: 3,
    },
  },

  businessPlans: {
    free: {
      name: "Free Business",
      quarterlyPrice: 0,
      annualPrice: 0,
      serviceAreaLimit: 1,
    },

    featured: {
      name: "Featured Business",
      quarterlyPrice: 10000,
      annualPrice: 35000,
      serviceAreaLimit: 3,
    },

    premium: {
      name: "Premium Business",
      quarterlyPrice: 20000,
      annualPrice: 70000,
      serviceAreaLimit: 10,
    },
  },

  subscriptionDurations: {
    quarterlyMonths: 3,
    annualMonths: 12,
  },
} as const;

export type AgentPlan =
  keyof typeof MONETIZATION.agentPlans;

export type BusinessPlan =
  keyof typeof MONETIZATION.businessPlans;

export type BillingPeriod =
  | "quarterly"
  | "annual";