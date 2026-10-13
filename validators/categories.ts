import { z } from "zod";
import { MAX_CATEGORY_LABEL } from "@/types/limits";
import type { ProjectCategory } from "@/types/projects";
import { nonEmpty, slugSchema, sortOrder } from "./shared";

export const categorySchema = z.strictObject({
  slug: slugSchema,
  label: nonEmpty.max(MAX_CATEGORY_LABEL),
  sort: sortOrder,
  visible: z.boolean(),
}) satisfies z.ZodType<ProjectCategory>;

// What the dashboard forms send: sort and visible have their own controls
export const categoryFormSchema = categorySchema.omit({
  sort: true,
  visible: true,
});
