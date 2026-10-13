import type { Project } from "@/types/projects";

export interface AdminCounts {
  skillGroups: { total: number; hidden: number };
  projects: { total: number; hidden: number; featuredVisible: number };
  experience: { total: number; hidden: number };
}

// A project as the dashboard sees it: hidden rows too, with its id (D90)
export type AdminProject = Project & { id: string };
