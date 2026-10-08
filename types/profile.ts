export interface SocialLink {
  kind: "linkedin" | "github";
  label: string;
  url: string;
}

export interface Profile {
  name: string;
  handle: string;
  locationLabel: string;
  timezone: string; // IANA id, e.g. "Asia/Jakarta"; drives the clock
  availability: string;
  avatarUrl: string | null;
  roleLabel: string;
  headline: string;
  intro: string;
  email: string;
  portraitUrl: string | null;
  resumeUrl: string | null;
  socials: SocialLink[];
  chips: string[]; // Overview tech chips
  focusAreas: string[]; // Overview focus pills
}