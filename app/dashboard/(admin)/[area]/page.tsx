import { notFound } from "next/navigation";
import { requireAdmin } from "@/lib/auth/require-admin";

// Which step builds each editor. Real routes (profile/, projects/ ...) win
// over this dynamic one automatically; the file goes away in P5.7.
const STEPS: Record<string, { label: string; step: string } | undefined> = {
  profile: { label: "Profile", step: "P5.3" },
  "tech-stack": { label: "Tech Stack", step: "P5.5" },
  projects: { label: "Projects", step: "P5.4" },
  experience: { label: "Experience", step: "P5.6" },
};

export default async function ComingSoonPage({
  params,
}: {
  params: Promise<{ area: string }>;
}) {
  await requireAdmin();
  const { area } = await params;
  const entry = STEPS[area];
  if (!entry) notFound();

  return (
    <div className="mx-auto w-full max-w-5xl px-6 py-8 lg:px-10 lg:py-12">
      <h1 className="text-3xl font-bold tracking-tight text-fg-high">
        {entry.label}
      </h1>
      <p className="mt-2 text-sm text-fg-low">
        This editor arrives in {entry.step}.
      </p>
    </div>
  );
}
