import type { ReactNode } from "react";

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

export type StagePhase = "idle" | "transitioning" | "bouncing" | "cooldown";

// 0 only before the first move
export type StageDirection = -1 | 0 | 1;

export type StageSource = "initial" | "wheel" | "swipe" | "keyboard" | "dock";

export interface StageState {
  /** Target page. Set the moment a move starts, so dock/URL/live region can follow. */
  index: number;
  /** Page we are leaving */
  from: number;
  direction: StageDirection;
  phase: StagePhase;
  source: StageSource;
  bounce: StageDirection;
}

export type StageAction =
  | { type: "GO_TO"; index: number; source: StageSource }
  | { type: "STEP"; delta: 1 | -1; source: StageSource }
  | { type: "TRANSITION_END" }
  | { type: "BOUNCE_END" }
  | { type: "COOLDOWN_END" };

export interface StageContextValue {
  state: StageState;
  goTo: (index: number, source: StageSource) => void;
  step: (delta: 1 | -1, source: StageSource) => void;
  endTransition: () => void;
}

export interface StagePanelItem {
  id: SectionId;
  content: ReactNode;
}
