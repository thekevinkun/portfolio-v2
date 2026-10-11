import { z } from "zod";
import {
  SKILL_STATUSES,
  TECH_ICON_KEYS,
  type SkillGroup,
} from "@/types/skills";
import { nonEmpty, slugSchema, sortOrder } from "./shared";

const iconKey = z.enum(TECH_ICON_KEYS);

export const skillItemSchema = z.strictObject({
  name: nonEmpty,
  iconKey,
  status: z.enum(SKILL_STATUSES),
});

// Card limits from D52: 5 items, 4 highlights that fit one line (~38 characters)
export const skillGroupSchema = z.strictObject({
  slug: slugSchema,
  indexLabel: nonEmpty,
  title: nonEmpty,
  subtitle: nonEmpty,
  badge: nonEmpty,
  iconKey,
  items: z.array(skillItemSchema).min(1).max(5),
  highlights: z.array(nonEmpty.max(40)).max(4),
  sort: sortOrder,
  visible: z.boolean(),
}) satisfies z.ZodType<SkillGroup>;
