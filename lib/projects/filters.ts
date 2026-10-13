import type { ProjectStatus } from "@/types/projects";

export const PROJECT_STATUS_LABELS: Record<ProjectStatus, string> = {
  live: "Live",
  "in-progress": "In progress",
  planned: "Planned",
  completed: "Completed",
};
