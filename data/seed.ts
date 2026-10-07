import type { Profile } from "@/types/profile";

// PLACEHOLDER: temporary data that mirrors the future `profile` table (P3.2, P4).
// Replace values with real data from the dashboard later.
export const profile: Profile = {
  name: "Kevin Mahendra",
  handle: "kevinmahendra",
  locationLabel: "Indonesia",
  timezone: "Asia/Jakarta",
  availability: "Open to opportunities",
  avatarUrl: "/placeholder/avatar.svg",
};

export { projects } from "./projects";
export { skillGroups, techStrip } from "./skill-groups";
export { experienceItems } from "./experience";
