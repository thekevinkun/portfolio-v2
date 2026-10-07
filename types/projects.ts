export type ProjectFilter =
  | "full-stack"
  | "frontend"
  | "game"
  | "web3"
  | "systems";

// live = deployed and reachable · completed = finished, repo only
export type ProjectStatus = "live" | "in-progress" | "planned" | "completed";

export type ProjectLinkKind = "live" | "repo";

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
