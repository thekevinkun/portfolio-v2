// Project details (D112): the structured write-up shown in the project
// overlay. Stored as one nullable jsonb column on `projects`; a section shows
// only when it has content.

export type ProjectFeature = {
  title: string;
  text: string;
};

// A titled section about an engineering decision or trade-off
export type ProjectNote = {
  title: string;
  body: string;
};

export type ProjectScreenshot = {
  url: string;
  // Required: it is what a screen reader says
  alt: string;
  caption?: string;
};

// The lists are always present and may be empty. The text fields are left out
// when empty.
export type ProjectDetails = {
  problem?: string;
  role?: string;
  timeframe?: string;
  features: ProjectFeature[];
  notes: ProjectNote[];
  screenshots: ProjectScreenshot[];
  // Only the 11-character id is stored (D119)
  videoId?: string;
};

// One source for the editor and the validator
export const YOUTUBE_ID_PATTERN = /^[A-Za-z0-9_-]{11}$/;
