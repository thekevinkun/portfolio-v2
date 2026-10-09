export type ExperienceKind = "work" | "freelance" | "education" | "milestone";

export type ExperienceProject = {
  name: string;
  bullets: string[];
};

export type ExperienceItem = {
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
