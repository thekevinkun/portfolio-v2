import type { Profile } from "@/types/profile";
import type { Section } from "@/types/stage";
import { SECTIONS } from "./sections";

type TitleProfile = Pick<Profile, "name" | "seoTitle">;

// Overview carries the full SEO title; the other pages read "<Label> | <name>" (D67).
// One format for the server metadata and the client tab-title sync.
export function getSectionTitle(
  section: Section,
  profile: TitleProfile,
): string {
  return section.id === "overview"
    ? profile.seoTitle
    : `${section.label} | ${profile.name}`;
}

// The server computes these once and hands them to the client sync
export function getSectionTitles(profile: TitleProfile): string[] {
  return SECTIONS.map((section) => getSectionTitle(section, profile));
}

// Spoken by the live region after a page turn, e.g. "Projects, page 3 of 5"
export function getSectionAnnouncement(
  section: Section,
  index: number,
  total: number,
): string {
  return `${section.label}, page ${index + 1} of ${total}`;
}
