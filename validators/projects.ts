import { z } from "zod";
import {
  PROJECT_LINK_KINDS,
  PROJECT_STATUSES,
  type ProjectContent,
  type StoredProject,
} from "@/types/projects";
import { assetUrl, httpUrl, nonEmpty, slugSchema, sortOrder } from "./shared";

export const projectLinkSchema = z.strictObject({
  kind: z.enum(PROJECT_LINK_KINDS),
  label: nonEmpty,
  url: httpUrl,
});

// "new" is the create route, so it can't be a slug
const projectSlug = slugSchema.refine(
  (slug) => slug !== "new",
  "This slug is reserved",
);

// Everything the form edits (D89). Both schemas below build from this.
const contentShape = {
  slug: projectSlug,
  title: nonEmpty,
  kicker: nonEmpty,
  summary: nonEmpty,
  filter: slugSchema,
  status: z.enum(PROJECT_STATUSES),
  iconUrl: assetUrl.nullable(),
  logoUrl: assetUrl.nullable(),
  tech: z.array(nonEmpty).min(1),
  links: z.array(projectLinkSchema),
};

// R4: "live" means deployed and reachable
const liveNeedsLink = (project: {
  status: string;
  links: { kind: string }[];
}) =>
  project.status !== "live" ||
  project.links.some((link) => link.kind === "live");

const liveRule = {
  message: 'A live project needs a link of kind "live"',
  path: ["links"],
};

// The dashboard form: no featured, sort or visible
export const projectFormSchema = z
  .strictObject(contentShape)
  .refine(liveNeedsLink, liveRule) satisfies z.ZodType<ProjectContent>;

// A full row, as the database and the seed hold it
export const projectSchema = z
  .strictObject({
    ...contentShape,
    featured: z.boolean(),
    sort: sortOrder,
    visible: z.boolean(),
  })
  .refine(liveNeedsLink, liveRule) satisfies z.ZodType<StoredProject>;
