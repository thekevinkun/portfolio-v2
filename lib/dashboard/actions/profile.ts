"use server";

import { eq } from "drizzle-orm";
import { deleteBlobs, isBlobUrl } from "@/lib/blob/cleanup";
import { db } from "@/lib/db";
import * as t from "@/lib/db/schema";
import { profileSchema } from "@/validators/profile";
import { adminAction, fail, ok } from "../admin-action";

// The same strict schema the seed uses (D89)
export const updateProfile = adminAction(profileSchema, async (input) => {
  // What the row holds now, to find files this save replaces or removes
  const [before] = await db
    .select({
      avatarUrl: t.profile.avatarUrl,
      portraitUrl: t.profile.portraitUrl,
      resumeUrl: t.profile.resumeUrl,
    })
    .from(t.profile)
    .where(eq(t.profile.id, 1));

  const updated = await db
    .update(t.profile)
    .set(input)
    .where(eq(t.profile.id, 1))
    .returning({ id: t.profile.id });

  if (updated.length === 0) {
    return fail("The profile row is missing. Run npm run db:seed.");
  }

  // Delete only after the save succeeded (D94)
  if (before) {
    const pairs: [string | null, string | null][] = [
      [before.avatarUrl, input.avatarUrl],
      [before.portraitUrl, input.portraitUrl],
      [before.resumeUrl, input.resumeUrl],
    ];
    const replaced = pairs.flatMap(([old, next]) =>
      old !== null && old !== next && isBlobUrl(old) ? [old] : [],
    );
    await deleteBlobs(replaced);
  }

  return ok();
});
