"use server";

import { asc, count, eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import * as t from "@/lib/db/schema";
import { skillGroupFormSchema } from "@/validators/skills";
import { adminAction, fail, ok } from "../admin-action";

// The slug identifies the group and never changes; sort and visible are not
// touched here. There is no create or delete (D92).
export const updateSkillGroup = adminAction(
  skillGroupFormSchema,
  async ({ slug, ...content }) => {
    const updated = await db
      .update(t.skillGroups)
      .set(content)
      .where(eq(t.skillGroups.slug, slug))
      .returning({ id: t.skillGroups.id });
    if (updated.length === 0) return fail("Group not found.");
    return ok();
  },
);

export const setSkillGroupVisible = adminAction(
  z.object({ id: z.uuid(), visible: z.boolean() }),
  async ({ id, visible }) => {
    const [row] = await db
      .select({ visible: t.skillGroups.visible })
      .from(t.skillGroups)
      .where(eq(t.skillGroups.id, id));
    if (!row) return fail("Group not found.");

    // The public page always needs at least one card
    if (!visible && row.visible) {
      const [shown] = await db
        .select({ value: count() })
        .from(t.skillGroups)
        .where(eq(t.skillGroups.visible, true));
      if ((shown?.value ?? 0) <= 1) {
        return fail("At least one group must stay visible.");
      }
    }

    await db
      .update(t.skillGroups)
      .set({ visible })
      .where(eq(t.skillGroups.id, id));
    return ok();
  },
);

// Swap with the neighbor, then renumber sort in one batch (D91)
export const moveSkillGroup = adminAction(
  z.object({ id: z.uuid(), direction: z.enum(["up", "down"]) }),
  async ({ id, direction }) => {
    const rows = await db
      .select({ id: t.skillGroups.id, sort: t.skillGroups.sort })
      .from(t.skillGroups)
      .orderBy(asc(t.skillGroups.sort), asc(t.skillGroups.slug));

    const index = rows.findIndex((row) => row.id === id);
    const current = rows[index];
    if (!current) return fail("Group not found.");

    const targetIndex = index + (direction === "up" ? -1 : 1);
    const other = rows[targetIndex];
    if (!other) return ok(); // already at the edge

    const next = [...rows];
    next[index] = other;
    next[targetIndex] = current;

    // Only rows whose position changed are written
    const updates = next.flatMap((row, position) =>
      row.sort === position
        ? []
        : [
            db
              .update(t.skillGroups)
              .set({ sort: position })
              .where(eq(t.skillGroups.id, row.id)),
          ],
    );
    const [first, ...rest] = updates;
    if (first) await db.batch([first, ...rest]);
    return ok();
  },
);
