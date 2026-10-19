// While a modal overlay is open (the project details, D117) the Stage must not
// react to wheel, keys or swipes. The overlay sets an attribute on <html>; the
// input hooks check it.
const LOCK_ATTRIBUTE = "data-stage-locked";

export function lockStage(): void {
  document.documentElement.setAttribute(LOCK_ATTRIBUTE, "");
}

export function unlockStage(): void {
  document.documentElement.removeAttribute(LOCK_ATTRIBUTE);
}

export function isStageLocked(): boolean {
  return document.documentElement.hasAttribute(LOCK_ATTRIBUTE);
}
