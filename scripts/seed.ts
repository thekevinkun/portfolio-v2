import { loadEnvConfig } from "@next/env";
import type { z } from "zod";
import * as seed from "@/data/seed";
import * as t from "@/lib/db/schema";
import { categorySchema } from "@/validators/categories";
import { experienceItemSchema } from "@/validators/experience";
import { profileSchema } from "@/validators/profile";
import { projectSchema } from "@/validators/projects";
import { skillGroupSchema } from "@/validators/skills";

// Same loader as drizzle.config.ts. lib/db is imported later, inside main(),
// because lib/env.ts reads process.env the moment it is imported.
loadEnvConfig(process.cwd());

const FLAGS = ["--update", "--check", "--yes-overwrite"];

// Validates every row and records problems instead of stopping at the first
function validateRows<T extends { slug: string }>(
  label: string,
  schema: z.ZodType<T>,
  rows: readonly unknown[],
  errors: string[],
): T[] {
  const valid: T[] = [];
  const seen = new Set<string>();

  rows.forEach((row, index) => {
    const name = (row as { slug?: string }).slug ?? String(index);
    const result = schema.safeParse(row);

    if (!result.success) {
      for (const issue of result.error.issues) {
        const path = issue.path.map(String).join(".") || "(row)";
        errors.push(`${label}[${name}] ${path}: ${issue.message}`);
      }
      return;
    }

    // onConflictDoNothing would hide a duplicate slug, so catch it here
    if (seen.has(result.data.slug)) {
      errors.push(`${label}[${name}] slug is duplicated`);
      return;
    }
    seen.add(result.data.slug);
    valid.push(result.data);
  });

  return valid;
}

async function run<R>(
  label: string,
  rows: readonly R[],
  write: (row: R) => Promise<boolean>,
) {
  let written = 0;
  for (const row of rows) {
    if (await write(row)) written += 1;
  }
  console.log(`${label}: ${written} written, ${rows.length - written} skipped`);
}

async function main() {
  const args = process.argv.slice(2);
  const unknown = args.filter((arg) => !FLAGS.includes(arg));
  if (unknown.length > 0) {
    throw new Error(
      `Unknown option: ${unknown.join(", ")} (use ${FLAGS.join(" or ")})`,
    );
  }
  const update = args.includes("--update");
  const checkOnly = args.includes("--check");

  // --update overwrites every row, dashboard edits included (D97)
  if (update && !checkOnly && !args.includes("--yes-overwrite")) {
    throw new Error(
      "--update overwrites every row and erases dashboard edits. Add --yes-overwrite if you really want that.",
    );
  }

  const errors: string[] = [];
  const profileResult = profileSchema.safeParse(seed.profile);
  if (!profileResult.success) {
    for (const issue of profileResult.error.issues) {
      const path = issue.path.map(String).join(".") || "(row)";
      errors.push(`profile ${path}: ${issue.message}`);
    }
  }
  const skillRows = validateRows(
    "skill_groups",
    skillGroupSchema,
    seed.skillGroups,
    errors,
  );
  const categoryRows = validateRows(
    "project_categories",
    categorySchema,
    seed.categories,
    errors,
  );
  const projectRows = validateRows(
    "projects",
    projectSchema,
    seed.projects,
    errors,
  );

  // A project's filter must be one of the seeded categories
  const categorySlugs = new Set(categoryRows.map((category) => category.slug));
  for (const project of projectRows) {
    if (!categorySlugs.has(project.filter)) {
      errors.push(
        `projects[${project.slug}] filter "${project.filter}" is not a category`,
      );
    }
  }
  const experienceRows = validateRows(
    "experience_items",
    experienceItemSchema,
    seed.experienceItems,
    errors,
  );

  if (errors.length > 0 || !profileResult.success) {
    console.error(
      `Seed data is invalid, nothing was written:\n- ${errors.join("\n- ")}`,
    );
    process.exit(1);
  }

  console.log(
    `Valid: profile 1, skill_groups ${skillRows.length}, project_categories ${categoryRows.length}, projects ${projectRows.length}, experience_items ${experienceRows.length}`,
  );
  if (checkOnly) return;

  console.log(
    update
      ? "Mode: --update (overwrites existing rows)"
      : "Mode: add missing rows only",
  );

  const { db } = await import("@/lib/db");
  const { env } = await import("@/lib/env");
  // Which database is this about to write to? (no password is printed)
  console.log(`Database host: ${new URL(env.DATABASE_URL).host}`);

  // id is fixed to 1 (profile_singleton)
  const profileRow = { id: 1, ...profileResult.data };
  await run("profile", [profileRow], async (row) => {
    const insert = db.insert(t.profile).values(row);
    const done = update
      ? await insert
          .onConflictDoUpdate({ target: t.profile.id, set: row })
          .returning({ id: t.profile.id })
      : await insert
          .onConflictDoNothing({ target: t.profile.id })
          .returning({ id: t.profile.id });
    return done.length > 0;
  });

  await run("skill_groups", skillRows, async (row) => {
    const insert = db.insert(t.skillGroups).values(row);
    const done = update
      ? await insert
          .onConflictDoUpdate({ target: t.skillGroups.slug, set: row })
          .returning({ id: t.skillGroups.id })
      : await insert
          .onConflictDoNothing({ target: t.skillGroups.slug })
          .returning({ id: t.skillGroups.id });
    return done.length > 0;
  });

  await run("project_categories", categoryRows, async (row) => {
    const insert = db.insert(t.projectCategories).values(row);
    const done = update
      ? await insert
          .onConflictDoUpdate({ target: t.projectCategories.slug, set: row })
          .returning({ id: t.projectCategories.id })
      : await insert
          .onConflictDoNothing({ target: t.projectCategories.slug })
          .returning({ id: t.projectCategories.id });
    return done.length > 0;
  });

  await run("projects", projectRows, async (row) => {
    const insert = db.insert(t.projects).values(row);
    const done = update
      ? await insert
          .onConflictDoUpdate({ target: t.projects.slug, set: row })
          .returning({ id: t.projects.id })
      : await insert
          .onConflictDoNothing({ target: t.projects.slug })
          .returning({ id: t.projects.id });
    return done.length > 0;
  });

  // undefined would be skipped by --update, so optional fields become explicit nulls
  const experienceDbRows = experienceRows.map((item) => ({
    ...item,
    summaryShort: item.summaryShort ?? null,
    shipped: item.shipped ?? null,
  }));
  await run("experience_items", experienceDbRows, async (row) => {
    const insert = db.insert(t.experienceItems).values(row);
    const done = update
      ? await insert
          .onConflictDoUpdate({ target: t.experienceItems.slug, set: row })
          .returning({ id: t.experienceItems.id })
      : await insert
          .onConflictDoNothing({ target: t.experienceItems.slug })
          .returning({ id: t.experienceItems.id });
    return done.length > 0;
  });
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
