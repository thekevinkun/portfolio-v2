import type { Profile } from "@/types/profile";

// Mirrors the future `profile` table (P4). Headline, socials and resume
// fields are added in P3.3.
export const profile: Profile = {
  name: "Kevin Mahendra",
  handle: "kevinmahendra",
  locationLabel: "Samarinda, Indonesia",
  timezone: "Asia/Makassar",
  availability: "Open to freelance & full-time",
  avatarUrl: "/placeholder/avatar.svg",
};

export { projects } from "./projects";
export { skillGroups, techStrip } from "./skill-groups";
export { experienceItems } from "./experience";
