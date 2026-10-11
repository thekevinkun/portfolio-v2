import { z } from "zod";
import { SOCIAL_KINDS, type Profile } from "@/types/profile";
import { assetUrl, httpUrl, ianaTimezone, nonEmpty } from "./shared";

export const socialLinkSchema = z.strictObject({
  kind: z.enum(SOCIAL_KINDS),
  label: nonEmpty,
  url: httpUrl,
});

export const profileSchema = z.strictObject({
  name: nonEmpty,
  username: nonEmpty,
  handle: nonEmpty,
  locationLabel: nonEmpty,
  timezone: ianaTimezone,
  availability: nonEmpty,
  availabilityShort: nonEmpty,
  avatarUrl: assetUrl.nullable(),
  roleLabel: nonEmpty,
  headline: nonEmpty,
  intro: nonEmpty,
  contactHeadline: nonEmpty,
  contactIntro: nonEmpty,
  email: z.email(),
  portraitUrl: assetUrl.nullable(),
  resumeUrl: assetUrl.nullable(),
  socials: z.array(socialLinkSchema),
  chips: z.array(nonEmpty),
  focusAreas: z.array(nonEmpty),
  seoTitle: nonEmpty,
  seoDescription: nonEmpty,
}) satisfies z.ZodType<Profile>;
