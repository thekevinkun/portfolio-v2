import type { Section } from "@/types/stage";

// Placeholder copy: replaced by database-driven titles in P4.5
const SITE_NAME = "Portfolio";

// One format for the server metadata and the client tab-title sync
export function getSectionTitle(section: Section): string {
  return `${section.label} | ${SITE_NAME}`;
}

// Spoken by the live region after a page turn, e.g. "Projects, page 3 of 5"
export function getSectionAnnouncement(
  section: Section,
  index: number,
  total: number,
): string {
  return `${section.label}, page ${index + 1} of ${total}`;
}
