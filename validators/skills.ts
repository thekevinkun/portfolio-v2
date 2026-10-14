import { z } from "zod";
import {
  MAX_HIGHLIGHT_LENGTH,
  MAX_SKILL_HIGHLIGHTS,
  MAX_SKILL_ITEMS,
} from "@/types/limits";
import {
  SKILL_STATUSES,
  TECH_ICON_KEYS,
  type SkillGroup,
  type SkillGroupContent,
} from "@/types/skills";
import { nonEmpty, slugSchema, sortOrder } from "./shared";

const iconKey = z.enum(TECH_ICON_KEYS);

export const skillItemSchema = z.strictObject({
  name: nonEmpty,
  iconKey,
  status: z.enum(SKILL_STATUSES),
});

// Card limits (D52, D98): items and highlights per card, and highlights that
// fit one line
export const skillGroupSchema = z.strictObject({
  slug: slugSchema,
  indexLabel: nonEmpty,
  title: nonEmpty,
  subtitle: nonEmpty,
  badge: nonEmpty,
  iconKey,
  items: z
    .array(skillItemSchema)
    .min(1, "Add at least one item.")
    .max(MAX_SKILL_ITEMS, `At most ${MAX_SKILL_ITEMS} items.`),
  highlights: z
    .array(
      nonEmpty.max(
        MAX_HIGHLIGHT_LENGTH,
        `At most ${MAX_HIGHLIGHT_LENGTH} characters.`,
      ),
    )
    .max(MAX_SKILL_HIGHLIGHTS, `At most ${MAX_SKILL_HIGHLIGHTS} highlights.`),
  sort: sortOrder,
  visible: z.boolean(),
}) satisfies z.ZodType<SkillGroup>;

// The dashboard form: no sort or visible
export const skillGroupFormSchema = skillGroupSchema.omit({
  sort: true,
  visible: true,
}) satisfies z.ZodType<SkillGroupContent>;
