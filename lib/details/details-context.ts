"use client";

import { createContext, useContext } from "react";
import type { ProjectDetailsContextValue } from "@/types/overlay";

export const DetailsContext = createContext<ProjectDetailsContextValue | null>(
  null,
);

export function useProjectDetails(): ProjectDetailsContextValue {
  const value = useContext(DetailsContext);
  if (!value) {
    throw new Error(
      "useProjectDetails must be used inside <ProjectDetailsProvider>",
    );
  }
  return value;
}
