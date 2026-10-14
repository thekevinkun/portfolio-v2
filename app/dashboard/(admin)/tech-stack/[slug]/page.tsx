import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import SkillGroupForm from "@/components/dashboard/SkillGroupForm";
import { requireAdmin } from "@/lib/auth/require-admin";
import { getAdminSkillGroupBySlug } from "@/lib/db/admin-queries";

export const metadata: Metadata = { title: "Edit tech stack group" };

export default async function EditSkillGroupPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  await requireAdmin();
  const { slug } = await params;
  const group = await getAdminSkillGroupBySlug(slug);
  if (!group) notFound();

  return (
    <div className="mx-auto w-full max-w-3xl px-6 py-8 lg:px-10 lg:py-12">
      <header className="mb-8">
        <Link
          href="/dashboard/tech-stack"
          className="text-xs text-fg-low hover:text-fg-high focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
        >
          ← Tech Stack
        </Link>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-fg-high">
          {group.title}
        </h1>
      </header>
      <SkillGroupForm group={group} />
    </div>
  );
}
