import type { Profile } from "@/types/profile";

type StringKeys = {
  [K in keyof Profile]: Profile[K] extends string ? K : never;
}[keyof Profile];

// Text fields plus the two string lists, edited one item per line
export type FieldKey = StringKeys | "chips" | "focusAreas";

export interface FieldConfig {
  name: FieldKey;
  label: string;
  hint?: string;
  // Set for a multi-line field
  rows?: number;
  type?: "text" | "email";
}

export interface FieldSection {
  title: string;
  fields: FieldConfig[];
}

// Rendered above the links section
export const PRIMARY_SECTIONS: FieldSection[] = [
  {
    title: "Identity",
    fields: [
      { name: "name", label: "Full name" },
      { name: "username", label: "Username" },
      { name: "handle", label: "Handle" },
      { name: "roleLabel", label: "Role label" },
    ],
  },
  {
    title: "Overview",
    fields: [
      { name: "headline", label: "Headline" },
      { name: "intro", label: "Intro", rows: 4 },
      { name: "chips", label: "Tech chips", rows: 4, hint: "One per line." },
      {
        name: "focusAreas",
        label: "Focus pills",
        rows: 4,
        hint: "One per line.",
      },
    ],
  },
  {
    title: "Get In Touch",
    fields: [
      { name: "contactHeadline", label: "Statement" },
      { name: "contactIntro", label: "Intro", rows: 4 },
      { name: "email", label: "Email", type: "email" },
    ],
  },
];

// Rendered below the links section
export const SECONDARY_SECTIONS: FieldSection[] = [
  {
    title: "Location & availability",
    fields: [
      { name: "locationLabel", label: "Location label" },
      {
        name: "timezone",
        label: "Timezone",
        hint: "IANA id, for example Asia/Makassar. Drives the live clock.",
      },
      { name: "availability", label: "Availability" },
      { name: "availabilityShort", label: "Short availability" },
    ],
  },
  {
    title: "SEO",
    fields: [
      { name: "seoTitle", label: "Site title" },
      {
        name: "seoDescription",
        label: "Site description",
        rows: 3,
        hint: "Used for the Overview title and as the description on every page.",
      },
    ],
  },
];
