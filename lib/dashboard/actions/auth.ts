"use server";

import { signOut } from "@/lib/auth";

// The one dashboard action without an admin check: signing out is harmless
// for anyone, and it must work even when the session is already invalid.
export async function signOutAdmin() {
  await signOut({ redirectTo: "/dashboard/login" });
}
