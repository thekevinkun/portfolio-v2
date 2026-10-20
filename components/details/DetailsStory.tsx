import { GlassCard } from "@/components/ui";
import DetailsSection from "./DetailsSection";
import { paragraphs } from "@/lib/details/paragraphs";
import type { ProjectDetails } from "@/types/details";

interface DetailsStoryProps {
  details: ProjectDetails;
}

const bodyClass = "text-sm leading-relaxed whitespace-pre-line text-fg-medium";

// The written part: the problem, what it does and the engineering notes. Each
// block shows only when it has content.
const DetailsStory = ({ details }: DetailsStoryProps) => (
  <>
    {details.problem ? (
      <DetailsSection title="The problem">
        <div className="space-y-3">
          {paragraphs(details.problem).map((paragraph, index) => (
            <p
              key={index}
              className="text-base leading-relaxed whitespace-pre-line text-fg-medium"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </DetailsSection>
    ) : null}

    {details.features.length > 0 ? (
      <DetailsSection title="What it does">
        <ul className="grid gap-3 sm:grid-cols-2">
          {details.features.map((feature, index) => (
            <li key={index}>
              <GlassCard spotlight={false} className="h-full space-y-1.5 p-4">
                <h4 className="text-sm font-bold text-fg-high">
                  {feature.title}
                </h4>
                <p className={bodyClass}>{feature.text}</p>
              </GlassCard>
            </li>
          ))}
        </ul>
      </DetailsSection>
    ) : null}

    {details.notes.length > 0 ? (
      <DetailsSection title="Engineering notes">
        <div className="space-y-3">
          {details.notes.map((note, index) => (
            <GlassCard key={index} spotlight={false} className="space-y-2 p-5">
              <h4 className="text-sm font-bold text-fg-high">{note.title}</h4>
              {paragraphs(note.body).map((paragraph, paragraphIndex) => (
                <p key={paragraphIndex} className={bodyClass}>
                  {paragraph}
                </p>
              ))}
            </GlassCard>
          ))}
        </div>
      </DetailsSection>
    ) : null}
  </>
);

export default DetailsStory;
