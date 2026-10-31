// The order is the display order on Get In Touch (D135)
export const SOCIAL_KINDS = ["linkedin", "upwork", "github"] as const;
export type SocialKind = (typeof SOCIAL_KINDS)[number];

export interface SocialLink {
  kind: SocialKind;
  label: string;
  url: string;
}

export interface Profile {
  name: string;
  username: string;
  handle: string;
  locationLabel: string;
  timezone: string; // IANA id, e.g. "Asia/Jakarta"; drives the clock
  availability: string;
  availabilityShort: string;
  avatarUrl: string | null;
  roleLabel: string;
  headline: string;
  intro: string;
  contactHeadline: string; // Get In Touch statement
  contactIntro: string;
  email: string;
  portraitUrl: string | null;
  resumeUrl: string | null;
  socials: SocialLink[];
  chips: string[]; // Overview tech chips
  focusAreas: string[]; // Overview focus pills
  seoTitle: string; // site-wide default <title> (P4.5)
  seoDescription: string; // site-wide default meta description
}
