import type { ProjectCategory } from "@/types/projects";

// Seed input only: the five filters the site launched with (D44)
export const categories: ProjectCategory[] = [
  { slug: "full-stack", label: "Full Stack", sort: 0, visible: true },
  { slug: "frontend", label: "Frontend", sort: 1, visible: true },
  { slug: "game", label: "Game", sort: 2, visible: true },
  { slug: "web3", label: "Web3", sort: 3, visible: true },
  { slug: "systems", label: "C/C++", sort: 4, visible: true },
];
