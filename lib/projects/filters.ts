import type { ProjectFilter, ProjectStatus } from "@/types/projects";

// Pill order and labels. `systems` shows as "C/C++" (the filter type is
// broader than the label, see D44).
export const PROJECT_FILTERS: readonly { id: ProjectFilter; label: string }[] =
  [
    { id: "full-stack", label: "Full Stack" },
    { id: "frontend", label: "Frontend" },
    { id: "game", label: "Game" },
    { id: "web3", label: "Web3" },
    { id: "systems", label: "C/C++" },
  ];

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  live: "Live",
  "in-progress": "In progress",
  planned: "Planned",
  completed: "Completed",
};
