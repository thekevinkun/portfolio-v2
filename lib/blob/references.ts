import { eq, or, sql } from "drizzle-orm";
import { db } from "@/lib/db";
import * as t from "@/lib/db/schema";

// True when a saved row points at this file: a profile file, or a project
// icon, logo or screenshot
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

  // Screenshots live inside the details JSON: containment finds a project
  // whose list has an entry with this url (D120). A null details is never true.
  const inScreenshots = sql`${t.projects.details} @> ${JSON.stringify({
    screenshots: [{ url }],
  })}::jsonb`;

  const [project] = await db
    .select({ id: t.projects.id })
    .from(t.projects)
    .where(
      or(
        eq(t.projects.iconUrl, url),
        eq(t.projects.logoUrl, url),
        inScreenshots,
      ),
    )
    .limit(1);
  return project !== undefined;
}
