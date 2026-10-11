import type { MetadataRoute } from "next";
import { env } from "@/lib/env";
import { SECTIONS } from "@/lib/stage/sections";

// No lastModified: there is no honest source for it until the dashboard (P5)
export default function sitemap(): MetadataRoute.Sitemap {
  return SECTIONS.map((section) => ({
    url: `${env.SITE_URL}${section.path}`,
  }));
}
