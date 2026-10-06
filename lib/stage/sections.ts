import type { Section } from "@/types/stage";

// The five pages, in order. The Stage and the dock both read this list.
export const SECTIONS: readonly Section[] = [
  { id: "overview", path: "/", label: "Overview" },
  { id: "tech-stack", path: "/tech-stack", label: "Tech Stack" },
  { id: "projects", path: "/projects", label: "Projects" },
  { id: "experience", path: "/experience", label: "Experience" },
  { id: "contact", path: "/contact", label: "Get In Touch" },
] as const;
