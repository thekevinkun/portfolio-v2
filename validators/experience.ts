import { z } from "zod";
import {
  EXPERIENCE_KINDS,
  type ExperienceItem,
  type ExperienceItemContent,
} from "@/types/experience";
import {
  MAX_EXPERIENCE_BULLETS,
  MAX_EXPERIENCE_TAGS,
  MAX_SHIPPED_BULLETS,
  MAX_SHIPPED_PROJECTS,
  MIN_SHIPPED_BULLETS,
} from "@/types/limits";
import { nonEmpty, slugSchema, sortOrder, yearMonth } from "./shared";

const SHIPPED_BULLETS_MESSAGE = `Use ${MIN_SHIPPED_BULLETS}–${MAX_SHIPPED_BULLETS} bullets.`;

// Each project keeps 3 to 5 bullets; the wide layout shows the first 3 (D56)
export const experienceProjectSchema = z.strictObject({
  name: nonEmpty,
  bullets: z
    .array(nonEmpty)
    .min(MIN_SHIPPED_BULLETS, SHIPPED_BULLETS_MESSAGE)
    .max(MAX_SHIPPED_BULLETS, SHIPPED_BULLETS_MESSAGE),
});

// Everything the dashboard form edits. Both schemas below build from this.
const contentShape = {
  slug: slugSchema,
  title: nonEmpty,
  organization: nonEmpty,
  startDate: yearMonth,
  endDate: yearMonth.nullable(),
  summary: nonEmpty,
  summaryShort: nonEmpty.optional(),
  bullets: z
    .array(nonEmpty)
    .max(MAX_EXPERIENCE_BULLETS, `At most ${MAX_EXPERIENCE_BULLETS} lines.`),
  shipped: z
    .array(experienceProjectSchema)
    .max(MAX_SHIPPED_PROJECTS, `At most ${MAX_SHIPPED_PROJECTS} projects.`)
    .optional(),
  tags: z
    .array(nonEmpty)
    .max(MAX_EXPERIENCE_TAGS, `At most ${MAX_EXPERIENCE_TAGS} tags.`),
};

// "YYYY-MM" strings sort the same as dates
const datesInOrder = (item: { startDate: string; endDate: string | null }) =>
  item.endDate === null || item.endDate >= item.startDate;

const datesRule = {
  message: "The end date is before the start date.",
  path: ["endDate"],
};

// The dashboard form: no kind, sort or visible
export const experienceItemFormSchema = z
  .strictObject(contentShape)
  .refine(datesInOrder, datesRule) satisfies z.ZodType<ExperienceItemContent>;

// A full row, as the database and the seed hold it
export const experienceItemSchema = z
  .strictObject({
    ...contentShape,
    kind: z.enum(EXPERIENCE_KINDS),
    sort: sortOrder,
    visible: z.boolean(),
  })
  .refine(datesInOrder, datesRule) satisfies z.ZodType<ExperienceItem>;
