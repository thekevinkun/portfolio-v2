import type { Section } from "@/types/stage";

// Placeholder copy: replaced by database-driven titles in P4.5
const SITE_NAME = "Portfolio";

// One format for the server metadata and the client tab-title sync
export function getSectionTitle(section: Section): string {
  return `${section.label} | ${SITE_NAME}`;
}
