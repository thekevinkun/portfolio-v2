import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import * as t from "@/lib/db/schema";

// True when a saved row points at this file: a profile file or a project logo
export async function isReferenced(url: string): Promise<boolean> {
  const [profileRow] = await db
    .select({
      avatarUrl: t.profile.avatarUrl,
      portraitUrl: t.profile.portraitUrl,
      resumeUrl: t.profile.resumeUrl,
    })
    .from(t.profile)
    .where(eq(t.profile.id, 1));

  if (
    profileRow &&
    [
      profileRow.avatarUrl,
      profileRow.portraitUrl,
      profileRow.resumeUrl,
    ].includes(url)
  ) {
    return true;
  }

  const [project] = await db
    .select({ id: t.projects.id })
    .from(t.projects)
    .where(eq(t.projects.logoUrl, url))
    .limit(1);
  return project !== undefined;
}
