import type { AdminCounts } from "@/types/admin";
import { db } from "./index";
import * as t from "./schema";

const hiddenCount = (rows: { visible: boolean }[]) =>
  rows.filter((row) => !row.visible).length;

// Admin reads see every row, hidden ones too (D90). The tables hold about a
// dozen rows each, so counting in JS beats three aggregate queries.
export async function getAdminCounts(): Promise<AdminCounts> {
  const [groups, projects, experience] = await Promise.all([
    db.select({ visible: t.skillGroups.visible }).from(t.skillGroups),
    db
      .select({ visible: t.projects.visible, featured: t.projects.featured })
      .from(t.projects),
    db.select({ visible: t.experienceItems.visible }).from(t.experienceItems),
  ]);

  return {
    skillGroups: { total: groups.length, hidden: hiddenCount(groups) },
    projects: {
      total: projects.length,
      hidden: hiddenCount(projects),
      featuredVisible: projects.filter((p) => p.visible && p.featured).length,
    },
    experience: { total: experience.length, hidden: hiddenCount(experience) },
  };
}
