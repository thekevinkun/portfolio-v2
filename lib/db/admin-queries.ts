import { asc, eq } from "drizzle-orm";
import * as t from "./schema";
import { db } from "./index";
import type { AdminCounts, AdminProject } from "@/types/admin";
import type { Profile } from "@/types/profile";

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

// Not parsed with the strict schema on purpose (D90): a hand-broken row must
// still open in the editor so it can be fixed.
export async function getAdminProfile(): Promise<Profile> {
  const [row] = await db.select().from(t.profile).where(eq(t.profile.id, 1));
  if (!row) throw new Error("The profile row is missing. Run npm run db:seed.");

  const { id, ...profile } = row;
  void id;
  return profile;
}

// Every project, hidden ones too, in the same order the public site uses
export async function getAdminProjects(): Promise<AdminProject[]> {
  return db
    .select()
    .from(t.projects)
    .orderBy(asc(t.projects.sort), asc(t.projects.slug));
}

export async function getAdminProjectBySlug(
  slug: string,
): Promise<AdminProject | null> {
  const [row] = await db
    .select()
    .from(t.projects)
    .where(eq(t.projects.slug, slug));
  return row ?? null;
}
