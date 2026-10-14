import type { Project, ProjectCategory } from "@/types/projects";
import type { SkillGroup } from "@/types/skills";

export interface AdminCounts {
  skillGroups: { total: number; hidden: number };
  projects: { total: number; hidden: number; featuredVisible: number };
  categories: { total: number; hidden: number };
  experience: { total: number; hidden: number };
}

// A project as the dashboard sees it: hidden rows too, with its id (D90)
export type AdminProject = Project & { id: string };

// A category as the dashboard sees it: hidden ones too, with its id and how
// many projects use it
export type AdminCategory = ProjectCategory & {
  id: string;
  projectCount: number;
  visibleProjectCount: number;
};

// A skill group as the dashboard sees it: hidden ones too, with its id
export type AdminSkillGroup = SkillGroup & { id: string };
