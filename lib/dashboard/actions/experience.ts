"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import * as t from "@/lib/db/schema";
import { experienceItemFormSchema } from "@/validators/experience";
import { adminAction, fail, ok } from "../admin-action";

// The slug identifies the item. The row's real kind decides which fields
// apply, so a Learning item never gets a Shipped list and a Work item never
// gets bullets (D56). Kind, sort and visible are not touched (D92).
export const updateExperienceItem = adminAction(
  experienceItemFormSchema,
  async (input) => {
    const [before] = await db
      .select({ kind: t.experienceItems.kind })
      .from(t.experienceItems)
      .where(eq(t.experienceItems.slug, input.slug));
    if (!before) return fail("Item not found.");

    const common = {
      title: input.title,
      organization: input.organization,
      startDate: input.startDate,
      endDate: input.endDate,
      summary: input.summary,
      tags: input.tags,
    };

    const values: Partial<typeof t.experienceItems.$inferInsert> =
      before.kind === "education"
        ? { ...common, bullets: input.bullets }
        : {
            ...common,
            summaryShort: input.summaryShort ?? null,
            shipped: input.shipped ?? [],
          };

    await db
      .update(t.experienceItems)
      .set(values)
      .where(eq(t.experienceItems.slug, input.slug));
    return ok();
  },
);
