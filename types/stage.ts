export type SectionId =
  | "overview"
  | "tech-stack"
  | "projects"
  | "experience"
  | "contact";

export interface Section {
  id: SectionId;
  path: string;
  label: string;
}