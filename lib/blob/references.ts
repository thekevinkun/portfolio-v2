import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import * as t from "@/lib/db/schema";

// True when a saved row points at this file. Project logos join in P5.4b.
export async function isReferenced(url: string): Promise<boolean> {
  const [row] = await db
    .select({
      avatarUrl: t.profile.avatarUrl,
      portraitUrl: t.profile.portraitUrl,
      resumeUrl: t.profile.resumeUrl,
    })
    .from(t.profile)
    .where(eq(t.profile.id, 1));

  return (
    row !== undefined &&
    [row.avatarUrl, row.portraitUrl, row.resumeUrl].includes(url)
  );
}
