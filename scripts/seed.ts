import { loadEnvConfig } from "@next/env";
import type { z } from "zod";
import * as seed from "@/data/seed";
import * as t from "@/lib/db/schema";
import { experienceItemSchema } from "@/validators/experience";
import { profileSchema } from "@/validators/profile";
import { projectSchema } from "@/validators/projects";
import { skillGroupSchema } from "@/validators/skills";

// Same loader as drizzle.config.ts. lib/db is imported later, inside main(),
// because lib/env.ts reads process.env the moment it is imported.
loadEnvConfig(process.cwd());

const FLAGS = ["--update", "--check"];

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
  const projectRows = validateRows(
    "projects",
    projectSchema,
    seed.projects,
    errors,
  );
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
    `Valid: profile 1, skill_groups ${skillRows.length}, projects ${projectRows.length}, experience_items ${experienceRows.length}`,
  );
  if (checkOnly) return;

  console.log(
    update
      ? "Mode: --update (overwrites existing rows)"
      : "Mode: add missing rows only",
  );
  const { db } = await import("@/lib/db");

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
