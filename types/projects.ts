// One source for the DB enums, the Zod schemas and the TS unions (D64)
export const PROJECT_FILTERS = [
  "full-stack",
  "frontend",
  "game",
  "web3",
  "systems",
] as const;
export type ProjectFilter = (typeof PROJECT_FILTERS)[number];

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

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  summary: string;
  filter: ProjectFilter;
  status: ProjectStatus;
  logoUrl: string | null;
  tech: string[];
  links: ProjectLink[];
  featured: boolean;
  sort: number;
  visible: boolean;
};
