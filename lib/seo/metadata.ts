import type { Metadata } from "next";
import { getSectionTitle } from "@/lib/stage/section-title";
import type { Profile } from "@/types/profile";
import type { Section } from "@/types/stage";

// File in public/, 1200x630
const OG_IMAGE_PATH = "/og-image.jpg";

// Metadata for one URL: title, description, canonical (D30) and share tags.
// Relative URLs resolve against metadataBase from the root layout.
export function getSectionMetadata(
  section: Section,
  profile: Profile,
): Metadata {
  const title = getSectionTitle(section, profile);
  const description = profile.seoDescription;
  const alt = `${profile.name}, ${profile.roleLabel}`;

  return {
    title,
    description,
    alternates: { canonical: section.path },
    openGraph: {
      type: "website",
      url: section.path,
      siteName: profile.name,
      title,
      description,
      images: [{ url: OG_IMAGE_PATH, width: 1200, height: 630, alt }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: OG_IMAGE_PATH, alt }],
    },
  };
}
