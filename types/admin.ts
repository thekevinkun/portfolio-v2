import type { ExperienceItem, ExperienceProject } from "@/types/experience";
import type { ProjectDetails } from "@/types/details";
import type { ProjectCategory, StoredProject } from "@/types/projects";
import type { SkillGroup } from "@/types/skills";

export interface AdminCounts {
  skillGroups: { total: number; hidden: number };
  projects: { total: number; hidden: number; featuredVisible: number };
  categories: { total: number; hidden: number };
  experience: { total: number; hidden: number };
}

// A project as the dashboard sees it: hidden rows too, with its id (D90)
export type AdminProject = StoredProject & {
  id: string;
  // The write-up the editor works on; null when there is none (D124)
  details: ProjectDetails | null;
};

// A category as the dashboard sees it: hidden ones too, with its id and how
// many projects use it
export type AdminCategory = ProjectCategory & {
  id: string;
  projectCount: number;
  visibleProjectCount: number;
};

// A skill group as the dashboard sees it: hidden ones too, with its id
export type AdminSkillGroup = SkillGroup & { id: string };

// An experience item as the dashboard sees it: the database holds null where
// the public type has an optional field
export type AdminExperienceItem = Omit<
  ExperienceItem,
  "summaryShort" | "shipped"
> & {
  id: string;
  summaryShort: string | null;
  shipped: ExperienceProject[] | null;
};
