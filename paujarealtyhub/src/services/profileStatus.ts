import { getMyProfile } from "./profile";

export async function isProfileComplete() {
  const profile = await getMyProfile();

  if (!profile) return false;

  const requiredFields = [
    "full_name",
    "agent_name",
    "phone",
    "city",
    "state",
  ];

  return requiredFields.every((field) => {
    const value = profile[field];

    return value !== null && value !== "";
  });
}