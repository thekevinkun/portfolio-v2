"use server";

import { eq } from "drizzle-orm";
import { z } from "zod";
import { db } from "@/lib/db";
import * as t from "@/lib/db/schema";
import { detailsOrNull, projectDetailsSchema } from "@/validators/details";
import { slugSchema } from "@/validators/shared";
import { adminAction, fail, ok } from "../admin-action";

// The slug picks the row; the details replace the stored write-up
const inputSchema = z.strictObject({
  slug: slugSchema,
  details: projectDetailsSchema,
});

// An empty write-up is stored as null, so the project loses its Details
// button (D112). Nothing else on the row is touched.
export const updateProjectDetails = adminAction(
  inputSchema,
  async ({ slug, details }) => {
    const [row] = await db
      .select({ id: t.projects.id })
      .from(t.projects)
      .where(eq(t.projects.slug, slug));
    if (!row) return fail("Project not found.");

    await db
      .update(t.projects)
      .set({ details: detailsOrNull(details) })
      .where(eq(t.projects.slug, slug));
    return ok();
  },
);
