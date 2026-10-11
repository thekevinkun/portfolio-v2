import { env } from "@/lib/env";
import type { Profile } from "@/types/profile";

// schema.org Person. Only facts already visible on the site (R4): no email, no address.
export function buildPersonJsonLd(profile: Profile) {
  const portrait = profile.portraitUrl;
  const image = portrait?.startsWith("/")
    ? `${env.SITE_URL}${portrait}`
    : portrait;

  return {
    "@context": "https://schema.org",
    "@type": "Person",
    name: profile.name,
    url: env.SITE_URL,
    jobTitle: profile.roleLabel,
    description: profile.seoDescription,
    ...(image ? { image } : {}),
    sameAs: profile.socials.map((social) => social.url),
  };
}

// "<" is escaped so a value like "</script>" can never close the tag
export function toJsonLdString(data: object): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
