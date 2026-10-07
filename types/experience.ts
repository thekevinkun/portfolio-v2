export type ExperienceKind = "work" | "freelance" | "education" | "milestone";

export type ExperienceItem = {
  kind: ExperienceKind;
  title: string;
  organization: string;
  // "YYYY-MM"
  startDate: string;
  // null = present
  endDate: string | null;
  summary: string;
  bullets: string[];
  tags: string[];
  sort: number;
  visible: boolean;
};
