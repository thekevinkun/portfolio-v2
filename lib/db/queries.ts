import { asc, eq } from "drizzle-orm";
import { cache } from "react";
import type { z } from "zod";
import * as t from "./schema";
import { db } from "./index";
import { profileSchema } from "@/validators/profile";
import { projectSchema } from "@/validators/projects";
import { skillGroupSchema } from "@/validators/skills";
import { categorySchema } from "@/validators/categories";
import { experienceItemSchema } from "@/validators/experience";
import type { ExperienceItem } from "@/types/experience";
import type { Profile } from "@/types/profile";
import type { Project, ProjectCategory } from "@/types/projects";
import type { SkillGroup } from "@/types/skills";

// The strict schemas have no id field, so it is dropped before parsing
function withoutId<T extends { id: unknown }>(row: T): Omit<T, "id"> {
  const { id, ...rest } = row;
  void id;
  return rest;
}

// A bad row fails loudly here instead of rendering a broken page (D68)
function parseOrThrow<T>(
  label: string,
  schema: z.ZodType<T>,
  input: unknown,
): T {
  const result = schema.safeParse(input);
  if (result.success) return result.data;

  const detail = result.error.issues
    .map(
      (issue) =>
        `${issue.path.map(String).join(".") || "(row)"}: ${issue.message}`,
    )
    .join("; ");
  throw new Error(`Invalid ${label} in the database: ${detail}`);
}

async function loadProfile(): Promise<Profile> {
  const [row] = await db.select().from(t.profile).where(eq(t.profile.id, 1));
  if (!row) throw new Error("The profile row is missing. Run npm run db:seed.");
  return parseOrThrow("profile", profileSchema, withoutId(row));
}

async function loadSkillGroups(): Promise<SkillGroup[]> {
  const rows = await db
    .select()
    .from(t.skillGroups)
    .where(eq(t.skillGroups.visible, true))
    .orderBy(asc(t.skillGroups.sort), asc(t.skillGroups.slug));

  return rows.map((row) =>
    parseOrThrow(`skill_groups[${row.slug}]`, skillGroupSchema, withoutId(row)),
  );
}

async function loadProjects(): Promise<Project[]> {
  const rows = await db
    .select()
    .from(t.projects)
    .where(eq(t.projects.visible, true))
    .orderBy(asc(t.projects.sort), asc(t.projects.slug));

  return rows.map((row) =>
    parseOrThrow(`projects[${row.slug}]`, projectSchema, withoutId(row)),
  );
}

async function loadExperienceItems(): Promise<ExperienceItem[]> {
  const rows = await db
    .select()
    .from(t.experienceItems)
    .where(eq(t.experienceItems.visible, true))
    .orderBy(asc(t.experienceItems.sort), asc(t.experienceItems.slug));

  return rows.map((row) => {
    // The types use optional fields; the database uses null
    const { summaryShort, shipped, ...rest } = withoutId(row);
    return parseOrThrow(`experience_items[${row.slug}]`, experienceItemSchema, {
      ...rest,
      summaryShort: summaryShort ?? undefined,
      shipped: shipped ?? undefined,
    });
  });
}

// Visible categories in tab order; the Projects page keeps those with projects
async function loadCategories(): Promise<ProjectCategory[]> {
  const rows = await db
    .select()
    .from(t.projectCategories)
    .where(eq(t.projectCategories.visible, true))
    .orderBy(asc(t.projectCategories.sort), asc(t.projectCategories.slug));

  return rows.map((row) =>
    parseOrThrow(
      `project_categories[${row.slug}]`,
      categorySchema,
      withoutId(row),
    ),
  );
}

async function loadStageData() {
  const [profile, skillGroups, categories, projects, experienceItems] =
    await Promise.all([
      getProfile(),
      getSkillGroups(),
      getCategories(),
      getProjects(),
      getExperienceItems(),
    ]);
  return { profile, skillGroups, categories, projects, experienceItems };
}

// cache() shares one query per request, so the layout and the page don't
// each hit the database for the profile
export const getProfile = cache(loadProfile);
export const getSkillGroups = cache(loadSkillGroups);
export const getCategories = cache(loadCategories);
export const getProjects = cache(loadProjects);
export const getExperienceItems = cache(loadExperienceItems);
export const getStageData = cache(loadStageData);
