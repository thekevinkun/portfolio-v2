// Used only when --duration-overlay cannot be read (CSS owns the real value)
export const DEFAULT_OVERLAY_DURATION_MS = 400;

// Extra wait after the close transition before the dialog is closed
export const OVERLAY_CLOSE_PADDING_MS = 50;

// If history.back() never reports a popstate, the overlay closes anyway
export const HISTORY_BACK_FALLBACK_MS = 300;

// Used only when --duration-lightbox cannot be read (CSS owns the real value)
export const DEFAULT_LIGHTBOX_DURATION_MS = 250;

// The screenshots sit in the right column on desktop (about 40% of the width)
// and fill the width below 1024px
export const DETAILS_IMAGE_SIZES = "(min-width: 1024px) 40vw, 100vw";
