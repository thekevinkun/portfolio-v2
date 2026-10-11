import { z } from "zod";
import {
  PROJECT_FILTERS,
  PROJECT_LINK_KINDS,
  PROJECT_STATUSES,
  type Project,
} from "@/types/projects";
import { assetUrl, httpUrl, nonEmpty, slugSchema, sortOrder } from "./shared";

export const projectLinkSchema = z.strictObject({
  kind: z.enum(PROJECT_LINK_KINDS),
  label: nonEmpty,
  url: httpUrl,
});

export const projectSchema = z
  .strictObject({
    slug: slugSchema,
    title: nonEmpty,
    kicker: nonEmpty,
    summary: nonEmpty,
    filter: z.enum(PROJECT_FILTERS),
    status: z.enum(PROJECT_STATUSES),
    logoUrl: assetUrl.nullable(),
    tech: z.array(nonEmpty).min(1),
    links: z.array(projectLinkSchema),
    featured: z.boolean(),
    sort: sortOrder,
    visible: z.boolean(),
  })
  // R4: "live" means deployed and reachable
  .refine(
    (project) =>
      project.status !== "live" ||
      project.links.some((link) => link.kind === "live"),
    { message: 'A live project needs a link of kind "live"', path: ["links"] },
  ) satisfies z.ZodType<Project>;
