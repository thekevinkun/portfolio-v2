import type { ProjectDetails } from "./details";

// A category slug. Categories are rows in `project_categories` (D105), so the
// list is no longer fixed in code.
export type ProjectFilter = string;

export type ProjectCategory = {
  slug: string;
  label: string;
  sort: number;
  visible: boolean;
};

// live = deployed and reachable · completed = finished, repo only
export const PROJECT_STATUSES = [
  "live",
  "in-progress",
  "planned",
  "completed",
] as const;
export type ProjectStatus = (typeof PROJECT_STATUSES)[number];

export const PROJECT_LINK_KINDS = ["live", "repo"] as const;
export type ProjectLinkKind = (typeof PROJECT_LINK_KINDS)[number];

export type ProjectLink = {
  kind: ProjectLinkKind;
  label: string;
  url: string;
};

// A project as the database and the seed hold it, without the details: the
// write-up loads separately (D113, D124)
export type StoredProject = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  filter: ProjectFilter;
  status: ProjectStatus;
  // iconUrl: the small square on the cards; logoUrl: the large image for the
  // project details
  iconUrl: string | null;
  logoUrl: string | null;
  tech: string[];
  links: ProjectLink[];
  featured: boolean;
  sort: number;
  visible: boolean;
};

// What the public pages receive: the stored fields plus whether a write-up
// exists (it decides if the Details button shows)
export type Project = StoredProject & { hasDetails: boolean };

// What the dashboard form edits. Featured, visible and order have their own
// controls in the list (D102).
export type ProjectContent = Omit<
  StoredProject,
  "featured" | "sort" | "visible"
>;

// One project's write-up for the overlay, with the fields shown next to it
// (D113, D124). `categoryLabel` resolves from any category, hidden ones too.
export type ProjectDetailsEntry = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  status: ProjectStatus;
  categoryLabel: string;
  logoUrl: string | null;
  tech: string[];
  links: ProjectLink[];
  details: ProjectDetails;
};
