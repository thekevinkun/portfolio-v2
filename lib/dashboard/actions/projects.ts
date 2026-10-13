"use server";

import { and, asc, count, eq } from "drizzle-orm";
import { z } from "zod";
import { deleteBlobs } from "@/lib/blob/cleanup";
import { isBlobUrl } from "@/lib/blob/url";
import { db } from "@/lib/db";
import * as t from "@/lib/db/schema";
import { MAX_FEATURED_PROJECTS } from "@/types/limits";
import { adminAction, fail, ok } from "../admin-action";

const CAP_MESSAGE = `Overview shows ${MAX_FEATURED_PROJECTS} featured projects. Turn off Featured on another visible project first.`;

// Visible and featured is what Overview shows (D48), so only those count
async function countFeaturedVisible(): Promise<number> {
  const [row] = await db
    .select({ value: count() })
    .from(t.projects)
    .where(and(eq(t.projects.visible, true), eq(t.projects.featured, true)));
  return row?.value ?? 0;
}

export const setProjectVisible = adminAction(
  z.object({ id: z.uuid(), visible: z.boolean() }),
  async ({ id, visible }) => {
    const [row] = await db
      .select({ visible: t.projects.visible, featured: t.projects.featured })
      .from(t.projects)
      .where(eq(t.projects.id, id));
    if (!row) return fail("Project not found.");

    // Showing a featured project adds one to the Overview three
    if (
      visible &&
      !row.visible &&
      row.featured &&
      (await countFeaturedVisible()) >= MAX_FEATURED_PROJECTS
    ) {
      return fail(CAP_MESSAGE);
    }

    await db.update(t.projects).set({ visible }).where(eq(t.projects.id, id));
    return ok();
  },
);

export const setProjectFeatured = adminAction(
  z.object({ id: z.uuid(), featured: z.boolean() }),
  async ({ id, featured }) => {
    const [row] = await db
      .select({ visible: t.projects.visible, featured: t.projects.featured })
      .from(t.projects)
      .where(eq(t.projects.id, id));
    if (!row) return fail("Project not found.");

    // A hidden project doesn't count until it is shown (checked there too)
    if (
      featured &&
      !row.featured &&
      row.visible &&
      (await countFeaturedVisible()) >= MAX_FEATURED_PROJECTS
    ) {
      return fail(CAP_MESSAGE);
    }

    await db.update(t.projects).set({ featured }).where(eq(t.projects.id, id));
    return ok();
  },
);

// Swaps with the neighbor in the same filter group, then renumbers sort in one
// batch (D91). Overview reads the global order, so a move inside a filter can
// also change the order of featured cards there.
export const moveProject = adminAction(
  z.object({ id: z.uuid(), direction: z.enum(["up", "down"]) }),
  async ({ id, direction }) => {
    const rows = await db
      .select({
        id: t.projects.id,
        filter: t.projects.filter,
        sort: t.projects.sort,
      })
      .from(t.projects)
      .orderBy(asc(t.projects.sort), asc(t.projects.slug));

    const index = rows.findIndex((row) => row.id === id);
    const current = rows[index];
    if (!current) return fail("Project not found.");

    // The nearest row in the same filter, in the direction of the move
    const step = direction === "up" ? -1 : 1;
    let target = -1;
    for (let i = index + step; i >= 0 && i < rows.length; i += step) {
      if (rows[i]?.filter === current.filter) {
        target = i;
        break;
      }
    }
    const other = rows[target];
    if (!other) return ok(); // already at the edge of its group

    const next = [...rows];
    next[index] = other;
    next[target] = current;

    // Only rows whose position changed are written
    const updates = next.flatMap((row, position) =>
      row.sort === position
        ? []
        : [
            db
              .update(t.projects)
              .set({ sort: position })
              .where(eq(t.projects.id, row.id)),
          ],
    );
    const [first, ...rest] = updates;
    if (first) await db.batch([first, ...rest]);
    return ok();
  },
);

export const deleteProject = adminAction(
  z.object({ id: z.uuid() }),
  async ({ id }) => {
    const [row] = await db
      .select({ logoUrl: t.projects.logoUrl })
      .from(t.projects)
      .where(eq(t.projects.id, id));
    if (!row) return fail("Project not found.");

    await db.delete(t.projects).where(eq(t.projects.id, id));

    // The logo file goes with the project (nothing uploads logos before P5.4b)
    if (row.logoUrl && isBlobUrl(row.logoUrl)) await deleteBlobs([row.logoUrl]);
    return ok();
  },
);
