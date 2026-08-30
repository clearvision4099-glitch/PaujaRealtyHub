export const BUSINESS_CATEGORIES = [
  "Estate Agent",
  "Property Lawyer",
  "Land Surveyor",
  "Property Valuer",
  "Architect",
  "Property Manager",
  "Facility Manager",

  "Builder / Contractor",
  "Civil Engineer",
  "Structural Engineer",
  "Electrical Engineer",
  "Electrician",
  "Plumber",
  "Carpenter",
  "Painter",
  "Roofer",
  "Tiler",

  "Interior Designer",
  "Furniture & Furnishing",
  "Landscaping",
  "Cleaning Service",
  "Pest Control",

  "Security Service",
  "CCTV & Security Systems",

  "Movers / Relocation",
  "Logistics",

  "Building Materials",
  "Solar & Energy",

  "Mortgage / Finance",
  "Insurance",

  "Short-Let / Hospitality",

  "Other",
] as const;

export type BusinessCategory =
  (typeof BUSINESS_CATEGORIES)[number];