import { z } from "zod";
import { YOUTUBE_ID_PATTERN, type ProjectDetails } from "@/types/details";
import {
  MAX_DETAIL_ALT,
  MAX_DETAIL_CAPTION,
  MAX_DETAIL_FEATURES,
  MAX_DETAIL_FEATURE_TEXT,
  MAX_DETAIL_FEATURE_TITLE,
  MAX_DETAIL_NOTES,
  MAX_DETAIL_NOTE_BODY,
  MAX_DETAIL_NOTE_TITLE,
  MAX_DETAIL_PROBLEM,
  MAX_DETAIL_ROLE,
  MAX_DETAIL_SCREENSHOTS,
  MAX_DETAIL_TIMEFRAME,
} from "@/types/limits";
import { assetUrl, nonEmpty } from "./shared";

// A trimmed, non-empty string with a length limit. The editor drops blank rows
// before sending (D109), so a blank string here is an error.
const limited = (max: number) =>
  nonEmpty.max(max, `At most ${max} characters.`);

const featureSchema = z.strictObject({
  title: limited(MAX_DETAIL_FEATURE_TITLE),
  text: limited(MAX_DETAIL_FEATURE_TEXT),
});

const noteSchema = z.strictObject({
  title: limited(MAX_DETAIL_NOTE_TITLE),
  body: limited(MAX_DETAIL_NOTE_BODY),
});

const screenshotSchema = z.strictObject({
  url: assetUrl,
  alt: limited(MAX_DETAIL_ALT),
  caption: limited(MAX_DETAIL_CAPTION).optional(),
});

// D112. The limits come from types/limits.ts, so the editor hints and this
// schema cannot drift.
export const projectDetailsSchema = z.strictObject({
  problem: limited(MAX_DETAIL_PROBLEM).optional(),
  role: limited(MAX_DETAIL_ROLE).optional(),
  timeframe: limited(MAX_DETAIL_TIMEFRAME).optional(),
  features: z
    .array(featureSchema)
    .max(MAX_DETAIL_FEATURES, `At most ${MAX_DETAIL_FEATURES} features.`),
  notes: z
    .array(noteSchema)
    .max(MAX_DETAIL_NOTES, `At most ${MAX_DETAIL_NOTES} notes.`),
  screenshots: z
    .array(screenshotSchema)
    .max(
      MAX_DETAIL_SCREENSHOTS,
      `At most ${MAX_DETAIL_SCREENSHOTS} screenshots.`,
    ),
  videoId: z
    .string()
    .regex(YOUTUBE_ID_PATTERN, "Expected an 11-character YouTube video id")
    .optional(),
}) satisfies z.ZodType<ProjectDetails>;

// An empty form is stored as null, so a project without a write-up has no
// "Details" button (D112)
export function detailsOrNull(details: ProjectDetails): ProjectDetails | null {
  const filled =
    details.problem !== undefined ||
    details.role !== undefined ||
    details.timeframe !== undefined ||
    details.videoId !== undefined ||
    details.features.length > 0 ||
    details.notes.length > 0 ||
    details.screenshots.length > 0;
  return filled ? details : null;
}
