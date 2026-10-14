export const EXPERIENCE_KINDS = [
  "work",
  "freelance",
  "education",
  "milestone",
] as const;
export type ExperienceKind = (typeof EXPERIENCE_KINDS)[number];

export type ExperienceProject = {
  name: string;
  bullets: string[];
};

export type ExperienceItem = {
  slug: string;
  kind: ExperienceKind;
  title: string;
  organization: string;
  // "YYYY-MM"
  startDate: string;
  // null = present
  endDate: string | null;
  summary: string;
  // Shorter text for the wide layout (optional)
  summaryShort?: string;
  bullets: string[];
  // What was done on each project (optional)
  shipped?: ExperienceProject[];
  tags: string[];
  sort: number;
  visible: boolean;
};

// What the dashboard form edits; the kind, order and visibility stay as they are
export type ExperienceItemContent = Omit<
  ExperienceItem,
  "kind" | "sort" | "visible"
>;
