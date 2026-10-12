import type { FieldErrors } from "@/types/action";

// First message per field. rename() folds server paths such as "chips.2"
// into the name of the form control that shows them.
export function toFormErrors(
  fieldErrors: FieldErrors = {},
  rename: (key: string) => string = (key) => key,
): Record<string, string> {
  const out: Record<string, string> = {};
  for (const [key, messages] of Object.entries(fieldErrors)) {
    const name = rename(key);
    const message = messages[0];
    if (message !== undefined && out[name] === undefined) out[name] = message;
  }
  return out;
}
