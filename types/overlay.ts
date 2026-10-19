// closed → opening → open → closing → closed. Only "open" is visible, so the
// same CSS transition plays for opening and closing (D115).
export type OverlayPhase = "closed" | "opening" | "open" | "closing";

export interface ProjectDetailsContextValue {
  /** Opens the details of a project that has them; ignored for any other slug */
  open: (slug: string) => void;
  /** Closes the overlay, through Back when a history entry was added (D116) */
  close: () => void;
}
