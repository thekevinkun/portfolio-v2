"use server";

import { asc, count, desc, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import * as t from "@/lib/db/schema";
import { categoryFormSchema } from "@/validators/categories";
import { adminAction, fail, ok } from "../admin-action";

// The slug comes from the label when the category is added and never changes
export const createCategory = adminAction(categoryFormSchema, async (input) => {
  const [existing] = await db
    .select({ id: t.projectCategories.id })
    .from(t.projectCategories)
    .where(eq(t.projectCategories.slug, input.slug));
  if (existing) {
    return fail("Please fix the highlighted fields.", {
      label: ["A category with this name already exists."],
    });
  }

  const [last] = await db
    .select({ sort: t.projectCategories.sort })
    .from(t.projectCategories)
    .orderBy(desc(t.projectCategories.sort))
    .limit(1);

  await db.insert(t.projectCategories).values({
    ...input,
    visible: true,
    sort: (last?.sort ?? -1) + 1,
  });
  return ok();
});

// Only the label can change; the slug identifies the category
export const updateCategory = adminAction(
  categoryFormSchema,
  async ({ slug, label }) => {
    const updated = await db
      .update(t.projectCategories)
      .set({ label })
      .where(eq(t.projectCategories.slug, slug))
      .returning({ id: t.projectCategories.id });
    if (updated.length === 0) return fail("Category not found.");
    return ok();
  },
);

export const setCategoryVisible = adminAction(
  z.object({ id: z.uuid(), visible: z.boolean() }),
  async ({ id, visible }) => {
    const updated = await db
      .update(t.projectCategories)
      .set({ visible })
      .where(eq(t.projectCategories.id, id))
      .returning({ id: t.projectCategories.id });
    if (updated.length === 0) return fail("Category not found.");
    return ok();
  },
);

// Swap with the neighbor, then renumber sort in one batch (D91)
export const moveCategory = adminAction(
  z.object({ id: z.uuid(), direction: z.enum(["up", "down"]) }),
  async ({ id, direction }) => {
    const rows = await db
      .select({ id: t.projectCategories.id, sort: t.projectCategories.sort })
      .from(t.projectCategories)
      .orderBy(asc(t.projectCategories.sort), asc(t.projectCategories.slug));

    const index = rows.findIndex((row) => row.id === id);
    const current = rows[index];
    if (!current) return fail("Category not found.");

    const targetIndex = index + (direction === "up" ? -1 : 1);
    const other = rows[targetIndex];
    if (!other) return ok(); // already at the edge

    const next = [...rows];
    next[index] = other;
    next[targetIndex] = current;

    const updates = next.flatMap((row, position) =>
      row.sort === position
        ? []
        : [
            db
              .update(t.projectCategories)
              .set({ sort: position })
              .where(eq(t.projectCategories.id, row.id)),
          ],
    );
    const [first, ...rest] = updates;
    if (first) await db.batch([first, ...rest]);
    return ok();
  },
);

export const deleteCategory = adminAction(
  z.object({ id: z.uuid() }),
  async ({ id }) => {
    const rows = await db
      .select({ id: t.projectCategories.id, slug: t.projectCategories.slug })
      .from(t.projectCategories);

    const row = rows.find((item) => item.id === id);
    if (!row) return fail("Category not found.");
    if (rows.length === 1) return fail("You need at least one category.");

    const [used] = await db
      .select({ value: count() })
      .from(t.projects)
      .where(eq(t.projects.filter, row.slug));
    const inUse = used?.value ?? 0;
    if (inUse > 0) {
      return fail(`Move or delete its ${inUse} project(s) first.`);
    }

    await db.delete(t.projectCategories).where(eq(t.projectCategories.id, id));
    return ok();
  },
);
