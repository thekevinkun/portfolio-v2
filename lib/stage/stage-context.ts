"use client";

import { createContext, useContext } from "react";
import type { StageContextValue } from "@/types/stage";

export const StageContext = createContext<StageContextValue | null>(null);

export function useStage(): StageContextValue {
  const value = useContext(StageContext);
  if (!value) throw new Error("useStage must be used inside <StageProvider>");
  return value;
}
