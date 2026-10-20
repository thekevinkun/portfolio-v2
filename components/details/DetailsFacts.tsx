import { Chip, GlassCard } from "@/components/ui";
import DetailsSection from "./DetailsSection";
import { PROJECT_STATUS_LABELS } from "@/lib/projects/filters";
import type { ProjectDetailsEntry } from "@/types/projects";

interface DetailsFactsProps {
  entry: ProjectDetailsEntry;
}

// "At a glance" plus every technology (the cards show only the first five)
const DetailsFacts = ({ entry }: DetailsFactsProps) => {
  const { details } = entry;
  const rows = [
    { label: "Status", value: PROJECT_STATUS_LABELS[entry.status] },
    { label: "Category", value: entry.categoryLabel },
    ...(details.role ? [{ label: "Role", value: details.role }] : []),
    ...(details.timeframe
      ? [{ label: "Timeframe", value: details.timeframe }]
      : []),
  ];

  return (
    <>
      <DetailsSection title="At a glance">
        <GlassCard spotlight={false} className="p-5">
          <dl className="grid grid-cols-[auto_1fr] gap-x-6 gap-y-3">
            {rows.map((row) => (
              <div key={row.label} className="contents">
                <dt className="font-mono text-[11px] tracking-wider text-fg-low uppercase">
                  {row.label}
                </dt>
                <dd className="text-sm text-fg-high">{row.value}</dd>
              </div>
            ))}
          </dl>
        </GlassCard>
      </DetailsSection>

      <DetailsSection title="Technologies" meta={`${entry.tech.length}`}>
        <ul aria-label="Technologies" className="flex flex-wrap gap-1.5">
          {entry.tech.map((tech, index) => (
            <li key={`${tech}-${index}`}>
              <Chip>{tech}</Chip>
            </li>
          ))}
        </ul>
      </DetailsSection>
    </>
  );
};

export default DetailsFacts;
