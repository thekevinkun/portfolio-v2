import type { Metadata } from "next";
import { ButtonLink } from "@/components/ui";
import { ProfileForm } from "@/components/dashboard";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminProfile } from "@/lib/db/admin-queries";

export const metadata: Metadata = { title: "Profile" };

export default async function ProfilePage() {
  await requireAdmin();
  const profile = await getAdminProfile();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8 lg:px-10 lg:py-12">
      <header className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-fg-high">
            Profile
          </h1>
          <p className="mt-1 text-sm text-fg-low">
            Identity, copy, contact details and SEO shown across the site.
          </p>
        </div>
        <ButtonLink
          href="/"
          variant="secondary"
          size="sm"
          target="_blank"
          rel="noopener noreferrer"
        >
          View site ↗
        </ButtonLink>
      </header>
      <ProfileForm profile={profile} />
    </div>
  );
}
