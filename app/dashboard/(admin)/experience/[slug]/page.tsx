import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ExperienceForm from "@/components/dashboard/ExperienceForm";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminExperienceItemBySlug } from "@/lib/db/admin-queries";

export const metadata: Metadata = { title: "Edit experience" };

export default async function EditExperiencePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();
  const { slug } = await params;
  const item = await getAdminExperienceItemBySlug(slug);
  if (!item) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8 lg:px-10 lg:py-12">
      <header className="mb-8">
        <Link
          href="/dashboard/experience"
          className="text-xs text-fg-low hover:text-fg-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ← Experience
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-fg-high">
          {item.title}
        </h1>
      </header>
      <ExperienceForm item={item} />
    </div>
  );
}
