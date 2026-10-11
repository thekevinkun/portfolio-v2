import { z } from "zod";
import { EXPERIENCE_KINDS, type ExperienceItem } from "@/types/experience";
import { nonEmpty, slugSchema, sortOrder, yearMonth } from "./shared";

// Each project keeps 3 to 5 bullets; the wide layout shows the first 3 (D56)
export const experienceProjectSchema = z.strictObject({
  name: nonEmpty,
  bullets: z.array(nonEmpty).min(3).max(5),
});

export const experienceItemSchema = z
  .strictObject({
    slug: slugSchema,
    kind: z.enum(EXPERIENCE_KINDS),
    title: nonEmpty,
    organization: nonEmpty,
    startDate: yearMonth,
    endDate: yearMonth.nullable(),
    summary: nonEmpty,
    summaryShort: nonEmpty.optional(),
    bullets: z.array(nonEmpty),
    shipped: z.array(experienceProjectSchema).optional(),
    tags: z.array(nonEmpty),
    sort: sortOrder,
    visible: z.boolean(),
  })
  // "YYYY-MM" strings sort the same as dates
  .refine((item) => item.endDate === null || item.endDate >= item.startDate, {
    message: "endDate is before startDate",
    path: ["endDate"],
  }) satisfies z.ZodType<ExperienceItem>;
