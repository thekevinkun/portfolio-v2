"use server";

import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import * as t from "@/lib/db/schema";
import { profileSchema } from "@/validators/profile";
import { adminAction, fail, ok } from "../admin-action";

// The same strict schema the seed uses (D89). The file URLs travel unchanged
// until the uploads arrive in P5.3b.
export const updateProfile = adminAction(profileSchema, async (input) => {
  const updated = await db
    .update(t.profile)
    .set(input)
    .where(eq(t.profile.id, 1))
    .returning({ id: t.profile.id });

  if (updated.length === 0) {
    return fail("The profile row is missing. Run npm run db:seed.");
  }
  return ok();
});
