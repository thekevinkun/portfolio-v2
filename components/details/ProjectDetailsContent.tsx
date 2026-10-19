import { Pill } from "@/components/ui";
import { PROJECT_STATUS_LABELS } from "@/lib/projects/filters";
import type { ProjectDetailsEntry } from "@/types/projects";

interface ProjectDetailsContentProps {
  entry: ProjectDetailsEntry;
  titleId: string;
}

// PLACEHOLDER (P7.4a): P7.4b replaces this with the real header, two-column
// layout, screenshots and video. It only shows that the data arrives.
const ProjectDetailsContent = ({
  entry,
  titleId,
}: ProjectDetailsContentProps) => {
  const { details } = entry;

  return (
    <div className="mx-auto w-full max-w-4xl space-y-6">
      <div className="space-y-3">
        <div className="flex flex-wrap items-center gap-2">
          <p className="font-mono text-[10px] tracking-wider text-fg-low uppercase">
            {entry.kicker}
          </p>
          <Pill className="px-2 py-0.5 font-mono text-[10px] uppercase">
            {PROJECT_STATUS_LABELS[entry.status]}
          </Pill>
          <Pill className="px-2 py-0.5 font-mono text-[10px] uppercase">
            {entry.categoryLabel}
          </Pill>
        </div>
        <h2
          id={titleId}
          className="text-3xl font-extrabold tracking-tight text-fg-high"
        >
          {entry.title}
        </h2>
        <p className="text-base text-fg-medium">{entry.summary}</p>
      </div>

      {details.problem ? (
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-fg-high">The problem</h3>
          <p className="text-sm leading-relaxed text-fg-medium">
            {details.problem}
          </p>
        </section>
      ) : null}

      {details.features.length > 0 ? (
        <section className="space-y-2">
          <h3 className="text-sm font-bold text-fg-high">What it does</h3>
          <ul className="space-y-2">
            {details.features.map((feature, index) => (
              <li key={index} className="text-sm leading-relaxed">
                <span className="font-medium text-fg-high">
                  {feature.title}.{" "}
                </span>
                <span className="text-fg-medium">{feature.text}</span>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {details.notes.map((note, index) => (
        <section key={index} className="space-y-2">
          <h3 className="text-sm font-bold text-fg-high">{note.title}</h3>
          <p className="text-sm leading-relaxed whitespace-pre-line text-fg-medium">
            {note.body}
          </p>
        </section>
      ))}
    </div>
  );
};

export default ProjectDetailsContent;
