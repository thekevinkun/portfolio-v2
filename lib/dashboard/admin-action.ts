import type { z } from "zod";
import { requireAdmin } from "@/lib/auth/require-admin";
import type { ActionResult, FieldErrors } from "@/types/action";
import { revalidateSite } from "./revalidate";

export function ok(): ActionResult;
export function ok<T>(data: T): ActionResult<T>;
export function ok(data?: unknown): ActionResult<unknown> {
  return { ok: true, data };
}

export function fail(
  error: string,
  fieldErrors?: FieldErrors,
): ActionResult<never> {
  return { ok: false, error, fieldErrors };
}

// "socials.0.url" style keys; an issue on the whole object lands on "_form"
function toFieldErrors(error: z.ZodError): FieldErrors {
  const out: FieldErrors = {};
  for (const issue of error.issues) {
    const key = issue.path.map(String).join(".") || "_form";
    (out[key] ??= []).push(issue.message);
  }
  return out;
}

// Every dashboard mutation goes through here (D87): admin check, Zod parse,
// the write, then revalidation. User mistakes come back as a result, never a throw.
export function adminAction<TInput, TOutput, TData = undefined>(
  schema: z.ZodType<TOutput, TInput>,
  handler: (input: TOutput) => Promise<ActionResult<TData>>,
) {
  return async (input: TInput): Promise<ActionResult<TData>> => {
    // Outside the try: a redirect to the login page must not be swallowed
    await requireAdmin();

    const parsed = schema.safeParse(input);
    if (!parsed.success) {
      return fail(
        "Please fix the highlighted fields.",
        toFieldErrors(parsed.error),
      );
    }

    try {
      const result = await handler(parsed.data);
      if (result.ok) revalidateSite();
      return result;
    } catch (error) {
      console.error("Dashboard action failed:", error);
      return fail("Something went wrong. Please try again.");
    }
  };
}
