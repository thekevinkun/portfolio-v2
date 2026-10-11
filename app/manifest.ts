import type { MetadataRoute } from "next";
import { getProfile } from "@/lib/db/queries";

// Keep in step with --color-canvas in app/globals.css
const THEME_COLOR = "#050505";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const profile = await getProfile();

  return {
    name: profile.name,
    short_name: profile.name,
    description: profile.seoDescription,
    start_url: "/",
    display: "standalone",
    background_color: THEME_COLOR,
    theme_color: THEME_COLOR,
    icons: [
      {
        src: "/android-chrome-192x192.png",
        sizes: "192x192",
        type: "image/png",
      },
      {
        src: "/android-chrome-512x512.png",
        sizes: "512x512",
        type: "image/png",
      },
    ],
  };
}
