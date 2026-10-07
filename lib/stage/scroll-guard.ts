const SCROLLABLE_OVERFLOW = new Set(["auto", "scroll", "overlay"]);

// True when the wheel should scroll something inside the page instead of turning it:
// an element marked data-stage-scroll, or a scrollable ancestor with room to move.
// Called once per gesture, so the getComputedStyle walk stays cheap.
export function canInnerScroll(
  target: EventTarget | null,
  dy: number,
): boolean {
  let el = target instanceof Element ? target : null;

  while (el) {
    if (el.hasAttribute("data-stage-scroll")) return true;

    const { overflowY } = getComputedStyle(el);
    if (
      SCROLLABLE_OVERFLOW.has(overflowY) &&
      el.scrollHeight > el.clientHeight + 1
    ) {
      const atTop = el.scrollTop <= 0;
      const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
      // At its edge the element gives up; the next gesture can turn the page
      if (dy > 0 ? !atBottom : !atTop) return true;
    }
    el = el.parentElement;
  }
  return false;
}
