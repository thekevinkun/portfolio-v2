import { redirect } from "next/navigation";
import { auth } from "./index";
import { authEnv } from "./env";

// Compares against the env var on every call, so changing ADMIN_GITHUB_ID
// ends existing sessions (D83)
export async function getAdminSession() {
  const session = await auth();
  if (!session?.user || session.user.githubId !== authEnv.ADMIN_GITHUB_ID) {
    return null;
  }
  return session;
}

// Call this first in every dashboard page, layout and server action (D84)
export async function requireAdmin() {
  const session = await getAdminSession();
  if (!session) redirect("/dashboard/login");
  return session;
}
